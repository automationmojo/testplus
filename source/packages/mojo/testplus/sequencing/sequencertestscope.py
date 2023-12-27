
"""
.. module:: sequencersessionscope
    :platform: Darwin, Linux, Unix, Windows
    :synopsis: Module containing the base :class:`SequencerSessionScope` type which is used to
               provide session scope error handling in the control flow for automation tests.

.. moduleauthor:: Myron Walker <myron.walker@gmail.com>
"""

__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

from typing import Any, List, Tuple, Type, TYPE_CHECKING

import logging
import os

from types import TracebackType

from collections import OrderedDict

from mojo.errors.xtraceback import create_traceback_detail, format_traceback_detail

from mojo.results.recorders.resultrecorder import ResultRecorder

from mojo.testplus.exceptions import SkipTestError


logger = logging.getLogger()


if TYPE_CHECKING:
    from mojo.testplus.sequencing.testsequencer import TestSequencer


class SequencerTestScope:
    def __init__(self, sequencer: "TestSequencer", recorder: ResultRecorder, test_name: str, notables: OrderedDict[str, Any]={}):
        super().__init__()

        self._sequencer = sequencer
        self._recorder = recorder
        self._test_name = test_name
        self._scope_id = None
        self._parent_scope_id = None
        self._result = None
        self._scope_node = self._sequencer.find_treenode_for_scope(test_name)
        self._notables = notables
        self._monikers, self._pivots = self._get_monikers_and_pivots()
        self._context_identifier = "{}:{}".format(self._test_name, ",".join(self._monikers))

        return

    @property
    def recorder(self):
        return self._recorder

    @property
    def scope_id(self):
        return self._scope_id

    @property
    def test_name(self):
        return self._test_name

    def _get_monikers_and_pivots(self) -> Tuple[List[str], OrderedDict[str, Any]]:
        """
            Creates a full context identifier based on the full testname and the identifiers of any
            parameterized parameters that are being passed to the test.
        """
        
        monikers = []
        pivots = OrderedDict()

        if len(self._notables) > 0:

            for pname, pobj in self._notables.items():
                
                if hasattr(pobj, "moniker"):
                    monikers.append(pobj.moniker)
                else:
                    monikers.append(str(pobj))
                
                if hasattr(pobj, "pivots"):
                    pivots[pname] = pobj.pivots
                else:
                    pivots[pname] = str(pobj)

        return monikers, pivots

    def __enter__(self):
        self._parent_scope_id, self._scope_id = self._sequencer.scope_id_create(self._context_identifier)
        logger.info("TEST SCOPE ENTER: {}, {}".format(self._context_identifier, self._scope_id))
        self._result = self._sequencer.create_test_result_node(self._scope_id, self._test_name, self._monikers, self._pivots, parent_inst=self._parent_scope_id)
        self._recorder.preview(self._result)
        self._test_scope_enter()
        return self

    def __exit__(self, ex_type: Type, ex_inst: BaseException, ex_tb: TracebackType) -> bool:
        handled = True

        if ex_type is not None:

            if issubclass(ex_type, SkipTestError):
                self._result.mark_skip(ex_inst.reason, ex_inst.bug)
            else:
                # If an exceptions was thrown in this context, it means
                # that a test threw an exception.
                tb_detail = create_traceback_detail(ex_inst)
                
                if issubclass(ex_type, AssertionError):
                    # The convention for test failures that all tests should throw
                    # an AssertionError derived exception for failure conditions.
                    # This is important because a failure condition implies an expectation
                    # was checked and not met which implies a product code related failure
                    
                    self._result.add_failure(tb_detail)
                else:
                    self._result.add_error(tb_detail)

                traceback_lines = format_traceback_detail(tb_detail)
                errmsg = os.linesep.join(traceback_lines)
                logger.error(errmsg)

            handled = True
        else:
            self._result.mark_passed()

        # Call test scope exit before we finalize our results
        self._test_scope_exit()

        self._result.finalize()
        self._recorder.record(self._result)

        self._scope_node.finalize()
        self._sequencer.scope_id_pop(self._context_identifier)

        logger.info("TEST SCOPE EXIT: {}, {}".format(self._context_identifier, self._scope_id))

        return handled

    def _test_scope_enter(self):
        return
    
    def _test_scope_exit(self):
        return

class SequencerTestSetupScope:
    def __init__(self, sequencer: "TestSequencer", recorder: ResultRecorder, test_name: str, **kwargs):
        super().__init__()

        self._sequencer = sequencer
        self._recorder = recorder
        self._test_name = test_name
        self._scope_name = "setup:{}".format(test_name)
        self._scope_args = kwargs
        self._scope_id = None
        self._parent_scope_id = None
        self._test_scope_node = self._sequencer.find_treenode_for_scope(test_name)
        return

    def __enter__(self):
        self._parent_scope_id, self._scope_id = self._sequencer.scope_id_create(self._scope_name)
        logger.info("TEST SETUP ENTER: {}, {}".format(self._scope_name, self._scope_id))
        return self

    def __exit__(self, ex_type, ex_inst, ex_tb):
        handled = False

        if ex_type is not None:
            # If an exceptions was thrown in this context, it means
            # that the exception occured during the setup for this
            # module, this means we need to mark all descendant tests
            # as error'd due to a setup failure.
            errmsg = "Exception raises setting up scope='{}'".format(self._scope_name)
            logger.exception(errmsg)
            handled = True

        self._test_scope_node.finalize()
        self._sequencer.scope_id_pop(self._scope_name)
        logger.info("TEST SETUP EXIT: {}, {}".format(self._scope_name, self._scope_id))
        return handled
