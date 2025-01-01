/*
    Author: "Myron Walker"
    Copyright: "Copyright 2024, Myron W Walker"
    Version: = "2.0.0"
    Email: myron.walker@gmail.com
*/

class TestSummaryBanner extends HTMLElement {

    static tagname = 'testsummary-banner'

    template = `
        <div class='ts-banner'>
            <div class='ts-banner-job'>
                <div class='ts-banner-logo'>
                </div>
                <div class="ts-banner-content">
                    <div style="flex-grow: 1;"></div>
                    <div class="ts-banner-column">
                        <div class="ts-banner-row">
                            <div class="ts-banner-value-pair">
                                <div class="ts-banner-label">Automation Pod:</div>
                                <div class="ts-banner-value" id="id-summary-banner-apod">(not set)</div>
                            </div>
                        </div>
                    </div>
                    <div class="ts-banner-column">
                        <div class="ts-banner-row">
                            <div class="ts-banner-value-pair">
                                <div class="ts-banner-label">Branch:</div>
                                <div class="ts-banner-value" id="id-summary-banner-branch">(not set)</div>
                            </div>
                        </div>
                        <br>   
                        <div class="ts-banner-row">
                            <div class="ts-banner-value-pair" style="flex-basis: 1;">
                                <div class="ts-banner-label">Start:</div>
                                <div class="ts-banner-value" id="id-summary-banner-start">(not set)</div>
                            </div>
                        </div>
                    </div>
                    <div class="ts-banner-column">
                        <div class="ts-banner-row">
                            <div class="ts-banner-value-pair">
                                <div class="ts-banner-label">Build:</div>
                                <div class="ts-banner-value" id="id-summary-banner-build">(not set)</div>
                            </div>
                        </div>
                        <br>
                        <div class="ts-banner-row">
                            <div class="ts-banner-value-pair">
                                <div class="ts-banner-label">Stop:</div>
                                <div class="ts-banner-value" id="id-summary-banner-stop">(not set)</div>
                            </div>
                        </div>
                    </div>
                    <div class="ts-banner-column">
                        <div class="ts-banner-row">
                            <div class="ts-banner-value-pair">
                                <div class="ts-banner-label">Flavor:</div>
                                <div class="ts-banner-value" id="id-summary-banner-flavor">(not set)</div>
                            </div>
                        </div>
                        <br>
                        <div class="ts-banner-row">
                            <div class="ts-banner-value-pair">
                                <div class="ts-banner-label">Status:</div>
                                <div class="ts-banner-value" id="id-summary-banner-status">(not set)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ts-banner-metrics" >
                <div style="flex-grow: 1;"></div>
                <div class="ts-banner-metrics-panel">
                    <div class="ts-banner-metrics-column">
                        <div class="ts-banner-metrics-value-pair">
                            <div class="ts-banner-metrics-label">Errors:</div>
                            <div class="color-error ts-banner-metrics-value" id="id-summary-metrics-error">NaN</div>
                        </div>
                    </div>
                    <div class="ts-banner-metrics-column">
                        <div class="ts-banner-metrics-value-pair">
                            <div class="ts-banner-metrics-label">Failed:</div>
                            <div class="color-fail ts-banner-metrics-value" id="id-summary-metrics-fail">NaN</div>
                        </div>
                    </div>
                    <div class="ts-banner-metrics-column">
                        <div class="ts-banner-metrics-value-pair">
                            <div class="ts-banner-metrics-label">Skipped:</div>
                            <div class="color-skip ts-banner-metrics-value" id="id-summary-metrics-skip">NaN</div>
                        </div>
                    </div>
                    <div class="ts-banner-metrics-column">
                        <div class="ts-banner-metrics-value-pair">
                            <div class="ts-banner-metrics-label">Passed:</div>
                            <div class="color-pass ts-banner-metrics-value" id="id-summary-metrics-pass">NaN</div>
                        </div>
                    </div>
                    <div class="ts-banner-metrics-column">
                        <div class="ts-banner-metrics-value-pair">
                            <div class="ts-banner-metrics-label">Total:</div>
                            <div class="ts-banner-metrics-value" id="id-summary-metrics-total">NaN</div>
                        </div>
                        <div class="ts-banner-metrics-value-pair">
                            <div class="ts-banner-metrics-label">Score:</div>
                            <div class="ts-banner-metrics-value" id="id-summary-metrics-score">NaN</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        this.summary = {};
    }

    syncData (summary) {
        this.summary = summary;

        var result = null;

        if ("apod" in this.summary) {
            this.shadowRoot.querySelector("#id-summary-banner-apod").innerHTML = this.summary["apod"];
        }

        if ("start" in this.summary) {
            this.shadowRoot.querySelector("#id-summary-banner-start").innerHTML = this.summary["start"];
        }

        if ("stop" in this.summary) {
            this.shadowRoot.querySelector("#id-summary-banner-stop").innerHTML = this.summary["stop"];
        }

        if ("build" in this.summary) {
            var buildInfo = this.summary["build"];

            this.shadowRoot.querySelector("#id-summary-banner-branch").innerHTML = buildInfo["branch"];
            this.shadowRoot.querySelector("#id-summary-banner-build").innerHTML = buildInfo["build"];
            this.shadowRoot.querySelector("#id-summary-banner-flavor").innerHTML = buildInfo["flavor"];
            this.shadowRoot.querySelector("#id-summary-banner-flavor").innerHTML = buildInfo["flavor"];
        }

        if ("result" in this.summary) {
            result = this.summary["result"];

            this.shadowRoot.querySelector("#id-summary-banner-status").innerHTML = result;
        }

        if ("detail" in this.summary) {
            var detailInfo = this.summary["detail"];

            var errors = detailInfo["errors"];
            var failed = detailInfo["failed"];
            var skipped = detailInfo["skipped"];
            var passed = detailInfo["passed"];
            var total = detailInfo["total"];

            this.shadowRoot.querySelector("#id-summary-metrics-error").innerHTML = errors;
            this.shadowRoot.querySelector("#id-summary-metrics-fail").innerHTML = failed;
            this.shadowRoot.querySelector("#id-summary-metrics-skip").innerHTML = skipped;
            this.shadowRoot.querySelector("#id-summary-metrics-pass").innerHTML = passed;
            this.shadowRoot.querySelector("#id-summary-metrics-total").innerHTML = total;

            if ((result != null) && (total > 0)) {
                if ((total - skipped) > 0) {
                    var score = (passed / (total - skipped)) * 100;
                    var scoreFormat = score.toFixed(2);

                    this.shadowRoot.querySelector("#id-summary-metrics-score").innerHTML = scoreFormat;
                } else {
                    this.shadowRoot.querySelector("#id-summary-metrics-score").innerHTML = "NaN";
                }
            }
        }

    }
}


class TestSummaryDeviceItem extends HTMLElement {

    static tagname = 'testsummary-deviceitem'

    template = `
        <div id="id-device-item-container" class="ts-lscape-device-item">
            <div id="id-devitem-name">
                <div id="id-devitem-name-label" class="ts-lscape-device-lbl">Name</div>
                <div id="id-devitem-name-value" class="ts-lscape-device-val"></div>
            </div>
            <div id="id-devitem-role">
                <div id="id-devitem-role-label" class="ts-lscape-device-lbl">Role</div>
                <div id="id-devitem-role-value" class="ts-lscape-device-val"></div>
            </div>
            <div id="id-devitem-dtype">
                <div id="id-devitem-dtype-label" class="ts-lscape-device-lbl">Type</div>
                <div id="id-devitem-dtype-value" class="ts-lscape-device-val"></div>
            </div>
            <div id="id-devitem-host">
                <div id="id-devitem-host-label" class="ts-lscape-device-lbl">Host</div>
                <div id="id-devitem-host-value" class="ts-lscape-device-val"></div>
            </div>
            <div id="id-devitem-creds">
                <div id="id-devitem-creds-label" class="ts-lscape-device-lbl">Credentails</div>
                <div id="id-devitem-creds-value" class="ts-lscape-device-val"></div>
            </div>
            <div id="id-devitem-features">
                <div id="id-devitem-features-label" class="ts-lscape-device-lbl">Features</div>
                <div id="id-devitem-features-value" class="ts-lscape-device-val"></div>
            </div>
            <div id="id-devitem-skip">
                <div id="id-devitem-skip-label" class="ts-lscape-device-lbl">Skip</div>
                <div id="id-devitem-skip-value" class="ts-lscape-device-val"></div>
            </div>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        this.name = undefined;
        this.role = undefined;
        this.device_type = undefined;
        this.host = undefined;
        this.credentials = undefined;
        this.features = undefined;
        this.skip = undefined;
    }

    syncData (device_info) {
        var containerEl = this.shadowRoot.querySelector("#id-device-item-container");

        var nameEl = containerEl.querySelector("#id-devitem-name-value");
        var roleEl = containerEl.querySelector("#id-devitem-role-value");
        var dtypeEl = containerEl.querySelector("#id-devitem-dtype-value");
        var hostEl = containerEl.querySelector("#id-devitem-host-value");
        var credsEl = containerEl.querySelector("#id-devitem-creds-value");
        var featuresEl = containerEl.querySelector("#id-devitem-features-value");
        var skipEl = containerEl.querySelector("#id-devitem-skip-value");

        if ("name" in device_info) {
            this.name = device_info["name"];
            nameEl.innerHTML = this.name;
        } else {
            nameEl.style.display = 'none';
        }

        if ("role" in device_info) {
            this.role = device_info["role"];
            roleEl.innerHTML = this.role;
        } else {
            roleEl.style.display = 'none';
        }

        if ("dataType" in device_info) {
            this.dtype = device_info["dataType"];
            dtypeEl.innerHTML = this.dtype;
        } else {
            dtypeEl.style.display = 'none';
        }

        if ("host" in device_info) {
            this.host = device_info["host"];
            hostEl.innerHTML = this.host;
        } else {
            hostEl.style.display = 'none';
        }

        if ("credentials" in device_info) {
            this.credentials = device_info["credentials"];
            credsEl.innerHTML = this.credentials;
        } else {
            credsEl.style.display = 'none';
        }

        if ("features" in device_info) {
            this.features = device_info["features"];
            featuresEl.innerHTML = this.features;
        } else {
            featuresEl.style.display = 'none';
        }

        if ("skip" in device_info) {
            this.skip = device_info["skip"];
            skipEl.innerHTML = this.skip;
        } else {
            skipEl.style.display = 'none';
        }

    }
}



