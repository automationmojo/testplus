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


from mojo.tests.testplus.local.test_validator_injection import create_validator
from mojo.tests.testplus.local.test_validator_injection import create_looping_validator
from mojo.coupling.simplefactories import create_blah
from mojo.tests.testplus.local.test_validator_injection import create_time_interval_validator

def session(sequencer):
    """
    This is the entry point for the test run sequence document.
    """

    with sequencer.enter_session_scope_context() as ssc:


        scope_mojo(sequencer)

    return

def scope_mojo(sequencer):
    """
    This is the entry point for the 'mojo' test scope.
    """

    with sequencer.enter_module_scope_context("mojo") as msc:
        scope_mojo_tests(sequencer)

    return

def scope_mojo_tests(sequencer):
    """
    This is the entry point for the 'mojo_tests' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests") as msc:
        scope_mojo_tests_testplus(sequencer)

    return

def scope_mojo_tests_testplus(sequencer):
    """
    This is the entry point for the 'mojo_tests_testplus' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.testplus") as msc:
        scope_mojo_tests_testplus_local(sequencer)

    return

def scope_mojo_tests_testplus_local(sequencer):
    """
    This is the entry point for the 'mojo_tests_testplus_local' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.testplus.local") as msc:
        scope_mojo_tests_testplus_local_injection(sequencer)
        scope_mojo_tests_testplus_local_test_error_formatting(sequencer)
        scope_mojo_tests_testplus_local_test_function_signatures(sequencer)
        scope_mojo_tests_testplus_local_test_validator_injection(sequencer)

    return

def scope_mojo_tests_testplus_local_injection(sequencer):
    """
    This is the entry point for the 'mojo_tests_testplus_local_injection' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.testplus.local.injection") as msc:
        for blah in create_blah():
            scope_mojo_tests_testplus_local_injection_test_constraints(sequencer, blah)

    return

def scope_mojo_tests_testplus_local_injection_test_constraints(sequencer, blah):
    """
    This is the entry point for the 'mojo_tests_testplus_local_injection_test_constraints' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.testplus.local.injection.test_constraints") as msc:
        # ================ Test Scope: mojo.tests.testplus.local.injection.test_constraints#test_activity_logging ================

        test_scope_name = "mojo.tests.testplus.local.injection.test_constraints#test_activity_logging"

        with sequencer.enter_test_scope_context(test_scope_name) as tscope:
            from mojo.tests.testplus.local.injection.test_constraints import test_activity_logging
            test_activity_logging(tscope)

        # ================ Test Scope: mojo.tests.testplus.local.injection.test_constraints#test_constraint_constrained_parameter ================

        test_scope_name = "mojo.tests.testplus.local.injection.test_constraints#test_constraint_constrained_parameter"

        with sequencer.enter_test_scope_context(test_scope_name) as tscope:
            from mojo.tests.testplus.local.injection.test_constraints import test_constraint_constrained_parameter
            test_constraint_constrained_parameter(blah)

        # ================ Test Scope: mojo.tests.testplus.local.injection.test_constraints#test_tscope_parameter ================

        test_scope_name = "mojo.tests.testplus.local.injection.test_constraints#test_tscope_parameter"

        with sequencer.enter_test_scope_context(test_scope_name) as tscope:
            from mojo.tests.testplus.local.injection.test_constraints import test_tscope_parameter
            test_tscope_parameter(tscope, blah)


    return

def scope_mojo_tests_testplus_local_test_error_formatting(sequencer):
    """
    This is the entry point for the 'mojo_tests_testplus_local_test_error_formatting' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.testplus.local.test_error_formatting") as msc:
        # ================ Test Scope: mojo.tests.testplus.local.test_error_formatting#test_intentional_error ================

        test_scope_name = "mojo.tests.testplus.local.test_error_formatting#test_intentional_error"

        with sequencer.enter_test_scope_context(test_scope_name) as tscope:
            from mojo.tests.testplus.local.test_error_formatting import test_intentional_error
            test_intentional_error()

        # ================ Test Scope: mojo.tests.testplus.local.test_error_formatting#test_intentional_failure ================

        test_scope_name = "mojo.tests.testplus.local.test_error_formatting#test_intentional_failure"

        with sequencer.enter_test_scope_context(test_scope_name) as tscope:
            from mojo.tests.testplus.local.test_error_formatting import test_intentional_failure
            test_intentional_failure()


    return

def scope_mojo_tests_testplus_local_test_function_signatures(sequencer):
    """
    This is the entry point for the 'mojo_tests_testplus_local_test_function_signatures' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.testplus.local.test_function_signatures") as msc:
        # ================ Test Scope: mojo.tests.testplus.local.test_function_signatures#test_no_parameters ================

        test_scope_name = "mojo.tests.testplus.local.test_function_signatures#test_no_parameters"

        with sequencer.enter_test_scope_context(test_scope_name) as tscope:
            from mojo.tests.testplus.local.test_function_signatures import test_no_parameters
            test_no_parameters()


    return

def scope_mojo_tests_testplus_local_test_validator_injection(sequencer):
    """
    This is the entry point for the 'mojo_tests_testplus_local_test_validator_injection' test scope.
    """

    with sequencer.enter_module_scope_context("mojo.tests.testplus.local.test_validator_injection") as msc:
        # ================ Test Scope: mojo.tests.testplus.local.test_validator_injection#test_no_parameters ================

        test_scope_name = "mojo.tests.testplus.local.test_validator_injection#test_no_parameters"

        with sequencer.enter_test_scope_context(test_scope_name) as tscope:

            try:
                nvalidator = create_validator()
                nvalidator.attach_to_test(tscope, 'vcheck')
                lvalidator = create_looping_validator()
                lvalidator.attach_to_test(tscope, 'vlcheck')
                tivalidator = create_time_interval_validator()
                tivalidator.attach_to_test(tscope, 'vticheck')

                from mojo.tests.testplus.local.test_validator_injection import test_no_parameters
                test_no_parameters()


            finally:
                tivalidator.finalize()
                lvalidator.finalize()
                nvalidator.finalize()

    return
