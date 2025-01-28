/*
    Author: "Myron Walker"
    Copyright: "Copyright 2024, Myron W Walker"
    Version: = "2.0.0"
    Email: myron.walker@gmail.com
*/


let mojoComponentsRegistered = false;

class MojoIconTarget extends HTMLElement {
    static tagname = 'mojo-icon-target'

    static template = `
        <div id="id-icon-target" class="mojo-icon-target">
            <icon-question-mark></icon-question-mark>
        </div>
    `

    sel_container = "#id-icon-target"
    sel_tooltip = "#id-tooltip"

    static observedAttributes = ["tooltip"];

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = this.getTemplate();
        if (this.classList.length > 0) {
            shadowRoot.classList = this.classList;
        }

        addGlobalStylesToShadowRoot(shadowRoot);

        var containerEl =  this.shadowRoot.querySelector(this.sel_container);

        var tooltip = this.getAttribute("tooltip");
        if (tooltip != undefined) {
            this.update_tooltip(containerEl, tooltip);
        }
        
        if (this.innerHTML.trim().length > 0) {
            containerEl.innerHTML = this.innerHTML;    
        }

        var thisComp = this;

        containerEl.addEventListener("mousedown", (event) => { thisComp.mouse_down(event) });
        containerEl.addEventListener("mouseleave", (event) => { thisComp.mouse_leave(event) });
        containerEl.addEventListener("mouseup", (event) => { thisComp.mouse_up(event) });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "tooltip") {
            var containerEl =  this.shadowRoot.querySelector(this.sel_container);

            this.update_tooltip(containerEl, newValue);
        }
    }

    getTemplate() {
        return MojoIconTarget.template;
    }

    mouse_down(event) {
        var thisStyle = getComputedStyle(this);

        var fillColor = thisStyle.getPropertyValue("fill");
        var backgroundColor = thisStyle.getPropertyValue("background-color");

        var containerEl =  this.shadowRoot.querySelector(this.sel_container);

        containerEl.style.fill = backgroundColor;
        containerEl.style.backgroundColor = fillColor;
    }

    mouse_leave(event) {
        var containerEl =  this.shadowRoot.querySelector(this.sel_container);

        containerEl.style.fill = "";
        containerEl.style.backgroundColor = "";
    }

    mouse_up(event) {
        var containerEl =  this.shadowRoot.querySelector(this.sel_container);

        containerEl.style.fill = "";
        containerEl.style.backgroundColor = "";
    }

    update_tooltip(containerEl, tooltip) {

        var ttEl = containerEl.querySelector(this.sel_tooltip);

        if (tooltip.trim().length == 0) {
            containerEl.classList.remove("mojo-tooltip");

            if (ttEl != undefined) {
                containerEl.removeChild(ttEl);
            }
        } else {
            if (ttEl == undefined) {
                ttEl = document.createElement("span");

                ttEl.setAttribute("id", "id-tooltip");
                ttEl.classList.add("mojo-tooltip-text");

                containerEl.appendChild(ttEl);
            }

            containerEl.classList.add("mojo-tooltip");
            ttEl.innerHTML = tooltip;
        }
    
    }

}


class MojoCollapsible extends HTMLElement {

    static tagname = 'mojo-collapsible'

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);

        var buttonEl =  this.shadowRoot.querySelector(this.sel_button)
        var thisComp = this;

        buttonEl.addEventListener("click", (event) => { thisComp.toggle(event) });
    }

    getTemplate() {
        return MojoCollapsible.template;
    }

    syncData(header, content, expanded) {
        var headerTextEl =  this.shadowRoot.querySelector(this.sel_header_text);
        headerTextEl.innerHTML = header;

        var contentEl =  this.shadowRoot.querySelector(this.sel_content);

        if (content != undefined) {
            contentEl.innerHTML = "";

            if (content instanceof HTMLElement) {
                contentEl.appendChild(content);
            } else {
                contentEl.innerHTML = content;
            }
        }

        if (expanded) {
            contentEl.style.display = "";
        } else {
            contentEl.style.display = "none";
        }

        this.updateIconContent(contentEl);
    }

    toggle (event) {
        var contentEl =  this.shadowRoot.querySelector(this.sel_content);

        if (contentEl.style.display == "none") {
            contentEl.style.display = "";
        } else {
            contentEl.style.display = "none";
        }

        this.updateIconContent(contentEl);
    }

    updateIconContent (contentEl) {
        var iconEl = this.shadowRoot.querySelector(this.sel_header_icon);

        if (contentEl.style.display != "none") {
            iconEl.innerHTML = "<icon-minus-sign></icon-minus-sign>";
        } else {
            iconEl.innerHTML = "<icon-plus-sign></icon-plus-sign>";
        }
    }

}

class MojoCollapsibleLvl2 extends MojoCollapsible {

    static tagname = 'mojo-collapsible-lvl2'

