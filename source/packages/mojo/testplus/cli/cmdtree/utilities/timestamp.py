
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []


from datetime import datetime

import click

@click.command("timestamp")
def command_testplus_utilities_timestamp():

    from mojo.xmods.xdatetime import DATETIME_FORMAT_FILESYSTEM

    now = datetime.now()
    timestamp = now.strftime(DATETIME_FORMAT_FILESYSTEM).replace(" ", "T")
    print(timestamp)

    return