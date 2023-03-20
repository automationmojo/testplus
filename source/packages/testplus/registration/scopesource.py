
from typing import Callable, Union

from mojo.xmods.landscaping.coupling.scopecoupling import ScopeCoupling

from testplus.registration.sourcebase import SourceBase

class ScopeSource(SourceBase):

    def __init__(self, source_func: Callable, query_func: Union[Callable, None], scope_type: ScopeCoupling, constraints: dict):
        SourceBase.__init__(self, source_func, query_func, scope_type, constraints)
        self._source_func = source_func
        return
