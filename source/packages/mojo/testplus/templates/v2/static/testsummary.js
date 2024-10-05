/*
    Author: "Myron Walker"
    Copyright: "Copyright 2024, Myron W Walker"
    Version: = "2.0.0"
    Email: myron.walker@gmail.com
*/

// Summary State
var g_summary = null;

// Configuration State
var g_landscape_configuration = null
var g_startup_configuration = null;

// Results State
var g_results = null;
var g_counter_passed = 0;
var g_counter_failed = 0;
var g_counter_errors = 0;
var g_counter_skipped = 0;
var g_counter_total = 0;
var g_display_mode = "GROUPED";
var g_filter_mode = "NONE";

// Artifacts State
var g_artifacts_catalog = null;
var g_artifacts_sub_catalogs = null;
var g_artifacts_buttons = null;
var g_artifacts_tabs = null;

// Import Error State
var g_import_errors = null;

// File Catalog State
var g_catalog = null;


/*************************************************************************************
 *************************************************************************************
 *
 *                                  HELPER FUNCTIONS
 * 
 *************************************************************************************
 *************************************************************************************/

function split_test_fullname(testname_full) {
    var package_name = null;
    var test_name = null;

    var sindex = testname_full.search("#");

    if (sindex > -1) {
        name_parts = testname_full.split("#");
        package_name = name_parts[0];
        test_name = name_parts[1];
    }

    return [package_name, test_name];
}

/*************************************************************************************
 *************************************************************************************
 *
 *                                  ENABLE FUNCTIONS
 * 
 *************************************************************************************
 *************************************************************************************/

function enable_artifacts_section() {
    document.getElementById('artifacts-title').style = "display: block";
    document.getElementById('artifacts-tab-bar').style = "display: block";
    document.getElementById('artifacts-tab-content').style = "display: block";
}

/*************************************************************************************
 *************************************************************************************
 *
 *                                   LOAD FUNCTIONS
 * 
 *************************************************************************************
 *************************************************************************************/

async function load_artifact_folders() {
    g_artifacts_catalog = await fetch_json("artifacts/catalog.json");

    if ((g_artifacts_catalog != null) && (g_artifacts_catalog.folders.length > 0)) {
        enable_artifacts_section();

        g_artifacts_sub_catalogs = {};

        for (var findex in g_artifacts_catalog.folders) {
            var folder = g_artifacts_catalog.folders[findex];

            artifact_catalog = await fetch_http("artifacts/" + folder + "/catalog.json").catch(err => {
                console.log("The '" + folder + "' artifacts folder does not have a 'catalog.json' file.")
            });

            if ((artifact_catalog != null) && (artifact_catalog != "")) {
                g_artifacts_sub_catalogs[folder] = artifact_catalog;
            }
        }
    }
}

async function load_catalog() {
    g_catalog = await fetch_json("catalog.json");
}

async function load_configuration() {

    g_landscape_configuration = await fetch_json("landscape-declared.json").catch(err => {
        console.log("Unable to load the landscape declaration file='landscape-declared.json'.")
    });

    g_startup_configuration = await fetch_json("startup-configuration.json").catch(err => {
        console.log("Unable to load the landscape declaration file='startup-configuration.json'.")
    });

}

async function load_import_errors() {
    g_import_errors = await fetch_json_stream("import_errors.jsos")
}

