"""
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


from mojo.coupling.factories import create_landscape
from mojo.tests.interop.casey.protocols.tasker import create_tasking_adapter

def session(sequencer):
    """
    This is the entry point for the test run sequence document.
    """

    with sequencer.enter_session_scope_context() as ssc:

        from mojo.coupling.factories import create_linux_client_coordinator_coupling

        for lc_coupling in create_linux_client_coordinator_coupling():
            scope_mojo(sequencer, lc_coupling)

    return

def scope_mojo(sequencer, lc_coupling):
    """
    This is the entry point for the 'mojo' test scope.
    """

    with sequencer.enter_module_scope_context("mojo") as msc:
        scope_mojo_tests(sequencer, lc_coupling)

    return

def scope_mojo_tests(sequencer, lc_coupling):
    """
    This is the entry point for the 'mojo_tests' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests") as msc:
        scope_mojo_tests_interop(sequencer, lc_coupling)

    return

def scope_mojo_tests_interop(sequencer, lc_coupling):
    """
    This is the entry point for the 'mojo_tests_interop' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.interop") as msc:
        scope_mojo_tests_interop_casey(sequencer, lc_coupling)

    return

def scope_mojo_tests_interop_casey(sequencer, lc_coupling):
    """
    This is the entry point for the 'mojo_tests_interop_casey' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.interop.casey") as msc:
        for lscape in create_landscape():
            scope_mojo_tests_interop_casey_protocols(sequencer, lc_coupling, lscape)

    return

def scope_mojo_tests_interop_casey_protocols(sequencer, lc_coupling, lscape):
    """
    This is the entry point for the 'mojo_tests_interop_casey_protocols' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.interop.casey.protocols") as msc:
        scope_mojo_tests_interop_casey_protocols_tasker(sequencer, lc_coupling, lscape)

    return

def scope_mojo_tests_interop_casey_protocols_tasker(sequencer, lc_coupling, lscape):
    """
    This is the entry point for the 'mojo_tests_interop_casey_protocols_tasker' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.interop.casey.protocols.tasker") as msc:
        # ================ Test Scope: mojo.tests.interop.casey.protocols.tasker#test_tasker_say_hello ================

        test_scope_name = "mojo.tests.interop.casey.protocols.tasker#test_tasker_say_hello"

        with sequencer.enter_test_setup_context(test_scope_name) as tsetup:

            for tadapter in create_tasking_adapter(sequencer ,lscape):

                notables = { 'tadapter': tadapter, }
                with sequencer.enter_test_scope_context(test_scope_name, notables=notables) as tscope:
                    from mojo.tests.interop.casey.protocols.tasker import test_tasker_say_hello
                    test_tasker_say_hello(tadapter)


    return
