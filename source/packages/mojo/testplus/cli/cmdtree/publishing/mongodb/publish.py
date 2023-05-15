
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

HELP_CONNECTION = "A MongoDB connection string."
HELP_RESULTS = "A folder containing test results to publish"
HELP_EXPIRY = "A number of days to persist the up uploaded results."

@click.command("publish")
@click.option("--connection", required=True, type=str, help=HELP_CONNECTION)
@click.option("--results", required=True, type=str, help=HELP_RESULTS)
@click.option("--expiry-days", required=False, default=365, type=int, help=HELP_EXPIRY)
def command_publishing_mongodb_publish(connection, results, expiry_days):
    
    try:
        import pymongo
    except ImportError:
        print("You must install pymongo[svr] in order to be able to publish to a MongoDB data store.", file=sys.stderr)
        exit(1)

    if not os.path.exists(results):
        errmsg = "The specified output folder does not exist. folder={}".format(results)
        click.BadParameter(errmsg)
    
    expiry_date = datetime.now() + timedelta(days=expiry_days)

    # Make sure the summary document and the tests document exists
    summary_file = os.path.join(results, "testrun_summary.json")
    testresults_file = os.path.join(results, "testrun_results.jsos")

    from mojo.testplus.jsos import load_jsos_stream_from_file

    summary = None
    with open(summary_file, 'r') as sf:
        summary = json.load(sf)

    trstream = load_jsos_stream_from_file(testresults_file)

    from pymongo import MongoClient

    client = MongoClient(connection)

    testresults = client['testresults']

    testruns_v1 = testresults['testruns_v1']

    document = {
        "summary": summary,
        "testresults": trstream,
        "expiry_date": expiry_date
    }

    testruns_v1.insert_one(document)
    return