"""
.. module:: testref
    :platform: Darwin, Linux, Unix, Windows
    :synopsis: Module containing the base :class:`TestRef` type used to reference to
        tests that will be included into an a test execution graph.

.. moduleauthor:: Myron Walker <myron.walker@gmail.com>
"""

__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []


from typing import Any, List, OrderedDict

from types import FunctionType

import collections

from mojo.xmods.injection.injectableref import InjectableRef

class TestRef(InjectableRef):
    """
        The :class:`TestRef` objects are used to refer to a reference to a test.  We use :class:`TestRef` instances
        to reference the tests that are going to be run so we can control the lifespan of test case instances
        and control our memory consumption during test runs with large collections of test cases.

        The :class:`TestRef` object allows us to delay the creation of test runtime instance data and state until it is
        necessary to instantiate it and allows us to cleanup the runtime instance and state as soon as it is no longer
        being used.
    """

    def __init__(self, testfunc: FunctionType, monikers: List[str]=[], pivots: OrderedDict[str, Any]=collections.OrderedDict()):
        """
            Initializes the test reference object.

            :param testcontainer: The class of the test object that is being created.
            :param testmeth: The method on the test container
        """
        super().__init__(testfunc, monikers=monikers, pivots=pivots)
        return
