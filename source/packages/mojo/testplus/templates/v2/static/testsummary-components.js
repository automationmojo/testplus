/*
    Author: "Myron Walker"
    Copyright: "Copyright 2024, Myron W Walker"
    Version: = "2.0.0"
    Email: myron.walker@gmail.com
*/

class TestSummaryBanner extends HTMLElement {

    static tagname = 'testsummary-banner'

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);

        this.summary = {};
    }

    getTemplate() {
        return TestSummaryBanner.template;
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


class TestSummaryLandscapeObject extends HTMLElement {

    static tagname = 'testsummary-landscapeobject'

    static template = `
        <div id='id-lscape-object-container' class='ts-lscape-object-item'>
        </div>
    `

    sel_container = "#id-lscape-object-container"

    property_order = ['name']
    property_label_lookup = { 'name': 'Name'}

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);

        this.lscapeItem = undefined;
    }

    createPropertyPairElement(label, value) {
        var propLabel = this.getPropertyLabel(label);

        var labelEl = document.createElement('div');
        labelEl.innerHTML = propLabel + ":";
        labelEl.classList.add("ts-lscape-item-prop-lbl");

        var valueEl = document.createElement('div');
        valueEl.classList.add("ts-lscape-item-prop-val");
        valueEl.innerHTML = this.formatProperty(value);

        return [labelEl, valueEl];
    }

    formatProperty(propVal) {
        var formattedHtml = "";
        
        if (typeof propVal === 'string') {
            formattedHtml = propVal;
        } else if (Array.isArray(propVal)) {
            formattedHtml = "<div class='ts-lscape-item-value-list'>";
            for (var val of propVal) {
                formattedHtml += "<span>" + val + "</span>"
            }
            formattedHtml += "</div>"
        } else if (Object.keys(propVal).length > 0) {
            formattedHtml = "<div class='ts-lscape-item-value-list'>";
            for (var key of Object.keys(propVal)) {
                var val = propVal[key];
                formattedHtml += "<div class='ts-lscape-item-value-row-pair'><div class='ts-lscape-item-value-row-lbl'>" + key +
                                 ":</div><div class='ts-lscape-item-value-row-val'>" + val + "</div></div>";
            }
            formattedHtml += "</div>";
        } else {
            formattedHtml = propVal;
        }

        return formattedHtml;
    }

    getPropertyLabel(propKey) {
        var label = "";

        var propLabelLookup = this.getPropertyLabelLookup();

        if (propLabelLookup.hasOwnProperty(propKey)) {
            label = propLabelLookup[propKey];
        } else {
            label = propKey.substring(0, 1).toUpperCase(); + propKey.substring(1);
        }

        return label;
    }

    getPropertyLabelLookup() {
        return this.property_label_lookup
    }

    getPropertyOrder() {
        return this.property_order;
    }

    getTemplate() {
        return TestSummaryLandscapeObject.template;
    }

    syncData(lscapeItem) {

        this.lscapeItem = lscapeItem;

        var containerEl = this.shadowRoot.querySelector(this.sel_container);

        var propKeys = Object.keys(lscapeItem);
        var prefPropOrder = this.getPropertyOrder();

        for (const prefProp of prefPropOrder) {
            if (lscapeItem.hasOwnProperty(prefProp)) {
                propKeys = propKeys.filter( function(item) {
                    var matches = item == prefProp;
                    return matches;
                });

                const propVal = lscapeItem[prefProp];

                const [labelEl, valueEl] = this.createPropertyPairElement(prefProp, propVal);
                containerEl.appendChild(labelEl);
                containerEl.appendChild(valueEl);
            }
        }

        for (const propName of propKeys) {
            if (lscapeItem.hasOwnProperty(propName)) {
                const propVal = lscapeItem[propName];

                const [labelEl, valueEl] = this.createPropertyPairElement(propName, propVal);
                containerEl.appendChild(labelEl);
                containerEl.appendChild(valueEl);
            }
        }

    }

}


class TestSummaryDataProfileObject extends HTMLElement {

    static tagname = 'testsummary-dataprofileobject'

    property_order = ['name', 'profileType', 'host', 'credentials']
    
    property_label_lookup = {
        'name': 'Name',
        'profileType': 'ProfileType',
        'host': 'Host',
        'credentials': 'Credentials'
    }

