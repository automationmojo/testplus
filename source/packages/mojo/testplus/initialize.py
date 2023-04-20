

import os

from mojo.xmods.xcollections.context import Context, ContextPaths

from mojo.runtime.initialize import initialize_runtime, MOJO_RUNTIME_STATE
from mojo.runtime.variables import MOJO_RUNTIME_VARIABLES

TESTPLUS_DIR = os.path.dirname(__file__)
TEMPLATES_DIR = os.path.join(TESTPLUS_DIR, "templates")
STATIC_DIR = os.path.join(TEMPLATES_DIR, "static")

def initialize_testplus_runtime():
    if not MOJO_RUNTIME_STATE.INITIALIZED:
        initialize_runtime(name="testplus", logger_name="TP")
    return

def initialize_testplus_results():
    dest_static_dir = os.path.join(MOJO_RUNTIME_VARIABLES.MJR_HOME_DIRECTORY, "results", "static")

    if MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_SRC_DIR is None:
        MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_SRC_DIR = STATIC_DIR
    if MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_DEST_DIR is None:
        MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_DEST_DIR = dest_static_dir
    if MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_SUMMARY_TEMPLATE is None:
        MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_SUMMARY_TEMPLATE = os.path.join(TEMPLATES_DIR, "testsummary.html")

    ctx = Context()
    ctx.insert(ContextPaths.DIR_RESULTS_RESOURCE_SRC, MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_SRC_DIR)
    ctx.insert(ContextPaths.DIR_RESULTS_RESOURCE_DEST, MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_DEST_DIR)
    ctx.insert(ContextPaths.FILE_RESULTS_TEMPLATE, MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_SUMMARY_TEMPLATE)
    return
