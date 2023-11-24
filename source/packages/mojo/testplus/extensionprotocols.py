
from typing import Protocol, Type

from mojo.testplus.testjob import TestJob

from mojo.extension.extensionprotocol import ExtProtocol
from mojo.extension.superfactory import SuperFactory

class TestPlusExtensionProtocol(ExtProtocol):

    ext_protocol_name = "mojo-testplus"

    def get_testplus_default_job_type() -> Type[TestJob]:
        """
            Used to lookup and return the most relevant default job type as determined
            by the super factory search path.
        """
        return 
