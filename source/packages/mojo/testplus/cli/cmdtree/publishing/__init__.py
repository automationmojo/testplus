
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

import click

from mojo.testplus.cli.cmdtree.publishing.mongodb import group_testplus_publishing_mongodb

PUBLISHING_HELP = "Contains commands groups for publishing test results to different types of data stores."

@click.group("publishing", help=PUBLISHING_HELP)
def group_testplus_publishing():
    return

group_testplus_publishing.add_command(group_testplus_publishing_mongodb)
