/* global sgv, UI */

// The object sgv.dlgLoaderSplash is used to handle the display and functionality of a splash screen
sgv.dlgLoaderSplash = new function() {
    // UI element that will contain the splash screen
    var ui = null;
    // Information element that will display messages on the splash screen
    var info;
    
    /**
     * Creates the splash screen dialog.
     * @returns {undefined}
     */
    function createDialog() {
        // If the ui element is not already created
        if (ui===null) {
            // Create a new "dialog" HTML element with the specified properties and assign it to "ui"
            ui = UI.tag( "dialog", { "class": "sgvModalDialog", "id": "loaderSplash" });
        }

        // Append several child elements to the ui element
        ui.appendChild(UI.tag('span',{},{'textContent':'working hard for you'}));
        ui.appendChild(UI.tag('div',{'class':'loader'}));
        ui.appendChild(UI.tag('span',{},{'textContent':'... please wait ...'}));
        
        // Append child element and assign the 'info' variable to a new 'div' HTML element with the specified properties
        ui.appendChild(info = UI.tag('div',{'id':'infoBlock'}));

        // Set the display property of the ui element to "none"
        ui.style.display = "none";
        // Append the ui element to the body of the window document
        window.document.body.appendChild(ui);
    };

    /**
     * Displays the splash screen dialog.
     * @returns {undefined}
     */
    function showDialog() {
        if (ui===null) createDialog();
        if (ui.open) ui.close();
        info.innerHTML = "";
        ui.style.display = "block";
        ui.showModal();
    };

    /**
     * Hides the splash screen dialog.
     * @returns {undefined}
     */
    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };

    /**
     * Sets information text to display in the splash screen and optionally runs a function.
     * @param {string} text - The information text to display.
     * @param {Function} action - The function to run after setting the information text.
     * @returns {undefined}
     */
    function setInfoX(text,action) {
        if (ui.open) ui.close();
            ui.style.display = "block";
        ui.showModal();
        info.innerHTML = text;
        // If the action parameter is a function
        if (typeof action==='function'){
            // Set a timeout to run the function after a delay of 100 milliseconds
            setTimeout( ()=>{
                action();
            }, 100);
        }
    };
    
    // Return an object with references to the setInfoX, showDialog, and hideDialog functions
    return {
        setInfo: setInfoX,
        show: showDialog,
        hide: hideDialog
    };
};


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