    static template = `
        <div id="id-collapsible-container" class="mojo-collapsible-lvl2" >
            <div id="id-collapsible-button" class="mojo-collapsible-lvl2-button">
                <div id="id-header-text" class="mojo-collapsible-lvl2-header"></div>
                <div id="id-header-icon" class="mojo-collapsible-lvl2-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="mojo-collapsible-lvl2-content">
            </div>
        </div>
    `

    constructor() {
        super();
    }

    getTemplate() {
        return MojoCollapsibleLvl2.template;
    }

}

class MojoCollapsibleLvl3 extends MojoCollapsible {

    static tagname = 'mojo-collapsible-lvl3'

    static template = `
        <div id="id-collapsible-container" class="mojo-collapsible-lvl3" >
            <div id="id-collapsible-button" class="mojo-collapsible-lvl3-button">
                <div id="id-header-text" class="mojo-collapsible-lvl3-header"></div>
                <div id="id-header-icon" class="mojo-collapsible-lvl3-icon">+</div>
            </div>
            <div id="id-collapsible-content" class="mojo-collapsible-lvl3-content">
            </div>
        </div>
    `

    constructor() {
        super();
    }

    getTemplate() {
        return MojoCollapsibleLvl2.template;
    }

}


class MojoProjectTimeline extends HTMLElement {

    static tagname = "mojo-project-timeline"

    static template = `
        <div class="mojo-project-timeline">
        </div>
    `

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);

        var thisComp = this;

        copyEl.addEventListener("mousedown", (event) => { thisComp.mouse_down(event) });
        copyEl.addEventListener("mouseleave", (event) => { thisComp.mouse_leave(event) });
        copyEl.addEventListener("mouseup", (event) => { thisComp.mouse_up(event) });
    }

    getTemplate() {
        return MojoProjectTimeline.template;
    }

    mouse_down(event) {
        
    }

    mouse_leave(event) {
        
    }

    mouse_up(event) {
        
    }

    syncData(projectInfo) {
        
    }

}


class MojoPropertySingle extends HTMLElement {

