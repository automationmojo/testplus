
import mojo.testplus as testplus


def test_intentional_error():
    testplus.assert_equal(False, True, "Intentional error")
    return

if __name__ == "__main__":
    from mojo.testplus.entrypoints import generic_test_entrypoint
    generic_test_entrypoint()
