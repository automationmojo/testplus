/*
    __author__ = "Myron Walker"
    __copyright__ = "Copyright 2020, Myron W Walker"
    __credits__ = []
    __version__ = "1.0.0"
    __maintainer__ = "Myron Walker"
    __email__ = "myron.walker@gmail.com"
    __status__ = "Development" # Prototype, Development or Production
    __license__ = "MIT"
*/

// Summary State
var g_summary = null;

// Configuration State
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
    g_startup_configuration = {}

    var landscape = await fetch_json("landscape-declared.json").catch(err => {
        console.log("Unable to load the landscape declaration file='landscape-declared.json'.")
    });
    var startup = await fetch_json("startup-configuration.json").catch(err => {
        console.log("Unable to load the landscape declaration file='startup-configuration.json'.")
    });

    g_startup_configuration["landscape"] = landscape;
    g_startup_configuration["startup"] = startup;

    var upnp_startup_scan = await fetch_json("landscape-startup-scan.json").catch(err => {
        console.log("Unable to load the landscape declaration file='landscape-startup-scan.json'.")
    });

    startup["scans"] = upnp_startup_scan;
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

function append_configuration_array_items(bodyElement, arrayItems, path = []) {
    arrayItems.forEach(kvpair => {
        const [key, value] = kvpair;
        append_configuration_array_node(bodyElement, key, value, path);
    });
}

function append_configuration_dict_items(bodyElement, dictItems, path = []) {
    dictItems.forEach(kvpair => {
        const [key, value] = kvpair;
        var displayname = adjust_index_identifier(path, key, value);
        var childNode = create_configuration_tree_node(displayname, value, path);
        bodyElement.appendChild(childNode);
    });
}

function append_configuration_table(bodyElement, rowItems, path = []) {

    var tableElement = document.createElement("table");
    tableElement.classList.add("tree-node-table");

    rowItems.forEach(kvpair => {
        const [key, value] = kvpair;

        var rowElement = document.createElement("tr");
        rowElement.classList.add("tree-node-row");

        var keyElement = document.createElement("td");
        keyElement.classList.add("tree-node-key");
        keyElement.innerHTML = key;

        var valElement = document.createElement("td");
        valElement.classList.add("tree-node-val");
        valElement.innerHTML = value;

        rowElement.appendChild(keyElement);
        rowElement.appendChild(valElement);
        tableElement.appendChild(rowElement);
    });

    bodyElement.appendChild(tableElement);
}

function append_configuration_array_node(bodyElement, name, adata, path = []) {

    path.push(name);

    var nodeElement = document.createElement("details");
    nodeElement.classList.add("tree-node");

    var nodeElementTitle = document.createElement("summary");
    nodeElementTitle.classList.add("tree-node-hdr");
    nodeElementTitle.innerHTML = name;
    nodeElement.appendChild(nodeElementTitle);

    var nodeElementBody = document.createElement("div");
    nodeElementBody.classList.add("tree-node-body")
    nodeElement.appendChild(nodeElementBody);

    var arrayItems = [];
    var dictItems = [];
    var rowItems = [];

    for (var index in adata) {
        var item = adata[index];
        if (isString(item)) {
            rowItems.push([index, item]);
        } else if (Array.isArray(item)) {
            arrayItems.push([index, item]);
        } else if (isDict(item)) {
            dictItems.push([index, item]);
        } else {
            rowItems.push([index, item]);
        }
    };

    if (rowItems.length > 0) {
        append_configuration_table(nodeElementBody, rowItems, path);
    }

    if (arrayItems.length > 0) {
        append_configuration_array_items(nodeElementBody, arrayItems, path);
    }

    if (dictItems.length > 0) {
        append_configuration_dict_items(nodeElementBody, dictItems, path);
    }

    bodyElement.appendChild(nodeElement);

    path.pop();

}

