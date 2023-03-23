__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

import os

from mojo.xmods.exceptions import SemanticError

class TestRootType:
    TESTPLUS = "testplus"

def lookup_test_root_type(test_root):

    test_root_module = os.path.join(test_root, os.path.join("__testroot__.py"))
    if not os.path.exists(test_root_module):
        errmsg = "The test root must have a module '__testroot__.py'. testroot={}".format(test_root_module)
        raise SemanticError(errmsg) from None

    ROOT_TYPE = None

    trm_content = ""
    with open(test_root_module, 'r') as trmf:
        trm_content = trmf.read().strip()

    locals_vars = {}
    exec(trm_content, None, locals_vars)
    if "ROOT_TYPE" in locals_vars:
        ROOT_TYPE = locals_vars["ROOT_TYPE"]

    if ROOT_TYPE is None:
        errmsg = "The test root module must have a 'ROOT_TYPE' variable specifying (testplus, unittest).".format(test_root_module)
        raise SemanticError(errmsg) from None

    if not ((ROOT_TYPE == TestRootType.TESTPLUS) or (ROOT_TYPE == TestRootType.UNITTEST)):
        errmsg = "Unknow test root type {}".format(ROOT_TYPE)
        raise SemanticError(errmsg) from None

    return ROOT_TYPE
