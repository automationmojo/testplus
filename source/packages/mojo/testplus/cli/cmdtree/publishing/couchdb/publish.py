
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
HELP_USERNAME = "The CouchDB username who can write to a database."
HELP_PASSWORD = "The CouchDB password for the specified user."
HELP_RESULTS = "A folder containing test results to publish"
HELP_EXPIRY = "A number of days to persist the up uploaded results."

@click.command("publish")
@click.option("--host", required=True, type=str, help=HELP_HOST)
@click.option("--port", required=True, type=int, default=5984, help=HELP_PORT)
@click.option("--username", required=False, type=str, help=HELP_USERNAME)
@click.option("--password", required=False, type=str, help=HELP_PASSWORD)
@click.option("--results", required=True, type=str, help=HELP_RESULTS)
@click.option("--expiry-days", required=False, default=365, type=int, help=HELP_EXPIRY)
def command_publishing_couchdb_publish(host: str, port: int, username: str, password: str, results, expiry_days):
    
    try:
        import couchdb
    except ImportError:
        print("You must install 'CouchDB in order to be able to publish to a CouchDB data store.", file=sys.stderr)
        exit(1)

    if not os.path.exists(results):
        errmsg = "The specified output folder does not exist. folder={}".format(results)
        click.BadParameter(errmsg)
    
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

    # Make sure the summary document and the tests document exists
    summary_file = os.path.join(results, "testrun_summary.json")
    testresults_file = os.path.join(results, "testrun_results.jsos")

    from mojo.xmods.xdatetime import FORMAT_DATETIME
    from mojo.testplus.jsos import load_jsos_stream_from_file

    summary = None
    with open(summary_file, 'r') as sf:
        summary = json.load(sf)

    trstream = load_jsos_stream_from_file(testresults_file)

    dbsvr = couchdb.Server(connection)

    testresults = dbsvr['testresults']

    document = {
        "summary": summary,
        "version": "1.0",
        "testresults": trstream,
        "expiry_date": expiry_date.strftime(FORMAT_DATETIME)
    }

    testresults.save(document)
    return