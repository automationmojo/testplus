
"""
.. module:: sequencerscopebase
    :platform: Darwin, Linux, Unix, Windows
    :synopsis: Module containing the :class:`SequencerScopeBase` which servces as a base
               scope object for other sequencer scope objects.

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

from typing import TYPE_CHECKING

import logging
import uuid

from mojo.errors.xtraceback import TracebackDetail

from mojo.results.recorders.resultrecorder import ResultRecorder

from mojo.testplus.testgroup import TestGroup
from mojo.testplus.testref import TestRef

if TYPE_CHECKING:
    from mojo.testplus.sequencing.testsequencer import TestSequencer


logger = logging.getLogger()


class SequencerScopeBase:

    def __init__(self, sequencer: "TestSequencer", recorder: ResultRecorder):
        super().__init__()

        self._sequencer = sequencer
        self._recorder = recorder
        return

    def _mark_descendants_as_error(self, cursor, cursor_id, tbdetail):

        for chkey in cursor.children:
            child = cursor.children[chkey]
            if not child.finalized:
                if isinstance(child, TestRef):
                    self._mark_test_as_error(child, cursor_id, tbdetail)
                elif isinstance(child, TestGroup):
                    scope_id = str(uuid.uuid4())
                    scope_name = child.scope_name
                    result = self._sequencer.create_test_result_container(scope_id, scope_name, parent_inst=cursor_id)
                    self._recorder.record(result)
                    self._mark_descendants_as_error(child, scope_id, tbdetail)

        return

    def _mark_descendants_skipped(self, cursor, cursor_id, reason, bug):

        for chkey in cursor.children:
            child = cursor.children[chkey]
            if not child.finalized:
                if isinstance(child, TestRef):
                    self._mark_test_as_skip(child, cursor_id, reason, bug)
                elif isinstance(child, TestGroup):
                    scope_id = str(uuid.uuid4())
                    scope_name = child.scope_name
                    result = self._sequencer.create_test_result_container(scope_id, scope_name, parent_inst=cursor_id)
                    self._recorder.record(result)
                    self._mark_descendants_skipped(child, scope_id, reason, bug)

        return

    def _mark_test_as_error(self, testref: TestRef, parent_id: str, tbdetail: TracebackDetail):
        test_id = str(uuid.uuid4())
        result = self._sequencer.create_test_result_node(test_id, testref.name, testref.monikers, testref.pivots, parent_inst=parent_id)
        result.add_error(tbdetail)
        result.finalize()
        self._recorder.record(result)
        return

    def _mark_test_as_skip(self, testref: TestRef, parent_id: str, reason: str, bug: str):
        test_id = str(uuid.uuid4())
        result = self._sequencer.create_test_result_node(test_id, testref.name, testref.monikers, testref.pivots, parent_inst=parent_id)
        result.mark_skip(reason, bug)
        result.finalize()
        self._recorder.record(result)
        return