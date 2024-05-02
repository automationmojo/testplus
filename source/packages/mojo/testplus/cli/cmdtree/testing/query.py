
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []


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

    from mojo.runtime.activation import activate_runtime, ActivationProfile
    from mojo.runtime.variables import MOJO_RUNTIME_VARIABLES, resolve_runtime_variables

    # STEP 2 - Resolve the configuration variables (performed by the root command)

    # STEP 3 - Activate the runtime for the given activation class

    # We perform activation a little later in the testrunner.py file so we can
    # handle exceptions in the context of testrunner_main function
    activate_runtime(profile=ActivationProfile.Console)

    ctx = ContextSingleton()
    env = ctx.lookup("/environment")

    # STEP 4 - Apply any Option Overrides

    from mojo.runtime.optionoverrides import MOJO_RUNTIME_OPTION_OVERRIDES

    from mojo.xmods.markers import MetaFilter, parse_marker_expression

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

    from mojo.testplus.initialize import initialize_testplus_results

    initialize_testplus_results()

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

    # STEP 6 - Resolve the Configuration Maps

    from mojo.config.configurationmaps import resolve_configuration_maps
    resolve_configuration_maps(use_credentials=False, use_landscape=False,
                               use_runtime=False, use_topology=False)

    logger = logging.getLogger()

    from mojo.extension.wellknown import ConfiguredSuperFactorySingleton
    from mojo.testplus.extensionprotocols import TestPlusExtensionProtocol

    sfactory = ConfiguredSuperFactorySingleton()
    TestJobType = sfactory.get_override_types_by_order(TestPlusExtensionProtocol.get_testplus_default_job_type)

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
