"""
.. module:: testsequencer
    :platform: Darwin, Linux, Unix, Windows
    :synopsis: Module containing the base :class:`TestSequencer` type which is use to control
        the flow of the automation environment startup and test execution sequence.

.. moduleauthor:: Myron Walker <myron.walker@gmail.com>
"""

__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []



from typing import Any, List, OrderedDict, Optional, Sequence, Tuple, Type, Union


import collections
import json
import logging
import os
import sys
import uuid

from io import TextIOWrapper
from types import TracebackType

from mojo.collections.contextuser import ContextUser

from mojo.errors.exceptions import SemanticError

from mojo.xmods.ximport import import_file


from mojo.xmods.jsos import CHAR_RECORD_SEPERATOR
from mojo.xmods.injection.injectionregistry import injection_registry
from mojo.xmods.injection.parameterorigin import ParameterOrigin
from mojo.xmods.injection.coupling.integrationcoupling import IntegrationCoupling

from mojo.xmods.markers import MetaFilter
from mojo.xmods.xdebugger import WELLKNOWN_BREAKPOINTS, debugger_wellknown_breakpoint_code_append

from mojo.results.model.jobcontainer import JobContainer
from mojo.results.model.taskinggroup import TaskingGroup
from mojo.results.model.taskingresult import TaskingResult
from mojo.results.model.testcontainer import TestContainer
from mojo.results.model.testresult import TestResult

from mojo.results.recorders.resultrecorder import ResultRecorder

from mojo.runtime.paths import get_path_for_testresults, get_path_for_diagnostics

from mojo.testplus import Constraints
from mojo.testplus.diagnostics import DiagnosticLabel, RuntimeConfigPaths
from mojo.testplus.testcollector import TestCollector
from mojo.testplus.testgroup import TestGroup
from mojo.testplus.testref import TestRef

from mojo.testplus.sequencing.sequencersessionscope import SequencerSessionScope
from mojo.testplus.sequencing.sequencermodulescope import SequencerModuleScope
from mojo.testplus.sequencing.sequencertestscope import SequencerTestScope, SequencerTestSetupScope

from mojo.testplus import ConstraintsCatalog

constraints_catalog = ConstraintsCatalog()

logger = logging.getLogger()


CONSTRAINT_IMPORT_INSERTION_POINT = "# ------- INSERT CONSTRAINT IMPORTS HERE -------"

FACTORY_IMPORT_INSERTION_POINT = "# ------- INSERT FACTORY IMPORTS HERE -------"


TEMPLATE_TESTRUN_SEQUENCE_MODULE = '''"""
    ======================================= CODE GENERATED - DO NOT EDIT =======================================
    This is a code generated execution sequence document, do not manually edit this document.  The 'testplus'
    test framework generates this document in order to layout the test run scopes, parameter creations, and
    test calls in a user ledgible way which is easy to read and also to debug.
"""

__traceback_format_policy__ = "Brief"

import logging

logger = logging.getLogger()

from mojo.testplus import ConstraintsCatalog

constraints_catalog = ConstraintsCatalog()

{}

{}

'''.format(CONSTRAINT_IMPORT_INSERTION_POINT, FACTORY_IMPORT_INSERTION_POINT)


class TEST_SEQUENCER_PHASES:
    """
        Indicates the current state of the sequencer.
    """
    Initial = 0
    Discovery = 1
    Collection = 2
    Graph = 3
    Traversal = 4


