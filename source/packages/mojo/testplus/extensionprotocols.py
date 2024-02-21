__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

from typing import Type

from mojo.testplus.testjob import TestJob

from mojo.extension.extensionprotocol import ExtProtocol

class TestPlusExtensionProtocol(ExtProtocol):

    ext_protocol_name = "mojo-testplus"

    def get_testplus_default_job_type() -> Type[TestJob]:
        """
            Used to lookup and return the most relevant default job type as determined
            by the super factory search path.
        """
        return 