    constructor() {
        super();
    }

    getPropertyLabelLookup() {
        return this.property_label_lookup
    }

    getPropertyOrder() {
        return this.property_order;
    }

}


class TestSummaryDeviceObject extends TestSummaryLandscapeObject {

    static tagname = 'testsummary-deviceobject'

    property_order = ['name', 'deviceType', 'host', 'role', 'credentials', 'features', 'skip']
    
    property_label_lookup = {
        'name': 'Name',
        'deviceType': 'DeviceType',
        'host': 'Host',
        'role': 'Role',
        'credentials': 'Credentials',
        'features': 'Features',
        'skip': 'Skip'
    }

    constructor() {
        super();
    }

    getPropertyLabelLookup() {
        return this.property_label_lookup
    }

    getPropertyOrder() {
        return this.property_order;
    }
}


class TestSummaryDeviceGroup extends HTMLElement {

    static tagname = 'testsummary-devicegroup'

    static template = `
        <div id="id-device-group-container" class="ts-lscape-device-group">
            <div id="id-device-group-name" class="ts-lscape-device-group-name">
            </div>
            <div id="id-device-group-items" class="ts-lscape-device-group-items">
            </div>
        </div>
    `

    sel_container = "#id-device-group-container"
    sel_group_name = "#id-device-group-name"
    sel_group_items = "#id-device-group-items"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);

        this.name = undefined;
        this.devices = undefined;
    }

    getTemplate() {
        return TestSummaryDeviceGroup.template;
    }

    syncData(group_name, group_devices) {

        var groupNameEl = this.shadowRoot.querySelector(this.sel_group_name);
        var groupItemsEl = this.shadowRoot.querySelector(this.sel_group_items);

        this.group_name = name;
        this.group_devices = group_devices;

        groupNameEl.innerHTML = group_name;

        for (var device of group_devices) {
            var deviceEl = document.createElement(TestSummaryDeviceObject.tagname);
            deviceEl.syncData(device);

            groupItemsEl.appendChild(deviceEl);
        }

    }
}

class TestSummaryServiceObject extends TestSummaryLandscapeObject {

    static tagname = 'testsummary-serviceobject'

    property_order = ['name', 'serviceType', 'host', 'credentials']
    
    property_label_lookup = {
        'name': 'Name',
        'serviceType': 'ServiceType',
        'host': 'Host',
        'credentials': 'Credentials'
    }

    constructor() {
        super();
    }

    getPropertyLabelLookup() {
        return this.property_label_lookup
    }

    getPropertyOrder() {
        return this.property_order;
    }

}


class TestSummaryConfiguration extends HTMLElement {

    static tagname = 'testsummary-configuration'

