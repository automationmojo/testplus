

#!/usr/bin/env python3
"""
.. module:: testplus_command
    :platform: Darwin, Linux, Unix, Windows
    :synopsis: The script entrypoint for the 'testplus' command.

.. moduleauthor:: Myron Walker <myron.walker@gmail.com>
"""

__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []


import click

from mojo.testplus.cli.cmdtree.testing import group_testplus_testing
from mojo.testplus.cli.cmdtree.utilities import group_testplus_utilities


@click.group("testplus")
@click.option('-v', '--verbose', count=True)
def testplus_root_command(verbose):

    from mojo.runtime.runtimevariables import MOJO_RUNTIME_VARIABLES

    if verbose == 0:
        MOJO_RUNTIME_VARIABLES.MJR_INTERACTIVE_CONSOLE = True
    else:
        MOJO_RUNTIME_VARIABLES.MJR_INTERACTIVE_CONSOLE = False

        if verbose == 1:
            MOJO_RUNTIME_VARIABLES.MJR_LOG_LEVEL_CONSOLE = "INFO"
        elif verbose == 2:
            MOJO_RUNTIME_VARIABLES.MJR_LOG_LEVEL_CONSOLE = "DEBUG"
        elif verbose > 2:
            MOJO_RUNTIME_VARIABLES.MJR_LOG_LEVEL_CONSOLE = "NOTSET"

    from mojo.testplus.initialize import initialize_testplus_runtime
    initialize_testplus_runtime()

    return

testplus_root_command.add_command(group_testplus_testing)
testplus_root_command.add_command(group_testplus_utilities)

if __name__ == '__main__':
    testplus_root_command()