
"""
.. module:: sequencermodulescope
    :platform: Darwin, Linux, Unix, Windows
    :synopsis: Module containing the base :class:`SequencerModuleScope` type which is used to
               provide module scope error handling in the control flow for automation tests.

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

from mojo.testplus.exceptions import SkipTestError
from mojo.testplus.sequencing.sequencerscopebase import SequencerScopeBase


logger = logging.getLogger()


if TYPE_CHECKING:
    from mojo.testplus.sequencing.testsequencer import TestSequencer


class SequencerModuleScope(SequencerScopeBase):
    def __init__(self, sequencer: "TestSequencer", recorder: ResultRecorder, scope_name: str, **kwargs):
        super().__init__(sequencer, recorder)

        self._scope_name = scope_name
        self._scope_args = kwargs
        self._scope_id = None
        self._parent_scope_id = None
        self._scope_node = self._sequencer.find_treenode_for_scope(scope_name)
        return

    def __enter__(self):
        self._parent_scope_id, self._scope_id = self._sequencer.scope_id_create(self._scope_name)
        result = self._sequencer.create_test_result_container(self._scope_id, self._scope_name, parent_inst=self._parent_scope_id)
        self._recorder.record(result)
        logger.info("MODULE ENTER: {}, {}".format(self._scope_name, self._scope_id))
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
        logger.info("MODULE EXIT: {}, {}".format(self._scope_name, self._scope_id))

        return handled
