
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

from datetime import datetime

import click

@click.command("timestamp")
def command_testplus_utilities_timestamp():

    from mojo.xmods.xdatetime import FORMAT_DATETIME

    now = datetime.now()
    timestamp = now.strftime(FORMAT_DATETIME).replace(" ", "T")
    print(timestamp)

    return