
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

from mojo.xmods.xlogging.levels import LOG_LEVEL_NAMES

from testplus.cli.cmdtree.testing.constants import (
    HELP_ROOT,
    HELP_EXCLUDES,
    HELP_INCLUDES,
    HELP_OUTPUT,
    HELP_START,
    HELP_BRANCH,
    HELP_BUILD,
    HELP_FLAVOR,
    HELP_JOB_INITIATOR,
    HELP_JOB_LABEL,
    HELP_JOB_NAME,
    HELP_JOB_OWNER,
    HELP_CREDENTIAL,
    HELP_CREDENTIAL_NAMES,
    HELP_CREDENTIAL_PATH,
    HELP_LANDSCAPE,
    HELP_LANDSCAPE_NAMES,
    HELP_LANDSCAPE_PATH,
    HELP_RUNTIME,
    HELP_RUNTIME_NAMES,
    HELP_RUNTIME_PATH,
    HELP_TOPOLOGY,
    HELP_TOPOLOGY_NAMES,
    HELP_TOPOLOGY_PATH,
    HELP_RUNID,
    HELP_CONSOLE_LOG_LEVEL,
    HELP_FILE_LOG_LEVEL,
    HELP_DEBUGGER,
    HELP_BREAKPOINT,
    HELP_TIMETRAVEL,
    HELP_TIMEPORTAL,
    HELP_PRERUN_DIAGNOSTIC,
    HELP_POSTRUN_DIAGNOSTIC,
    HELP_INCLUDE_MARKER_EXP,
    HELP_EXCLUDE_MARKER_EXP
)

