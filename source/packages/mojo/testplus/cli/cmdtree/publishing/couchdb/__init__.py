
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

import click

from mojo.testplus.cli.cmdtree.publishing.couchdb.initialize import command_publishing_couchdb_initialize
from mojo.testplus.cli.cmdtree.publishing.couchdb.publish import command_publishing_couchdb_publish


@click.group("couchdb", help="Contains commands publishing test results to CouchDB.")
def group_testplus_publishing_couchdb():
    return

group_testplus_publishing_couchdb.add_command(command_publishing_couchdb_initialize)
group_testplus_publishing_couchdb.add_command(command_publishing_couchdb_publish)