class TestSequencer(ContextUser):
    """
        The :class:`TestSequencer` is a state machine that helps to orchestrate the flow fo the test run.  It ensures
        that the steps of the test flow are consistent between runs.
    """

    def __init__(self, jobtitle: str, root: str, includes: Sequence[str], excludes: Sequence[str], metafilters: List[MetaFilter]):
        """
            Creates a 'TestSequencer' object which is used to discover the tests and control the flow of a test run.

            :param jobtitle: The name of the test job.
            :param root: The path to the root folder that is the base of the tests.
            :param includes: List of expressions used to determine which tests to include.
                             (scope):(package).(package)@(module)#(testname)
            :param excludes: List of expressions used to determine which tests to exclued from the included tests.
            :param metafilters: List of expressions used to filter tests by metadata
        """
        super().__init__()

        self._jobtitle = jobtitle
        self._root = root
        self._includes = includes
        self._excludes = excludes
        self._metafilters = metafilters
        self._integrations = {}
        self._references = []
        self._scopes = {}
        self._scope_roots = []
        self._import_errors = {}
        self._testtree = None
        self._sequence_document = None
        self._recorder = None
        self._root_result = None
        self._scope_stack = []
        return

    def __enter__(self):
        """
            Provides 'with' statement scope semantics for the :class:`TestSequencer`
        """
        return self

    def __exit__(self, ex_type: Type, ex_inst: BaseException, ex_tb: TracebackType) -> bool:
        """
            Provides 'with' statement scope semantics for the :class:`TestSequencer`
        """
        return False

    @property
    def import_errors(self):
        """
            A list of import errors that were encountered during the sequencing of the test run.
        """
        return self._import_errors

    @property
    def references(self):
        """
            A list of :class:`TestRef` objects that are included in the test run.
        """
        return self._references

    @property
    def testnodes(self):
        """
        """
        root_nodes = [tnode for _, tnode in self._testtree]
        return root_nodes

    @property
    def testtree(self):
        """
        """
        return self._testtree

    def attach_to_environment(self, **kwargs):
        """
            Goes through all the integrations and provides them with an opportunity to
            attach to the test environment.
        """

        results_dir = get_path_for_testresults()

        environment_dict = self.create_password_masked_environment()

        package_dict = collections.OrderedDict()

        package_names = [k for k in sys.modules.keys()]
        package_names.sort()
        for pname in package_names:
            nxtmod = sys.modules[pname]
            if pname.find(".") == -1 and hasattr(nxtmod, "__file__"):
                package_dict[pname] = nxtmod.__file__

        startup_dict = collections.OrderedDict([
            ("command", " ".join(sys.argv)),
            ("environment", environment_dict),
            ("packages", package_dict)
        ])

        startup_full = os.path.join(results_dir, "startup-configuration.json")
        with open(startup_full, 'w') as suf:
            json.dump(startup_dict, suf, indent=True)

        integ_type: IntegrationCoupling

        for _, integ_type in self._integrations.items():
            integ_type.attach_to_environment(**kwargs)

        return

    def attach_to_framework(self, **kwargs):
        """
            Goes through all the integrations and provides them with an opportunity to
            attach to the test environment.
        """

        integ_type: IntegrationCoupling

        for _, integ_type in self._integrations.items():
            integ_type.attach_to_framework(**kwargs)

        return

    def collect_resources(self):
        """
            Goes through all the integrations and provides them with an opportunity to
            collect shared resources that are required for testing.
        """

        integ_type: IntegrationCoupling

        for _, integ_type in self._integrations.items():
            integ_type.collect_resources()

        return

    def create_job_result_container(self, scope_id: str, scope_name: str) -> JobContainer:
        """
            Method for creating a result container.
        """
        rcontainer = JobContainer(scope_id, scope_name)
        return rcontainer

    def create_password_masked_environment(self) -> OrderedDict[str, str]:
        """
            Creates copy of the environment for writing to a file with the passwords masked.
        """
        environment_dict = collections.OrderedDict()

        env_keys = [k for k in os.environ.keys()]
        env_keys.sort()
        for ek in env_keys:
            environment_dict[ek] = os.environ[ek]

        for key in environment_dict.keys():
            if key.find("PASSWORD") > -1:
                environment_dict[key] = "(hidden)"
        
        return environment_dict

    def create_tasking_group(self, scope_id: str, name: str, parent_inst: str) -> TaskingGroup:
        """
            Method for creating a result group.
        """
        tgrp = TaskingGroup(scope_id, name, parent_inst)
        return tgrp
    
    def create_tasking_result(self, scope_id: str, name: str, parent_inst: str) -> TaskingResult:
        """
            Method for creating a tasking result.
        """
        tresult = TaskingResult(scope_id, name, parent_inst) 
        return tresult

    def create_test_result_container(self, scope_id: str, scope_name: str, parent_inst: str) -> TestContainer:
        """
            Method for creating a result container.
        """
        rcontainer = TestContainer(scope_id, scope_name, parent_inst)
        return rcontainer
    
    def create_test_result_node(self, scope_id: str, name: str, monikers: List[str], pivots: OrderedDict[str, Any], parent_inst: str) -> TestResult:
        """
            Method for creating a result node.
        """
        rnode = TestResult(scope_id, name, parent_inst, monikers, pivots)
        return rnode

    def diagnostic_capture_pre_testrun(self, level: int=9):
        """
            Perform a pre-run diagnostic on the devices in the test landscape.
        """

        prerun_info = self.context.lookup(RuntimeConfigPaths.DIAGNOSTIC_PRERUN)

        if prerun_info is not None and prerun_info == True:
            label = DiagnosticLabel.PRERUN_DIAGNOSTIC
            diagnostic_root = get_path_for_diagnostics(label)

            for _, integ_type in self._integrations.items():
                integ_type.diagnostic(label, level, diagnostic_root)

        return

    def diagnostic_capture_post_testrun(self, level: int=9):
        """
            Perform a post-run diagnostic on the devices in the test landscape.
        """
        postrun_info = self.context.lookup(RuntimeConfigPaths.DIAGNOSTIC_POSTRUN)

        if postrun_info is not None and postrun_info == True:

            label = DiagnosticLabel.POSTRUN_DIAGNOSTIC
            diagnostic_root = get_path_for_diagnostics(label)

            for _, integ_type in self._integrations.items():
                integ_type.diagnostic(label, level, diagnostic_root)

        return

    def discover(self, test_module=None, include_integrations: bool=True) -> int:
        """
            Initiates the discovery phase of the test run.
        """
        collector = TestCollector(self._root, excludes=self._excludes, metafilters=self._metafilters, test_module=test_module)

        # Discover the tests, integration points, and scopes.  If test modules is not None then
        # we are running tests from an individual module and we can limit discovery to the test module
        for inc_item in self._includes:
            collector.collect_references(inc_item)

        collector.finalize_collection()

        self._testtree = collector.test_tree
        self._references = collector.references

        testcount = len(self._references)
        if testcount > 0:
            if include_integrations:
                self._integrations, self._scopes = collector.collect_integrations_and_scopes()
            self._import_errors = collector.import_errors

        return testcount

    def enter_module_scope_context(self, scope_name) -> SequencerModuleScope:
        context = SequencerModuleScope(self, self._recorder, scope_name)
        return context

    def enter_session_scope_context(self) -> SequencerSessionScope:
        context = SequencerSessionScope(self, self._recorder, self._root_result)
        return context

    def enter_test_scope_context(self, test_name, notables: Sequence=[]) -> SequencerTestScope:
        context = SequencerTestScope(self, self._recorder, test_name, notables=notables)
        return context

    def enter_test_setup_context(self, test_name) -> SequencerTestSetupScope:
        context = SequencerTestSetupScope(self, self._recorder, test_name)
        return context

    def establish_integration_order(self):
        """
            Re-orders the integrations based on any declared precedences.
        """

        integ_type: IntegrationCoupling

        for _, integ_type in self._integrations.items():
            integ_type.establish_integration_order()

        return

    def establish_presence(self):
        """
            Goes through all the integrations and provides them with an opportunity to
            establish a presence or persistant services with the test resource or resources
            they are integrating into the automation run.
        """

        integ_type: IntegrationCoupling

        for _, integ_type in self._integrations.items():
            integ_type.establish_presence()

        return

    def execute_tests(self, runid: str, recorder: ResultRecorder):
        """
            Called in order to execute the tests contained in the :class:`TestPacks` being run.
        """

        res_name = "<session>"

        self._recorder = recorder

        self._root_result = self.create_job_result_container(runid, res_name)
        recorder.record(self._root_result)

        if self._sequence_document is None:
            errmsg = "The 'execute_tests' method should not be called without first generating the test sequence document."
            raise SemanticError(errmsg) from None

        # Import the test sequence document
        sequence_mod = import_file("sequence_document", self._sequence_document)
        sequence_mod.session(self)

        return

    def expand_test_tree_based_on_query(self):

        context_locals = {}

        # Walk the test tree and expand the parameters
        # self._testtree

        return

    def find_test_scope(self) -> SequencerTestScope:

        test_scope = None
        for next_scope in self._scope_stack:
            if isinstance(next_scope, SequencerTestScope):
                test_scope = next_scope

        return test_scope

    def find_treenode_for_scope(self, scope_name, cursor=None):
        found = None

        if cursor is None:
            cursor = self._testtree

        if cursor.scope_name == scope_name:
            found = cursor
        elif isinstance(cursor, TestGroup):
            for child in cursor.children.values():
                found = self.find_treenode_for_scope(scope_name, cursor=child)
                if found is not None:
                    break

        return found

    def generate_testrun_sequence_document(self, outputfilename: str, indent_space="    "):

        constraint_imports = set()
        factory_imports = set()
        test_imports = set()

        temp_outputfile = outputfilename + ".tmp"

        with open(temp_outputfile, 'w') as sdf:

            sdf.write(TEMPLATE_TESTRUN_SEQUENCE_MODULE)

            scopes_called = self._generate_session_method(sdf, self._testtree, factory_imports, constraint_imports, indent_space)

            while len(scopes_called) > 0:
                sdf.write(os.linesep)
                scope_module, scope_name, scope_node, scope_call_args = scopes_called.pop(0)
                child_scopes_called = self._generate_scope_method(sdf, scope_module, scope_name, scope_node, scope_call_args, 
                                                                  factory_imports, constraint_imports, indent_space)
                child_scopes_called.extend(scopes_called)
                scopes_called = child_scopes_called

        linesep = os.linesep

        # Insert the factory imports and constraint imports
        with open(temp_outputfile, 'r') as tmpf:

            with open(outputfilename, 'w') as sdf:

                while True:
                    nxtline = tmpf.readline()
                    if len(nxtline) == 0:
                        break
                    
                    if nxtline.startswith(CONSTRAINT_IMPORT_INSERTION_POINT):
                        for cimp in constraint_imports:
                            sdf.write(cimp)
                            sdf.write(linesep)

                    elif nxtline.startswith(FACTORY_IMPORT_INSERTION_POINT):
                        for fimp in factory_imports:
                            sdf.write(fimp)
                            sdf.write(linesep)

                    else:
                        sdf.write(nxtline)

        os.remove(temp_outputfile)

        self._sequence_document = outputfilename

        return

    def get_recorder(self) -> str:
        return self._recorder

    def get_top_scope_id(self) -> str:

        top_id = None
        if len(self._scope_stack) > 0:
            top_id = self._scope_stack[-1][1]
        
        return top_id
    
    def mark_activity(self, activity_name: str, target: str="NA", detail: Optional[dict] = None):
        """
            A helper method that classes having a reference to the sequence can used to pass activity
            markers through to the current test scope.
        """

        test_scope = self.find_test_scope()
        if test_scope is not None:
            test_scope.mark_activity(activity_name, target=target, detail=detail)
        
        return

    def scope_id_create(self, scope_name: str) -> Tuple[str, str]:

        parent_id = None
        if len(self._scope_stack) > 0:
            parent_id = self._scope_stack[-1][1]

        scope_id = str(uuid.uuid4())
        self._scope_stack.append((scope_name, scope_id))

        return parent_id, scope_id

    def scope_id_pop(self, scope_name: str):

        top_entry_name, _ = self._scope_stack.pop()
        if top_entry_name != scope_name:
            errmsg = "Attempting to pop '{}' from the scope stack but encountered '{}'.".format(scope_name, top_entry_name)
            raise RuntimeError(errmsg) from None

        return

    def scope_id_push(self, scope_name: str, scope_id: str):
        self._scope_stack.append((scope_name, scope_id))
        return

    def _generate_session_method(self, outf: TextIOWrapper, root_node: TestGroup, factory_imports: set,
                                 constraint_imports: set, indent_space: str):
        """
            Generates the :function:`session` entry point function or the test run
            sequence document.
        """
        scopes_called = []

        current_indent = indent_space

        method_lines: List[str] = [
            'def session(sequencer):',
            '{}"""'.format(current_indent),
            '{}This is the entry point for the test run sequence document.'.format(indent_space),
            '{}"""'.format(current_indent)
        ]

        debugger_wellknown_breakpoint_code_append(WELLKNOWN_BREAKPOINTS.TESTRUN_START, method_lines, current_indent)

        method_lines.append('')
        method_lines.append('{}with sequencer.enter_session_scope_context() as ssc:'.format(current_indent))
        method_lines.append('')

        current_indent = current_indent + indent_space

        this_scope = root_node.get_resource_scope()

        # Import all the parameter source functions
        for _, porigin in this_scope.parameter_originations.items():
            if not porigin.implied:
                method_lines.append('{}from {} import {}'.format(current_indent, porigin.source_module_name, porigin.source_function.__name__))
        method_lines.append('')

        # Create the calls to all of the root test scopes
        child_call_args = ['sequencer']

        # Create the variables with session scope
        for pname, porigin in this_scope.parameter_originations.items():
            if not porigin.implied:
                source_func_call = porigin.generate_call()
                method_lines.append('{}for {} in {}:'.format(current_indent, pname, source_func_call))
                child_call_args.append(pname)
                current_indent = current_indent + indent_space

        child_name_list = [cnk for cnk in root_node.children.keys()]
        child_name_list.sort()

        for child_name in child_name_list:

            # This code is assuming that all the children of the root node are of type
            # `TestGroup` which might not be a valid assumption to make all the time.
            # TODO: Add support for root level TestRef nodes.
            child_node: Union[TestRef, TestGroup] = root_node.children[child_name]

            scope_module = child_name
            if child_node.package:
                scope_module = child_node.package + "." + child_name
            
            scope_name = scope_module.replace(".", "_")
            
            call_line = '{}scope_{}({})'.format(current_indent, scope_name, ", ".join(child_call_args))
            method_lines.append(call_line)
            scopes_called.append((scope_module, scope_name, child_node, child_call_args))

        method_lines.append('')
        method_lines.append('{}return'.format(indent_space))
        method_lines.append('')

        method_content = os.linesep.join(method_lines)
        outf.write(method_content)

        return scopes_called

    def _generate_scope_method(self, outf: TextIOWrapper, scope_module: str, scope_name: str, scope_node: TestGroup,
                               scope_call_args: List[str], factory_imports: set, constraint_imports: set,
                               indent_space: str):
        scopes_called = []

        current_indent = "    "

        method_lines = [
            'def scope_{}({}):'.format(scope_name, ", ".join(scope_call_args)),
            '{}"""'.format(current_indent),
            "{}This is the entry point for the '{}' test scope.".format(current_indent, scope_name),
            '{}"""'.format(current_indent),
            '',
            '{}with sequencer.enter_module_scope_context("{}") as msc:'.format(current_indent, scope_module)
        ]

        current_indent = current_indent + indent_space

        # Create the calls to all of the root test scopes
        child_call_args = [arg for arg in scope_call_args]

        resource_scope = scope_node.get_resource_scope()

        # Add the local factory imports to our imports list
        for _, porigin in resource_scope.parameter_originations.items():
            factory_imports.add('from {} import {}'.format(porigin.source_module_name, porigin.source_function.__name__))

        # Create the variables with session scope
        for pname, porigin in resource_scope.parameter_originations.items():

            sp_parameter_names = [pn for pn in porigin.source_signature.parameters.keys()]
            sp_constraints = None

            if 'constraints' in sp_parameter_names:
                constraints_key = porigin.constraints_key
                if constraints_key is not None:
                    sp_constraints = constraints_catalog.lookup_constraints(constraints_key)
                    if sp_constraints is None:
                        raise RuntimeError(f"Constraint required but not found for contraints_key={constraints_key}")
                    method_lines.append('{}constraints=constraints_catalog.lookup_constraints({})'.format(current_indent, repr(constraints_key)))
                else:
                    sp_parameter_names.remove('constraints')

            source_func_call = porigin.generate_call(constraints=sp_constraints)
            method_lines.append('{}for {} in {}:'.format(current_indent, pname, source_func_call))
            child_call_args.append(pname)
            current_indent = current_indent + indent_space

        child_name_list = [cnk for cnk in scope_node.children.keys()]
        child_name_list.sort()

        for child_name in child_name_list:
            child_node: Union[TestRef, TestGroup] = scope_node.children[child_name]

            if isinstance(child_node, TestRef):

                pre_test_scope_indent = current_indent

                # Generate a test run scope for this test
                test_scope_name = child_node.name
                test_scope = injection_registry.lookup_resource_scope(test_scope_name)

                test_parameters = child_node.function_parameters

                test_local_args = []

                for param_name in test_parameters:
                    # If the test parameter is of test_scope origin
                    # then we need to add it to test_local_args so we
                    # can create an import for it.
                    if param_name in test_scope.parameter_originations:
                        param_obj = test_scope.parameter_originations[param_name]
                        test_local_args.append((param_name, param_obj))

                notables_map = ""
                notables_args = ""

                method_lines.append("{}# ================ Test Scope: {} ================".format(current_indent, test_scope_name))
                method_lines.append('')

                
                
                method_lines.append('{}test_scope_name = "{}"'.format(current_indent, test_scope_name))
                method_lines.append('')

                constraints = None

                if len(test_local_args) > 0:
                    method_lines.append('{}with sequencer.enter_test_setup_context(test_scope_name) as tsetup:'.format(current_indent))
                    current_indent += indent_space

                    notables_map_names = []

                    # Import any factory functions that are used in test local factory methods
                    param_name: str
                    param_obj: ParameterOrigin

                    for param_name, param_obj in test_local_args:
                        fmodname = param_obj.source_module_name
                        ffuncname = param_obj.source_function_name
                        factory_imports.add("from {} import {}".format(fmodname, ffuncname))

                    method_lines.append('')

                    # Generate any local parameters
                    for param_name, param_obj in test_local_args:
                        ffuncname = param_obj.source_function_name
                        ffuncsig = param_obj.source_signature
                        ffuncargs = [pn for pn in ffuncsig.parameters]

                        if 'constraints' in ffuncargs:
                            constraints_key = param_obj.constraints_key
                            if constraints_key is not None:
                                if constraints_catalog.lookup_constraints(constraints_key) is None:
                                    raise RuntimeError(f"Constraint required but not found for contraints_key={constraints_key}")
                                method_lines.append('{}constraints=constraints_catalog.lookup_constraints({})'.format(current_indent, repr(constraints_key)))
                            else:
                                ffuncargs.remove('constraints')

                        ffuncargs_str = " ,".join(ffuncargs)
                        method_lines.append("{}for {} in {}({}):".format(current_indent, param_name, ffuncname, ffuncargs_str))
                        notables_map_names.append(param_name)
                        current_indent += indent_space
                
                    notables_map = ", ".join(map(lambda arg: "'{}': {}".format(arg, arg), notables_map_names))
                    if len(notables_map_names) == 1:
                        notables_map += ","

                    notables_args = ", notables=notables"

                    method_lines.append('')

                if len(notables_map) > 0:
                    method_lines.append('{}notables'.format(current_indent) + " = { " + notables_map + " }")

                method_lines.append('{}with sequencer.enter_test_scope_context(test_scope_name{}) as tscope:'.format(current_indent, notables_args))
                current_indent += indent_space

                validator_originations = [vo for vo in test_scope.validator_originations.values()]

                val_indent = ""
                # Write the validator construction calls
                if len(validator_originations) > 0:
                    val_indent = "    "
                    validator_originations.reverse()
                    method_lines.append("")
                    method_lines.append(f"{current_indent}try:")
                    for vorigin in validator_originations:
                        factory_imports.add("from {} import {}".format(vorigin.source_module_name, vorigin.source_function_name))

                        val_parameter_names = [pn for pn in vorigin.source_signature.parameters.keys()]
                        val_constraints = None

                        if 'constraints' in val_parameter_names:
                            constraints_key = vorigin.constraints_key
                            if constraints_key is not None:
                                val_constraints = constraints_catalog.lookup_constraints(constraints_key)
                                if val_constraints is None:
                                    raise RuntimeError(f"Constraint required but not found for contraints_key={constraints_key}")
                                method_lines.append('{}{}constraints=constraints_catalog.lookup_constraints({})'.format(current_indent, val_indent, repr(constraints_key)))
                            else:
                                val_parameter_names.remove('constraints')
                        
                        method_lines.append("{}{}{} = {}".format(current_indent, val_indent, vorigin.identifier, vorigin.generate_call(constraints=val_constraints)))
                        method_lines.append("{}{}{}.attach_to_test(tscope, '{}')".format(current_indent, val_indent, vorigin.identifier, vorigin.suffix))
                    method_lines.append("")

                # Make the call to the test function
                test_args = []
                for param_name in test_parameters:
                    test_args.append(param_name)

                method_lines.append("{}{}from {} import {}".format(current_indent, val_indent, child_node.module_name, child_node.base_name))

                call_line = '{}{}{}({})'.format(current_indent, val_indent, child_node.base_name, ", ".join(test_args))
                method_lines.append(call_line)
                method_lines.append('')

                # Write the validator finalize calls
                if len(validator_originations) > 0:
                    validator_originations.reverse()
                    method_lines.append("")
                    method_lines.append(f"{current_indent}finally:")
                    for vorigin in validator_originations:
                        method_lines.append("{}{}{}.finalize()".format(current_indent, val_indent, vorigin.identifier))

                # Restor the indent to before the test scope
                current_indent = pre_test_scope_indent

            else:
                scope_module = child_name

                if child_node.package:
                    scope_module = child_node.package + "." + child_name
                
                scope_name = scope_module.replace(".", "_")
                call_line = '{}scope_{}({})'.format(current_indent, scope_name, ", ".join(child_call_args))
                method_lines.append(call_line)
                scopes_called.append((scope_module, scope_name, child_node, child_call_args))

        method_lines.append('')
        method_lines.append('{}return'.format(indent_space))
        method_lines.append('')

        method_content = os.linesep.join(method_lines)
        outf.write(method_content)

        return scopes_called

    def record_import_errors(self, outputfilename: str):
        """
            Method that writes out the import errors to the active results directory.
        """
        with open(outputfilename, 'w') as ief:

            modname: str
            filename: str
            errmsg: str
            
            for modname, filename, errmsg in self._import_errors.values():
                ief.write(CHAR_RECORD_SEPERATOR)
                ieitem = {
                    "module": modname,
                    "filename": filename,
                    "trace": errmsg.splitlines(False)
                }
                json.dump(ieitem, ief, indent=4)

        return
