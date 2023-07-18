/* global UI, sgv */

/**
 * @class
 * @classdesc Represents the DlgAbout class.
 * @memberof sgv
 */
class DlgAbout {
    constructor() {
        this.ui = null;
        
    }

    /**
     * Creates the About Dialog if it hasn't been created yet.
     * Adds the necessary elements and styles to the dialog.
     * @public
     */
    create() {
        if (this.ui===null) {
            // Create the UI element for the dialog.
            this.ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgAbout" });
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
        btn.addEventListener('click', () => {
            this.hide();
        });

        // Create and append the title bar.
        let t = UI.createTitlebar("About", false);
        this.ui.appendChild(t);

        // Append the content to the UI element.
        this.ui.appendChild(content);

        // Initially hide the dialog.
        this.ui.style.display = "none";

        // Append the dialog to the body of the document.
        window.document.body.appendChild(this.ui);
    }

    /**
     * Shows the About Dialog.
     * Creates it first if it hasn't been created yet.
     * @public
     */
    show() {
        if (this.ui===null) {
            this.create();
        }
        this.ui.style.display = "block";

        // Show the dialog.
        this.ui.showModal();
    }

    /**
     * Hides the About Dialog.
     * @public
     */
    hide() {
        // Close the dialog and hide it.
        this.ui.close();
        this.ui.style.display = "none";
    }
}

/**
 * Represents the static instance of DlgAbout in the sgv namespace.
 * @type {DlgAbout}
 * @memberof sgv
 * @static
 */
sgv.dlgAbout = new DlgAbout();

