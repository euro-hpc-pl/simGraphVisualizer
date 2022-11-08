/* global sgv, UI, FileIO */

sgv.dlgAlternateFileSave = new function() {
    var selectType, selectName, spanExt;
    var btnCancel, btnSave;
    
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

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
    
    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
    function showDialog() {
        ui.style.display = "block";
        ui.showModal();
    };
    
    return {
        show: showDialog,
        hide: hideDialog
    };
};
