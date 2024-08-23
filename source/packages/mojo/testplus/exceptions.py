
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []


from mojo.errors.exceptions import SkipError

def skip_test(reason: str):
    raise SkipError(reason)
