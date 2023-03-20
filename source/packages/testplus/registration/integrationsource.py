
from typing import Callable

from mojo.xmods.landscaping.coupling.integrationcoupling import IntegrationCoupling

from testplus.registration.sourcebase import SourceBase

class IntegrationSource(SourceBase):

    def __init__(self, source_func: Callable, integration_type: IntegrationCoupling, constraints: dict):
        SourceBase.__init__(self, source_func, None, integration_type, constraints)
        return
