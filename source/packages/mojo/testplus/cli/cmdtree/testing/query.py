
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

from typing import List

import logging
import os
import sys

import click

from mojo.testplus.cli.cmdtree.testing.constants import (
    HELP_ROOT,
    HELP_EXCLUDES,
    HELP_INCLUDES,
    HELP_EXCLUDE_MARKER_EXP,
    HELP_INCLUDE_MARKER_EXP
)

@click.command("query", help="Command used to query information about tests.")
@click.option("--root", default=None, type=str, help=HELP_ROOT)
@click.option("--excludes", "-x", multiple=True, help=HELP_EXCLUDES)
@click.option("--includes", "-i", multiple=True, help=HELP_INCLUDES)
@click.option("--include-marker-exp", required=False, multiple=True, help=HELP_INCLUDE_MARKER_EXP)
@click.option("--exclude-marker-exp", required=False, multiple=True, help=HELP_EXCLUDE_MARKER_EXP)
def command_testplus_testing_query(root, includes, excludes,
    include_marker_exp, exclude_marker_exp):
    
    # pylint: disable=unused-import,import-outside-toplevel

    # We do the imports of the automation framework code inside the action functions because
    # we don't want to startup loggin and the processing of inputs and environment variables
    # until we have entered an action method.  Thats way we know how to setup the environment.

    # IMPORTANT: We need to load the context first because it will trigger the loading
    # of the default user configuration

    from mojo.collections.contextpaths import ContextPaths
    from mojo.collections.wellknown import ContextSingleton

    from mojo.xmods.xpython import extend_path

    from mojo.runtime.variables import JobType, MOJO_RUNTIME_VARIABLES

    from mojo.runtime.optionoverrides import MOJO_RUNTIME_OPTION_OVERRIDES

    # We perform activation a little later in the testrunner.py file so we can
    # handle exceptions in the context of testrunner_main function
    import mojo.runtime.activation.console

    from mojo.testplus.initialize import initialize_testplus_runtime, initialize_testplus_results
    
    # This is a NO-OP if someone else already intialized the runtime with different names
    initialize_testplus_runtime()

    ctx = ContextSingleton()
    env = ctx.lookup("/environment")

    initialize_testplus_results()

    from mojo.testplus.markers import MetaFilter, parse_marker_expression

    # Setup the Test Root
    if root is None:
        if MOJO_RUNTIME_VARIABLES.MJR_TESTROOT is not None:
            root = MOJO_RUNTIME_VARIABLES.MJR_TESTROOT
        elif ctx.lookup(ContextPaths.TESTROOT) is not None:
            root = ctx.lookup(ContextPaths.TESTROOT)
        else:
            root = "."

    test_root = os.path.abspath(os.path.expandvars(os.path.expanduser(root)))
    if not os.path.isdir(test_root):
        errmsg = "The specified root folder does not exist. root=%s" % root
        if test_root != root:
            errmsg += " expanded=%s" % test_root
        raise click.BadParameter(errmsg)

    MOJO_RUNTIME_OPTION_OVERRIDES.override_testroot(root)

    # Make sure we extend PATH to include the test roots parent folder so imports will
    # work properly.
    test_root_parent = os.path.dirname(test_root)
    extend_path(test_root_parent)

    metafilters: List[MetaFilter] = []
    for imexp in include_marker_exp:
        imexp = imexp.strip("\"")
        imexp = imexp.strip("'")
        mfilter = parse_marker_expression("+" + imexp)
        metafilters.append(mfilter)

    for exmexp in exclude_marker_exp:
        exmexp = exmexp.strip("\"")
        imexp = imexp.strip("'")
        mfilter = parse_marker_expression("-" + imexp)
        metafilters.append(mfilter)

    # Initialize testplus results and logging
    initialize_testplus_results()

    logger = logging.getLogger()

    from mojo.xmods.wellknown.singletons import SuperFactorySinglton
    from mojo.testplus.extensionpoints import TestPlusExtensionPoints

    sfactory = SuperFactorySinglton()
    TestJobType = sfactory.get_override_types_by_order(TestPlusExtensionPoints.get_testplus_default_job_type)

    # At this point in the code, we either lookup an existing test job or we create a test job
    # from the includes, excludes or test_module
    result_code = 0
    with TestJobType(logger, test_root, includes=includes, excludes=excludes, metafilters=metafilters) as tjob:
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
