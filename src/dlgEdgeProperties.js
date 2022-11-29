
/* global sgv, UI, Dispatcher */

sgv.dlgEdgeProperties = new function() {
    var precontent, content, zeroInfo;
    var hidEdgeId;
    var selectEdgeId, selectScope;
    var checkValueE, editWagaE;
    var btnSetE, btnDeleteE;
    var prevFocused=null;

    var ui = createUI();
    
    ui.addEventListener('keydown', onKeyDownX );
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
        hideDialog();
    });

    function createUI() {
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvEdgeProperties", "Edge properties", true);
        
        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialog();
        });

        hidEdgeId = UI.newInput('hidden', '0', '', 'edgeId');
        ui.appendChild(hidEdgeId);

        precontent = UI.tag("div", {'class':'content'});

        selectEdgeId = UI.tag('select',{'id':'selectEdgeId'});
        selectEdgeId.appendChild(UI.tag('option',{'value':0,'selected':true},{'innerHTML':'-- id --'}));
        selectEdgeId.addEventListener('change', function () {
            selectedEdgeId();
        });
        precontent.appendChild(UI.tag('label',{'for':'selectEdgeId'},{'innerHTML':'Edge: '}));
        precontent.appendChild(selectEdgeId);

        ui.appendChild(precontent);

        content = UI.tag("div", {'class':'content'});
        ui.appendChild(content);


        content.appendChild((selectScope = new ScopePanel(false, 'scope: ')).ui);

        var valueBlock = UI.tag("div", {'id':'ValueBlock'});
        checkValueE = UI.newInput("checkbox", "", "", "valueCheckE");
        checkValueE.addEventListener('click', function () {
            activateE();
        });
        valueBlock.appendChild(checkValueE);

        editWagaE = UI.newInput("number", "0", "", "wagaE");
        editWagaE.addEventListener('change', function () {
            edycjaE();
        });
        valueBlock.appendChild(editWagaE);

        btnSetE = UI.newInput("button", "set", "setvaluebutton", "setE");
        btnSetE.addEventListener('click', function () {
            edycjaE();
        });
        
        valueBlock.appendChild(btnSetE);
        content.appendChild(valueBlock);
        
        ui.appendChild(zeroInfo = UI.tag("div", {'class':'content'}, {'innerHTML': "Select an edge, please."}));
        
        ui.appendChild(UI.createTransparentBtn1('CLOSE', 'CloseButton', ()=>{hideDialog();}));
        ui.appendChild(UI.createTransparentBtn1('DELETE', 'DeleteButton', ()=>{usunE();}));
        
        return ui;
    };

    function showDialog(edgeId, x, y) {
        if (typeof edgeId !== 'undefined') {
            edgeId = edgeId.toString();
            hidEdgeId.value = edgeId;
        } else {
            edgeId = hidEdgeId.value;
        }
        
        if ( edgeId === '0' ) {
            content.style.display = 'none';
            zeroInfo.style.display = 'block';
            return;
        } else {
            zeroInfo.style.display = 'none';
            content.style.display = 'block';
        }

        UI.clearSelect(selectEdgeId, false);
        for (const key in sgv.graf.edges) {
            selectEdgeId.appendChild(UI.tag('option',{'value':key},{'innerHTML':"q" + sgv.graf.edges[key].begin + " - q" + sgv.graf.edges[key].end}));
        }
        UI.selectByKey( selectEdgeId, edgeId );

        selectScope.refresh();

        let currentValue = sgv.graf.edgeValue(edgeId);
        if ((currentValue===null)||isNaN(currentValue)) {
            checkValueE.checked = "";
            editWagaE.value = null;
            editWagaE.disabled = "disabled";
            btnSetE.disabled = "disabled";
        } else {
            checkValueE.checked = "checked";
            editWagaE.value = currentValue;
            editWagaE.disabled = "";
            btnSetE.disabled = "";
        }

        if (!isMobile){
            if ((typeof x!=='undefined')&&(typeof y!=='undefined')) {
                let xOffset = sgv.canvas.clientLeft;
                ui.style.top = y + "px";
                ui.style.left = (xOffset + x) + "px";
            }
        }

        ui.style.display = "block";
        prevFocused = window.document.activeElement;
        ui.focus({focusVisible: false});
    };

    function onKeyDownX(event) {
//        if (!ui.contains(document.activeElement)) return;

        let key = event.key;
        
        if (key==='Escape') {
           hideDialog();
        }
    }

    function hideDialog() {
        if (prevFocused!==null) prevFocused.focus({focusVisible: false});
        if (ui!==null) ui.style.display = "none";
    };

    function selectedEdgeId() {
        showDialog(event.target.value);
    }

    function changeScopeE() {
        let scopeId = event.target.value;

        let edgeId = ui.querySelector("#edgeId").value;

        let currentValue = sgv.graf.edgeValue(edgeId,sgv.graf.scopeOfValues[scopeId]);
        
        if ((currentValue===null)||isNaN(currentValue)) {
            console.log('NULL');
            checkValueE.checked = "";
            editWagaE.value = null;
            editWagaE.disabled = "disabled";
            btnSetE.disabled = "disabled";
        } else {
            console.log('NOT NULL');
            checkValueE.checked = "checked";
            editWagaE.value = currentValue;
            editWagaE.disabled = "";
            btnSetE.disabled = "";
        }
    };



    function usunE() {
        sgv.graf.delEdge(ui.querySelector("#edgeId").value);
        ui.style.display = "none";
    };

    function edycjaE() {
        let id = ui.querySelector("#edgeId").value;
        let val = parseFloat(editWagaE.value.replace(/,/g, '.'));
        let scope = sgv.graf.scopeOfValues[selectScope.value];
        
        sgv.graf.setEdgeValue(id, val, scope);
        //ui.style.display = "none";
        Dispatcher.graphChanged();
    };

    function activateE() {
        let isActive = checkValueE.checked;
        let scope = sgv.graf.scopeOfValues[selectScope.value];
        if (isActive) {
            editWagaE.disabled = "";
            btnSetE.disabled = "";
            let val = parseFloat(editWagaE.value.replace(/,/g, '.'));
            if (val==="") {
                val=0;
                editWagaE.value = val;
            }
            sgv.graf.setEdgeValue(ui.querySelector("#edgeId").value, val, scope);
        } else {
            editWagaE.disabled = "disabled";
            btnSetE.disabled = "disabled";
            sgv.graf.delEdgeValue(ui.querySelector("#edgeId").value, scope);
        }
        Dispatcher.graphChanged();
    };

    function refreshX() {
        if (ui.style.display === "block") showDialog();
    };

    return {
        show: showDialog,
        hide: hideDialog,
        refresh: refreshX,
        isVisible: () => {
            return (ui!==null)&&(ui.style.display === "block");
        }
    };
};
