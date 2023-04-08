
import mojo.testplus as testplus


def test_no_parameters():
    testplus.logger.info("test_no_parameters: was run.")
    return

if __name__ == "__main__":
    from mojo.testplus.entrypoints import generic_test_entrypoint
    generic_test_entrypoint()
