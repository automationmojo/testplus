
from typing import Protocol, Type

from mojo.testplus.testjob import TestJob

class TestPlusExtensionPoints(Protocol):

    def get_testplus_default_job_type() -> Type[TestJob]:
        """
            Used to lookup and return the most relevant default job type as determined
            by the super factory search path.
        """
        return 
