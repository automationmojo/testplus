
from typing import Type

from mojo.xmods.extension.configured import ExtensionPointsFactory

from mojo.testplus.extensionpoints import TestPlusExtensionPoints
from mojo.testplus.testjob import TestJob, DefaultTestJob

class TestPlusExtensionPointsFactory(ExtensionPointsFactory, TestPlusExtensionPoints):

    def get_testplus_default_job_type() -> Type[TestJob]:
        """
            Used to lookup and return the most relevant default job type as determined
            by the super factory search path.
        """
        return DefaultTestJob
