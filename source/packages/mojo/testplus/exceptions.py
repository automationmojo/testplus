__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

class UnknownParameterError(RuntimeError):
    """
        This error is raised when the test framework encounters a
        reference to a well-known parameter that cannot be resolved.
    """

class SkipTestError(RuntimeError):
    """
        This error is raised when the test indicates that it should be skipped
        due to some reason that occures during the test.
    """

def skip_test(reason: str):
    raise SkipTestError(reason)