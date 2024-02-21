
from mojo import testplus

from mojo.coupling.simplefactories import create_blah

testplus.originate_parameter(create_blah, identifier='blah', constraints={"message": "something"})
