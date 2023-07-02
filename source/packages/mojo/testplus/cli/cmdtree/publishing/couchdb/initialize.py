
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

import json
import os
import sys

from datetime import datetime, timedelta

import click

HELP_HOST = "A CouchDB host name."
HELP_PORT = "The CouchDB port number."
HELP_USERNAME = "The CouchDB username who can create a database."
HELP_PASSWORD = "The CouchDB password for the specified user."
HELP_EXPIRY = "A number of days to persist the up uploaded results."

MAP_BY_BRANCH = """
function (doc) {
    if (doc.summary.build.branch && doc.summary.build.build)
    {
        key = doc.summary.build.branch
        value = { id: doc._id, summary: doc}
        emit(key, value);
    }
}
"""

MAP_BY_PIPELINE = """
function (doc) {
    if (doc.summary.pipeline.name && doc.summary.pipeline.id)
    {
        key = doc.summary.pipeline.id
        value = { id: doc._id, result: doc}
        emit(key, value);
    }
}
"""

@click.command("initialize")
@click.option("--host", required=True, type=str, help=HELP_HOST)
@click.option("--port", required=True, type=int, default=5984, help=HELP_PORT)
@click.option("--username", required=False, type=str, help=HELP_USERNAME)
@click.option("--password", required=False, type=str, help=HELP_PASSWORD)
@click.option("--expiry-days", required=False, default=365, type=int, help=HELP_EXPIRY)
def command_publishing_couchdb_initialize(host: str, port: int, username: str, password: str, expiry_days: int):
    
    try:
        import couchdb
    except ImportError:
        print("You must install 'CouchDB in order to be able to publish to a CouchDB data store.", file=sys.stderr)
        exit(1)
    
    protocol = "http"
    if host.find("http://") > -1 or host.find("https://") > -1:
        protocol, host = host.split("://", 1)

    connection = f"{host}:{port}"
    if username is not None:
        if password is None:
            errmsg = "A 'password' parameter must be specified if a username is provided."
            click.BadArgumentUsage(errmsg)
        connection = f"{username}:{password}@{connection}"
    
    connection = f"{protocol}://{connection}"

    expiry_date = datetime.now() + timedelta(days=expiry_days)

    dbsvr = couchdb.Server(connection)

    if 'testresults' not in dbsvr:
        database = dbsvr.create('testresults')

        data = {
                "_id": f"_design/default",
                "views": {
                    "by_branch": {
                        "map": MAP_BY_BRANCH
                    },
                    "by_pipeline": {
                        "map": MAP_BY_PIPELINE
                    }
                },
                "language": "javascript",
                "options": {"partitioned": False }
                }

        database.save( data )

    return