
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

import click

from mojo.testplus.cli.cmdtree.testing.jobs import group_testplus_testing_jobs

from mojo.testplus.cli.cmdtree.testing.query import command_testplus_testing_query
from mojo.testplus.cli.cmdtree.testing.run import command_testplus_testing_run

@click.group("testing", help="Contains command for working with tests and test results.")
def group_testplus_testing():
    return

group_testplus_testing.add_command(group_testplus_testing_jobs)

group_testplus_testing.add_command(command_testplus_testing_query)
group_testplus_testing.add_command(command_testplus_testing_run)