function create_configuration_tree_node(name, ndata, path = []) {

    path.push(name);

    var nodeElement = document.createElement("details");
    nodeElement.classList.add("tree-node");

    var nodeElementTitle = document.createElement("summary");
    nodeElementTitle.classList.add("tree-node-hdr");
    nodeElementTitle.innerHTML = name;
    nodeElement.appendChild(nodeElementTitle);

    var nodeElementBody = document.createElement("div");
    nodeElementBody.classList.add("tree-node-body")
    nodeElement.appendChild(nodeElementBody);

    var arrayItems = [];
    var dictItems = [];
    var rowItems = [];

    for (const [key, value] of Object.entries(ndata)) {
        if (value != null) {
            if (isString(value)) {
                rowItems.push([key, value]);
            } else if (Array.isArray(value)) {
                arrayItems.push([key, value]);
            } else if (isDict(value)) {
                dictItems.push([key, value]);
            } else {
                rowItems.push([key, value]);
            }
        } else {
            console.log("Null value encountered key=" + key + " .");
        }

    }

    if (rowItems.length > 0) {
        append_configuration_table(nodeElementBody, rowItems, path);
    }

    if (arrayItems.length > 0) {
        append_configuration_array_items(nodeElementBody, arrayItems, path);
    }

    if (dictItems.length > 0) {
        append_configuration_dict_items(nodeElementBody, dictItems, path);
    }

    path.pop();

    return nodeElement;
}