async function load_results() {
    var results = await fetch_json_stream("testrun_results.jsos");

    var counter_passed = 0;
    var counter_errors = 0;
    var counter_failed = 0;
    var counter_skipped = 0;

    if (g_display_mode == "GROUPED") {
        g_results = {};

        var parent_lookup = {};

        if (g_filter_mode == "NONE") {
            var rcount = results.length;

            while (rcount > 0) {

                var ritem = results.shift();

                var ritem_instance = ritem.instance;
                var ritem_parentid = ritem.parent;

                if (ritem.rtype == "TEST") {

                    if (! parent_lookup.hasOwnProperty(ritem_instance)) {

                        ritem.tasking_groups = [];
                        parent_lookup[ritem_instance] = ritem;

                    } else {
                        
                        var preview_ritem = parent_lookup[ritem_instance];
                        ritem.tasking_groups = preview_ritem.tasking_groups;

                        var moniker_suffix = ""
                        if ((ritem.monikers) && (ritem.monikers.length > 0)) {
                            moniker_start = "["
                            ritem.monikers.forEach(item => {
                                moniker_suffix = moniker_suffix + "[" + item + "]"
                                moniker_start = ",["
                            });
                        }

                        var testname_full = ritem.name;
                        if (moniker_suffix != "") {
                            testname_full = testname_full + ":" + moniker_suffix;
                        }

                        const [package_name, test_name] = split_test_fullname(testname_full);
                        ritem.name = test_name
                        ritem.package_name = package_name

                        var detail = ritem.detail;
                        detail.passed = false;
                        detail.skipped = false;

                        if (detail.errors.length > 0) {
                            counter_errors += 1;
                        }
                        else if (detail.failures.length > 0) {
                            counter_failed += 1;
                        }
                        else {
                            if (ritem.result == "SKIPPED") {
                                detail.skipped = true;
                                counter_skipped += 1;
                            } else {
                                detail.passed = true;
                                counter_passed += 1;
                            }
                        }

                        var package_list = null;
                        if (package_name in g_results) {
                            package_list = g_results[package_name];
                        } else {
                            package_list = [];
                            g_results[package_name] = package_list;
                        }

                        package_list.push(ritem);

                    }

                } else if (ritem.rtype == "TASKING_GROUP") {

                    if (parent_lookup.hasOwnProperty(ritem_parentid)) {

                        if (! parent_lookup.hasOwnProperty(ritem_instance)) {
                            parent_item = parent_lookup[ritem_parentid];
                            ritem.taskings = [];
                            ritem.passed = 0;
                            ritem.failed = 0;
                            ritem.errored = 0;
                            parent_item.tasking_groups.push(ritem);
                            parent_lookup[ritem_instance] = ritem;

                        } else {
                            original_tgroup = parent_lookup[ritem_instance];
                            original_tgroup.stop = ritem.stop;
                        }

                    }
                
                } else if (ritem.rtype == "TASKING") {
                    
                    if (parent_lookup.hasOwnProperty(ritem_parentid)) {
                        var parent_item = parent_lookup[ritem_parentid];
                        parent_item.taskings.push(ritem)

                        if (ritem.detail.errors.length > 0) {
                            parent_item.errored += 1;
                        }
                        else if (ritem.detail.failures.length > 0) {
                            parent_item.failed += 1;
                        }
                        else {
                            parent_item.passed += 1;
                        }
                    }
                }

                rcount = rcount - 1;
            }

        } else {

            var filter_status = g_filter_mode;
            var rcount = results.length;
            while (rcount > 0) {
                var ritem = results.shift();
                if ((ritem.rtype == "TEST") && (ritem.result == filter_status)) {
                    g_results.push(ritem);
                }
                rcount = rcount - 1;
            }

        }

    } else {
        //TODO: Add code to create tree based g_results
    }

    g_counter_passed = counter_passed;
    g_counter_errors = counter_errors;
    g_counter_failed = counter_failed;
    g_counter_skipped = counter_skipped;

}

async function load_summary() {
    g_summary = await fetch_json("testrun_summary.json");
}

/*************************************************************************************
 *************************************************************************************
 *
 *                                 ELEMENT CREATION
 * 
 *************************************************************************************
 *************************************************************************************/

function adjust_index_identifier(path, name, value) {
    var display_name = name;

    var modpath = path.join("/")
    if (modpath == "landscape/environment/credentials") {
        display_name = display_name + " - " + value["identifier"];
    } else if (modpath == "landscape/pod/devices") {
        var devtype = value["deviceType"];
        if (devtype == "network/upnp") {
            var upnpinfo = value["upnp"];
            display_name = display_name + " - " + upnpinfo["modelNumber"] + ", " + upnpinfo["modelName"] + " - " + upnpinfo["IP"] + " - " + upnpinfo["USN"];
        } else if (devtype == "network/ssh") {
            display_name = display_name + " - " + value["host"];
        }

    } else if ((modpath == "landscape/pod/power") || (modpath == "landscape/pod/serial")) {
        display_name = display_name + " - " + value["name"]
    } else if ((modpath == "startup/scans/upnp/found_devices") ||
        (modpath == "startup/scans/upnp/matching_devices") ||
        (modpath == "startup/scans/upnp/missing_devices")) {
        display_name = display_name + " - " + value["IP"];
        var usn = value["USN"];
        if (usn != undefined) {
            display_name = display_name + " - " + usn;
        }
    } else if ((modpath == "startup/scans/ssh/matching_devices") ||
        (modpath == "startup/scans/ssh/missing_devices")) {
        var devtype = value["deviceType"];
        if (devtype == "network/upnp") {
            var upnpinfo = value["upnp"];
            display_name = display_name + " - " + value["host"] + " - " + upnpinfo["modelNumber"] + ", " + upnpinfo["modelName"] + " - " + upnpinfo["USN"];
        } else if (devtype == "network/ssh") {
            display_name = display_name + " - " + value["host"];
        }
    }


    return display_name;
}

