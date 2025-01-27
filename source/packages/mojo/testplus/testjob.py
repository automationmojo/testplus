"""
.. module:: testjob
    :platform: Darwin, Linux, Unix, Windows
    :synopsis: Module that is contains the :class:`TestJob` class which is utilized for each test
        run as the parent container for all test results.

.. moduleauthor:: Myron Walker <myron.walker@gmail.com>
"""

__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []



from typing import List, Optional

import yaml
import os
import traceback

from mojo.collections.contextuser import ContextUser
from mojo.collections.contextpaths import ContextPaths

from mojo.config.configurationmaps import CONFIGURATION_MAPS

from mojo.xmods.xformatting import CommandOutputFormat
from mojo.xmods.xdebugger import WELLKNOWN_BREAKPOINTS, debugger_wellknown_breakpoint_entry

from mojo.runtime.runtimevariables import MOJO_RUNTIME_VARIABLES
from mojo.runtime.paths import (
    get_summary_html_template_source,
    get_summary_static_resource_dest_dir,
    get_summary_static_resource_src_dir,
    get_path_for_testresults
)

from mojo.results.model.buildinfo import BuildInfo
from mojo.results.model.jobinfo import JobInfo
from mojo.results.model.pipelineinfo import PipelineInfo
from mojo.results.model.renderinfo import RenderInfo

from mojo.results.recorders.jsonresultrecorder import ResultRecorder, JsonResultRecorder

from mojo.testplus.sequencing.testsequencer import TestSequencer


