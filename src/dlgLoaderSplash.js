/* global sgv, UI */

/**
 * @class
 * @classdesc Represents the DlgLoaderSplash class.
 * @memberof sgv
 */
class DlgLoaderSplash {
    constructor() {
        // UI element that will contain the splash screen
        this.ui = null;
        // Information element that will display messages on the splash screen
        this.info;
    }

    /**
     * Creates the splash screen dialog.
     * @returns {undefined}
     */
    createDialog() {
        // If the ui element is not already created
        if (this.ui===null) {
            // Create a new "dialog" HTML element with the specified properties and assign it to "ui"
            this.ui = UI.tag( "dialog", { "class": "sgvModalDialog", "id": "loaderSplash" });
        }

        // Append several child elements to the ui element
        this.ui.appendChild(UI.tag('span',{},{'textContent':'working hard for you'}));
        this.ui.appendChild(UI.tag('div',{'class':'loader'}));
        this.ui.appendChild(UI.tag('span',{},{'textContent':'... please wait ...'}));
        
        // Append child element and assign the 'info' variable to a new 'div' HTML element with the specified properties
        this.ui.appendChild(this.info = UI.tag('div',{'id':'infoBlock'}));

        // Set the display property of the ui element to "none"
        this.ui.style.display = "none";
        // Append the ui element to the body of the window document
        window.document.body.appendChild(this.ui);
    }

    /**
     * Displays the splash screen dialog.
     * @returns {undefined}
     */
    show() {
        if (this.ui===null) this.createDialog();
        if (this.ui.open) this.ui.close();
        this.info.innerHTML = "";
        this.ui.style.display = "block";
        this.ui.showModal();
    }

    /**
     * Hides the splash screen dialog.
     * @returns {undefined}
     */
    hide() {
        this.ui.close();
        this.ui.style.display = "none";
    }

    /**
     * Sets information text to display in the splash screen and optionally runs a function.
     * @param {string} text - The information text to display.
     * @param {Function} action - The function to run after setting the information text.
     * @returns {undefined}
     */
    setInfo(text,action) {
        if (this.ui.open) this.ui.close();
            this.ui.style.display = "block";
        this.ui.showModal();
        this.info.innerHTML = text;
        // If the action parameter is a function
        if (typeof action==='function'){
            // Set a timeout to run the function after a delay of 100 milliseconds
            setTimeout( ()=>{
                action();
            }, 100);
        }
    };
}

/**
 * Represents the static instance of DlgLoaderSplash in the sgv namespace.
 * @type {DlgLoaderSplash}
 * @memberof sgv
 * @static
 */
sgv.dlgLoaderSplash = new DlgLoaderSplash();


/**
 * Shows the splash screen.
 * @returns {undefined}
 */
function  showSplash() {
    sgv.dlgLoaderSplash.show();
};

/**
 * Hides the splash screen after a delay of 200 milliseconds.
 * @returns {undefined}
 */
function hideSplash() {
    setTimeout(function () {
        sgv.dlgLoaderSplash.hide();
    }, 200);
};

/**
 * Shows the splash screen, runs a specified function after a delay of 100 milliseconds, and optionally hides the splash screen.
 * @param {Function} f - The function to run.
 * @param {boolean} [noHide=false] - Whether to not hide the splash screen after running the function.
 * @returns {undefined}
 */
function showSplashAndRun(f,noHide) {
    if (typeof noHide==='undefined')
        noHide = false;
    
    showSplash();
    setTimeout(()=>{
        f();
        if (!noHide) hideSplash();
    }, 100);
};
