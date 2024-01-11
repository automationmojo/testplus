
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"


import logging
import os
import threading
import time
import uuid

from mojo.errors.exceptions import NotOverloadedError, SemanticError
from mojo.errors.xtraceback import create_traceback_detail, format_traceback_detail

from mojo.results.model.testresult import TestResult

from mojo.xmods.injection.coupling.validatorcoupling import ValidatorCoupling

from mojo.testplus.sequencing.sequencertestscope import SequencerTestScope
from mojo.waiting import wait_for_it, TimeoutContext


class Validator(ValidatorCoupling):

    def __init__(self):
        super().__init__()

        self._inst_id = str(uuid.uuid4())

        self._suffix = None
        self._testscope = None
        self._parent_scope_id = None
        self._validator_name = None
        self._recorder = None

        self._logger = logging.getLogger()
        return

    @property
    def inst_id(self):
        return self._inst_id

    @property
    def suffix(self):
        return self._suffix

    @property
    def validator_name(self):
        return self._validator_name

    def attach_to_test(self, testscope: SequencerTestScope, suffix: str):
        """
            The 'attach_to_test' method is called by the sequencer in order to attach the validator to its partner
            test scope.
        """
        self._testscope = testscope
        self._suffix = suffix
        self._parent_scope_id = self._testscope._parent_scope_id
        self._validator_name = testscope.test_name + "_" + self._suffix
        self._recorder = testscope.recorder
        self._result = TestResult(self._inst_id, self._validator_name, self._parent_scope_id, self._testscope._monikers, self._testscope._pivots)
        self._recorder.preview(self._result)
        return

    def initialize(self, *args, **kwargs):
        """
            The 'initialize' method should attempt to initialize the validator but it should not allow an exception
            to be raised.  It should handle and store any exceptions raised during initialization for later evaluation
            during the 'validate' method.
        """
        self._logger.warn("Validator.initialize called on the base validator object which is a no-op.")
        return

    def validate(self):
        """
            The 'validate' method is a self contained testcase.  It checks the state of the validator object and then
            raises the appropriate exception for an 'Error' or 'Failure' condition based on the results found.
        """
        raise NotOverloadedError("Validator derived types must implement the 'validate' method.")

    def finalize(self):
        """
            The 'finalize' method should attempt to finalize the validator but it should not allow an exception
            to be raised.  It should handle and store any exceptions raised during finalization and store any
            exceptions it has encountered into its associated test result.
        """

        try:
            self.validate()

            self._result.mark_passed()
        except AssertionError as aerr:
            # If an exceptions was thrown in this context, it means
            # that a test threw an exception.
            tb_detail = create_traceback_detail(aerr)
            
            self._result.add_failure(tb_detail)

            traceback_lines = format_traceback_detail(tb_detail)
            errmsg = os.linesep.join(traceback_lines)
            self._logger.error(errmsg)
        except Exception as gerr:
            # If an exceptions was thrown in this context, it means
            # that a test threw an exception.
            tb_detail = create_traceback_detail(gerr)

            self._result.add_error(tb_detail)

            traceback_lines = format_traceback_detail(tb_detail)
            errmsg = os.linesep.join(traceback_lines)
            self._logger.error(errmsg)

        finally:
            self._result.finalize()

            self._recorder.record(self._result)

        return


DEFAULT_LOOP_DELAY = 0

DEFAULT_SHUTDOWN_TIMEOUT = 60
DEFAULT_SHUTDOWN_INTERVAL = 1


class LoopingValidatorState:
    Initial = "Initial"
    Running = "Running"
    Shutdown = "Shutdown"
    Finished = "Finished"


class LoopingValidator(Validator):
    """
        The :class:`LoopingValidator` object provides a mechanism for performing a series
        of validation work tasks in parallel to a test.
    """

    def __init__(self, loop_delay: int=DEFAULT_LOOP_DELAY, shutdown_timeout: float=DEFAULT_SHUTDOWN_TIMEOUT, shutdown_interval: int=DEFAULT_SHUTDOWN_INTERVAL):
        
        super().__init__()

        self._loop_delay = loop_delay
        self._shutdown_timeout = shutdown_timeout
        self._shutdown_interval = shutdown_interval

        self._state = LoopingValidatorState.Initial

        self._thread = None
        self._lock = threading.RLock()

        return
    
    def attach_to_test(self, testscope: SequencerTestScope, suffix: str):
        """
            The 'attach_to_test' method is called by the sequencer in order to attach the validator to its partner
            test scope.
        """
        
        self._testscope = testscope
        self._suffix = suffix
        self._parent_scope_id = self._testscope._parent_scope_id
        self._validator_name = testscope.test_name + "_" + self._suffix
        self._recorder = testscope.recorder
        self._result = TestResult(self._inst_id, self._validator_name, self._parent_scope_id, self._testscope._monikers, self._testscope._pivots)
        self._recorder.preview(self._result)

        return

    def do_work(self) -> bool:

        return False

    def initialize(self, *args, **kwargs):
        """
            The 'initialize' method should attempt to initialize the validator but it should not allow an exception
            to be raised.  It should handle and store any exceptions raised during initialization for later evaluation
            during the 'validate' method.
        """
        if self._state != LoopingValidatorState.Initial:
            errmsg = "LoopingValidator.initialize called while the looper was already running."
            raise SemanticError(errmsg)
        
        sgate = threading.Event()
        sgate.clear()

        self._thread = threading.Thread(target=self._thread_entry, args=(sgate,) ,daemon=True)
        self._thread.start()

        sgate.wait()

        return

    def finalize(self):
        """
            The 'finalize' method should attempt to finalize the validator but it should not allow an exception
            to be raised.  It should handle and store any exceptions raised during finalization and store any
            exceptions it has encountered into its associated test result.
        """

        # Mark the state as 'Shutdown' to tell the thread to stop
        # looping
        self._state = LoopingValidatorState.Shutdown

        # We have to wait for the thread that is shutting down to exit
        # and mark the state as 'Finised' before we can call finalize
        self.wait()

        super().finalize()

        return

    def wait(self):

        wait_for_it(self._wait_for_shutdown, what_for="LoopingValidator Shutdown", timeout=self._shutdown_timeout, interval=self._shutdown_interval)

        return

    def _thread_entry(self, sgate: threading.Event):

        sgate.set()

        self._state = LoopingValidatorState.Running

        while self._state == LoopingValidatorState.Running:
            more_work = self.do_work()
            if not more_work:
                break

            if self._loop_delay > 0:
                time.sleep(self._loop_delay)

        self._state = LoopingValidatorState.Finished

        return

    def _wait_for_shutdown(self, wctx: TimeoutContext) -> bool:

        shutdown = False
        if self._state != LoopingValidatorState.Finished:
            shutdown = True

        if not shutdown and wctx.final_attempt:
            to = wctx.create_timeout(what_for="LoopingValidator Shutdown")
            raise to

        return shutdown


class TimeIntervalValidator(LoopingValidator):
    """
        The :class:`TimeIntervalValidator` object provides a mechanism for performing a series
        of validation work tasks in parallel to a test.
    """

    def __init__(self, interval: int, shutdown_timeout: float=DEFAULT_SHUTDOWN_TIMEOUT, shutdown_interval: int=DEFAULT_SHUTDOWN_INTERVAL):
        super().__init__(loop_delay=interval, shutdown_timeout=shutdown_timeout, shutdown_interval=shutdown_interval)
        return
    
    def do_work(self) -> bool:
        self.tick()
        return True
    
    def tick(self):
        """
            The 'tick' method is implemented by derived classes in order to perform work at
            a specified interval.
        """
        return