    static tagname = "mojo-property-single"

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);

        var copyEl = this.shadowRoot.querySelector(this.sel_copy);
        var valueEl = this.shadowRoot.querySelector(this.sel_value);
        
        copyEl.onclick = function(e) { comp.copyValue(valueEl, e) };

        var thisComp = this;

        copyEl.addEventListener("mousedown", (event) => { thisComp.mouse_down(event, copyEl) });
        copyEl.addEventListener("mouseleave", (event) => { thisComp.mouse_leave(event, copyEl) });
        copyEl.addEventListener("mouseup", (event) => { thisComp.mouse_up(event, copyEl) });
    }

    getTemplate() {
        return MojoPropertySingle.template;
    }

    copyValue(valueEl, e) {

        var value = valueEl.innerHTML;
        navigator.clipboard.writeText(value);

    }

    mouse_down(event, copyEl) {
        var thisStyle = getComputedStyle(copyEl);

        var fillColor = thisStyle.getPropertyValue("fill");
        var backgroundColor = thisStyle.getPropertyValue("background-color");

        copyEl.style.fill = backgroundColor;
        copyEl.style.backgroundColor = fillColor;
    }

    mouse_leave(event, copyEl) {
        copyEl.style.fill = "";
        copyEl.style.backgroundColor = "";
    }

    mouse_up(event, copyEl) {
        copyEl.style.fill = "";
        copyEl.style.backgroundColor = "";
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

    static template = `
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
        shadowRoot.innerHTML = this.getTemplate();

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

        var value = valEl.innerHTML;
        navigator.clipboard.writeText(value);

    }
    
    createPropertyCopy(valEl) {

        var thisComp = this;

        var copyEl = document.createElement("div");
        copyEl.classList = this.default_classes_item_copy;
        copyEl.innerHTML = '<icon-copy></icon-copy>';
        
        copyEl.onclick = function(e) { comp.copyValue(valEl, e) };

        copyEl.addEventListener("mousedown", (event) => { thisComp.mouse_down(event, copyEl) });
        copyEl.addEventListener("mouseleave", (event) => { thisComp.mouse_leave(event, copyEl) });
        copyEl.addEventListener("mouseup", (event) => { thisComp.mouse_up(event, copyEl) });

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

    getTemplate() {
        return MojoPropertyTable.template;
    }

    mouse_down(event, copyEl) {
        var thisStyle = getComputedStyle(copyEl);

        var fillColor = thisStyle.getPropertyValue("fill");
        var backgroundColor = thisStyle.getPropertyValue("background-color");

        copyEl.style.fill = backgroundColor;
        copyEl.style.backgroundColor = fillColor;
    }

    mouse_leave(event, copyEl) {
        copyEl.style.fill = "";
        copyEl.style.backgroundColor = "";
    }

    mouse_up(event, copyEl) {
        copyEl.style.fill = "";
        copyEl.style.backgroundColor = "";
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

class MojoTabLabel extends HTMLElement {
    static tagname = "mojo-tab-label";

    static observedAttributes = ["selected"]

    static template = `
        <div id="id-tab-label-container" class="mojo-tab-label-container">
        </div>
    `

    sel_container = "#id-tab-label-container"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return MojoTabLabel.template;
    }

    syncData(label) {
        var containertEl =  this.shadowRoot.querySelector(this.sel_container);
        containertEl.innerHTML = "";

        if (label instanceof HTMLElement) {
            containertEl.appendChild(label);
        } else {
            containertEl.innerHTML = "<span>" + label + "</span>";
        }
    }
}


class MojoTabContent extends HTMLElement {
    static tagname = "mojo-tab-content";

    static observedAttributes = ["selected"]

    static template = `
        <div id="id-tab-content-container" class="mojo-tab-content-container">
        </div>
    `

    sel_container = "#id-tab-content-container"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);
    }

    getTemplate() {
        return MojoTabContent.template;
    }

    syncData(content) {
        var containertEl =  this.shadowRoot.querySelector(this.sel_container);
        containertEl.innerHTML = "";

        if (content instanceof HTMLElement) {
            containertEl.appendChild(content);
        } else {
            containertEl.innerHTML = content;
        }
    }
}


class MojoTabPage {

    constructor(key, label, content) {
        this.key = key;
        this.label = label;
        this.content = content;

        this.labelEl = undefined;
        this.contentEl = undefined;
    }

    createContentElement() {

        var contentEl = document.createElement("mojo-tab-content");

        contentEl.classList.add("mojo-tab-content");
        contentEl.syncData(this.content);

        this.contentEl = contentEl;

        return contentEl;

    }

    createLabelElement() {

        var labelEl = document.createElement("mojo-tab-label");
        
        labelEl.classList.add("mojo-tab-label");
        labelEl.syncData(this.label);
        
        this.labelEl = labelEl;

        return labelEl;

    }

    createTabElements() {
        var labelEl = this.createLabelElement();
        var contentEl = this.createContentElement();

        return [labelEl, contentEl];
    }

    disposeTabElements() {
        this.labelEl.remove();
        this.contentEl.remove();
    }

    updateSelected(selected) {
        if (selected) {
            this.contentEl.setAttribute("selected", selected);
            this.labelEl.setAttribute("selected", selected);
        } else {
            this.contentEl.removeAttribute("selected");
            this.labelEl.removeAttribute("selected");
        }
    }

}


class MojoTabSet extends HTMLElement {

    static tagname = "mojo-tabset";

    static template = `
        <div id="id-tabset-container" class="mojo-tabset">
            <div id="id-tabset-labels-collection" class="mojo-tabset-label-collection">
            </div>
            <div id="id-tabset-content-collection" class="mojo-tabset-content-collection">
            </div>
        </div>
    `

    sel_container = "#id-tabset-container"
    sel_labels = "#id-tabset-labels-collection"
    sel_content = "#id-tabset-content-collection"

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.getTemplate();

        addGlobalStylesToShadowRoot(shadowRoot);

        this.pages = undefined;
        this.selected = undefined;
    }

    getTemplate() {
        return MojoTabSet.template;
    }

    scrubOldPages() {

    }

    syncData(tabPages) {

        var labelsCollEl = this.shadowRoot.querySelector(this.sel_labels);
        var contentCollEl = this.shadowRoot.querySelector(this.sel_content);

        this.scrubOldPages();

        if (tabPages.length > 0) {

            var tabsetComp = this;

            this.pages = {}

            for (const tindex in tabPages) {
                const tpage = tabPages[tindex];

                const [labelEl, contentEl] = tpage.createTabElements();

                labelEl.onclick = function(e) {
                    tabsetComp.tabClick(tpage, e)
                };

                this.pages[tpage.key] = tpage;

                labelsCollEl.appendChild(labelEl);
                contentCollEl.appendChild(contentEl);
            }

            this.selected = tabPages[0].key;
        }

        this.switchToSelected()

    }

    switchToSelected() {
        var pageKeys = Object.keys(this.pages);

        if (pageKeys.length > 0) {

            for (const pki in pageKeys) {
                var pkey = pageKeys[pki];
                var page = this.pages[pkey];
                page.updateSelected(pkey == this.selected);
            }

        }

    }

    tabClick(tpage, event) {
        this.selected = tpage.key;
        this.switchToSelected();
    }
}



function register_mojo_components() {

    register_icon_components()

    if (!mojoComponentsRegistered) {
        mojoComponentsRegistered = true;

        customElements.define(MojoCollapsible.tagname, MojoCollapsible);
        customElements.define(MojoCollapsibleLvl2.tagname, MojoCollapsibleLvl2);
        customElements.define(MojoCollapsibleLvl3.tagname, MojoCollapsibleLvl3);
        customElements.define(MojoIconTarget.tagname, MojoIconTarget);
        customElements.define(MojoProjectTimeline.tagname, MojoProjectTimeline);
        customElements.define(MojoPropertySingle.tagname, MojoPropertySingle);
        customElements.define(MojoPropertyTable.tagname, MojoPropertyTable);
        customElements.define(MojoTabSet.tagname, MojoTabSet);
        customElements.define(MojoTabContent.tagname, MojoTabContent);
        customElements.define(MojoTabLabel.tagname, MojoTabLabel);
    }

}