class TestSummaryDeviceGroup extends HTMLElement {

    static tagname = 'testsummary-devicegroup'

    template = `
        <div id="id-device-group-container" class="ts-lscape-device-group">
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        this.name = undefined;
        this.devices = undefined;
    }

    syncData(group_name, group_devices) {

        var containerEl = this.shadowRoot.querySelector("#id-device-item-container");

        this.name = name;
        this.devices = group_devices;


    }
}


class TestSummaryConfiguration extends HTMLElement {

    static tagname = 'testsummary-configuration'

    template = `
        <div class="ts-configuration-card">
            <div class="ts-section-header">
                <h2 class="zero-margins-and-padding">Configuration</h2>
            </div>
            <div class="ts-section-detail">
                <div id="id-ts-configuration-content" class="ts_vertical_tiling_panel">
                    <property-table id="id-ts-configuration-command"></property-table>
                </div>
            </div>  
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        this.landscape = undefined;
        this.command = undefined;
        this.environment = undefined;
        this.packages = undefined;
    }

    syncData (startup, landscape) {

        this.landscape = landscape;

        if (startup != null) {
            if ("command" in startup) {
                this.command = startup.command;
            }

            if ("environment" in startup) {
                this.environment = startup.environment;
            }

            if ("packages" in startup) {
                this.packages = startup.packages;
            }
        }

        var contentEl = this.shadowRoot.querySelector("#id-ts-configuration-content");

        if (this.command != undefined) {
            var commandEl = this.shadowRoot.querySelector("#id-ts-configuration-command");
            commandEl.innerHTML = "";

            commandEl.syncData({ "Command": this.command });
        }

        if (this.environment != undefined) {

            var environmentEl = this.shadowRoot.querySelector("#id-ts-configuration-environment");
            if (environmentEl == undefined) {
                environmentEl = document.createElement(TestSummaryConfigurationEnvironment.tagname);
                contentEl.appendChild(environmentEl);
            }

            environmentEl.syncData(this.environment);
        }

        if (this.packages != undefined) {
            
            var packagesEl = this.shadowRoot.querySelector("#id-ts-configuration-packages");
            if (packagesEl == undefined) {
                packagesEl = document.createElement(TestSummaryConfigurationPackages.tagname);
                contentEl.appendChild(packagesEl);
            }

            packagesEl.syncData(this.packages);
        }

        if (this.landscape != undefined) {
            var landscapeEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape");
            if (landscapeEl == undefined) {
                landscapeEl = document.createElement(TestSummaryConfigurationLandscape.tagname);
                contentEl.appendChild(landscapeEl);
            }
            
            landscapeEl.syncData(this.landscape);
        }

    }

}

