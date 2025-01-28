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


class IconBug extends IconBase {

    static tagname = 'icon-bug'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M480-200q66 0 113-47t47-113v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160q0 66 47 113t113 47Zm-80-120h160v-80H400v80Zm0-160h160v-80H400v80Zm80 40Zm0 320q-65 0-120.5-32T272-240H160v-80h84q-3-20-3.5-40t-.5-40h-80v-80h80q0-20 .5-40t3.5-40h-84v-80h112q14-23 31.5-43t40.5-35l-64-66 56-56 86 86q28-9 57-9t57 9l88-86 56 56-66 66q23 15 41.5 34.5T688-640h112v80h-84q3 20 3.5 40t.5 40h80v80h-80q0 20-.5 40t-3.5 40h84v80H688q-32 56-87.5 88T480-120Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconCopy extends IconBase {

    static tagname = 'icon-copy'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconDeviceUnknown extends IconBase {

    static tagname = 'icon-device-unknown'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M480-280q-17 0-29.5-12.5T438-322q0-17 12.5-29.5T480-364q17 0 29.5 12.5T522-322q0 17-12.5 29.5T480-280Zm-30-128q0-46 7.5-63t42.5-47q14-14 24-27.5t10-30.5q0-18-13.5-32T480-622q-27 0-41 15.5T420-574l-54-22q12-35 41-59.5t73-24.5q47 0 80.5 25.5T594-578q0 24-12 45t-30 39q-30 30-36 42t-6 44h-60ZM280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-120v40h400v-40H280Zm0-80h400v-480H280v480Zm0-560h400v-40H280v40Zm0 0v-40 40Zm0 640v40-40Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconError extends IconBase {

    static tagname = 'icon-error'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconFile extends IconBase {

    static tagname = 'icon-file'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconFilter extends IconBase {

    static tagname = 'icon-filter'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconFolder extends IconBase {

    static tagname = 'icon-folder'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconFolderCode extends IconBase {

    static tagname = 'icon-folder-code'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M160-240v-480 520-40Zm0 80q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v200h-80v-200H447l-80-80H160v480h200v80H160ZM584-56 440-200l144-144 56 57-87 87 87 87-56 57Zm192 0-56-57 87-87-87-87 56-57 144 144L776-56Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconFolderData extends IconBase {

    static tagname = 'icon-folder-data'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M600-40q-33 0-56.5-23.5T520-120q0-23 11-41t29-29v-221q-18-11-29-28.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 23-11 40.5T640-411v115l160-53v-62q-18-11-29-28.5T760-480q0-33 23.5-56.5T840-560q33 0 56.5 23.5T920-480q0 23-11 40.5T880-411v119l-240 80v22q18 11 29 29t11 41q0 33-23.5 56.5T600-40ZM160-160v-560 560Zm0 0q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480h280v80H160Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconFolderEye extends IconBase {

    static tagname = 'icon-folder-eye'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v242q-18-14-38-23t-42-19v-200H447l-80-80H160v480h120v80H160ZM640-40q-91 0-168-48T360-220q35-84 112-132t168-48q91 0 168 48t112 132q-35 84-112 132T640-40Zm0-80q57 0 107.5-26t82.5-74q-32-48-82.5-74T640-320q-57 0-107.5 26T450-220q32 48 82.5 74T640-120Zm0-40q-25 0-42.5-17.5T580-220q0-25 17.5-42.5T640-280q25 0 42.5 17.5T700-220q0 25-17.5 42.5T640-160Zm-480-80v-480 277-37 240Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconFolderManaged extends IconBase {

    static tagname = 'icon-folder-managed'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="m680-80-12-60q-12-5-22.5-10.5T624-164l-58 18-40-68 46-40q-2-12-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T668-420l12-60h80l12 60q12 5 22.5 10.5T816-396l58-18 40 68-46 40q2 12 2 26t-2 26l46 40-40 68-58-18q-11 8-21.5 13.5T772-140l-12 60h-80Zm40-120q33 0 56.5-23.5T800-280q0-33-23.5-56.5T720-360q-33 0-56.5 23.5T640-280q0 33 23.5 56.5T720-200Zm-560-40v-480 172-12 320Zm0 80q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v131q-18-13-38-22.5T800-548v-92H447l-80-80H160v480h283q3 21 9.5 41t15.5 39H160Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconMinusSign extends IconBase {

    static tagname = 'icon-minus-sign'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M200-440v-80h560v80H200Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconNoteAdd extends IconBase {

    static tagname = 'icon-note-add'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M440-240h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconNoteStack extends IconBase {

    static tagname = 'icon-note-stack'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M280-160v-441q0-33 24-56t57-23h439q33 0 56.5 23.5T880-600v320L680-80H360q-33 0-56.5-23.5T280-160ZM81-710q-6-33 13-59.5t52-32.5l434-77q33-6 59.5 13t32.5 52l10 54h-82l-7-40-433 77 40 226v279q-16-9-27.5-24T158-276L81-710Zm279 110v440h280v-160h160v-280H360Zm220 220Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconPlusSign extends IconBase {

    static tagname = 'icon-plus-sign'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconSearch extends IconBase {

    static tagname = 'icon-search'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconSettings extends IconBase {

    static tagname = 'icon-settings'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconTabletAndroid extends IconBase {

    static tagname = 'icon-tablet-android'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="M200-40q-33 0-56.5-23.5T120-120v-720q0-33 23.5-56.5T200-920h560q33 0 56.5 23.5T840-840v720q0 33-23.5 56.5T760-40H200Zm0-200v120h560v-120H200Zm200 80h160v-40H400v40ZM200-320h560v-400H200v400Zm0-480h560v-40H200v40Zm0 0v-40 40Zm0 560v120-120Z"/>
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  class="icon-component-style">
            <path d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"/>
        </svg>
    `
    constructor() {
        super();
        this.initializeShadow(this.template);
    }
}

class IconWarning extends IconBase {

    static tagname = 'icon-warning'

    template = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-component-style">
            <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/>
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

        customElements.define(IconBug.tagname, IconBug);
        customElements.define(IconCopy.tagname, IconCopy);
        customElements.define(IconDeviceUnknown.tagname, IconDeviceUnknown);
        customElements.define(IconError.tagname, IconError);
        customElements.define(IconFile.tagname, IconFile);
        customElements.define(IconFilter.tagname, IconFilter);
        customElements.define(IconFolder.tagname, IconFolder);
        customElements.define(IconFolderCode.tagname, IconFolderCode);
        customElements.define(IconFolderData.tagname, IconFolderData);
        customElements.define(IconFolderEye.tagname, IconFolderEye);
        customElements.define(IconFolderManaged.tagname, IconFolderManaged);
        customElements.define(IconMinusSign.tagname, IconMinusSign);
        customElements.define(IconPlusSign.tagname, IconPlusSign);
        customElements.define(IconNoteAdd.tagname, IconNoteAdd);
        customElements.define(IconNoteStack.tagname, IconNoteStack);
        customElements.define(IconSearch.tagname, IconSearch);
        customElements.define(IconSettings.tagname, IconSettings);
        customElements.define(IconTabletAndroid.tagname, IconTabletAndroid);
        customElements.define(IconQuestionMark.tagname, IconQuestionMark);
        customElements.define(IconWarning.tagname, IconWarning);
    }

}