class TestJob(ContextUser):
    """
        The :class:`TestJob` spans the execution of all :class:`TestPack` and organizes the
        flow of execution of test packs.  It allows for the sequencing of the execution of test
        packs so as to optimize the time test runs spend performing setup and tearnown tasks.  This
        allows for the optimization of infrastructure resources.

        * Single Instance
        * Setup Test Landscape
        * Jobs have an expected number of tests based
        * Collects and organizes results from all the :class:`TestPack` runs

        * Can be used to customize the sequencing of :class:`TestPack` runs.
    """

    title = "" # Friendly name for the test job
    description = "" # Description of the job

    includes = None # The test packs or tests that are included in this TestJob
    excludes = None # The tests that are to be excluded from this TestJob
    metafilters = None

    def __init__(self, logger, testroot, includes: Optional[List[str]]=None, excludes: Optional[List[str]]=None,
                 metafilters: Optional[List[str]]=None, test_module: Optional[str]=None, parser=None):
        """
            Constructor for a :class:`TestJob`.  It initializes the member variables based on the parameters passed
            from the entry point function and the class member data declared on :class:`TestJob` derived classes.
        """
        self._logger = logger
        self._testroot = testroot

        if self.includes is None:
            self.includes = includes
            self.excludes = excludes

        self.metafilters = metafilters

        self._test_module = test_module
        self._parser = parser
        self._starttime = None

        self._test_results_dir = None
        self._result_filename = None
        self._summary_filename = None
        self._summary_template = None
        self._import_errors_filename = None

        self._testpacks = None

        self._apod = MOJO_RUNTIME_VARIABLES.MJR_AUTOMATION_POD
        self._release = MOJO_RUNTIME_VARIABLES.MJR_BUILD_RELEASE
        self._branch = MOJO_RUNTIME_VARIABLES.MJR_BUILD_BRANCH
        self._build = MOJO_RUNTIME_VARIABLES.MJR_BUILD_NAME
        self._flavor = MOJO_RUNTIME_VARIABLES.MJR_BUILD_FLAVOR
        self._build_url = MOJO_RUNTIME_VARIABLES.MJR_BUILD_URL

        self._run_id = MOJO_RUNTIME_VARIABLES.MJR_RUN_ID

        self._pipeline_id = MOJO_RUNTIME_VARIABLES.MJR_PIPELINE_ID
        self._pipeline_name = MOJO_RUNTIME_VARIABLES.MJR_PIPELINE_NAME
        self._pipeline_instance = MOJO_RUNTIME_VARIABLES.MJR_PIPELINE_INSTANCE

        self._job_initiator = MOJO_RUNTIME_VARIABLES.MJR_JOB_INITIATOR
        self._job_id = MOJO_RUNTIME_VARIABLES.MJR_JOB_ID
        self._job_label = MOJO_RUNTIME_VARIABLES.MJR_JOB_LABEL
        self._job_name = MOJO_RUNTIME_VARIABLES.MJR_JOB_NAME
        self._job_owner = MOJO_RUNTIME_VARIABLES.MJR_JOB_OWNER
        self._job_seed = MOJO_RUNTIME_VARIABLES.MJR_JOB_SEED
        self._job_type = MOJO_RUNTIME_VARIABLES.MJR_JOB_TYPE
        self._job_venue = MOJO_RUNTIME_VARIABLES.MJR_JOB_VENUE
        self._job_tag = MOJO_RUNTIME_VARIABLES.MJR_JOB_TAG
        
        self._import_errors = []

        return

    def __enter__(self):
        self.begin()
        return self

    def __exit__(self, ex_type, ex_inst, ex_tb):
        self.finalize()
        return False

    @property
    def import_errors(self):
        return self._import_errors

    def begin(self):
        """
            Called at the beginning of a test job in order to setup the recording of test results.
        """

        env = self.context.lookup("/environment")

        self._starttime = env["starttime"]

        self._test_results_dir = get_path_for_testresults()
        
        # Dump out a flattened copy of the runtime file to the test output folder so we have a copy
        # of the inputs to the automation run.
        self._runtime_archive = os.path.join(self._test_results_dir, "runtime-declared.yaml")
        with open(self._runtime_archive, 'w+') as raf:
            yaml.safe_dump(CONFIGURATION_MAPS.RUNTIME_CONFIGURATION_MAP.flatten(), raf, indent=4)
        
        self._result_filename = os.path.join(self._test_results_dir, "testrun_results.jsos")
        self._summary_filename = os.path.join(self._test_results_dir, "testrun_summary.json")
        self._summary_template = get_summary_html_template_source()
        self._import_errors_filename = os.path.join(self._test_results_dir, "import_errors.jsos")
        self._testrun_sequence_filename = os.path.join(self._test_results_dir, "testrun_sequence.py")
        
        return

    def execute(self):
        """
            Runs the tests that are included in the given :class:'TestPack'.
        """
        result_code = 0

        with self._create_sequencer() as tseq:
            # IMPORTANT: The ordering of the automation sequence is extremely important.  Proper
            # ordering of these steps ensures that the correct things are happening in the correct
            # order in the automation code and that we provide the ability for configuration
            # issues to be discovered as early as possible.

            debugger = self.context.lookup(ContextPaths.DEBUG_DEBUGGER, None)
            breakpoints = self.context.lookup(ContextPaths.DEBUG_BREAKPOINTS, None)

            # STEP 1: We discover the tests first so we can build a listing of the
            # Integration and Scope couplings.  We don't want to execute any test code, setup,
            # or teardown code at this point.  We want to seperate out the integration
            # code from the test code and run the integration code first so we can discover
            # integration issues independant of the test code itself.
            self._logger.section("Discovery")
            debugger_wellknown_breakpoint_entry(WELLKNOWN_BREAKPOINTS.TEST_DISCOVERY)

            count = tseq.discover(test_module=self._test_module)

            # STEP 2: Tell the sequencer to record any import errors that happened during discovery
            # of tests.  If a test file or dependent file failed to import then the test
            # will just not be included in a run and this is a type of invisible error
            # that we must plan for and highlight.
            self._import_errors.extend(tseq.import_errors)
            tseq.record_import_errors(self._import_errors_filename)

            if count > 0:

                self._logger.section("Integration Publishing")

                # Initiate contact with the TestLandscape
                self.fire_activate_configuration()

                # STEP 3: Call attach_to_framework on the sequencer to give all the couplings a chance
                # to plug themselves into the automation framework.  This allows us to only integrate
                # couplings that are being consumed by the tests AND also to only include couplings that
                # are included in the test framework.  This give the opportunity for the couplings to trigger
                # the startup of the coordinators that inter-operate with the test landscape and the
                # associated devices.
                self.fire_attach_to_framework(tseq)

                # STEP 4: After all the couplings have had the opportunity to plug themselves into
                # the test framework, we trigger the finalization of the test landscape initialization
                self.fire_activate_integration()

                # STEP 5: Now that we have collected all the couplings and have a preview of
                # the complexity of the automation run encoded into the coupling types collected.
                # Allow the couplings to attach to the automation environment so they can get
                # a preview of the parameters and configuration and provide us with an early
                # indicator of any parameter or configuration issues.
                #
                # This is the final step of validating all the input information to the run and
                # we are able to perform this step in the context of the integration code and
                # outside of the execution of any test code
                self.fire_attach_to_environment(tseq)

                # STEP 6: All the couplings have had a chance to analyze the configuration
                # information and provide us with a clear indication if there are any configuration
                # issues.  Now provide the couplings with the opportunity to reach out to the
                # automation infrastructure and checkout or collect any global shared resources
                # that might be required for this automation run.
                self._logger.section("Collecting Resources")
                tseq.collect_resources()

                # STEP 7: Finalize the activation process and transition the landscape
                # to fully active where all APIs are available.
                #
                # Because the Automation Kit is a distrubuted automation test framework,
                # we want to provide an early opportunity for all the integration and scope couplings
                # to establish initial connectivity or first contact with the resources or devices
                # that are being integrated into the automation run.
                #
                # This helps to ensure the reduction of automation failure noise due to configuration
                # or environmental issues
                self.fire_activate_operations()

                # STEP 8: After we have established that we have good connectivity with all of the
                # test landscape devices, we then want to give the integration couplings an opportunity
                # to establish a presence of presistent functionality or services with the remote devices
                self.fire_establish_presence(tseq)

                # STEP 9: Capture a pre-testrun diagnostic capture
                self.fire_diagnostic_capture_pre_testrun(tseq)

                self._logger.section("Expanding Test Tree Based on Query")
                tseq.expand_test_tree_based_on_query()

                self._logger.section("Generating Test Run Sequence")
                # STEP 10: Generate the test run sequence document that will be used or the run.
                tseq.generate_testrun_sequence_document(self._testrun_sequence_filename)

                title = self.title
                runid = self._run_id
                start = str(self._starttime)

                static_resource_source = get_summary_static_resource_src_dir()
                static_resource_destination = get_summary_static_resource_dest_dir()
                
                render_info = RenderInfo(title=title, summary_filename=self._summary_filename, summary_template=self._summary_template,
                                         result_filename=self._result_filename, static_resource_source=static_resource_source,
                                         static_resource_destination=static_resource_destination)

                build_info = BuildInfo(branch=self._branch, build=self._build, flavor=self._flavor,
                                       release=self._release, url=self._build_url)

                pipeline_info = None
                if self._pipeline_id is not None:
                    pipeline_info = PipelineInfo(id=self._pipeline_id, name=self._pipeline_name, instance=self._pipeline_instance)

                job_info = JobInfo(id=self._job_id, name=self._job_name, type=self._job_type, owner=self._job_owner, label=self._job_label,
                                   initiator=self._job_initiator, venue=self._job_venue, tag=self._job_tag)
                
                self._logger.section("Running Tests")

                # STEP 11: The startup phase is over, up to this point we have mostly been executing
                # integration code and configuration analysis code that is embedded into mostly class
                # level methods.
                #
                # Now we start going through all the test testpacks and tests and start instantiating
                # test scopes and instances and start executing setup, teardown and test level code
                with self._create_recorder(runid=runid, start=start, render_info=render_info,
                                        build_info=build_info, pipeline_info=pipeline_info, job_info=job_info) as recorder:
                    try:
                        # Traverse the execution graph
                        tseq.execute_tests(runid, recorder)

                        try:
                            # STEP 12: Capture a post-testrun diagnostic capture
                            self.fire_diagnostic_capture_post_testrun(tseq)
                        except Exception:
                            err_msg = traceback.format_exc()
                            self._logger.error(err_msg)

                    finally:
                        recorder.finalize()

                        recorded_sumary = recorder.summary
                        if "result" in recorded_sumary:
                            if recorded_sumary["result"] != "PASSED":
                                result_code = -1
                        else:
                            self._logger.error("The 'result' field was not found in the recorded summary report.")
                            result_code = -1

                        # STEP 13: This is where we do any final processing and or publishing of results.
                        # We might also want to add automated bug filing here later.
                        self._logger.section("Completed Tests")

                        # Write out the test results
                        results_msg_lines = [""]
                        results_msg_lines.extend(recorder.format_lines())
                        results_msg_lines.append("")

                        results_msg = os.linesep.join(results_msg_lines)

                        self._logger.render(results_msg)

            else:
                # We didn't find any tests so display a message, and set the return code to
                # indicate an error condition
                err_msg_lines = [
                    "The include and exclude parameters specified resulted in an empty test set."
                ]

                if self.includes is not None:
                    err_msg_lines.append("INCLUDES:")
                    for nxtitem in self.includes:
                        err_msg_lines.append("    %s" % nxtitem)
                    err_msg_lines.append("")
                else:
                    err_msg_lines.append("INCLUDES: None")

                if self.excludes is not None:
                    err_msg_lines.append("EXCLUDES:")
                    for nxtitem in self.excludes:
                        err_msg_lines.append("    %s" % nxtitem)
                    err_msg_lines.append("")
                else:
                    err_msg_lines.append("EXCLUDES: None")

                err_msg = os.linesep.join(err_msg_lines)
                self._logger.error(err_msg)

                result_code = -1

        return result_code

    def fire_attach_to_environment(self, tseq: TestSequencer):
        """
            Goes through all the integrations and provides them with an opportunity to
            attach to the test environment.
        """

        tseq.attach_to_environment()

        return

    def fire_attach_to_framework(self, tseq: TestSequencer):
        """
            Goes through all the integrations and provides them with an opportunity to
            attach to the test environment.
        """

        tseq.attach_to_framework()

        return

    def fire_activate_configuration(self):
        self._logger.debug("Firing: fire_activate_configuration")
        return
    
    def fire_activate_integration(self):
        self._logger.debug("Firing: fire_activate_integration")
        return
    
    def fire_activate_operations(self):
        self._logger.debug("Firing: fire_activate_operations")
        return

    def fire_diagnostic_capture_post_testrun(self, tseq: TestSequencer, level: int=9):
        tseq.diagnostic_capture_post_testrun(level)
        return

    def fire_diagnostic_capture_pre_testrun(self, tseq: TestSequencer, level: int=9):
        tseq.diagnostic_capture_pre_testrun(level)
        return

    def fire_establish_presence(self, tseq: TestSequencer):

        tseq.establish_presence()

        return

    def finalize(self): # pylint: disable=no-self-use
        """
            Called at the end of a test job in order to flush the results of the test run, copy
            the report template to the output directory.
        """
        return

    def query(self, format: CommandOutputFormat=CommandOutputFormat.DISPLAY):
        
        query_results = []

        with self._create_sequencer() as tseq:
            
            count = tseq.discover(test_module=self._test_module)

            query_results = tseq.references

            self._import_errors.extend(tseq.import_errors)

        return query_results

    @classmethod
    def user_interface_display_options(cls):
        """
            Overridden by derived TestJob classes in order to return a configuration user interface
            description that provides information about a vue javascript component that meets the
            interface requirements and will allow a user to display job configuration information that
            can be packaged stored in a data store as a json object and later passed to a job in order
            to configure the job.
        """
        return

    @classmethod
    def user_interface_edit_options(cls):
        """
            Overridden by derived TestJob classes in order to return a configuration user interface
            description that provides information about a vue javascript component that meets the
            interface requirements and will allow a user to input job configuration information that
            can be packaged stored in a data store as a json object and later passed to a job in order
            to configure the job.
        """
        return

    def _create_recorder(self, runid: str, start: str, render_info: RenderInfo, build_info: BuildInfo,
                         pipeline_info: PipelineInfo, job_info: JobInfo) -> ResultRecorder:
        """
            Simple hook function to make it possible to overload the type of ResultRecorder that is created for
            any given job.
        """

        inst = JsonResultRecorder(runid=runid, start=start, render_info=render_info, apod=self._apod,
                                        build_info=build_info, pipeline_info=pipeline_info, job_info=job_info)
        return inst

    def _create_sequencer(self):
        """
            Simple hook function to make it possible to overload the type of the TestSequencer that is created
            for jobs.
        """
        inst = TestSequencer(self.title, self._testroot, includes=self.includes, excludes=self.excludes, metafilters=self.metafilters)
        return inst



class DefaultTestJob(TestJob):
    """
        The :class:`DefautTestJob` is utilized as a job container when a job was not specified.
    """
    name = "Test Job"
    description = "Unspecified test job."
