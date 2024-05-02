"""
.. module:: testnode
    :platform: Darwin, Linux, Unix, Windows
    :synopsis: Module that contains the :class:`TestNode` class which is utilized as the collection point
               which associates a set of tests with their descendant execution scopes.

.. moduleauthor:: Myron Walker <myron.walker@gmail.com>
"""

__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []



import logging

from mojo.xmods.injection.injectablegroup import InjectableGroup

from mojo.testplus.testref import TestRef

logger = logging.getLogger()

class TestGroup(InjectableGroup):
    """
              -------------
              |  Group A  |
        ---------------------------
        |  Group AA  |  Scope AB  |
        -------------------------------
        |         Scope AAA/ABA       |
        -------------------------------
    """

    def __init__(self, name, package=None):
        super().__init__(name, package=package)
        return

    def add_descendent(self, test_ref: TestRef):
        super().add_descendent(test_ref)
        return
