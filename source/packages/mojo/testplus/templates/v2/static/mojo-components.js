/*
    Author: "Myron Walker"
    Copyright: "Copyright 2024, Myron W Walker"
    Version: = "2.0.0"
    Email: myron.walker@gmail.com
*/


let mojoComponentsRegistered = false;


class MojoIconTarget extends HTMLElement {
    static tagname = 'mojo-icon-target'

    template = `
        <div id="id-icon-target" class="mojo-icon-target">
            <icon-question-mark></icon-question-mark>
        </div>
    `

    sel_container = "#id-icon-target"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        var containerEl =  this.shadowRoot.querySelector(this.sel_container);
        var thisComp = this;

        containerEl.addEventListener("mousedown", (event) => { thisComp.mouse_down(event) });
        containerEl.addEventListener("mouseup", (event) => { thisComp.mouse_up(event) });
    }

    mouse_down(event) {
        var thisStyle = getComputedStyle(this);

        var fillColor = thisStyle.getPropertyValue("fill");
        var backgroundColor = thisStyle.getPropertyValue("background-color");

        var containerEl =  this.shadowRoot.querySelector(this.sel_container);

        containerEl.style.fill = backgroundColor;
        containerEl.style.backgroundColor = fillColor;
    }

    mouse_up(event) {
        var containerEl =  this.shadowRoot.querySelector(this.sel_container);

        containerEl.style.fill = "";
        containerEl.style.backgroundColor = "";
    }

}


class MojoCollapsible extends HTMLElement {

    static tagname = 'mojo-collapsible'

    template = `
        <div id="id-collapsible-container" class="mojo-collapsible" >
            <div id="id-collapsible-button" class="mojo-collapsible-button">
                <div id="id-header-text" class="mojo-collapsible-header"></div>
                <div id="id-header-icon" class="mojo-collapsible-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="mojo-collapsible-content">
            </div>
        </div>
    `

    sel_container = "#id-collapsible-container"
    sel_button = "#id-collapsible-button"
    sel_header_text = "#id-header-text"
    sel_header_icon = "#id-header-icon"
    sel_content = "#id-collapsible-content"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);

        var buttonEl =  this.shadowRoot.querySelector(this.sel_button)
        var thisComp = this;

        buttonEl.addEventListener("click", (event) => { thisComp.toggle(event) });

    }

    syncData(header, content, expanded) {
        var headerTextEl =  this.shadowRoot.querySelector(this.sel_header_text);
        headerTextEl.innerHTML = header;
        
        var contentEl =  this.shadowRoot.querySelector(this.sel_content);
        contentEl.innerHTML = content;

        if (expanded) {
            contentEl.style.display = "block";
        } else {
            contentEl.style.display = "none";
        }

        this.updateIconContent(contentEl);
    }

    toggle (event) {
        var contentEl =  this.shadowRoot.querySelector(this.sel_content);

        if (contentEl.style.display == "none") {
            contentEl.style.display = "block";
        } else {
            contentEl.style.display = "none";
        }

        this.updateIconContent(contentEl);
    }

    updateIconContent (contentEl) {
        var iconEl = this.shadowRoot.querySelector(this.sel_header_icon);

        if (contentEl.style.display != "none") {
            iconEl.innerHTML = "-";
        } else {
            iconEl.innerHTML = "+";
        }
    }

}


class MojoPropertySingle extends HTMLElement {

    static tagname = "mojo-property-single"

    template = `
        <div id="id-property-single-container" class="mojo-prop-single">
            <div id="id-property-single-label" class="mojo-prop-single-label"></div>
            <div id="id-property-single-value" class="mojo-prop-single-value"></div>
            <div id="id-property-single-copy" class="mojo-prop-single-copy"><icon-copy></icon-copy></div>
        </div>
    `

    default_classes_container = ["mojo-prop-single"]
    default_classes_copy = ["mojo-prop-single-copy"]
    default_classes_label = ["mojo-prop-single-label"]
    default_classes_value = ["mojo-prop-single-value"]