function entity_escape(tgtstr) {
    return tgtstr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function create_trace_element(trace) {
    var outerDiv = document.createElement('div');
    
    var origin = trace.origin;
    
    var nxtpre = document.createElement('pre');
    nxtpre.classList.add("code-font-lt");
    nxtpre.innerHTML = "  File " + origin.file + ", line " + origin.lineno + ", in " + origin.scope;
    outerDiv.appendChild(nxtpre);

    nxtpre = document.createElement('pre');
    nxtpre.classList.add("margin-lg");
    nxtpre.classList.add("code-font-dk");
    nxtpre.innerHTML = entity_escape(trace.call);
    outerDiv.appendChild(nxtpre);

    if ((trace.code != undefined) && (trace.code.length > 0)) {
        var nxtpre = document.createElement('pre');
        nxtpre.classList.add("margin-lg");

        var nxtcode = document.createElement('code');
        nxtcode.classList.add("language-python");
        nxtcode.innerHTML = "\n" + trace.code.join("\n");
        nxtpre.appendChild(nxtcode);
    }

    outerDiv.appendChild(nxtpre);

    return outerDiv;
}

function create_errors_table(errorsList) {
    var errorsTable = document.createElement("div");
    errorsTable.classList.add("e-list");

    for (var eidx in errorsList) {
        var eitem = errorsList[eidx];
    
        var itemElement = document.createElement("div");
        
        var headerElement = document.createElement("pre");
        headerElement.innerHTML = eitem.extype + ", " + eitem.exargs.join(",");
        itemElement.appendChild(headerElement);

        for (var tindex in eitem.traces) {
            var titem = eitem.traces[tindex];

            var traceElement = create_trace_element(titem);
            itemElement.appendChild(traceElement);
        }

        errorsTable.appendChild(itemElement)
    }

    return errorsTable
}

function create_failures_table(failuresList) {
    var failuresTable = document.createElement("div");
    failuresTable.classList.add("f-list");

    for (var fidx in failuresList) {
        var fitem = failuresList[fidx];
    
        var itemElement = document.createElement("div");
        
        var headerElement = document.createElement("pre");
        headerElement.innerHTML = fitem.extype + ", " + fitem.exargs.join(",");
        itemElement.appendChild(headerElement);

        for (var tindex in fitem.traces) {
            var titem = fitem.traces[tindex];

            var traceElement = create_trace_element(titem);
            itemElement.appendChild(traceElement);
        }

        failuresTable.appendChild(itemElement)
    }

    return failuresTable
}

function create_tasking_groups_table(tasking_groups) {
    var taskingGroupsContent = document.createElement("div");
    taskingGroupsContent.classList.add("tgrp-content");
    
    var taskingGroupsDetails = document.createElement("details");

    taskingGroupsContent.appendChild(taskingGroupsDetails);

    var taskingGroupsHeader = document.createElement("summary");
    taskingGroupsHeader.classList.add("tgrp-content-hdr");
    taskingGroupsDetails.appendChild(taskingGroupsHeader);

    var taskingGroupHdrContent = document.createElement("div");
    taskingGroupHdrContent.innerHTML = "Tasking Groups";
    taskingGroupHdrContent.classList.add("tgrp-content-hdr-row");
    
    taskingGroupsHeader.appendChild(taskingGroupHdrContent);

    for (tgidx in tasking_groups) {
        var tgroup = tasking_groups[tgidx];

        var tgroupItem = document.createElement("div");
        tgroupItem.classList.add("tgrp-dtl-body");

        if (tgroup.errored > 0) {
            tgroupItem.classList.add("tgrp-dtl-error");
        } else if (tgroup.failed > 0) {
            tgroupItem.classList.add("tgrp-dtl-fail");
        } else if (tgroup.passed > 0) {
            tgroupItem.classList.add("tgrp-dtl-pass");
        } else {
            tgroupItem.classList.add("tgrp-dtl-unk");
        }

        var tgroupDetails = document.createElement("details");
        tgroupDetails.classList.add("tgrp-dtl-row");
        tgroupItem.appendChild(tgroupDetails);

        var tgroupSummary = document.createElement("summary");
        tgroupSummary.classList.add("tgrp-dtl-hdr");

        var tgroupSummaryHdrRow = document.createElement("div");
        tgroupSummaryHdrRow.classList.add("tgrp-dtl-hdr-row");
    

        var tgroupNameLbl = document.createElement("div");
        tgroupNameLbl.classList.add("tgrp-dtl-label");
        tgroupNameLbl.innerHTML = "Name";
        tgroupSummaryHdrRow.appendChild(tgroupNameLbl);


        var tgroupNameVal = document.createElement("div");
        tgroupNameVal.classList.add("tgrp-dtl-value");
        tgroupNameVal.innerHTML = tgroup.name;
        tgroupSummaryHdrRow.appendChild(tgroupNameVal);
        

        var tgroupStartLbl = document.createElement("div");
        tgroupStartLbl.classList.add("tgrp-dtl-label");
        tgroupStartLbl.innerHTML = "Start";
        tgroupSummaryHdrRow.appendChild(tgroupStartLbl);


        var tgroupStartVal = document.createElement("div");
        tgroupStartVal.classList.add("tgrp-dtl-value");
        tgroupStartVal.innerHTML = tgroup.start;
        tgroupSummaryHdrRow.appendChild(tgroupStartVal);


        var tgroupStopLbl = document.createElement("div");
        tgroupStopLbl.classList.add("tgrp-dtl-label");
        tgroupStopLbl.innerHTML = "Stop";
        tgroupSummaryHdrRow.appendChild(tgroupStopLbl);


        var tgroupStopVal = document.createElement("div");
        tgroupStopVal.classList.add("tgrp-dtl-value");
        tgroupStopVal.innerHTML = tgroup.stop;
        tgroupSummaryHdrRow.appendChild(tgroupStopVal);


        tgroupSummary.appendChild(tgroupSummaryHdrRow);
        tgroupDetails.appendChild(tgroupSummary);

        var taskingsTable = create_taskings_table(tgroup.taskings);
        tgroupDetails.appendChild(taskingsTable);

        taskingGroupsDetails.appendChild(tgroupItem);
    }

    return taskingGroupsContent;
}

function create_taskings_table(taskings) {
    var taskingsTable = document.createElement("div");

    for (tidx in taskings) {
        var titem = taskings[tidx];

        var taskItemElement = document.createElement("div");
        taskItemElement.classList.add("task-item");
        taskingsTable.appendChild(taskItemElement);

        var taskingDetails = document.createElement("details");
        taskItemElement.appendChild(taskingDetails);

        var taskingSummary = document.createElement("summary");
        taskingSummary.classList.add("task-item-hdr");
        taskingDetails.appendChild(taskingSummary);

        var taskingHeader = document.createElement("div");
        taskingHeader.classList.add("task-item-hdr-row");
        taskingSummary.appendChild(taskingHeader);

        var tname = titem.name.substring(titem.name.indexOf("@") + 1);

        var fieldLbl = document.createElement("div");
        fieldLbl.classList.add("tgrp-dtl-label");
        fieldLbl.innerHTML = "Name";
        taskingHeader.appendChild(fieldLbl);

        var fieldVal = document.createElement("div");
        fieldVal.classList.add("tgrp-dtl-value");
        fieldVal.innerHTML = tname;
        taskingHeader.appendChild(fieldVal);

        var fieldLbl = document.createElement("div");
        fieldLbl.classList.add("tgrp-dtl-label");
        fieldLbl.innerHTML = "Start";
        taskingHeader.appendChild(fieldLbl);

        var fieldVal = document.createElement("div");
        fieldVal.classList.add("tgrp-dtl-value");
        fieldVal.innerHTML = titem.start;
        taskingHeader.appendChild(fieldVal);

        var fieldLbl = document.createElement("div");
        fieldLbl.classList.add("tgrp-dtl-label");
        fieldLbl.innerHTML = "Stop";
        taskingHeader.appendChild(fieldLbl);

        var fieldVal = document.createElement("div");
        fieldVal.classList.add("tgrp-dtl-value");
        fieldVal.innerHTML = titem.stop;
        taskingHeader.appendChild(fieldVal);

        var fieldLbl = document.createElement("div");
        fieldLbl.classList.add("task-dtl-label");
        fieldLbl.innerHTML = "Result";
        taskingHeader.appendChild(fieldLbl);

        var resultColorClass = "color-skip";
        if (titem.result == "PASSED") {
            resultColorClass = "color-pass";
        } else if (titem.result == "ERRORED") {
            resultColorClass = "color-error";
        } else if (titem.result == "FAILED") {
            resultColorClass = "color-fail";
        }

        var fieldVal = document.createElement("div");
        fieldVal.classList.add("task-dtl-value");
        fieldVal.classList.add(resultColorClass);
        fieldVal.style = "font-weight: 500";
        fieldVal.innerHTML = titem.result;
        taskingHeader.appendChild(fieldVal);

        // Expanded Detail

        var taskingInnerDetail = document.createElement("div");
        taskingInnerDetail.classList.add("task-dtl-body");
        taskingDetails.appendChild(taskingInnerDetail);

        var taskingDetailRow = document.createElement("div");
        taskingDetailRow.classList.add("task-dtl-row");
        taskingInnerDetail.appendChild(taskingDetailRow);

        var fieldLbl = document.createElement("div");
        fieldLbl.classList.add("tgrp-dtl-label");
        fieldLbl.innerHTML = "Worker";
        taskingDetailRow.appendChild(fieldLbl);

        var fieldVal = document.createElement("div");
        fieldVal.classList.add("tgrp-dtl-value");
        fieldVal.innerHTML = "<a href='http://" + titem.worker + "'>" + titem.worker + "</a>";
        taskingDetailRow.appendChild(fieldVal);

        var fieldLbl = document.createElement("div");
        fieldLbl.classList.add("tgrp-dtl-label");
        fieldLbl.innerHTML = "InstId";
        taskingDetailRow.appendChild(fieldLbl);

        var fieldVal = document.createElement("div");
        fieldVal.classList.add("tgrp-dtl-value");
        fieldVal.innerHTML = titem.instance;
        taskingDetailRow.appendChild(fieldVal);

        var fieldLbl = document.createElement("div");
        fieldLbl.classList.add("tgrp-dtl-label");
        fieldLbl.innerHTML = "Parent";
        taskingDetailRow.appendChild(fieldLbl);

        var fieldVal = document.createElement("div");
        fieldVal.classList.add("tgrp-dtl-value");
        fieldVal.innerHTML = titem.parent;
        taskingDetailRow.appendChild(fieldVal);

        var taskingDetailRow = document.createElement("div");
        taskingDetailRow.classList.add("task-dtl-row");
        taskingInnerDetail.appendChild(taskingDetailRow);

        var logfolder = "taskings/" + titem.prefix + "-" + titem.instance;

        var fieldLbl = document.createElement("img");
        fieldLbl.style = "margin-left: 20px;";
        fieldLbl.classList.add("icon-folder");
        taskingDetailRow.appendChild(fieldLbl);

        var fieldVal = document.createElement("div");
        fieldVal.classList.add("tgrp-dtl-value");
        fieldVal.innerHTML = "<a href='" + logfolder + "'>Tasking Logs</a>";
        taskingDetailRow.appendChild(fieldVal);

        var detail = titem.detail;

        if (detail.errors.length > 0) {
            var errorList = detail.errors;
            var errorsHeader = document.createElement("div");
            errorsHeader.classList.add("e-list-hdr");
    
            errorsHeader.innerHTML = "<h3>ERRORS</h3>";
            taskingInnerDetail.appendChild(errorsHeader);
    
            var errorsTable = create_errors_table(errorList);
            taskingInnerDetail.appendChild(errorsTable);
    
            taskingInnerDetail.appendChild(document.createElement("br"));
        }
    
        if (detail.failures.length > 0) {
            var failuresList = detail.failures;
            var failuresHeader = document.createElement("div");
            failuresHeader.classList.add("f-list-hdr");
    
            failuresHeader.innerHTML = "<h3>FAILURES</h3>";
            taskingInnerDetail.appendChild(failuresHeader);
    
            var failuresTable = create_failures_table(failuresList);
            taskingInnerDetail.appendChild(failuresTable);
    
            taskingInnerDetail.appendChild(document.createElement("br"));
        }

    }

    return taskingsTable;
}

function create_result_item_content(ritem) {
    var package_name = ritem.package_name
    var test_name =  ritem.name

    var resultElement = document.createElement("details");
    resultElement.classList.add("ritem-row");
    var summaryContainer = document.createElement("summary");
    summaryContainer.classList.add("ritem-hdr")

    var summaryContainerRow = document.createElement("div");
    summaryContainerRow.classList.add("ritem-hdr-row");
    summaryContainer.appendChild(summaryContainerRow);

    var summaryStart = document.createElement("div");
    summaryStart.innerHTML = ritem.start;
    summaryStart.classList.add("ritem-hdr-start");
    summaryContainerRow.appendChild(summaryStart);

    var summaryName = document.createElement("div");
    summaryName.innerHTML = test_name;
    summaryName.classList.add("ritem-hdr-name");
    summaryContainerRow.appendChild(summaryName);

    var detail = ritem.detail;

    var error_count = detail.errors.length;
    var failure_count = detail.failures.length;
    var skip_count = detail.skipped ? 1 : 0;
    var pass_count = detail.passed ? 1 : 0;

    var summaryE = document.createElement("div");
    summaryE.innerHTML = error_count;
    summaryE.classList.add(error_count > 0 ? "ritem-hdr-e" : "ritem-hdr-z");
    summaryContainerRow.appendChild(summaryE);

    var summaryF = document.createElement("div");
    summaryF.innerHTML = failure_count;
    summaryF.classList.add(failure_count > 0 ? "ritem-hdr-f" : "ritem-hdr-z");
    summaryContainerRow.appendChild(summaryF);

    var summaryS = document.createElement("div");
    summaryS.innerHTML = skip_count;
    summaryS.classList.add(skip_count > 0 ? "ritem-hdr-s" : "ritem-hdr-z");
    summaryContainerRow.appendChild(summaryS);

    var summaryP = document.createElement("div");
    summaryP.innerHTML = pass_count;
    summaryP.classList.add(pass_count > 0 ? "ritem-hdr-p" : "ritem-hdr-z");
    summaryContainerRow.appendChild(summaryP);

    var detailContainer = document.createElement("div");
    detailContainer.classList.add("test-dtl-body");

    var otherDetail = document.createElement("div");
    otherDetail.classList.add("test-dtl-hdr-row");

    var instLabel = document.createElement("div");
    instLabel.innerHTML = "InstId";
    instLabel.classList.add("test-dtl-label");
    otherDetail.appendChild(instLabel);
    var instValue = document.createElement("div");
    instValue.classList.add("test-dtl-value");
    instValue.innerHTML = ritem.instance;
    otherDetail.appendChild(instValue);

    var startLabel = document.createElement("div");
    startLabel.innerHTML = "Start";
    startLabel.classList.add("test-dtl-label");
    otherDetail.appendChild(startLabel);
    var startValue = document.createElement("div");
    startValue.innerHTML = ritem.start;
    startValue.classList.add("test-dtl-value");
    otherDetail.appendChild(startValue);

    var stopLabel = document.createElement("div");
    stopLabel.innerHTML = "Stop";
    stopLabel.classList.add("test-dtl-label");
    otherDetail.appendChild(stopLabel);
    var stopValue = document.createElement("div");
    stopValue.innerHTML = ritem.stop;
    stopValue.classList.add("test-dtl-value");
    otherDetail.appendChild(stopValue);

    var elapsedTime = get_time_difference(ritem.start, ritem.stop);

    var elapsedLabel = document.createElement("div");
    elapsedLabel.innerHTML = "Elapsed";
    elapsedLabel.classList.add("test-dtl-label");
    otherDetail.appendChild(elapsedLabel);
    var elapsedValue = document.createElement("div");
    elapsedValue.innerHTML = elapsedTime;
    elapsedValue.classList.add("test-dtl-value");
    otherDetail.appendChild(elapsedValue);

    detailContainer.appendChild(otherDetail);

    if (detail.hasOwnProperty("documentation")) {
        var docsHeader = document.createElement("h3");
        docsHeader.classList.add("doc-hdr");
        docsHeader.innerHTML = "DOCUMENTATION"
        detailContainer.appendChild(docsHeader);

        var docContent = document.createElement("pre");
        docContent.classList.add("doc-content");
        docContent.innerHTML = detail.documentation;
        detailContainer.appendChild(docContent);
    }

    if (detail.errors.length > 0) {
        var errorList = detail.errors;
        var errorsHeader = document.createElement("div");
        errorsHeader.classList.add("e-list-hdr");

        errorsHeader.innerHTML = "<h3>ERRORS</h3>";
        detailContainer.appendChild(errorsHeader);

        var errorsTable = create_errors_table(errorList);
        detailContainer.appendChild(errorsTable);

        detailContainer.appendChild(document.createElement("br"));
    }

    if (detail.failures.length > 0) {
        var failuresList = detail.failures;
        var failuresHeader = document.createElement("div");
        failuresHeader.classList.add("f-list-hdr");

        failuresHeader.innerHTML = "<h3>FAILURES</h3>";
        detailContainer.appendChild(failuresHeader);

        var failuresTable = create_failures_table(failuresList);
        detailContainer.appendChild(failuresTable);

        detailContainer.appendChild(document.createElement("br"));
    }

    if (ritem.tasking_groups.length > 0) {
        var taskingGroupContent = create_tasking_groups_table(ritem.tasking_groups);

        detailContainer.appendChild(taskingGroupContent);
    }

    resultElement.appendChild(detailContainer);
    resultElement.appendChild(document.createElement("br"));

    resultElement.appendChild(summaryContainer);

    return resultElement;
}

function create_package_item_content(package_name, package_items) {

    var pkgElement = document.createElement("details");
    pkgElement.classList.add("pitem-row");

    var summaryContainer = document.createElement("summary");
    summaryContainer.classList.add("pitem-hdr");
    pkgElement.appendChild(summaryContainer);

    var summaryContainerRow = document.createElement("div");
    summaryContainerRow.classList.add("pitem-hdr-row")
    summaryContainer.appendChild(summaryContainerRow);

    var pkgHeaderDiv = document.createElement("div");
    pkgHeaderDiv.innerHTML = package_name;
    pkgHeaderDiv.classList.add("pitem-hdr-name");

    summaryContainerRow.appendChild(pkgHeaderDiv)

    var error_count = 0;
    var failure_count = 0;
    var skip_count = 0;
    var pass_count = 0;

    for (var idx in package_items) {
        var ritem = package_items[idx];
        var rdetail = ritem.detail;

        error_count += rdetail.errors.length;
        failure_count += rdetail.failures.length;
        skip_count += rdetail.skipped ? 1 : 0;
        pass_count += rdetail.passed ? 1 : 0;

        var eitem = create_result_item_content(ritem);
        pkgElement.appendChild(eitem);
    }

    var summaryE = document.createElement("div");
    summaryE.innerHTML = error_count;
    summaryE.classList.add(error_count > 0 ? "pitem-hdr-e" : "pitem-hdr-z");
    summaryContainerRow.appendChild(summaryE);

    var summaryF = document.createElement("div");
    summaryF.innerHTML = failure_count;
    summaryF.classList.add(failure_count > 0 ? "pitem-hdr-f" : "pitem-hdr-z");
    summaryContainerRow.appendChild(summaryF);

    var summaryS = document.createElement("div");
    summaryS.innerHTML = skip_count;
    summaryS.classList.add(skip_count > 0 ? "pitem-hdr-s" : "pitem-hdr-z");
    summaryContainerRow.appendChild(summaryS);

    var summaryP = document.createElement("div");
    summaryP.innerHTML = pass_count;
    summaryP.classList.add(pass_count > 0 ? "pitem-hdr-p" : "pitem-hdr-z");
    summaryContainerRow.appendChild(summaryP);

    return pkgElement;
}

function create_results_content_as_grouped() {
    var result_table_body = document.getElementById("test-results-body");
    for (var package_name in g_results) {
        var package_items = g_results[package_name];

        var pkgElement = create_package_item_content(package_name, package_items);

        result_table_body.appendChild(pkgElement);
    }
}

function create_results_content_as_tree() {

}

function select_tab(name) {
    var tabIndex = null;

    var tab_count = g_artifacts_buttons.length;
    var tindex = 0;
    while (tindex < tab_count) {
        var tabButton = g_artifacts_buttons[tindex];
        var buttonName = tabButton.getAttribute("name");
        if (buttonName == name) {
            tabIndex = tindex;
        }

        tindex += 1;
    }

    for (var tindex in g_artifacts_buttons) {
        var tabButton = g_artifacts_buttons[tindex];
        var buttonName = tabButton.getAttribute("name");
        if (buttonName == name) {
            tabIndex = tindex;
        }
    }

    if (tabIndex != null) {

        var tab_count = g_artifacts_buttons.length;
        var tindex = 0;
        while (tindex < tab_count) {
            var tabButton = g_artifacts_buttons[tindex];
            tabButton.classList.remove("active");

            var tabTab = g_artifacts_tabs[tindex];
            tabTab.style = "display: none;";

            tindex += 1;
        }

        var tabButton = g_artifacts_buttons[tabIndex];
        tabButton.classList.add("active");

        var tabContent = g_artifacts_tabs[tabIndex];
        tabContent.style = "display: block;";
    }
}

function on_tab_click(event) {
    var tabName = this.getAttribute("name");

    select_tab(tabName);
    console.log("Tab '" + tabName + "' clicked.")
}

function render_artifact_tab(tabBarContainer, tabContentContainer, name, contentUrl) {
    var tabButtonElement = document.createElement('button');
    tabButtonElement.setAttribute("name", name);
    tabButtonElement.innerHTML = name;
    tabButtonElement.classList.add("tab");
    tabButtonElement.onclick = on_tab_click;
    tabBarContainer.appendChild(tabButtonElement);

    g_artifacts_buttons.push(tabButtonElement);

    var tabContentElement = document.createElement('iframe');
    tabContentElement.src = contentUrl;
    tabContentElement.classList.add("tabcontent")
    tabContentContainer.appendChild(tabContentElement);

    g_artifacts_tabs.push(tabContentElement);
}

function render_import_error_item_content(container, imp_err_item) {

    /*
        {
            "filename": ""
            "trace": ""
        }
    */

    var imp_err_item_row = document.createElement("details");
    imp_err_item_row.classList.add("ierr-item-hdr");

    var summary_item = document.createElement("summary");
    summary_item.classList.add('ierr-item-hdr');
    var filename_item = document.createElement('div');
    filename_item.classList.add('ierr-item-hdr-filename');
    filename_item.innerHTML = imp_err_item.filename;
    summary_item.appendChild(filename_item);

    var detail_body = document.createElement('div');
    detail_body.classList.add("test-dtl-body");

    var stack_trace_hdr = document.createElement('h3');
    stack_trace_hdr.classList.add('f-list-hdr');
    stack_trace_hdr.innerHTML = "Stack Trace";
    detail_body.appendChild(stack_trace_hdr);

    var st_list = document.createElement('div');
    st_list.classList.add('ff-list');
    detail_body.appendChild(st_list);

    var failuresTable = create_failures_table([imp_err_item.trace]);

    imp_err_item_row.appendChild(failuresTable);
    imp_err_item_row.appendChild(summary_item);

    container.appendChild(imp_err_item_row);

}

function render_file_element(container, name, ref) {
    var nxtRow = document.createElement("div");
    nxtRow.classList.add('ff-row');

    var iconCont = document.createElement("div");
    iconCont.classList.add('ff-icon');
    var imgElmnt = document.createElement("img");
    imgElmnt.classList.add("icon-file");
    iconCont.appendChild(imgElmnt);
    nxtRow.appendChild(iconCont);

    var linkCont = document.createElement("div");
    linkCont.classList.add('ff-name');
    var linkElmnt = document.createElement("a");
    linkElmnt.href = ref;
    linkElmnt.innerHTML = name;
    linkCont.appendChild(linkElmnt);
    nxtRow.appendChild(linkCont);

    container.appendChild(nxtRow);
}

function render_folder_element(container, name, ref) {

    var nxtRow = document.createElement("div");
    nxtRow.classList.add('ff-row');

    var iconCont = document.createElement("div");
    iconCont.classList.add('ff-icon');
    var imgElmnt = document.createElement("img");
    imgElmnt.classList.add("icon-folder");
    iconCont.appendChild(imgElmnt);
    nxtRow.appendChild(iconCont);

    var linkCont = document.createElement("div");
    linkCont.classList.add('ff-name');
    var linkElmnt = document.createElement("a");
    linkElmnt.href = ref;
    linkElmnt.innerHTML = name;
    linkCont.appendChild(linkElmnt);
    nxtRow.appendChild(linkCont);

    container.appendChild(nxtRow);

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

function refresh_configuration() {
    var configurationBodyElement = document.getElementById("test-configuration-body");

    try {
        var landscapeNodeElement = create_configuration_tree_node("landscape", g_startup_configuration["landscape"]);
        configurationBodyElement.appendChild(landscapeNodeElement);
    } catch(e) {
    }

    try {
        var startupNodeElement = create_configuration_tree_node("startup", g_startup_configuration["startup"]);
        configurationBodyElement.appendChild(startupNodeElement);
    } catch(e) {
    }
}

function refresh_import_errors() {
    var ierrbody = document.getElementById("import-errors-body");

    for (var idx in g_import_errors) {
        var imp_err_item = g_import_errors[idx];
        render_import_error_item_content(ierrbody, imp_err_item);
    }
}

function refresh_summary() {
    if (g_summary.hasOwnProperty("title") && g_summary.title != null) {
        setElement = document.getElementById("summary-title");
        if (setElement != null) {
            setElement.innerHTML = g_summary.title;
        }
    }
    
    if (g_summary.hasOwnProperty("build")) {
        var build_info = g_summary.build;
        
        if (build_info.hasOwnProperty("build")) {
            if (build_info.hasOwnProperty("build") && build_info.build != null) {
                setElement = document.getElementById("summary-build");
                if (setElement != null) {
                    setElement.innerHTML = build_info.build;
                }
            }
            if (build_info.hasOwnProperty("branch") && build_info.branch != null) {
                setElement = document.getElementById("summary-branch");
                if (setElement != null) {
                    setElement.innerHTML = build_info.build;
                }
            }
            if (build_info.hasOwnProperty("flavor") && build_info.flavor != null) {
                setElement = document.getElementById("summary-flavor");
                if (setElement != null) {
                    setElement.innerHTML = build_info.flavor;
                }
            }
        }
     
    }

    if (g_summary.hasOwnProperty("branch") && build_info.branch != null) {
        setElement = document.getElementById("summary-branch");
        if (setElement != null) {
            setElement.innerHTML = build_info.build;
        }
    }
    if (g_summary.hasOwnProperty("flavor") && build_info.flavor != null) {
        setElement = document.getElementById("summary-flavor");
        if (setElement != null) {
            setElement.innerHTML = build_info.flavor;
        }
    }
    
    if (g_summary.hasOwnProperty("apod") && g_summary.apod != null) {
        setElement = document.getElementById("summary-apod");
        if (setElement != null) {
            setElement.innerHTML = g_summary.apod;
        }
    }
    if (g_summary.hasOwnProperty("start") && g_summary.start != null) {
        setElement = document.getElementById("summary-start");
        if (setElement != null) {
            setElement.innerHTML = g_summary.start;
        }
    }
    if (g_summary.hasOwnProperty("stop") && g_summary.stop != null) {
        setElement = document.getElementById("summary-stop");
        if (setElement != null) {
            setElement.innerHTML = g_summary.stop;
        }
    }
    if (g_summary.hasOwnProperty("result") && g_summary.result != null) {
        setElement = document.getElementById("summary-status");
        if (setElement != null) {
            setElement.innerHTML = g_summary.result;
        }
    }
    if (g_summary.hasOwnProperty("detail") && g_summary.detail != null) {
        detail = g_summary.detail;

        if (detail.hasOwnProperty("errors") && (detail.errors != null)) {
            g_counter_errors = detail.errors;
        }
        if (detail.hasOwnProperty("failed") && (detail.failed != null)) {
            g_counter_failed = detail.failed;
        }
        if (detail.hasOwnProperty("skipped") && (detail.skipped)) {
            g_counter_skipped = detail.skipped;
        }
        if (detail.hasOwnProperty("passed") && (detail.passed != null)) {
            g_counter_passed = detail.passed;
        }
        if (detail.hasOwnProperty("total") && (detail.total != null)) {
            g_counter_total = detail.total;
        } else {
            g_counter_total = g_counter_errors + g_counter_failed + g_counter_skipped + g_counter_passed;
        }
    }
    else {
        g_counter_total = g_counter_errors + g_counter_failed + g_counter_skipped + g_counter_passed;
    }

    var relevant_test_counter = (g_counter_total - g_counter_skipped);
    var summary_score = "(error)";
    if (relevant_test_counter > 0) {
        summary_score = (g_counter_passed / (g_counter_total - g_counter_skipped)) * 100;
    }

    document.getElementById("summary-error").innerHTML = g_counter_errors;
    document.getElementById("summary-fail").innerHTML = g_counter_failed;
    document.getElementById("summary-skip").innerHTML = g_counter_skipped;
    document.getElementById("summary-pass").innerHTML = g_counter_passed;
    document.getElementById("summary-total").innerHTML = g_counter_total;
    document.getElementById("summary-score").innerHTML = summary_score.toFixed(2);
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
        var result_content = null;

        if (g_display_mode == "GROUPED") {
            result_content = create_results_content_as_grouped();
        } else {
            result_content = create_results_content_as_tree();
        }

        if (result_content != null) {
            var resultsContainer = document.getElementById("test-results-body");
            resultsContainer.innerHTML = "";
            resultsContainer.appendChild(result_content);
        }

        window.Prism = window.Prism || {};
        window.Prism.manual = true;
        Prism.highlightAll();
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