    static template = `
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
                    <testsummary-config-landscape id="id-ts-configuration-landscape">
                    </testsummary-config-landscape>
                </div>
            </div>  
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);

        this.landscape = undefined;
        this.command = undefined;
        this.environment = undefined;
        this.packages = undefined;
    }

    getTemplate() {
        return TestSummaryConfiguration.template;
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

            var tableEl = document.createElement(MojoPropertyTable.tagname);
            tableEl.syncData(this.environment);

            environmentEl.syncData("Environment", tableEl);

        } else {
            environmentEl.style.display = "None";
        }

        var packagesEl = this.shadowRoot.querySelector("#id-ts-configuration-packages");
        if (this.packages != undefined) {

            var tableEl = document.createElement(MojoPropertyTable.tagname);
            tableEl.syncData(this.packages);

            packagesEl.syncData("Packages", tableEl);
            
        } else {
            packagesEl.style.display = "None";
        }

        var landscapeEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape");
        if (this.landscape != undefined) {
            
            landscapeEl.syncData("Landscape", this.landscape);

        } else {
            landscapeEl.style.display = "None";
        }

    }

}

class TestSummaryConfigurationEnvironment extends HTMLElement {

    static tagname = 'testsummary-config-environment'

    static template = `
        <div id="id-collapsible-container" class="mojo-collapsible" >
            <div id="id-collapsible-button" class="mojo-collapsible-button">
                <div id="id-header-text" class="mojo-collapsible-header"></div>
                <div id="id-header-icon" class="mojo-collapsible-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="ts-collapsible-content">
                <property-table id="id-ts-configuration-environment"></property-table>
            </div>
        </div>
    `

    constructor() {
        super();
    }

    getTemplate() {
        return TestSummaryConfigurationEnvironment.template;
    }

    syncData (environment) {
        this.environment = environment;

        var tableEl = this.shadowRoot.querySelector("#id-ts-configuration-environment")
        tableEl.syncData(environment);
    }

}


class TestSummaryConfigurationLandscape extends MojoCollapsible {

    static tagname = 'testsummary-config-landscape'

    static template = `
        <div id="id-collapsible-container" class="mojo-collapsible" >
            <div id="id-collapsible-button" class="mojo-collapsible-button">
                <div id="id-header-text" class="mojo-collapsible-header"></div>
                <div id="id-header-icon" class="mojo-collapsible-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="ts-lscape-collapsable-content">
                <mojo-collapsible-lvl2 id="id-ts-configuration-landscape-dataprofiles">
                </mojo-collapsible-lvl2>
                <div style="height: 8px;"></div>
                <mojo-collapsible-lvl2 id="id-ts-configuration-landscape-device-groups">
                </mojo-collapsible-lvl2>
                <div style="height: 8px;"></div>
                <mojo-collapsible-lvl2 id="id-ts-configuration-landscape-services">
                </mojo-collapsible-lvl2>
                <div style="height: 4px;"></div>
            </div>
        </div>
    `

    constructor() {
        super();
    }

    getTemplate() {
        return TestSummaryConfigurationLandscape.template;
    }

    syncData (header, landscape) {

        this.landscape = landscape;

        var deviceGroupsEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape-device-groups");

        if ((landscape.apod != undefined) && (Object.keys(landscape.apod).length > 0)) {

            deviceGroupsEl.style.display = "";

            var deviceGroupListEl = document.createElement("div");
            deviceGroupListEl.classList.add("ts-lscape-device-groups-list");

            var apod = landscape.apod

            // If we have device groups in the automation pod, then 

            for (var device_group of Object.keys(apod)) {

                console.debug("Processing device group (" + device_group + ")");

                var group_devices = apod[device_group];
                
                var nextDeviceGroupEl = document.createElement(TestSummaryDeviceGroup.tagname);
                nextDeviceGroupEl.syncData(device_group, group_devices);

                deviceGroupListEl.appendChild(nextDeviceGroupEl)
            }

            deviceGroupsEl.syncData("Device Groups", deviceGroupListEl, true);

        } else {
            deviceGroupsEl.style.display = "none";
        }

        var landscapeDataProfilesEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape-dataprofiles");
        if ((landscape.dataprofiles != undefined) && (landscape.dataprofiles.length > 0)) {
            landscapeDataProfilesEl.style.display = "";

            var landscapeDataProfilesListEl = document.createElement("div");
            landscapeDataProfilesListEl.classList.add("ts-lscape-dataprofiles-list");
            
            // TODO: Add support for displaying data profiles

            landscapeDataProfilesEl.syncData("Data Profiles", landscapeDataProfilesListEl, true);
        
        } else {
            
            landscapeDataProfilesEl.style.display = "none";
        }

        if (landscape.environment != undefined) {
            var lscape_env = landscape.environment;

            if (lscape_env.label != undefined) {
                var env_label = lscape_env.label;

                // TODO: Update the environment declared in the landscape file
            }

        }

        var landscapeServiceEl = this.shadowRoot.querySelector("#id-ts-configuration-landscape-services");

        if (landscape.infrastructure != undefined) {

            var infrastructure = landscape.infrastructure;

            if ((infrastructure.services != undefined) && (infrastructure.services.length > 0)) {
                // TODO: Add support for displaying infrastructure details
                landscapeServiceEl.style.display = '';

                var landscapeServicesListEl = document.createElement("div");
                landscapeServicesListEl.classList.add("ts-lscape-services-list");
                
                for (const serviceInfo of infrastructure.services) {
                    var serviceEl = document.createElement(TestSummaryServiceObject.tagname);
                    serviceEl.syncData(serviceInfo)

                    landscapeServicesListEl.appendChild(serviceEl);
                }
                
                landscapeServiceEl.syncData("Services", landscapeServicesListEl, true);

            
            } else {
                landscapeServiceEl.style.display = 'none';
            }

        } else {
            landscapeServiceEl.style.display = 'none';
        }

        super.syncData(header, undefined, false);

    }

}


class TestSummaryConfigurationPackages extends MojoCollapsible {

    static tagname = 'testsummary-config-packages'

    static template = `
        <div id="id-collapsible-container" class="mojo-collapsible" >
            <div id="id-collapsible-button" class="mojo-collapsible-button">
                <div id="id-header-text" class="mojo-collapsible-header"></div>
                <div id="id-header-icon" class="mojo-collapsible-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="ts-collapsible-content">
                <property-table id="id-ts-configuration-packages"></property-table>
            </div>
        </div>
    `

    constructor() {
        super();
    }

    getTemplate() {
        return TestSummaryConfigurationPackages.template;
    }

    syncData (packages) {
        this.packages = packages;
    
        var tableEl = this.shadowRoot.querySelector("#id-ts-configuration-packages")
        tableEl.syncData(packages);

        super.syncData("Packages", undefined, false);
    }

}



class TestSummaryResultGroup extends HTMLElement {

    static tagname = 'testsummary-resultgroup'

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return TestSummaryResultGroup.template;
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

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return TestSummaryResultItem.template;
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

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return TestSummaryResultDetail.template;
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

    static template = `
        <div id="id-collapsible-container" class="ts-errors-collapsible" >
            <div id="id-collapsible-button" class="ts-errors-collapsible-button">
                <div id="id-header-text" class="ts-errors-collapsible-header">ERRORS</div>
                <div id="id-header-icon" class="ts-errors-collapsible-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="ts-errors-collapsible-content">
            </div>
        </div>
    `

    constructor() {
        super();
    }

    getTemplate() {
        return TestSummaryErrorsCollapsible.template;
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

    static template = `
        <div id="id-collapsible-container" class="ts-failures-collapsible" >
            <div id="id-collapsible-button" class="ts-failures-collapsible-button">
                <div id="id-header-text" class="ts-failures-collapsible-header"></div>
                <div id="id-header-icon" class="ts-failures-collapsible-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="ts-failures-collapsible-content">
            </div>
        </div>
    `

    constructor() {
        super();
    }

    getTemplate() {
        return TestSummaryFailuresCollapsible.template;
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

    static template = `
        <div id="id-exception-content" class="ts-exception-content">
            <pre></pre>
        </div>
    `

    sel_exception_content = "#id-exception-content"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return TestSummaryExceptionTrace.template;
    }

    syncData (exargs, extype, trace_lines) {

        var contentEl = this.shadowRoot.querySelector(this.sel_exception_content);

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


class TestSummaryImportFailureTrace extends MojoCollapsible {
    static tagname = 'testsummary-import-failure-trace'

    static template = `
        <div id="id-collapsible-container" class="ts-importfailure-trace" >
            <div id="id-collapsible-button" class="ts-importfailure-trace-button">
                <div id="id-header-text" class="ts-importfailure-trace-header">Trace</div>
                <div id="id-header-icon" class="ts-importfailure-trace-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="ts-importfailure-trace-content">
            </div>
        </div>
    `

    constructor() {
        super();
    }

    getTemplate() {
        return TestSummaryImportFailureTrace.template;
    }

    syncData(header, trace_lines) {

        var contentEl = this.shadowRoot.querySelector(this.sel_content);
        contentEl.innerHTML = "";

        var traceContentEl = this.createTraceContent(trace_lines);
        contentEl.appendChild(traceContentEl);

        super.syncData(header, undefined, false);
    }

    createTraceContent(trace_lines) {

        trace_lines = trace_lines.reverse();

        var traceLinesEl = document.createElement("div");

        for (var tindex in trace_lines) {
            var titem = trace_lines[tindex];
            var nxtLineEl = document.createElement("pre");
            nxtLineEl.innerHTML = titem;

            traceLinesEl.appendChild(nxtLineEl);
        }

        return traceLinesEl;

    }
}


class TestSummaryImportFailureItem extends HTMLElement {

    static tagname = 'testsummary-import-failure-item'

    static template = `
        <div class='ts-importfailure-item'>
            <mojo-property-table id="id-ts-trace-prop-table">
            </mojo-property-table>
            <testsummary-import-failure-trace id="id-ts-import-trace">
            </testsummary-import-failure-trace>
        </div>
    `

    sel_trace_prop_table = "#id-ts-trace-prop-table"
    sel_trace = "#id-ts-import-trace"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return TestSummaryImportFailureItem.template;
    }

    syncData (importError) {

        var traceProps = {
            "Filename": importError.filename,
            "Module": importError.module
        };

        var trace = importError.trace;

        var propTableEl = this.shadowRoot.querySelector(this.sel_trace_prop_table);
        propTableEl.syncData(traceProps);

        var traceCollEl = this.shadowRoot.querySelector(this.sel_trace);
        traceCollEl.syncData("Trace", trace);
    }

    createTraceContent(trace_lines) {
        trace_lines = trace_lines.reverse();

        var traceLinesEl = document.createElement("div");

        for (var tindex in trace_lines) {
            var titem = trace_lines[tindex];
            var nxtLineEl = document.createElement("pre");
            nxtLineEl.innerHTML = titem;

            traceLinesEl.appendChild(nxtLineEl);
        }

        return traceLinesEl;
    }
}

class TestSummaryArtifacts extends HTMLElement {

    static tagname = 'testsummary-artifacts'

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return TestSummaryArtifacts.template;
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

    static template = `
        <div class="ts-importfailures-card">
            <div class="ts-section-header">
                <h2 class="zero-margins-and-padding">Import Failures</h2>
            </div>
            <div class="ts-section-detail">
                <div id="id-import-failures-list">

