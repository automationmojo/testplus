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

            var commandDetail = this.shadowRoot.createElement("detail");
            commandElement.appendChild(commandDetail);

            var commandSummary = this.shadowRoot.createElement("summary");
            commandSummary.innerHTML = "<div>Command</div>";
            commandDetail.appendChild(commandSummary);
        }

        if (this.environment != undefined) {
            var environmentElement = this.shadowRoot.querySelector("#id-ts-configuration-environment");
        }

        if (this.packages != undefined) {
            var packagesElement = this.shadowRoot.querySelector("#id-ts-configuration-packages");
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


class TestSummaryResultDetail extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-resultdetail")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.append(template)
    }

    syncData () {
        
    }
}


class TestSummaryArtifacts extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-artifacts")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.append(template)
    }

    syncData () {
        
    }
}


class TestSummaryImportFailures extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-importfailures")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.append(template)
    }

    syncData () {
        
    }
}


class TestSummaryFilesAndFolders extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("#template-testsummary-filesandfolders")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.append(template)
    }

    syncData () {
        
    }
}


function register_summary_components() {
    customElements.define("testsummary-banner", TestSummaryBanner);
    customElements.define("testsummary-configuration", TestSummaryConfiguration);
    customElements.define("testsummary-resultdetail", TestSummaryResultDetail);
    customElements.define("testsummary-artifacts", TestSummaryArtifacts);
    customElements.define("testsummary-importfailures", TestSummaryImportFailures);
    customElements.define("testsummary-filesandfolders", TestSummaryFilesAndFolders);
}