class TestSummaryConfigurationEnvironment extends HTMLElement {

    static tagname = 'testsummary-config-environment'

    template = `
        <button id="id-ts-config-environment-button" type="button" class="ts-collapsible">Environment</button>
        <div id="id-ts-config-environment-content" class="ts-collapsible-content" style="display:none;">
            <property-table id="id-ts-configuration-environment"></property-table>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        this.environment = undefined;

        var buttonEl =  this.shadowRoot.querySelector("#id-ts-config-environment-button")
        
        var thisComp = this;
        buttonEl.addEventListener("click", (event) => { thisComp.toggle(event) });
    }

    syncData (environment) {
        this.environment = environment;

        var tableEl = this.shadowRoot.querySelector("#id-ts-configuration-environment")
        tableEl.syncData(environment);
    }

    toggle (event) {
        var contentEl =  this.shadowRoot.querySelector("#id-ts-config-environment-content");

        if (contentEl.style.display == "none") {
            contentEl.style.display = "block";
        } else {
            contentEl.style.display = "none";
        }
    }

}


class TestSummaryConfigurationLandscape extends HTMLElement {

    static tagname = 'testsummary-config-landscape'

    template = `
        <button id="id-ts-config-landscape-button" type="button" class="ts-collapsible">Landscape</button>
        <div id="id-ts-config-landscape-content" class="ts-collapsible-content" style="display:none;">
            <div style="margin-left: 20px;">
                <div id="id-ts-configuration-landscape-label"></div>
                <details id="id-ts-configuration-landscape-devices">
                    <summary>Devices</summary>
                    <div id="id-ts-configuration-landscape-device-groups" class="ts-lscape-device-groups-list">
                    </div>
                </details>
                <details id="id-ts-configuration-landscape-services">
                    <summary>Services</summary>
                    <div id="id-ts-configuration-landscape-services-list" class="ts-lscape-services-list">

