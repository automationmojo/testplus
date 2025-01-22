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
                            <div class="ts-banner-prop-pair">
                                <div class="ts-banner-prop-label">Automation Pod:</div>
                                <div class="ts-banner-prop-value" id="id-summary-banner-apod">(not set)</div>
                            </div>
                        </div>
                    </div>
                    <div class="ts-banner-column">
                        <div class="ts-banner-row">
                            <div class="ts-banner-prop-pair">
                                <div class="ts-banner-prop-label">Branch:</div>
                                <div class="ts-banner-prop-value" id="id-summary-banner-branch">(not set)</div>
                            </div>
                        </div>
                        <br>   
                        <div class="ts-banner-row">
                            <div class="ts-banner-prop-pair" style="flex-basis: 1;">
                                <div class="ts-banner-prop-label">Start:</div>
                                <div class="ts-banner-prop-value" id="id-summary-banner-start">(not set)</div>
                            </div>
                        </div>
                    </div>
                    <div class="ts-banner-column">
                        <div class="ts-banner-row">
                            <div class="ts-banner-prop-pair">
                                <div class="ts-banner-prop-label">Build:</div>
                                <div class="ts-banner-prop-value" id="id-summary-banner-build">(not set)</div>
                            </div>
                        </div>
                        <br>
                        <div class="ts-banner-row">
                            <div class="ts-banner-prop-pair">
                                <div class="ts-banner-prop-label">Stop:</div>
                                <div class="ts-banner-prop-value" id="id-summary-banner-stop">(not set)</div>
                            </div>
                        </div>
                    </div>
                    <div class="ts-banner-column">
                        <div class="ts-banner-row">
                            <div class="ts-banner-prop-pair">
                                <div class="ts-banner-prop-label">Flavor:</div>
                                <div class="ts-banner-prop-value" id="id-summary-banner-flavor">(not set)</div>
                            </div>
                        </div>
                        <br>
                        <div class="ts-banner-row">
                            <div class="ts-banner-prop-pair">
                                <div class="ts-banner-prop-label">Status:</div>
                                <div class="ts-banner-prop-value" id="id-summary-banner-status">(not set)</div>
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
                    <mojo-property-single id="id-ts-configuration-command">
                    </mojo-property-single>
                    <mojo-collapsible id="id-ts-configuration-environment">
                    </mojo-collapsible>
                    <mojo-collapsible id="id-ts-configuration-packages">
                    </mojo-collapsible>
                    <mojo-collapsible id="id-ts-configuration-landscape">
                    </mojo-collapsible>
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

            commandEl.syncData( "Command", this.command );
        }

        var environmentEl = this.shadowRoot.querySelector("#id-ts-configuration-environment");
        if (this.environment != undefined) {
            environmentEl.innerHTML = "";

            var tableEl = document.createElement(MojoPropertyTable.tagname);
            tableEl.syncData(this.environment);

            environmentEl.syncData("Environment", tableEl);
        } else {
            environmentEl.style.display = "None";
        }

        var packagesEl = this.shadowRoot.querySelector("#id-ts-configuration-packages");
        if (this.packages != undefined) {
            packagesEl.innerHTML = "";

            var tableEl = document.createElement(MojoPropertyTable.tagname);
            tableEl.syncData(this.packages);

            packagesEl.syncData("Packages", tableEl);
        } else {
            packagesEl.style.display = "None";
        }

        var landscapeEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape");
        if (this.landscape != undefined) {
            landscapeEl.innerHTML = "";
            
            landscapeEl.syncData("Landscape", "");
        } else {
            landscapeEl.style.display = "None";
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
                <div id="id-ris-item-detail" class="ts-results-item-detail">
                    <div class="ts-results-item-prop-row" >
                        <div class="ts-results-item-prop-pair" >
                            <div id="id-rip-inst-label" class="ts-results-item-prop-label">InstId</div>
                            <div id="id-rip-inst-value" class="ts-results-item-prop-value"></div>
                        </div>
                        <div class="ts-results-item-prop-pair" >
                            <div id="id-rip-start-label" class="ts-results-item-prop-label">Start</div>
                            <div id="id-rip-start-value" class="ts-results-item-prop-value"></div>
                        </div>
                        <div class="ts-results-item-prop-pair" >
                            <div id="id-rip-stop-label" class="ts-results-item-prop-label">Stop</div>
                            <div id="id-rip-stop-value" class="ts-results-item-prop-value"></div>
                        </div>
                        <div class="ts-results-item-prop-pair" >
                            <div id="id-rip-elapsed-label" class="ts-results-item-prop-label">Elapsed</div>
                            <div id="id-rip-elapsed-value" class="ts-results-item-prop-value"></div>
                        </div>
                    </div>
                </div>
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

        var itemDetailEl = this.shadowRoot.querySelector("#id-resultitem-detail");

        var itemInstValEl = this.shadowRoot.querySelector("#id-rip-inst-value");
        itemInstValEl.innerHTML = testItem.instance;

        var itemStartValEl = this.shadowRoot.querySelector("#id-rip-start-value");
        itemStartValEl.innerHTML = testItem.start;

        var itemStopValEl = this.shadowRoot.querySelector("#id-rip-stop-value");
        itemStopValEl.innerHTML = testItem.stop;

        var elapsed = get_time_difference(testItem.start, testItem.stop);

        var itemElapsedValEl = this.shadowRoot.querySelector("#id-rip-elapsed-value");
        itemElapsedValEl.innerHTML = elapsed;

        if (errored > 0) {
            var errorsCollapsibleEl = document.createElement(TestSummaryErrorsCollapsible.tagname);
            
            errorsCollapsibleEl.syncData(detail.errors);

            itemDetailEl.appendChild(errorsCollapsibleEl);
        }

        if (failed > 0) {
            var failsCollapsibleEl = document.createElement(TestSummaryFailuresCollapsible.tagname);

            failsCollapsibleEl.syncData(detail.failures);

            itemDetailEl.appendChild(failsCollapsibleEl);
        }

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


class TestSummaryErrorsCollapsible extends MojoCollapsible {

    static tagname = 'testsummary-errors-collection'

    constructor() {
        super(`
        <div id="id-collapsible-container" class="ts-errors-collapsible" >
            <div id="id-collapsible-button" class="ts-errors-collapsible-button">
                <div id="id-header-text" class="ts-errors-collapsible-header">ERRORS</div>
                <div id="id-header-icon" class="ts-errors-collapsible-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="ts-errors-collapsible-content">
            </div>
        </div>
    `);
    }

    syncData(errors) {

        var contentEl = this.shadowRoot.querySelector(this.sel_content);

        var errorCount = errors.length;

        for (var eidx = 0; eidx < errorCount; eidx++) {
            var traceInfo = errors[eidx];

            var traceEl = document.createElement(TestSummaryExceptionTrace.tagname)
            traceEl.syncData(traceInfo.exargs, traceInfo.extype, traceInfo.traces);

            contentEl.appendChild(traceEl);
        }

        super.syncData("ERRORS", undefined, false);
    }

}


class TestSummaryFailuresCollapsible extends MojoCollapsible {

    static tagname = 'testsummary-failures-collection'

    constructor() {
        super(`
        <div id="id-collapsible-container" class="ts-failures-collapsible" >
            <div id="id-collapsible-button" class="ts-failures-collapsible-button">
                <div id="id-header-text" class="ts-failures-collapsible-header"></div>
                <div id="id-header-icon" class="ts-failures-collapsible-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="ts-failures-collapsible-content">
            </div>
        </div>
    `);
    }

    syncData(failures) {

        var contentEl = this.shadowRoot.querySelector(this.sel_content);

        var failureCount = failures.length;

        for (var fidx = 0; fidx < failureCount; fidx++) {
            var traceInfo = failures[fidx];

            var traceEl = document.createElement(TestSummaryExceptionTrace.tagname)
            traceEl.syncData(traceInfo.exargs, traceInfo.extype, traceInfo.traces);

            contentEl.appendChild(traceEl);
        }

        super.syncData("FAILURES", undefined, false);
    }
}


class TestSummaryExceptionTrace extends HTMLElement {

    static tagname = 'testsummary-exception-trace'

    template = `
        <div id="id-exception-content" class="ts-exception-content">
            <pre></pre>
        </div>
    `

    sel_content = "#id-exception-content"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData (exargs, extype, trace_lines) {

        var contentEl = this.shadowRoot.querySelector(this.sel_content);

        var exAndMsgEl = document.createElement("pre");
        exAndMsgEl.classList.add("code-font-dk")
        exAndMsgEl.innerHTML = extype + ", " + exargs;
        contentEl.appendChild(exAndMsgEl);

        var traces_len = trace_lines.length;

        for (var tidx=0; tidx < traces_len; tidx++) {
            var traceInfo = trace_lines[tidx];
            var traceEl = this.createTraceElement(traceInfo);
            contentEl.appendChild(traceEl);
        }
    }

    createTraceElement(traceInfo) {
        var outerDivEl = document.createElement('div');
        
        var origin = traceInfo.origin;
        
        var nxtPreEl = document.createElement('pre');
        nxtPreEl.classList.add("code-font-lt");
        nxtPreEl.innerHTML = "  File " + origin.file + ", line " + origin.lineno + ", in " + origin.scope;
        outerDivEl.appendChild(nxtPreEl);
    
        nxtPreEl = document.createElement('pre');
        nxtPreEl.classList.add("margin-lg");
        nxtPreEl.classList.add("code-font-dk");
        nxtPreEl.innerHTML = entity_escape(traceInfo.call);
        outerDivEl.appendChild(nxtPreEl);
    
        if ((traceInfo.code != undefined) && (traceInfo.code.length > 0)) {
            var nxtPreEl = document.createElement('pre');
            nxtPreEl.classList.add("margin-lg");
    
            var codeEl = document.createElement('code');
            codeEl.classList.add("language-python");
            codeEl.innerHTML = "\n" + traceInfo.code.join("\n");
            nxtPreEl.appendChild(codeEl);
        }
    
        outerDivEl.appendChild(nxtPreEl);
    
        return outerDivEl;
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
                <mojo-tabset id="id-artifacts-tabset"></mojo-tabset>
            </div>
        </div>
    `

    sel_tabset = "#id-artifacts-tabset"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData (artifacts_catalog, artifacts_folder_catalogs) {

        if ((artifacts_catalog != undefined) && (artifacts_catalog.folders != undefined)) {

            var artifacts_folders = artifacts_catalog.folders;

            var tabsList = [];

            for (var findex in artifacts_folders) {
                var afolder = artifacts_folders[findex];
                var afolder_catalog = artifacts_folder_catalogs[afolder];

                if (afolder_catalog != undefined) {
                    if (afolder_catalog["files"] != undefined) {
                        if (afolder_catalog["files"].includes("tab.html")) {
                            var tabURL = "artifacts/" + afolder + "/tab.html";
                        
                            var iframeEl = document.createElement("iframe");
                            iframeEl.classList.add("ts-artifact-tab-iframe");
                            iframeEl.setAttribute("src", tabURL);
                            iframeEl.setAttribute("title", afolder);
                            
                            var tab = new MojoTabPage(afolder, afolder, iframeEl);
                            tabsList.push(tab);
                        }
                    }
                }
            }

            var tabsetEl = this.shadowRoot.querySelector(this.sel_tabset);
            tabsetEl.syncData(tabsList);

        }

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

    syncData (importErrors) {
        for (var idx in g_import_errors) {
            var imp_err_item = g_import_errors[idx];
            render_import_error_item_content(ierrbody, imp_err_item);
        }
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
                <h2>Folders</h2>
                <div id="id-folders-list">
                </div>
                <br></br>
                <h2>Files</h2>
                <div id="id-files-list">
                </div>
            </div>
        </div>
    `

    sel_files = "#id-files-list"
    sel_folders = "#id-folders-list"
    
    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    createFileElement(label, path) {
        var fileEl = document.createElement("div");
        fileEl.innerHTML = "<icon-file class='ts-file-icon'></icon-file><a href='" + path + "'>" + label + "</a>";
        return fileEl;
    }

    createFolderElement(label, path) {
        var folderEl = document.createElement("div");
        folderEl.innerHTML = "<icon-folder class='ts-folder-icon'></icon-folder><a href='" + path + "'>" + label + "</a>";
        return folderEl;
    }

    syncData (files, folders) {

        var folderListEl = this.shadowRoot.querySelector(this.sel_folders);
        folderListEl.innerHTML = "";
        
        var folderEl = this.createFolderElement("Parent", "..");
        folderListEl.appendChild(folderEl);

        for (var idx in folders) {
            var nxt = folders[idx];

            folderEl = this.createFolderElement(nxt, nxt);
            folderListEl.appendChild(folderEl);
        }

        var fileListEl = this.shadowRoot.querySelector(this.sel_files);
        fileListEl.innerHTML = "";

        for (var idx in files) {
            var nxt = files[idx];

            var fileEl = this.createFolderElement(nxt, nxt);
            fileListEl.appendChild(fileEl);
        }
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
    customElements.define(TestSummaryErrorsCollapsible.tagname, TestSummaryErrorsCollapsible);
    customElements.define(TestSummaryFailuresCollapsible.tagname, TestSummaryFailuresCollapsible);
    customElements.define(TestSummaryExceptionTrace.tagname, TestSummaryExceptionTrace);
    customElements.define(TestSummaryArtifacts.tagname, TestSummaryArtifacts);
    customElements.define(TestSummaryImportFailures.tagname, TestSummaryImportFailures);
    customElements.define(TestSummaryFilesAndFolders.tagname, TestSummaryFilesAndFolders);
}
