/*
    Author: "Myron Walker"
    Copyright: "Copyright 2024, Myron W Walker"
    Version: = "2.0.0"
    Email: myron.walker@gmail.com
*/

let iconComponentsRegistered = false;

class IconBase extends HTMLElement {
    constructor(template) {
        super();
    }

    initializeShadow(template) {
        const shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.innerHTML = template;

        addGlobalStylesToShadowRoot(shadowRoot);
    }
}

class IconCopy extends IconBase {

    static tagname = 'icon-copy'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconQuestionMark extends IconBase {

    static tagname = 'icon-question-mark'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

function register_icon_components() {

    if (!iconComponentsRegistered) {
        iconComponentsRegistered = true;

        customElements.define(IconCopy.tagname, IconCopy);
        customElements.define(IconQuestionMark.tagname, IconQuestionMark);
    }

}

