/* global sgv, UI, Graph, TempGraphStructure */

const SingleFilePanel = (function(_id,_label,_path,_params) {
    var myId = _id;
    var myUI = UI.tag("div", {'class':'singleFilePanel'});

    myUI.style.padding = '2px';
    myUI.style['margin'] = '2px';
    //myUI.style['background-color'] = '#00f';

    var myLabel = UI.newInput("text", _label, "label", "");
    myUI.appendChild(myLabel);
    
    var myPath = UI.newInput("text", _path, "path", "");
    myUI.appendChild(myPath);
    
    var myParams = UI.newInput("text", _params, "params", "");
    myUI.appendChild(myParams);

    let btnDelScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'value': 'x'});
    btnDelScope.addEventListener('click',(e)=>{
        SingleFilePanel.removeByUi(e.target.parentNode);
    });

    myUI.appendChild(btnDelScope);

    return {
        id: myId,
        ui: myUI,
        label: myLabel.value,
        path: myPath.value,
        params: myParams.value,
        close: () => { SingleFilePanel.removeByUi(myUI); }
    };
});

SingleFilePanel.panels = [];

SingleFilePanel.removeByUi = function(tmpUI) {
    tmpUI.parentNode.removeChild(tmpUI);

    for( var i = 0; i < SingleFilePanel.panels.length; i++){ 
        if ( SingleFilePanel.panels[i].ui === tmpUI) { 
            SingleFilePanel.panels.splice(i, 1); 
        }
    }
};

SingleFilePanel.removeAll = function() {
    for( var i = SingleFilePanel.panels.length-1; i >=0; i--){
        let tmpUI = SingleFilePanel.panels[i].ui;
        tmpUI.parentNode.removeChild(tmpUI);
        SingleFilePanel.panels.splice(i, 1); 
    }
};

SingleFilePanel.create = function(_id,_label,_path,_params){
    return (SingleFilePanel.panels[SingleFilePanel.panels.length] = new SingleFilePanel(_id,_label,_path,_params)).ui;
};

sgv.dlgEditSettings = new function() {
    var files;
    var workingDir;
    
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function createUI() {
        let ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgEditSettings" });

        let t = UI.createTitlebar("Edit settings", false);
        ui.appendChild(t);

        let switches = UI.tag('div',{'id':'switches'});
        let externalProgramsSwitch = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'addPanelButton', 'name':'addPanelButton', 'value':'External programs'});
        externalProgramsSwitch.style['border-bottom'] = '0';
        externalProgramsSwitch.style['background-color'] = 'rgba(0,0,0,1.0)';
        externalProgramsSwitch.style['position'] = 'relative';
        externalProgramsSwitch.style['top'] = '2px';
        externalProgramsSwitch.style['border-bottom-left-radius'] = '0';
        externalProgramsSwitch.style['border-bottom-right-radius'] = '0';
        switches.appendChild(externalProgramsSwitch);
        ui.appendChild(switches);
        
        let content = UI.tag('div',{'id':'switch_content'});
        content.style.border = '1px solid #888';
        content.style['background-color'] = '#000';
        
        files = UI.tag('div',{'id':'files'});
        
        files.style['min-width'] = '630px';
        files.style.padding = '2px';
        
        content.appendChild(files);

        let addPanelButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'addPanelButton', 'name':'addPanelButton', 'value':'add new'});
        addPanelButton.addEventListener('click', ()=>{
            if (SingleFilePanel.panels.length===0){
                files.appendChild(SingleFilePanel.create(0, "label_0","path_0","params_0"));
            } else {
                let idx = SingleFilePanel.panels[SingleFilePanel.panels.length-1].id + 1;
                files.appendChild(SingleFilePanel.create(idx, "label_"+idx,"path_"+idx,"params_"+idx));
            }
        });
        content.appendChild(addPanelButton);
        
      
        ui.appendChild(content);

        let wd = UI.tag('div',{'id':'wd'});
        wd.style['color'] = '#ddd';
        wd.style['padding-top'] = '15px';
        wd.style['text-align'] = 'center';
        wd.appendChild(UI.span("Temporary directory: ", {'id': "wDirLabel"}));
        let wdButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'wdButton', 'name':'wdButton', 'value':'...'});
        wdButton.style['width'] = 'auto';
        wdButton.addEventListener('click', ()=>{
            window.indexBridge.getDirectoryDlg().then((result)=>{
               workingDir.value = result; 
            });
        });
        wd.appendChild(wdButton);
        workingDir = UI.newInput("text", "", "", "workingDir");
        wd.appendChild(workingDir);

        ui.appendChild(wd);

        let btns = UI.tag('div',{'id':'buttons'});

        let cancelButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cancelButton', 'name':'cancelButton', 'value':'Cancel'});
        cancelButton.addEventListener('click', ()=>{
            hideDialog();
        });
        btns.appendChild(cancelButton);
        
        let saveButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'saveButton', 'name':'saveButton', 'value':'Save settings'});
        saveButton.addEventListener('click', ()=>{
            onSaveButton();
        });
        btns.appendChild(saveButton);

        ui.appendChild(btns);

        return ui;
    };
    
    function onSaveButton() {
        var extInfo = [];
        
        for (const panel of SingleFilePanel.panels) {
            extInfo.push({
                label: panel.label,
                path: panel.path,
                params: panel.params
            });
        }
        
        window.indexBridge.settingsEdited(extInfo, workingDir.value);
        
        hideDialog();
    }
    
    function showDialog(_externalRun, _extBinDir) {
        ui.close();
        
        SingleFilePanel.removeAll();
        
        let idx = 0;
        for (const exr of _externalRun) {
            files.appendChild(SingleFilePanel.create(idx, exr.label, exr.path, exr.params));
            idx++;
        }
        
        workingDir.value = _extBinDir;
        
        ui.showModal();
    };

    function hideDialog() {
        ui.close();
    };
    
    return {
        show: showDialog,
        hide: hideDialog
    };
};
