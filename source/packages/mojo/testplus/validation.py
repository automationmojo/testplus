
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

from typing import Callable, Dict, Optional, Type

import logging
import os
import uuid

from mojo.errors.exceptions import NotOverloadedError
from mojo.errors.xtraceback import create_traceback_detail, format_traceback_detail

from mojo.results.model.testresult import TestResult

from mojo.xmods.injection.coupling.validatorcoupling import ValidatorCoupling

from mojo.testplus.sequencing.sequencertestscope import SequencerTestScope


class Validator(ValidatorCoupling):

    def __init__(self):
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

    def initialize(self, *args, **kwargs):
        """
            The 'initialize' method should attempt to initialize the validator but it should not allow an exception
            to be raised.  It should handle and store any exceptions raised during initialization for later evaluation
            during the 'validate' method.
        """
        self._logger.warn("Validator.initialize called on the base validator object which is a no-op.")
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
        
        result = TestResult(self._inst_id, self._validator_name, self._parent_scope_id, self._testscope._monikers, self._testscope._pivots)

        try:
            self.validate()

            result.mark_passed()
        except AssertionError as aerr:
            # If an exceptions was thrown in this context, it means
            # that a test threw an exception.
            tb_detail = create_traceback_detail(aerr)
            
            result.add_failure(tb_detail)

            traceback_lines = format_traceback_detail(tb_detail)
            errmsg = os.linesep.join(traceback_lines)
            self._logger.error(errmsg)
        except:
            # If an exceptions was thrown in this context, it means
            # that a test threw an exception.
            tb_detail = create_traceback_detail(aerr)

            result.add_error(tb_detail)

            traceback_lines = format_traceback_detail(tb_detail)
            errmsg = os.linesep.join(traceback_lines)
            self._logger.error(errmsg)

        finally:
            result.finalize()

            self._recorder.record(result)

        return



