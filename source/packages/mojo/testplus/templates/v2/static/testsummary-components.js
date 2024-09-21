
var templatesLink = document.querySelector( 'link#testsummary-templates' )
var templatesCollection = templatesLink.import

class TestSummaryBanner extends HTMLElement {
    constructor() {
        super();

        const template = templatesCollection.querySelector("#template-testsummary-banner").content;

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.cloneNode(true));

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
            var detailInfo = this.summary["build"];

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

customElements.define("testsummary-banner", TestSummaryBanner);


class TestSummaryConfiguration extends HTMLElement {
    constructor() {
        super();

        const template = templatesCollection.querySelector("#template-testsummary-configuration").content;

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.cloneNode(true));

        this.landscape = {};
        this.packages = {};
        this.environment = {};
    }

    syncData (landscape, packages, environment) {
        this.landscape = landscape;
        this.packages = packages;
        this.environment = environment
    }

}

customElements.define("testsummary-configuration", TestSummaryConfiguration);



class TestSummaryResultDetail extends HTMLElement {
    constructor() {
        super();

        const template = templatesCollection.querySelector("#template-testsummary-resultdetail")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.append(template)
    }

    syncData () {
        
    }
}

customElements.define("testsummary-resultdetail", TestSummaryResultDetail);



class TestSummaryArtifacts extends HTMLElement {
    constructor() {
        super();

        const template = templatesCollection.querySelector("#template-testsummary-artifacts")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.append(template)
    }

    syncData () {
        
    }
}

customElements.define("testsummary-artifacts", TestSummaryArtifacts);



class TestSummaryImportFailures extends HTMLElement {
    constructor() {
        super();

        const template = templatesCollection.querySelector("#template-testsummary-importfailures")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.append(template)
    }

    syncData () {
        
    }
}

customElements.define("testsummary-importfailures", TestSummaryImportFailures);



class TestSummaryFilesAndFolders extends HTMLElement {
    constructor() {
        super();

        const template = templatesCollection.querySelector("#template-testsummary-filesandfolders")

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.append(template)
    }

    syncData () {
        
    }
}

customElements.define("testsummary-filesandfolders", TestSummaryFilesAndFolders);