                </div>
            </div>
        </div>
    `

    sel_import_failures_list = "#id-import-failures-list"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return TestSummaryImportFailures.template;
    }

    syncData (importFailures) {
        var failuresListEl = this.shadowRoot.querySelector(this.sel_import_failures_list);
        failuresListEl.innerHTML = "";

        for (var idx in importFailures) {
            var failItem = importFailures[idx];
            
            var failItemEl = document.createElement(TestSummaryImportFailureItem.tagname);
            failItemEl.syncData(failItem);
            
            failuresListEl.appendChild(failItemEl);
        }
    }
}


class TestSummaryFilesAndFolders extends HTMLElement {

    static tagname = 'testsummary-filesandfolders'

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return TestSummaryFilesAndFolders.template;
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

    customElements.define(TestSummaryArtifacts.tagname, TestSummaryArtifacts);
    customElements.define(TestSummaryBanner.tagname, TestSummaryBanner);
    customElements.define(TestSummaryConfiguration.tagname, TestSummaryConfiguration);
    customElements.define(TestSummaryConfigurationEnvironment.tagname, TestSummaryConfigurationEnvironment);
    customElements.define(TestSummaryConfigurationLandscape.tagname, TestSummaryConfigurationLandscape);
    customElements.define(TestSummaryConfigurationPackages.tagname, TestSummaryConfigurationPackages);
    customElements.define(TestSummaryDataProfileObject.tagname, TestSummaryDataProfileObject);
    customElements.define(TestSummaryDeviceGroup.tagname, TestSummaryDeviceGroup);
    customElements.define(TestSummaryDeviceObject.tagname, TestSummaryDeviceObject);
    customElements.define(TestSummaryErrorsCollapsible.tagname, TestSummaryErrorsCollapsible);
    customElements.define(TestSummaryExceptionTrace.tagname, TestSummaryExceptionTrace);
    customElements.define(TestSummaryFailuresCollapsible.tagname, TestSummaryFailuresCollapsible);
    customElements.define(TestSummaryFilesAndFolders.tagname, TestSummaryFilesAndFolders);
    customElements.define(TestSummaryImportFailures.tagname, TestSummaryImportFailures);
    customElements.define(TestSummaryImportFailureItem.tagname, TestSummaryImportFailureItem);
    customElements.define(TestSummaryImportFailureTrace.tagname, TestSummaryImportFailureTrace);
    customElements.define(TestSummaryResultGroup.tagname, TestSummaryResultGroup);
    customElements.define(TestSummaryResultItem.tagname, TestSummaryResultItem);
    customElements.define(TestSummaryResultDetail.tagname, TestSummaryResultDetail);
    customElements.define(TestSummaryServiceObject.tagname, TestSummaryServiceObject);
}
