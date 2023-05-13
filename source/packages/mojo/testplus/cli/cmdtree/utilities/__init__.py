
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

import click

from mojo.testplus.cli.cmdtree.utilities.timestamp import command_testplus_utilities_timestamp


@click.group("utilities", help="Contains various automation pipeline utility commands.")
def group_testplus_utilities():
    return

group_testplus_utilities.add_command(command_testplus_utilities_timestamp)