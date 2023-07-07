/**
 * Singleton object for handling About Dialog.
 * @constructor
 */
sgv.dlgAbout = new function() {
    /** @type {Element} Represents the UI element of the dialog. */
    var ui = null;

    /**
     * Creates the About Dialog if it hasn't been created yet.
     * Adds the necessary elements and styles to the dialog.
     * @private
     */
    function createDialog() {
        if (ui===null) {
            // Create the UI element for the dialog.
            ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgAbout" });
        }
        
        // Create a div to contain the content.
        var content = UI.tag( "div", { "class": "content" });

        // Apply styles to the content.
        content.style['text-align'] = 'center';
        content.style.width = 'fit-content';

        // Add HTML content to the div.
        content.innerHTML += '<div><img src="pics/EuroHPC.jpg"></div>';
        content.innerHTML += '<div>Narodowa Infrastruktura Superkomputerowa dla EuroHPC - EuroHPC PL</div>';
        content.innerHTML += '<div class="info">simGraphVisualizer v.1.0</div>';
        content.innerHTML += '<div><img src="pics/Flagi.jpg"></div>';

        // Create and append the close button.
        let btn = UI.tag( "input", {
            'type':     "button",
            'value':    "Close",
            'class':    "actionbutton",
            'id':       "closeButton",
            'name':     "closeButton"
        });
        content.appendChild(btn);

        // Add event listener to close the dialog when the button is clicked.
        btn.addEventListener('click', function () {
            hideDialog();
        });

        // Create and append the title bar.
        let t = UI.createTitlebar("About", false);
        ui.appendChild(t);

        // Append the content to the UI element.
        ui.appendChild(content);

        // Initially hide the dialog.
        ui.style.display = "none";

        // Append the dialog to the body of the document.
        window.document.body.appendChild(ui);
    };

    /**
     * Shows the About Dialog.
     * Creates it first if it hasn't been created yet.
     * @public
     */
    function showDialog() {
        if (ui===null) {
            createDialog();
        }
        ui.style.display = "block";

        // Show the dialog.
        ui.showModal();
    };

    /**
     * Hides the About Dialog.
     * @public
     */
    function hideDialog() {
        // Close the dialog and hide it.
        ui.close();
        ui.style.display = "none";
    };


    // Expose public methods.
    return {
        //ui: ui,  // Uncomment if you want to expose the ui object.
        create: createDialog,
        show: showDialog,
        hide: hideDialog
    };
};
