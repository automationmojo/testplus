
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

import logging
import os
import sys

import click

from mojo.testplus.cli.cmdtree.testing.constants import (
    HELP_ROOT,
    HELP_EXCLUDES,
    HELP_INCLUDES,
    HELP_DEBUG
)

@click.command("query", help="Command used to query information about tests.")
@click.option("--root", default=None, type=str, help=HELP_ROOT)
@click.option("--excludes", "-x", multiple=True, help=HELP_EXCLUDES)
@click.option("--includes", "-i", multiple=True, help=HELP_INCLUDES)
@click.option("--debug", default=False, type=bool, help=HELP_DEBUG)
def command_testplus_testing_query(root, includes, excludes, debug):
    # pylint: disable=unused-import,import-outside-toplevel

    # We do the imports of the automation framework code inside the action functions because
    # we don't want to startup loggin and the processing of inputs and environment variables
    # until we have entered an action method.  Thats way we know how to setup the environment.

    # IMPORTANT: We need to load the context first because it will trigger the loading
    # of the default user configuration

    from mojo.xmods.xcollections.context import Context
    from mojo.xmods.xpython import extend_path

    from mojo.runtime.variables import MOJO_RUNTIME_VARIABLES

    ctx = Context()
    env = ctx.lookup("/environment")

    # Set the jobtype
    env["jobtype"] = "testrun"

    test_root = None
    if root is not None:
        MOJO_RUNTIME_VARIABLES.MJR_TESTROOT = root
    elif MOJO_RUNTIME_VARIABLES.MJR_TESTROOT is not None:
        root = MOJO_RUNTIME_VARIABLES.MJR_TESTROOT
    else:
        root = "."

    test_root = os.path.abspath(os.path.expandvars(os.path.expanduser(root)))
    if not os.path.isdir(test_root):
        errmsg = "The specified root folder does not exist. root=%s" % root
        if test_root != root:
            errmsg += " expanded=%s" % test_root
        raise click.BadParameter(errmsg)
    env["testroot"] = test_root

    # Make sure we extend PATH to include the test root
    extend_path(test_root)

    # We use console activation because all our input output is going through the terminal
    import mojo.runtime.activation.console

    from mojo.testplus.initialize import initialize_testplus_results
    initialize_testplus_results()

    from mojo.xmods.wellknown.singletons import SuperFactorySinglton
    from mojo.testplus.extensionpoints import TestPlusExtensionPoints

    # Initialize logging
    from mojo.xmods.xlogging.foundations import logging_initialize
    logging_initialize()

    logger = logging.getLogger()

    tpmod = sys.modules["mojo.testplus"]
    tpmod.logger = logger

    sfactory = SuperFactorySinglton()
    TestJobType = sfactory.get_override_types_by_order(TestPlusExtensionPoints.get_testplus_default_job_type)

    # At this point in the code, we either lookup an existing test job or we create a test job
    # from the includes, excludes or test_module

    result_code = 0
    with TestJobType(logger, test_root, includes=includes, excludes=excludes) as tjob:
        query_results = tjob.query()

        test_names = [tn for tn in query_results.keys()]
        test_names.sort()
        print()
        print("Tests:")
        for tname in test_names:
            tref = query_results[tname]
            print("    " + tname)
            param_names = [pn for pn in tref.subscriptions.keys()]
            param_names.sort()
            for pname in param_names:
                pinfo = tref.subscriptions[pname]
                print ("        {}: {}".format(pname, pinfo.describe_source()))


        print()

        if len(tjob.import_errors) > 0:
            print("IMPORT ERRORS:", file=sys.stderr)
            for ifilename in tjob.import_errors:
                imperr_msg = ifilename
                print("    " + imperr_msg, file=sys.stderr)
            print("", file=sys.stderr)

    return