    sel_copy = "#id-property-single-copy"
    sel_label = "#id-property-single-label"
    sel_value = "#id-property-single-value"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    copyValue(valEl, e) {

        var value = valEl.getAttribute("value");
        navigator.clipboard.writeText(value);

    }

    syncData(label, value) {
        var labelEl = this.shadowRoot.querySelector(this.sel_label);
        var valueEl = this.shadowRoot.querySelector(this.sel_value);

        labelEl.innerHTML = label;
        valueEl.innerHTML = value;
    }

}


class MojoPropertyTable extends HTMLElement {

    static tagname = "mojo-property-table";

    template = `
        <div id="id-property-table-container" class="mojo-prop-table">
        </div>
    `

    default_classes_container = ["mojo-prop-table"]
    default_classes_item_copy = ["mojo-prop-table-item-copy"]
    default_classes_item_label = ["mojo-prop-table-item-label"]
    default_classes_item_value = ["mojo-prop-table-item-value"]

    sel_container = "#id-property-table-container"

    static observedAttributes = ["grid-class", "item-copy-class", "item-label-class", "item-value-class"]

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    attributeChangedCallback(name, oldValue, newValue) {

        var containerEl = this.shadowRoot.querySelector(this.sel_container);

        if (name == "grid-class") {
            containerEl.classList = newValue;
        
        } else if ((name == "item-copy-class") || (name == "item-label-class") || (name == "item-value-class")) {

            var columnIndex = 0;
            if (name == "item-copy-class") {
                columnIndex = 2;
            } else if (name == "item-value-class") {
                columnIndex = 1;
            }

            var cindex = 0;
            for (childEl in containerEl.childNodes) {
                
                if ((cindex % 3) == columnIndex) {
                    childEl.classList = newValue;
                }

                cindex += 1;
            }

        }

    }

    copyValue(valEl, e) {

        var value = valEl.getAttribute("value");
        navigator.clipboard.writeText(value);

    }
    
    createPropertyCopy(valEl) {

        var thisComp = this;

        var copyEl = document.createElement("div");
        copyEl.classList = this.default_classes_item_copy;
        copyEl.innerHTML = '<icon-copy></icon-copy>';
        copyEl.onclick = function(e) { comp.copyValue(valEl, e) };

        return copyEl;
    }

    createPropertyLabel(plabel) {

        var labelEl = document.createElement("span");
        labelEl.innerHTML = plabel;
        labelEl.classList = this.default_classes_item_label;
        return labelEl;

    }

    createPropertyValue(pval) {

        var valueEl = document.createElement("span");
        valueEl.innerHTML = pval;
        valueEl.classList = this.default_classes_item_value;
        return valueEl;

    }
      
    syncData(propertiesTable) {

        var containerEl = this.shadowRoot.querySelector(this.sel_container);
        containerEl.innerHTML = "";

        var propNames = Object.keys(propertiesTable);
        propNames.sort();
        
        if (propNames.length > 0) {

            for (const pindex in propNames) {
                var plabel = propNames[pindex];
                var pval = propertiesTable[plabel];

                var labelEl = this.createPropertyLabel(plabel);
                containerEl.appendChild(labelEl);

                var valEl = this.createPropertyValue(pval);
                containerEl.appendChild(valEl);

                var copyEl = this.createPropertyCopy(valEl);
                
                containerEl.appendChild(copyEl);
            }

        }

    }

}


function register_mojo_components() {

    register_icon_components()

    if (!mojoComponentsRegistered) {
        mojoComponentsRegistered = true;

        customElements.define(MojoCollapsible.tagname, MojoCollapsible);
        customElements.define(MojoIconTarget.tagname, MojoIconTarget);
        customElements.define(MojoPropertySingle.tagname, MojoPropertySingle);
        customElements.define(MojoPropertyTable.tagname, MojoPropertyTable);
    }

}

