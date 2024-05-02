
__author__ = "Myron Walker"
__copyright__ = "Copyright 2020, Myron W Walker"
__credits__ = []

from typing import Type

from mojo.extension.extensionfactory import ExtFactory

from mojo.testplus.extensionprotocols import TestPlusExtensionProtocol

from mojo.testplus.testjob import TestJob, DefaultTestJob

class TestPlusDefaultExtensionFactory(ExtFactory, TestPlusExtensionProtocol):

    def get_testplus_default_job_type() -> Type[TestJob]:
        """
            Used to lookup and return the most relevant default job type as determined
            by the super factory search path.
        """
        return DefaultTestJob