                    </div>
                </details>
            </div>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        this.landscape = undefined;

        var buttonEl =  this.shadowRoot.querySelector("#id-ts-config-landscape-button")
        
        var thisComp = this;
        buttonEl.addEventListener("click", (event) => { thisComp.toggle(event) });
    }

    syncData (landscape) {

        this.landscape = landscape;

        if (landscape.apod != undefined) {
            var apod = landscape.apod

            var deviceGroupsEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape-device-groups");

            if (apod.length > 0) {
                // If we have device groups in the automation pod, then 

                for (var device_group of Object.keys(apod)) {

                    console.debug("Processing device group (" + device_group + ")");

                    var group_devices = apod[device_group];
                    
                    var nextDeviceGroupEl = document.createElement("testsummary-devicegroup");
                    nextDeviceGroupEl.syncData(device_group, group_devices);

                    deviceGroupsEl.appendChild(nextDeviceGroupEl)
                }

            } else {
                landscapeDevicesEl.style.display = "none";
            }

        } else {
            landscapeDevicesEl.style.display = "none";
        }

        if (landscape.dataprofiles != undefined) {
            // TODO: Add support for displaying data profiles
        
        } else {
            var landscapeDevicesEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape-dataprofiles");
            landscapeDevicesEl.style.display = "none";
        }

        if (landscape.environment != undefined) {
            var lscape_env = landscape.environment;

            if (lscape_env.label != undefined) {
                var env_label = lscape_env.label;

                // TODO: Update the environment declared in the landscape file
            }

        }

        if (landscape.infrastructure != undefined) {

            var infrastructure = landscape.infrastructure;
            var landscapeServiceEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape-services");

            if (infrastructure.services != undefined) {
                // TODO: Add support for displaying infrastructure details
                landscapeServiceEl.style.display = 'block';
            
            } else {
                landscapeServiceEl.style.display = 'none';
            }
        } 
    }
    
    toggle (event) {
        var contentEl =  this.shadowRoot.querySelector("#id-ts-config-landscape-content");

        if (contentEl.style.display == "none") {
            contentEl.style.display = "block";
        } else {
            contentEl.style.display = "none";
        }
    }

}


