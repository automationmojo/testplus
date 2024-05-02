
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []


import os

from mojo.collections.contextpaths import ContextPaths
from mojo.collections.wellknown import ContextSingleton

from mojo.xmods.xlogging.foundations import logging_initialize
    
from mojo.runtime.initialize import initialize_runtime, MOJO_RUNTIME_STATE
from mojo.runtime.variables import MOJO_RUNTIME_VARIABLES

TESTPLUS_DIR = os.path.dirname(__file__)

class TestPlusVariables:
    TESTPLUS_TEMPLATES_DIR = os.path.join(TESTPLUS_DIR, "templates")
    TESTPLUS_RESOURCE_DEST_LEAF = os.path.join("static", "v1")
    TESTPLUS_RESOURCE_SRC_DIR = os.path.join(TESTPLUS_TEMPLATES_DIR, "v1", "static")
    TESTPLUS_SUMMARY_TEMPLATE = os.path.join(TESTPLUS_TEMPLATES_DIR, "v1", "testsummary.html")
    

def initialize_testplus_runtime():
    if not MOJO_RUNTIME_STATE.INITIALIZED:
        name="mjr"
        home_dir = os.path.join(os.path.expanduser("~"), name)
        initialize_runtime(name=name, home_dir=home_dir, logger_name="TP")
    return

def initialize_testplus_results():
    dest_static_dir = os.path.join(MOJO_RUNTIME_VARIABLES.MJR_HOME_DIRECTORY, "results", TestPlusVariables.TESTPLUS_RESOURCE_DEST_LEAF)

    if MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_SRC_DIR is None:
        MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_SRC_DIR = TestPlusVariables.TESTPLUS_RESOURCE_SRC_DIR
    if MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_DEST_DIR is None:
        MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_DEST_DIR = dest_static_dir
    if MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_SUMMARY_TEMPLATE is None:
        MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_SUMMARY_TEMPLATE = TestPlusVariables.TESTPLUS_SUMMARY_TEMPLATE

    ctx = ContextSingleton()
    ctx.insert(ContextPaths.DIR_RESULTS_RESOURCE_SRC, MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_SRC_DIR)
    ctx.insert(ContextPaths.DIR_RESULTS_RESOURCE_DEST, MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_RESOURCE_DEST_DIR)
    ctx.insert(ContextPaths.FILE_RESULTS_TEMPLATE, MOJO_RUNTIME_VARIABLES.MJR_RESULTS_STATIC_SUMMARY_TEMPLATE)
    
    logging_initialize()

    return
