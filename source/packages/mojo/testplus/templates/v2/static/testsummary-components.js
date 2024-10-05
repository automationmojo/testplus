/*
    Author: "Myron Walker"
    Copyright: "Copyright 2024, Myron W Walker"
    Version: = "2.0.0"
    Email: myron.walker@gmail.com
*/


let globalSheets = null;


function getGlobalStyleSheets() {
    if (globalSheets === null) {
        globalSheets = Array.from(document.styleSheets)
          .map(x => {
            const sheet = new CSSStyleSheet();
            const css = Array.from(x.cssRules).map(rule => rule.cssText).join(' ');
            sheet.replaceSync(css);
            return sheet;
          });
      }
    
      return globalSheets;
}


function addGlobalStylesToShadowRoot(shadowRoot) {
    shadowRoot.adoptedStyleSheets.push(
        ...getGlobalStyleSheets()
    );
}


class PropertyTable extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-property-table");

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = template.innerHTML;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData(propertiesTable) {
        var gridBodyEl = this.shadowRoot.querySelector("#id-ts-pgrid");
        gridBodyEl.innerHTML = "";

        var propNames = Object.keys(propertiesTable);
        propNames.sort();
        
        if (propNames.length > 0) {
            for (const pindex in propNames) {
                var pname = propNames[pindex];
                var pval = propertiesTable[pname];

                var labelCell = document.createElement("span");
                labelCell.innerHTML = pname;
                labelCell.classList.add("ts-pgrid-label");
                gridBodyEl.appendChild(labelCell);

                var valCell = document.createElement("span");
                valCell.innerHTML = pval
                valCell.classList.add("ts-pgrid-value");
                gridBodyEl.appendChild(valCell);

                var btnCopyEl = document.createElement("button");
                btnCopyEl.classList.add("ts-pgrid-copy");
                var comp = this
                btnCopyEl.innerHTML = "Copy";
                btnCopyEl.onclick = function(e) { comp.copyValue(valCell, e) };

                gridBodyEl.appendChild(btnCopyEl);
            }
        }
    }

    copyValue(valEl, e) {
        var value = valEl.getAttribute("value");
        navigator.clipboard.writeText(value);
    }
}


class TestSummaryBanner extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-banner");

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = template.innerHTML;

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


class TestSummaryConfiguration extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-configuration");

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = template.innerHTML;

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

        if (this.landscape != undefined) {
            var landscapeElement = this.shadowRoot.querySelector("#id-ts-configuration-landscape");
        }

        if (this.command != undefined) {
            var commandElement = this.shadowRoot.querySelector("#id-ts-configuration-command");
            commandElement.innerHTML = "";

            commandElement.syncData({ "Command": this.command });
        }

        if (this.environment != undefined) {
            var environmentElement = this.shadowRoot.querySelector("#id-ts-configuration-environment");
            environmentElement.innerHTML = "";

            environmentElement.syncData(this.environment);
        }

        if (this.packages != undefined) {
            var packagesElement = this.shadowRoot.querySelector("#id-ts-configuration-packages");
            packagesElement.innerHTML = "";

            packagesElement.syncData(this.packages);
        }

    }

    refreshCommand() {

    }

    refreshEnvironment() {

    }

    refreshLandscape() {

    }

    refreshPackages() {

    }

}


class TestSummaryResultGroup extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-resultgroup")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = template.innerHTML;

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
        if (errored > 1) {
            grpErrorEl.classList.add("color-error");
        } else {
            grpErrorEl.classList.add("color-ghost");
        }
        grpErrorEl.innerHTML = errored.toString();

        var grpFailEl = this.shadowRoot.querySelector("#id-rgs-failure");
        if (failed > 1) {
            grpFailEl.classList.add("color-fail");
        } else {
            grpFailEl.classList.add("color-ghost");
        }
        grpFailEl.innerHTML = failed.toString();

        var grpSkipEl = this.shadowRoot.querySelector("#id-rgs-skip");
        if (skipped > 1) {
            grpSkipEl.classList.add("color-skip");
        } else {
            grpSkipEl.classList.add("color-ghost");
        }
        grpSkipEl.innerHTML = skipped.toString();

        var grpPassEl = this.shadowRoot.querySelector("#id-rgs-pass");
        if (passed > 1) {
            grpPassEl.classList.add("color-pass");
        } else {
            grpPassEl.classList.add("color-ghost");
        }
        grpPassEl.innerHTML = passed.toString();

    }
}


class TestSummaryResultItem extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-resultitem")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = template.innerHTML;

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
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-testresults")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = template.innerHTML;

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
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-artifacts")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = template.innerHTML;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData () {
        
    }
}


class TestSummaryImportFailures extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-importfailures")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = template.innerHTML;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData () {
        
    }
}


class TestSummaryFilesAndFolders extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-filesandfolders")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = template.innerHTML;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    syncData () {
        
    }
}


function register_summary_components() {
    customElements.define("property-table", PropertyTable);
    customElements.define("testsummary-banner", TestSummaryBanner);
    customElements.define("testsummary-configuration", TestSummaryConfiguration);
    customElements.define("testsummary-resultgroup", TestSummaryResultGroup);
    customElements.define("testsummary-resultitem", TestSummaryResultItem);
    customElements.define("testsummary-resultdetail", TestSummaryResultDetail);
    customElements.define("testsummary-artifacts", TestSummaryArtifacts);
    customElements.define("testsummary-importfailures", TestSummaryImportFailures);
    customElements.define("testsummary-filesandfolders", TestSummaryFilesAndFolders);
}