class TestSummaryConfigurationPackages extends HTMLElement {

    static tagname = 'testsummary-config-packages'

    template = `
        <div id="id-container" class="mojo-collapsible" >
            <div class="mojo-collapsible-button">
                <div id="id-header-text" class="mojo-collapsible-header"></div>
                <div id="id-header-icon" class="mojo-collapsible-icon"></div>
            </div>
            <div id="id-collapsible-content" class="mojo-collapsible-content">
                <property-table id="id-ts-configuration-packages"></property-table>
            </div>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        var buttonEl =  this.shadowRoot.querySelector("#id-ts-config-packages-button")
        

        var thisComp = this;
        buttonEl.addEventListener("click", (event) => { thisComp.toggle(event) });


    }

    syncData (packages) {
        this.packages = packages;
    
        var tableEl = this.shadowRoot.querySelector("#id-ts-configuration-packages")
        tableEl.syncData(packages);
    }

    toggle (event) {
        var contentEl =  this.shadowRoot.querySelector("#id-ts-config-packages-content");

        if (contentEl.style.display == "none") {
            contentEl.style.display = "block";
        } else {
            contentEl.style.display = "none";
        }
    }

}



class TestSummaryResultGroup extends HTMLElement {

    static tagname = 'testsummary-resultgroup'

    template = `
        <details>
            <summary id="id-rgroup-summary">
                <div class="ts-results-grp-grid">
                    <span id="id-rgs-name" class="ts-results-grp-name"></span>
                    <span id="id-rgs-error" class="ts-results-grp-score"></span>
                    <span id="id-rgs-failure" class="ts-results-grp-score"></span>
                    <span id="id-rgs-skip" class="ts-results-grp-score"></span>
                    <span id="id-rgs-pass" class="ts-results-grp-score"></span>
                </div>
            </summary>
            <div id="id-resultgroup-detail" style="margin-left: 20px;">
            </div>
        </details>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData (groupName, groupInfo) {

        var grpDetailEl = this.shadowRoot.querySelector("#id-resultgroup-detail");

        var grpNameEl = this.shadowRoot.querySelector("#id-rgs-name");
        grpNameEl.innerHTML = groupName;

        var errored = 0;
        var failed = 0;
        var skipped = 0;
        var passed = 0;

        for ( const testItem of groupInfo) {
            
            if (testItem.hasOwnProperty("detail")) {
                var itemResult = testItem.result;

                if (itemResult == "PASSED") {
                    passed += 1;
                } else if (itemResult == "FAILED") {
                    failed += 1;
                } else if (itemResult == "ERRORED") {
                    errored += 1;
                } else if (itemResult == "SKIPPED") {
                    skipped += 1;
                }

                var resultItemEl = document.createElement("testsummary-resultitem");
                resultItemEl.syncData(testItem);

                grpDetailEl.appendChild(resultItemEl);
            }
            
        }

        var grpErrorEl = this.shadowRoot.querySelector("#id-rgs-error");
        if (errored > 0) {
            grpErrorEl.classList.add("color-error");
        } else {
            grpErrorEl.classList.add("color-ghost");
        }
        grpErrorEl.innerHTML = errored.toString();

        var grpFailEl = this.shadowRoot.querySelector("#id-rgs-failure");
        if (failed > 0) {
            grpFailEl.classList.add("color-fail");
        } else {
            grpFailEl.classList.add("color-ghost");
        }
        grpFailEl.innerHTML = failed.toString();

        var grpSkipEl = this.shadowRoot.querySelector("#id-rgs-skip");
        if (skipped > 0) {
            grpSkipEl.classList.add("color-skip");
        } else {
            grpSkipEl.classList.add("color-ghost");
        }
        grpSkipEl.innerHTML = skipped.toString();

        var grpPassEl = this.shadowRoot.querySelector("#id-rgs-pass");
        if (passed > 0) {
            grpPassEl.classList.add("color-pass");
        } else {
            grpPassEl.classList.add("color-ghost");
        }
        grpPassEl.innerHTML = passed.toString();

    }
}


