
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []


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