@click.command("run", help="Command used to run collections of tests.")
@click.option("--root", default=None,  type=str, required=False, help=HELP_ROOT)
@click.option("--excludes", "-x", multiple=True, required=False, help=HELP_EXCLUDES)
@click.option("--includes", "-i", multiple=True, help=HELP_INCLUDES)
@click.option("--output", "-o", default=None, required=False, help=HELP_OUTPUT)
@click.option("--start", default=None, required=False, help=HELP_START)
@click.option("--runid", default=None, required=False, help=HELP_RUNID)
@click.option("--branch", default=None, required=False, help=HELP_BRANCH)
@click.option("--build", default=None, required=False, help=HELP_BUILD)
@click.option("--flavor", default=None, required=False, help=HELP_FLAVOR)
@click.option("--job-initiator", default=None, required=False, help=HELP_JOB_INITIATOR)
@click.option("--job-label", default=None, required=False, help=HELP_JOB_LABEL)
@click.option("--job-name", default=None, required=False, help=HELP_JOB_NAME)
@click.option("--job-owner", default=None, required=False, help=HELP_JOB_OWNER)
@click.option("--credential", "credential_files", multiple=True, default=None, required=False, help=HELP_CREDENTIAL)
@click.option("--credential-name", "credential_names", default=None, required=False, help=HELP_CREDENTIAL_NAMES)
@click.option("--credential-path", "credential_path", default=None, required=False, help=HELP_CREDENTIAL_PATH)
@click.option("--landscape", "landscape_files", multiple=True, default=None, required=False, help=HELP_LANDSCAPE)
@click.option("--landscape-name", "landscape_names", default=None, required=False, help=HELP_LANDSCAPE_NAMES)
@click.option("--landscape-path", "landscape_path", default=None, required=False, help=HELP_LANDSCAPE_PATH)
@click.option("--runtime", "runtime_files", multiple=True, default=None, required=False, help=HELP_RUNTIME)
@click.option("--runtime-name", "runtime_names", default=None, required=False, help=HELP_RUNTIME_NAMES)
@click.option("--runtime-path", "runtime_path", default=None, required=False, help=HELP_RUNTIME_PATH)
@click.option("--topology", "topology_files", multiple=True, default=None, required=False, help=HELP_TOPOLOGY)
@click.option("--topology-name", "topology_names", default=None, required=False, help=HELP_TOPOLOGY_NAMES)
@click.option("--topology-path", "topology_path", default=None, required=False, help=HELP_TOPOLOGY_PATH)
@click.option("--console-level", default=None, required=False, type=click.Choice(LOG_LEVEL_NAMES, case_sensitive=False), help=HELP_CONSOLE_LOG_LEVEL)
@click.option("--logfile-level", default=None, required=False, type=click.Choice(LOG_LEVEL_NAMES, case_sensitive=False), help=HELP_FILE_LOG_LEVEL)
@click.option("--debugger", default=None, required=False, type=click.Choice(['pdb', 'debugpy']), help=HELP_DEBUGGER)
@click.option("--breakpoint", "breakpoints", default=None, required=False, multiple=True, type=click.Choice(['test-discovery', 'testrun-start']), help=HELP_BREAKPOINT)
@click.option("--time-travel", is_flag=True, default=False, required=False, help=HELP_TIMETRAVEL)
@click.option("--time-portal", "timeportals", default=None, required=False, multiple=True, help=HELP_TIMEPORTAL)
@click.option("--prerun-diagnostic", is_flag=True, default=False, required=False, help=HELP_PRERUN_DIAGNOSTIC)
@click.option("--postrun-diagnostic", is_flag=True, default=False, required=False, help=HELP_POSTRUN_DIAGNOSTIC)
@click.option("--include-marker-exp", required=False, multiple=True, help=HELP_INCLUDE_MARKER_EXP)
@click.option("--exclude-marker-exp", required=False, multiple=True, help=HELP_EXCLUDE_MARKER_EXP)
def command_testplus_testing_run(root, includes, excludes, output, start, runid, branch, build, flavor, job_initiator,
                        job_label, job_name, job_owner, credentials_files, credential_names, credential_path,
                        landscape_files, landscape_names, landscape_path, runtime_files, runtime_names, runtime_path,
                        topology_files, topology_names, topology_path, console_level, logfile_level,
                        debugger, breakpoints, time_travel, timeportals, prerun_diagnostic,
                        postrun_diagnostic, include_marker_exp, exclude_marker_exp):

    # pylint: disable=unused-import,import-outside-toplevel

    # We do the imports of the automation framework code inside the action functions because
    # we don't want to startup loggin and the processing of inputs and environment variables
    # until we have entered an action method.  Thats way we know how to setup the environment.

    # IMPORTANT: We need to load the context first because it will trigger the loading
    # of the default user configuration
    from mojo.xmods.xcollections.context import Context, ContextPaths
    from mojo.xmods.xpython import extend_path

    from mojo.runtime.variables import JobType, MOJO_RUNTIME_VARIABLES
    
    from mojo.runtime import optionoverrides

    ctx = Context()
    env = ctx.lookup("/environment")

    # We need to set the job type before we trigger activation.
    env["jobtype"] = JobType.TestRun

    # We perform activation a little later in the testrunner.py file so we can
    # handle exceptions in the context of testrunner_main function
    import mojo.runtime.activation.testrun

    from mojo.xmods.xlogging.foundations import logging_initialize

    from testplus.markers import MetaFilter, parse_marker_expression

    if branch is not None:
        optionoverrides.override_build_branch(branch)

    if build is not None:
        optionoverrides.override_build_name(build)
    
    if flavor is not None:
        optionoverrides.override_build_flavor(flavor)
    
    if job_initiator is not None:
        optionoverrides.override_job_initiator(job_initiator)
    
    if job_label is not None:
        optionoverrides.override_job_label(job_label)
    
    if job_name is not None:
        optionoverrides.override_job_name(job_name)

    if job_owner is not None:
        optionoverrides.override_job_owner(job_owner)

    if credentials_files is not None:
        optionoverrides.override_config_credential_files(credentials_files)

    if landscape_files is not None and landscape_names is not None:
        errmsg = "The '--landscape-file' and '--landscape-name' options should not be used together."
        raise click.BadOptionUsage("landscape-name", errmsg)

    if landscape_files is not None:
        optionoverrides.override_config_landscape_files(landscape_files)

    if landscape_names is not None:
        optionoverrides.override_config_landscape_names(landscape_names)

    if landscape_files is not None or landscape_names is not None:
        landscape_filenames = MOJO_RUNTIME_VARIABLES.MJR_CONFIG_LANDSCAPE_FILES
        option_name = "landscape" if landscape_files is not None else "landscape-names"
        if not os.path.exists(landscape_filenames):
            errmsg = "The specified landscape file does not exist. filename={}".format(landscape_filenames)
            raise click.BadOptionUsage(option_name, errmsg)

    if runtime_files is not None and runtime_names is not None:
        errmsg = "The '--runtime-file' and '--runtime-name' options should not be used together."
        raise click.BadOptionUsage("runtime-name", errmsg)

    if runtime_files is not None:
        optionoverrides.override_config_runtime_files(runtime_files)
    
    if runtime_names is not None:
        optionoverrides.override_config_runtime_names(runtime_names)
    
    if runtime_files is not None or runtime_names is not None:
        runtime_filename = MOJO_RUNTIME_VARIABLES.MJR_CONFIG_RUNTIME_FILES
        option_name = "runtime" if runtime_files is not None else "runtime-names"
        if not os.path.exists(runtime_filename):
            errmsg = "The specified runtime file does not exist. filename={}".format(runtime_filename)
            raise click.BadOptionUsage(option_name, errmsg)

    if topology_files is not None and topology_names is not None:
        errmsg = "The '--topology-file' and '--topology-name' options should not be used together."
        raise click.BadOptionUsage("option_name", errmsg)

    if topology_files is not None:
        optionoverrides.override_config_topology_files(topology_files)
    
    if topology_names is not None:
        optionoverrides.override_config_topology_names(topology_names)

    if topology_files is not None or topology_names is not None:
        topology_filename = MOJO_RUNTIME_VARIABLES.MJR_CONFIG_TOPOLOGY_FILES
        option_name = "topology" if topology_files is not None else "topology-names"
        if not os.path.exists(topology_filename):
            errmsg = "The specified topology file does not exist. filename={}".format(topology_filename)
            raise click.BadOptionUsage(option_name, errmsg)

    if console_level is not None:
        optionoverrides.override_loglevel_console(console_level)

    if logfile_level is not None:
        optionoverrides.override_loglevel_file(logfile_level)

    if output is not None:
        optionoverrides.override_output_directory(output)

    if start is not None:
        optionoverrides.override_starttime(start)
    
    if runid is not None:
        optionoverrides.override_runid(runid)

    # Process the commandline args here and then set the variables on the environment
    # as necessary.  We need to do this before we import activate.
    if breakpoints is not None:
        optionoverrides.override_debug_breakpoints(breakpoints)

        # If a breakpoint was passed bug the debugger was not, use 'debugpy' for the
        # default debugger.
        if debugger is None:
            optionoverrides.override_debug_debugger('debugpy')

    if debugger is not None:
        optionoverrides.override_debug_debugger('debugpy')

    if time_travel is not None:
        optionoverrides.override_timetravel(time_travel)

    if timeportals is not None:
        optionoverrides.override_timeportals(timeportals)

    if prerun_diagnostic:
        ctx.insert("/configuration/diagnostics/prerun-diagnostic", {})
    
    if postrun_diagnostic:
        ctx.insert("/configuration/diagnostics/postrun-diagnostic", {})

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

    optionoverrides.override_testroot(root)

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

    # Initialize logging
    logging_initialize()
    logger = logging.getLogger()

    from testplus.extensionpoints import TestplusExtensionPoints
    akep = TestplusExtensionPoints()

    # At this point in the code, we either lookup an existing test job or we create a test job
    # from the includes, excludes or test_module
    TestJobType = akep.get_testplus_default_job_type()
    result_code = 0
    with TestJobType(logger, test_root, includes=includes, excludes=excludes, metafilters=metafilters) as tjob:
        result_code = tjob.execute()

    sys.exit(result_code)

    return