class TestSummaryResultItem extends HTMLElement {

    static tagname = 'testsummary-resultitem'

    template = `
        <details>
            <summary id="id-ritem-summary">
                <div class="ts-results-items-grid">
                    <span id="id-ris-start" class="ts-results-item-start"></span>
                    <span id="id-ris-name" class="ts-results-item-name"></span>
                    <span id="id-ris-error" class="ts-results-item-score"></span>
                    <span id="id-ris-failure"  class="ts-results-item-score"></span>
                    <span id="id-ris-skip"  class="ts-results-item-score"></span>
                    <span id="id-ris-pass"  class="ts-results-item-score"></span>
                </div>
            </summary>
            <div id="id-resultitem-detail">
                <div id="id-ris-item-detail">
                </div>
                <div id="id-ris-taskings"></div>
            </div>
        </details>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData (testItem) {

        var itemNameEl = this.shadowRoot.querySelector("#id-ris-name");
        itemNameEl.innerHTML = testItem.name;

        var itemStartEl = this.shadowRoot.querySelector("#id-ris-start");
        itemStartEl.innerHTML = testItem.start;

        var detail = testItem.detail;

        var errored = detail.errors.length > 0 ? 1 : 0;
        var failed = detail.failures.length > 0 ? 1 : 0;
        var skipped = detail.skipped ? 1 : 0;
        var passed = detail.passed ? 1 : 0;

        var itemErrorEl = this.shadowRoot.querySelector("#id-ris-error");
        if (errored > 0) {
            itemErrorEl.classList.add("color-error");
        } else {
            itemErrorEl.classList.add("color-ghost");
        }
        itemErrorEl.innerHTML = errored.toString();
        
        var itemFailureEl = this.shadowRoot.querySelector("#id-ris-failure");
        if (failed > 0) {
            itemFailureEl.classList.add("color-fail");
        } else {
            itemFailureEl.classList.add("color-ghost");
        }
        itemFailureEl.innerHTML = failed.toString();

        var itemSkipEl = this.shadowRoot.querySelector("#id-ris-skip");
        if (skipped > 0) {
            itemSkipEl.classList.add("color-skip");
        } else {
            itemSkipEl.classList.add("color-ghost");
        }
        itemSkipEl.innerHTML = skipped.toString();

        var itemPassEl = this.shadowRoot.querySelector("#id-ris-pass");
        if (passed > 0) {
            itemPassEl.classList.add("color-pass");
        } else {
            itemPassEl.classList.add("color-ghost");
        }
        itemPassEl.innerHTML = passed.toString();
    }
}


class TestSummaryResultDetail extends HTMLElement {
    
    static tagname = 'testsummary-resultdetail'

    template = `
        <div class="ts-resultdetail-card">
            <div class="ts-section-header">
                <h2 class="zero-margins-and-padding">Test Result Detail</h2>
            </div>
            <div class="ts-section-detail">
                <div id='id-test-results-header' class='ts-results-hdr-grid'>
                    
                </div>
                <div id='id-test-results-items'>
                    
