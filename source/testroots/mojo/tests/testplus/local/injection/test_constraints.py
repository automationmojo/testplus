

import mojo.testplus as testplus

import time

from mojo.testplus.sequencing.sequencertestscope import SequencerTestScope as TestScope

def test_constraint_constrained_parameter(blah: str):
    testplus.logger.info(f"test_constraint_constrained_parameter: blah={blah}.")
    return


def test_tscope_parameter(tscope: TestScope, blah: str):
    testplus.logger.info(f"test_constraint_constrained_parameter: blah={blah}.")
    return

def test_activity_logging(tscope: TestScope):

    with tscope.begin_activity("first activity") as a:
        time.sleep(2)
    
    tscope.mark_activity("second activity")

    with tscope.begin_activity("third activity") as a:
        time.sleep(2)

    return


if __name__ == "__main__":
    from mojo.testplus.entrypoints import generic_test_entrypoint
    generic_test_entrypoint()
