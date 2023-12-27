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

from typing import Type, TYPE_CHECKING

import logging
import os

from types import TracebackType

from mojo.errors.xtraceback import create_traceback_detail, format_traceback_detail

from mojo.results.recorders.resultrecorder import ResultRecorder
from mojo.results.model.jobcontainer import JobContainer

from mojo.testplus.exceptions import SkipTestError
from mojo.testplus.sequencing.sequencerscopebase import SequencerScopeBase


logger = logging.getLogger()


if TYPE_CHECKING:
    from mojo.testplus.sequencing.testsequencer import TestSequencer


class SequencerSessionScope(SequencerScopeBase):
    def __init__(self, sequencer: "TestSequencer", recorder: ResultRecorder, root_result: JobContainer):
        super().__init__(sequencer, recorder)
        
        self._scope_name = root_result.name
        self._scope_id = root_result.inst_id
        self._root_result = root_result
        self._scope_node = self._sequencer.testtree
        return

    def __enter__(self):
        self._sequencer.scope_id_push(self._scope_name, self._scope_id)
        logger.info("SESSION ENTER: {}".format(self._scope_id))
        return self

    def __exit__(self, ex_type: Type, ex_inst: BaseException, ex_tb: TracebackType) -> bool:
        handled = False

        if ex_type is not None:

            if issubclass(ex_type, SkipTestError):
                self._mark_descendants_skipped(self._scope_node, self._scope_id, ex_inst.reason, ex_inst.bug)
            else:
                tb_detail = create_traceback_detail(ex_inst)
                self._mark_descendants_as_error(self._scope_node,  self._scope_id, tb_detail)

                # If an exceptions was thrown in this context, it means
                # that the exception occured during the setup for this
                # module, this means we need to mark all descendant tests
                # as error'd due to a setup failure.
                errmsg_lines = [
                    "Exception raises setting up scope='{}'".format(self._scope_name)
                ]
                errmsg_lines.extend(format_traceback_detail(tb_detail))
                errmsg = os.linesep.join(errmsg_lines)
                logger.error(errmsg)

            handled = True

        self._scope_node.finalize()
        self._sequencer.scope_id_pop(self._scope_name)
        logger.info("SESSION EXIT: {}".format(self._scope_id))
        return handled
