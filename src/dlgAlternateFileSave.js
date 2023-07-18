/* global sgv, UI, FileIO */


/**
 * @class
 * @classdesc Represents the DlgAbout class. This class provides functionality related to handling the alternative save file dialog if the browser does not allow to open the system window for selecting a file to save.
 * @memberof sgv
 */
const DlgAlternateFileSave = (function() {
    var selectType, selectName, spanExt;
    var btnCancel, btnSave;
    
    /**
     * @type {HTMLElement}
     * @description User interface element for the dialog
     */
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    /**
     * @function
     * @description Creates the user interface for the dialog.
     * @returns {HTMLElement} The created user interface
     */
    function createUI() {
        //let ui = UI.createEmptyWindow("sgvUIwindow sgvModalDialog", "sgvSaveGraphDlg", "Save graph", true);
        let ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgAltSaveGraph" });
        
        let tt = UI.createTitlebar("Save graph", false);
        ui.appendChild(tt);

        content = UI.tag("div", {'class':'content'});

        content.appendChild(UI.tag("div",{},{
            'style':'max-width:400px',
            'textContent':
"Your browser does not allow us to open the system window for selecting a file to save. \
Please select the file format and its name and click Save button. \
Depending on your browser's settings, the file will be saved in \
the default location (usually: Downloads) or a selection window will appear."
        }));
        
        content.appendChild(UI.tag("hr"));
        
        let t = UI.tag("div");
        selectType = UI.tag( "select", {'id': "savSelectType" } );
        selectType.appendChild(UI.option('.txt','TXT'));
        selectType.appendChild(UI.option('.gexf','GEXF'));
        selectType.addEventListener('change', (e) => {
            spanExt.textContent = e.target.value;
        });
        t.appendChild(UI.tag('label',{'for':'savSelectType'},{'innerHTML':'Select format: '}));
        t.appendChild( selectType );
        content.appendChild(t);

        let n = UI.tag("div");
        selectName = UI.tag( "input", {'type':'text', 'id': 'savSelectName', 'value':'filename' } );
        n.appendChild(UI.tag('label',{'for':'savSelectname'},{'innerHTML':'Select filename: '}));
        n.appendChild( selectName );
        spanExt = UI.tag("span",{},{'textContent':'.txt'});
        n.appendChild( spanExt );
        content.appendChild(n);

        btnCancel = UI.newInput("button", "cancel", "actionbutton", "");
        btnCancel.addEventListener('click', function () {
            hideDialog();
        });
        content.appendChild(btnCancel);

        btnSave = UI.newInput("button", "save", "actionbutton", "");
        btnSave.addEventListener('click', function () {
            FileIO.alternateSave(selectName.value, spanExt.textContent);
            hideDialog();
        });
        content.appendChild(btnSave);
        
        ui.appendChild(content);
        
        ui.style.display = "none";
        return ui;
    };
    
    /**
     * @function
     * @description Hides the dialog.
     */
    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
    /**
     * @function
     * @description Shows the dialog.
     */
    function showDialog() {
        ui.style.display = "block";
        ui.showModal();
    };
    
    // Public interface
    return {
        show: showDialog,
        hide: hideDialog
    };
});


/**
 * Represents the static instance of DlgAlternateFileSave in the sgv namespace.
 * @type {DlgAlternateFileSave}
 * @memberof sgv
 * @static
 */
sgv.dlgAlternateFileSave = new DlgAlternateFileSave();