                </div>
            </div>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData (renderFormat, resultsDetail) {
        
        var gridResultsHeaderEl = this.shadowRoot.querySelector("#id-test-results-header");
        gridResultsHeaderEl.innerHTML = "";
    
        var headerEl = document.createElement("div");
        headerEl.classList.add("ts-results-hdr-start");
        headerEl.innerHTML = "Start";
        gridResultsHeaderEl.appendChild(headerEl);

        var headerEl = document.createElement("div");
        headerEl.classList.add("ts-results-hdr-name");
        headerEl.innerHTML = "TestName";
        gridResultsHeaderEl.appendChild(headerEl);

        var headerEl = document.createElement("div");
        headerEl.classList.add("ts-results-hdr-e");
        headerEl.innerHTML = "E";
        gridResultsHeaderEl.appendChild(headerEl);

        var headerEl = document.createElement("div");
        headerEl.classList.add("ts-results-hdr-f");
        headerEl.innerHTML = "F";
        gridResultsHeaderEl.appendChild(headerEl);

        var headerEl = document.createElement("div");
        headerEl.classList.add("ts-results-hdr-s");
        headerEl.innerHTML = "S";
        gridResultsHeaderEl.appendChild(headerEl);

        var headerEl = document.createElement("div");
        headerEl.classList.add("ts-results-hdr-p");
        headerEl.innerHTML = "P";
        gridResultsHeaderEl.appendChild(headerEl);

        var gridResultsItemsEl = this.shadowRoot.querySelector("#id-test-results-items");
        gridResultsItemsEl.innerHTML = "";
        
        if (renderFormat == "render_by_package") {
            this.renderTestsGroupedByPackage(gridResultsItemsEl, resultsDetail)
        } else if (renderFormat == "render_as_tree") {

        }

    }

    renderTestsGroupedByPackage(gridResultsEl, resultsDetail) {

        for ( const [pkgName, testGroup] of Object.entries(resultsDetail)) {
            var resultItemEl = document.createElement("testsummary-resultgroup");

            resultItemEl.syncData(pkgName, testGroup);

            gridResultsEl.appendChild(resultItemEl);
        }

    }
}


class TestSummaryArtifacts extends HTMLElement {

    static tagname = 'testsummary-artifacts'

    template = `
        <div class="ts-artifacts-card">
            <div class="ts-section-header">
                <h2 class="zero-margins-and-padding">Artifacts</h2>
            </div>
            <div class="ts-section-detail">
            </div>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData () {
        
    }
}


class TestSummaryImportFailures extends HTMLElement {

    static tagname = 'testsummary-importfailures'

    template = `
        <div class="ts-importfailures-card">
            <div class="ts-section-header">
                <h2 class="zero-margins-and-padding">Import Failures</h2>
            </div>
            <div class="ts-section-detail">
            </div>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData () {
        
    }
}


class TestSummaryFilesAndFolders extends HTMLElement {

    static tagname = 'testsummary-filesandfolders'

    template = `
        <div class="ts-filesandfolders-card">
            <div class="ts-section-header">
                <h2 class="zero-margins-and-padding">Files and Folders</h2>
            </div>
            <div class="ts-section-detail">
            </div>
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData () {
        
    }
}


function register_testsummary_components() {

    register_mojo_components()

    customElements.define(TestSummaryBanner.tagname, TestSummaryBanner);
    customElements.define(TestSummaryConfiguration.tagname, TestSummaryConfiguration);
    customElements.define(TestSummaryConfigurationEnvironment.tagname, TestSummaryConfigurationEnvironment);
    customElements.define(TestSummaryConfigurationLandscape.tagname, TestSummaryConfigurationLandscape);
    customElements.define(TestSummaryConfigurationPackages.tagname, TestSummaryConfigurationPackages);
    customElements.define(TestSummaryDeviceGroup.tagname, TestSummaryDeviceGroup);
    customElements.define(TestSummaryDeviceItem.tagname, TestSummaryDeviceItem);
    customElements.define(TestSummaryResultGroup.tagname, TestSummaryResultGroup);
    customElements.define(TestSummaryResultItem.tagname, TestSummaryResultItem);
    customElements.define(TestSummaryResultDetail.tagname, TestSummaryResultDetail);
    customElements.define(TestSummaryArtifacts.tagname, TestSummaryArtifacts);
    customElements.define(TestSummaryImportFailures.tagname, TestSummaryImportFailures);
    customElements.define(TestSummaryFilesAndFolders.tagname, TestSummaryFilesAndFolders);
}
