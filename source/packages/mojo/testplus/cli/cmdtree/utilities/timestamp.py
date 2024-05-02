
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []


from datetime import datetime

import click

@click.command("timestamp")
def command_testplus_utilities_timestamp():

    from mojo.xmods.xdatetime import FORMAT_DATETIME

    now = datetime.now()
    timestamp = now.strftime(FORMAT_DATETIME).replace(" ", "T")
    print(timestamp)

    return