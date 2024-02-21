
from typing import Generator

from mojo import testplus

@testplus.resource()
def create_blah(constraints={}) -> Generator[str, None, None]:
    yield "blah"