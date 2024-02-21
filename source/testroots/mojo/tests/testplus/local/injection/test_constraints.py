

import mojo.testplus as testplus


def test_constraint_constrained_parameter(blah: str):
    testplus.logger.info(f"test_constraint_constrained_parameter: blah={blah}.")
    return

if __name__ == "__main__":
    from mojo.testplus.entrypoints import generic_test_entrypoint
    generic_test_entrypoint()