function entity_escape(tgtstr) {
    return tgtstr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


/*************************************************************************************
 *************************************************************************************
 *
 *                                   SECTION REFRESH
 * 
 *************************************************************************************
 *************************************************************************************/

function refresh_artifacts() {
    var artifactsBarElement = document.getElementById("artifacts-tab-bar");
    var artifactsContentElement = document.getElementById("artifacts-tab-content");

    g_artifacts_buttons = [];
    g_artifacts_tabs = [];

    for (var findex in g_artifacts_catalog.folders) {
        var folder = g_artifacts_catalog.folders[findex];
        var subCatalog = g_artifacts_sub_catalogs[folder];
        if (subCatalog != undefined) {
            var folderURL = "artifacts/" + folder + "/tab.html";
            render_artifact_tab(artifactsBarElement, artifactsContentElement, folder, folderURL);
        }
    }

    if (g_artifacts_buttons.length > 0) {
        var firstButton = g_artifacts_buttons[0];

        var tabName = firstButton.getAttribute("name");
        select_tab(tabName);
    }
}

function refresh_catalog() {

    var container = document.getElementById("container-folders");
    render_folder_element(container, "Parent", "..")

    var folders_list = g_catalog.folders;
    for (var idx in folders_list) {
        var nxt = folders_list[idx];

        render_folder_element(container, nxt, nxt)
    }

    var container = document.getElementById("container-files");
    var file_list = g_catalog.files;
    for (var idx in file_list) {
        var nxt = file_list[idx];

        render_file_element(container, nxt, nxt)
    }
}

function refresh_import_errors() {
    var ierrbody = document.getElementById("import-errors-body");

    for (var idx in g_import_errors) {
        var imp_err_item = g_import_errors[idx];
        render_import_error_item_content(ierrbody, imp_err_item);
    }
}

function refresh_startup_environment() {
    try {
        var startupNodeElement = create_startup_environment_panels("startup", g_startup_configuration["startup"]);
        configurationBodyElement.appendChild(startupNodeElement);
    } catch(e) {
    }
}

function refresh_startup_landscape() {
    var configurationBodyElement = document.getElementById("test-configuration-body");

    try {
        var landscapeNodeElement = create_startup_landscape_panels("landscape", g_startup_configuration["landscape"]);
        configurationBodyElement.appendChild(landscapeNodeElement);
    } catch(e) {
    }
}

function refresh_configuration() {
    var configurationComponent = document.getElementById("testsummary-configuration");

    configurationComponent.syncData(g_startup_configuration, g_landscape_configuration)
}

function refesh_results_content_as_grouped() {
    var resultsDetail = document.getElementById("testsummary-resultdetail");

    resultsDetail.syncData("render_by_package", g_results)
}

function refresh_results_content_as_tree() {
    var resultsDetail = document.getElementById("testsummary-resultdetail");

    resultsDetail.syncData("render_as_tree", g_results)
}

function refresh_summary() {

    if (g_summary != null) {
        var summaryComponent = document.getElementById("testsummary-banner");

        summaryComponent.syncData(g_summary)
    }

}

/*************************************************************************************
 *************************************************************************************
 *
 *                                      PAGE LOAD
 * 
 *************************************************************************************
 *************************************************************************************/

async function refresh_page() {
    
    load_summary().then(() => {
        refresh_summary();
    });

    load_configuration().then(() => {
        refresh_configuration();
    });

    load_results().then(() => {
        if (g_display_mode == "GROUPED") {
            result_content = refesh_results_content_as_grouped();
        } else {
            result_content = refresh_results_content_as_tree();
        }

        try {
            window.Prism = window.Prism || {};
            window.Prism.manual = true;
            Prism.highlightAll();
        } catch(error) {
            console.warn(error)
        }
    });

    load_import_errors().then(() => {
        refresh_import_errors();
    });

    load_catalog().then(() => {
        if (g_catalog.folders.indexOf("artifacts") > -1) {
            load_artifact_folders().then(() => {
                refresh_artifacts();
            });
        }

        refresh_catalog();
    });

}
