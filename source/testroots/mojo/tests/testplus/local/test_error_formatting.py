
import mojo.testplus as testplus

def test_intentional_error():
    raise Exception("Intentional error.")

def test_intentional_failure():
    testplus.assert_equal(False, True, "Intentional failure.")
    return

if __name__ == "__main__":
    from mojo.testplus.entrypoints import generic_test_entrypoint
    generic_test_entrypoint()
