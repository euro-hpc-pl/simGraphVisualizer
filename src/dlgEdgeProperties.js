
/* global sgv, UI, Dispatcher */

/**
 * @class
 * @classdesc Represents the DlgEdgeProperties class.
 * @memberof sgv
 * @property {function} show - Function to show the dialog
 * @property {function} hide - Function to hide the dialog
 * @property {function} refresh - Function to refresh the dialog
 * @property {function} isVisible - Function to check if the dialog is visible
 */
const DlgEdgeProperties = (function() {
    var precontent, content, zeroInfo;
    var hidEdgeId;
    var selectEdgeId, selectScope;
    var checkValueE, editWagaE;
    var btnSetE, btnDeleteE;
    var prevFocused=null;

    var notShownBefore = true;

    var ui = createUI();
    
    ui.addEventListener('keydown', onKeyDownX );
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
        hideDialog();
    });

    /**
     * Function to create UI for the dialog.
     *
     * @returns {Object} - Returns the UI object for the dialog
     */
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
            onValueEnableCheckbox();
        });
        valueBlock.appendChild(checkValueE);

        editWagaE = UI.newInput("number", "0", "", "wagaE");
        editWagaE.addEventListener('change', function () {
            onSetEdgeValueButton();
        });
        valueBlock.appendChild(editWagaE);

        btnSetE = UI.newInput("button", "set", "setvaluebutton", "setE");
        btnSetE.addEventListener('click', function () {
            onSetEdgeValueButton();
        });
        
        valueBlock.appendChild(btnSetE);
        content.appendChild(valueBlock);
        
        ui.appendChild(zeroInfo = UI.tag("div", {'class':'content'}, {'innerHTML': "Select an edge, please."}));
        
        ui.appendChild(UI.createTransparentBtn1('CLOSE', 'CloseButton', ()=>{hideDialog();}));
        ui.appendChild(UI.createTransparentBtn1('DELETE', 'DeleteButton', ()=>{onDeleteEdgeButton();}));
        
        return ui;
    };

    /**
     * Function to show the dialog.
     *
     * @param {?string} edgeId - The ID of the edge
     * @param {?number} x - The x position to show the dialog
     * @param {?number} y - The y position to show the dialog
     */
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

        if ((!isMobile) && notShownBefore){
            notShownBefore = false;
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

    /**
     * Function to handle keydown events in the dialog.
     *
     * @param {Object} event - The keydown event
     */
    function onKeyDownX(event) {
//        if (!ui.contains(document.activeElement)) return;

        let key = event.key;
        
        if (key==='Escape') {
           hideDialog();
        }
    }

    /**
     * Function to hide the dialog.
     */
    function hideDialog() {
        if (prevFocused!==null) prevFocused.focus({focusVisible: false});
        if (ui!==null) ui.style.display = "none";
    };

    /**
     * Function to handle selection change in the edge ID dropdown.
     */
    function selectedEdgeId() {
        showDialog(event.target.value);
    }

    /**
     * Function to handle the Delete button click event.
     */
    function onDeleteEdgeButton() {
        hideDialog();
        sgv.graf.delEdge(hidEdgeId.value);
    };

    /**
     * Function to handle the Set button click event.
     */
    function onSetEdgeValueButton() {
        let val = parseFloat(editWagaE.value.replace(/,/g, '.'));
        let scope = selectScope.getScope();

        if ((val==="")||(isNaN(val))) {
            sgv.graf.delEdgeValue(hidEdgeId.value, scope);
        }
        else {
            sgv.graf.setEdgeValue(hidEdgeId.value, val, scope);
        }
        Dispatcher.graphChanged();
    };

    /**
     * Function to handle the value enable checkbox click event.
     */
    function onValueEnableCheckbox() {
        let isActive = checkValueE.checked;
        let scope = selectScope.getScope();
        
        if (isActive) {
            let val = parseFloat(editWagaE.value.replace(/,/g, '.'));
            if ((val==="")||(isNaN(val))) {
                val=0;
            }
            sgv.graf.setEdgeValue(hidEdgeId.value, val, scope);
        } else {
            sgv.graf.delEdgeValue(hidEdgeId.value, scope);
        }
        Dispatcher.graphChanged();
    };

    /**
     * Function to refresh the dialog.
     */
    function refreshX() {
        if (ui.style.display === "block") showDialog();
    };

    // The API exposed by this module
    return {
        show: showDialog,
        hide: hideDialog,
        refresh: refreshX,
        isVisible: () => {
            return (ui!==null)&&(ui.style.display === "block");
        }
    };
});

/**
 * Represents the static instance of DlgEdgeProperties in the sgv namespace.
 * @type {DlgEdgeProperties}
 * @memberof sgv
 * @static
 */
sgv.dlgEdgeProperties = new DlgEdgeProperties();
