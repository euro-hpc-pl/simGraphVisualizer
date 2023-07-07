/* global UI, sgv, Edge, Dispatcher, SVG */

/**
 * Represents a value panel component.
 * @returns An object with properties and methods related to the value panel component.
 */
const ValuePanel = (function() {
    var btnSetN, checkValueN, editWagaN;
    var nodeId, scope;
    
    var valueBlock = UI.tag("div", {'id':'ValueBlock'});

    checkValueN = UI.newInput("checkbox", "", "", "valueCheckN");
    checkValueN.addEventListener('click', function (e) {
        activateN(e.target.checked);
    });
    valueBlock.appendChild(checkValueN);

    editWagaN = UI.newInput("number", "0", "", "wagaN");
    editWagaN.addEventListener('change', function () {
        edycjaN();
    });
    valueBlock.appendChild(editWagaN);

    btnSetN = UI.newInput("button", "set", "setvaluebutton", "setN");
    btnSetN.addEventListener('click', function () {
        edycjaN();
    });
    valueBlock.appendChild(btnSetN);

    /**
     * Updates the value of a node in the graph based on the input from the user.
     * @returns None
     */
    function edycjaN() {
        let val = parseFloat(editWagaN.value.replace(/,/g, '.'));
        sgv.graf.setNodeValue(nodeId, val, scope);
        Dispatcher.graphChanged();
    };

    /**
     * Activates or deactivates a feature based on the given isActive parameter.
     * @param {boolean} isActive - Indicates whether the feature should be activated or deactivated.
     * @returns None
     */
    function activateN(isActive) {
        if (isActive) {
            editWagaN.disabled = "";
            btnSetN.disabled = "";
            let val = parseFloat(editWagaN.value.replace(/,/g, '.'));
            if (isNaN(val)) {
                val=0;
                editWagaN.value = val;
            }
            console.log(val);
            sgv.graf.setNodeValue(nodeId, val, scope);
        } else {
            editWagaN.disabled = "disabled";
            btnSetN.disabled = "disabled";
            sgv.graf.delNodeValue(nodeId, scope);
        }
        Dispatcher.graphChanged();
    };

    /**
     * Updates the UI to show the current value of a node.
     * If the current value is null or NaN, the checkbox is unchecked and the input field and button are disabled.
     * If the current value is not null or NaN, the checkbox is checked and the input field and button are enabled.
     * @returns None
     */
    function showX() {
        let currentValue = sgv.graf.nodeValue(nodeId, scope);
        if ((currentValue===null)||isNaN(currentValue)) {
            checkValueN.checked = "";
            editWagaN.value = null;
            editWagaN.disabled = "disabled";
            btnSetN.disabled = "disabled";
        } else {
            checkValueN.checked = "checked";
            editWagaN.value = currentValue;
            editWagaN.disabled = "";
            btnSetN.disabled = "";
        }
    }
    
    /**
     * Sets the value of the nodeId variable to the given id and calls the showX function.
     * @param {any} id - The id to set the nodeId variable to.
     * @returns None
     */
    function setNodeX(id) {
        nodeId = id;
        showX();
    }

    /**
     * Sets the scope to the given value and calls the showX() function.
     * @param {any} sc - The scope.
     * @returns None
     */
    function setScopeX(sc) {
        scope = sc;
        showX();
    }

    /**
     * Sets the value of the nodeId in scope and calls the showX function.
     * @param {any} id - The value to assign to the nodeId variable.
     * @param {any} sc - The scope.
     * @returns None
     */
    function setX(id, sc) {
        nodeId = id;
        scope = sc;
        showX();
    }

    return {
        ui: valueBlock,
        setNode: setNodeX,
        setScope: setScopeX,
        show: setX
    };
});

/**
 * Represents a dialog for displaying and editing properties of a node in a graph.
 * @returns An object with methods for showing, hiding, refreshing, and checking visibility of the dialog.
 */
sgv.dlgNodeProperties = new function() {
   
    var hidNodeId;
    var selectNodeId, selectScope;
    var btnConnectN, selectDestN, btnConnectSelectN;
    var checkLabelN, editLabelN;
    var valuePanel;
    var content, zeroInfo, svgView;
    var prevFocused=null;
    
    var _width = 250;
    var _height = 250;

    var notShownBefore = true;


    var ui = createUI();

    ui.addEventListener('keydown', onKeyDownX );
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
        hideDialog();
//        window.addEventListener('orientationchange', sgv.dlgNodeProperties.onOrientationChange );
        //new ResizeObserver(()=>console.log('resize')).observe(svgView);
    });

    function onOrientationChange() {
        console.log('onOrientationChange()');
    }

    /**
     * Creates the user interface for the application.
     * @returns None
     */
    function createUI() {
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvNodeProperties", "Node properties", true);

        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialog();
        });
        
        hidNodeId = UI.newInput('hidden', '0', '', 'nodeId');
        ui.appendChild(hidNodeId);

        var main = UI.tag("div", {'id':'main'});
        ui.appendChild(main);
        
        var precontent = UI.tag("div", {'id':'nodeid', 'class':'content'});

        selectNodeId = UI.tag('select',{'id':'selectNodeId'});
        selectNodeId.appendChild(UI.tag('option',{'value':0,'selected':true},{'innerHTML':'-- id --'}));
        selectNodeId.addEventListener('change', function () {
            selectedNodeId();
        });
        precontent.appendChild(UI.tag('label',{'for':'selectNodeId'},{'innerHTML':'Node: '}));
        precontent.appendChild(selectNodeId);

        main.appendChild(precontent);



        let div = UI.tag('div', {'id':'svg'});

        svgView = SVG.createSVG2('svgView', _width, _height, (event) => {
            if (event.target.id === 'svgView') {
                sgv.dlgEdgeProperties.hide();
            }
        });
        div.appendChild(svgView);
        main.appendChild(div);

        content = UI.tag("div", {'id':'tools', 'class':'content'});


        var labelBlock = UI.tag("div", {'id':'LabelBlock'});
        checkLabelN = UI.newInput("checkbox", "", "", "checkLabelN");
        checkLabelN.addEventListener('click', function (e) {
            let checked = e.target.checked;

            editLabelN.disabled = checked?"":"disabled";
            sgv.graf.nodes[hidNodeId.value].showLabel(checked);
        });
        labelBlock.appendChild(UI.tag('label',{'for':'checkLabelN'},{'innerHTML':'Label: '}));
        labelBlock.appendChild(checkLabelN);

        editLabelN = UI.newInput("text", "", "", "editLabelN");
        editLabelN.addEventListener('change', function (e) {
            sgv.graf.nodes[hidNodeId.value].setLabel(e.target.value, true);
        });
        labelBlock.appendChild(editLabelN);
        
        content.appendChild(labelBlock);

        content.appendChild((selectScope = new ScopePanel(false, 'scope: ')).ui);
        content.appendChild((valuePanel = new ValuePanel()).ui);
        
        var connectBlock = UI.tag("div", {'id':'ConnectBlock'});
        
        btnConnectN = UI.newInput("button", "connect to...", "", "connectN");
        btnConnectN.addEventListener('click', function () {
            connectNodes();
        });
        connectBlock.appendChild(btnConnectN);

        selectDestN = UI.tag('select',{'id':'destN'});
        connectBlock.appendChild(selectDestN);

        btnConnectSelectN = UI.newInput("button", "^", "", "connectSelectN");
        btnConnectSelectN.addEventListener('click', function () {
            connectSelectN();
        });
        connectBlock.appendChild(btnConnectSelectN);

        content.appendChild(connectBlock);

        main.appendChild(content);

        zeroInfo = UI.tag("div", {'id':'zeroInfo', 'class':'content'}, {'innerHTML': "Select a node, please."});
        main.appendChild(zeroInfo);

        main.appendChild(UI.createTransparentBtn1('DELETE', 'DeleteButton', ()=>{
            usunN();
        }));
        
        main.appendChild(UI.createTransparentBtn1('CLOSE', 'CloseButton', ()=>{
            hideDialog();
        }));
        
        return ui;
    }

    /**
     * Draws connected edges for a given node.
     * @param {Node} n1 - The node for which to draw connected edges.
     * @returns None
     */
    function drawConnectedEdges(n1) {
        let connected = sgv.graf.findAllConnected(n1);
        
        let set = new Set();
        for (let j of connected.internal) set.add(j);
        for (let j of connected.horizontal) set.add(j);
        for (let j of connected.vertical) set.add(j);
        for (let j of connected.up) set.add(j);
        for (let j of connected.down) set.add(j);
        
        //let angle = 360.0/set.size;
        let angle = (2.0*Math.PI)/set.size;
        let currentAngle = angle;

        set.forEach((n2)=>{
            let x2 = 100.0*Math.sin(currentAngle);
            let y2 = 100.0*Math.cos(currentAngle);

            let eid = Edge.calcId(n1, n2);
            if (eid in sgv.graf.edges) {
                let val = sgv.graf.edgeValue(eid);
                let color = valueToColor(val);
                let wth = 2 + 5 * valueToEdgeWidth(val);

                let eVal = sgv.graf.nodeValue(n2);
                let eColor = valueToColor(eVal);

                SVG.drawSvgEdge(svgView, eid, 125, 125, 125+x2, 125+y2, color.toHexString(), wth, (event)=>{
                    let rect = event.target.getBoundingClientRect();
                    sgv.dlgEdgeProperties.show(eid, rect.x, rect.y);
                    sgv.dlgEdgeProperties.ui.style['z-index']=101;
                });
                SVG.drawSvgText(svgView, n2, 125+x2, 125+y2, n2, 'yellow', eColor.toHexString(), ()=>{
                    showDialog(n2);
                });
            }
            currentAngle += angle;
        });
    }

    /**
     * Draws a node with the specified ID.
     * @param {string} nodeId - The ID of the node to draw.
     * @returns None
     */
    function drawNode(nodeId) {
        if (typeof nodeId === 'undefined') {
            nodeId = hidNodeId.value;
        }
 
        selectScope.selScope(sgv.graf.currentScope);
        
        svgView.innerHTML = '';
        if ((nodeId) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(nodeId);
            let color = valueToColor(val);

            drawConnectedEdges(nodeId);
            
            SVG.drawSvgNode(svgView, nodeId, 125, 125, 25, color.toHexString(), ()=>{});
            SVG.drawSvgText(svgView, nodeId, 125, 125, nodeId.toString(), 'yellow', '', ()=>{});
        }
    }

    /**
     * Displays a dialog box at the specified coordinates.
     * @param {string} nodeId - The ID of the node to display the dialog box on.
     * @param {number} x - The x-coordinate of the dialog box.
     * @param {number} y - The y-coordinate of the dialog box.
     * @returns None
     */
    function showDialog(nodeId, x, y) {
        if (typeof nodeId !== 'undefined') {
            nodeId = nodeId.toString();
            hidNodeId.value = nodeId;
        } else {
            nodeId = hidNodeId.value;
        }

        if ( nodeId === '0' ) {
            content.style.display = 'none';
            zeroInfo.style.display = 'block';
            svgView.innerHTML = '';
            return;
        } else {
            zeroInfo.style.display = 'none';
            content.style.display = 'block';
        }

        hidNodeId.value = nodeId;

        drawNode(nodeId);

        selectScope.refresh();
        valuePanel.show(nodeId, sgv.graf.currentScope);

        UI.clearSelect(selectDestN, true);
        UI.clearSelect(selectNodeId, false);

        for (const key in sgv.graf.nodes) {
            let isDifferentId = (key.toString() !== nodeId.toString());

            selectNodeId.appendChild(UI.tag('option',{'value':key},{'innerHTML':"q" + key}));
            
            if (isDifferentId) {
                 selectDestN.appendChild(UI.tag('option',{'value':key},{'innerHTML':"q" + key}));
            }
        }
        
        UI.selectByKey( selectNodeId, nodeId );

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
    }
    
    
    function selectedNodeId() {
        showDialog(event.target.value);
    }
    

    function usunN() {
        let val = hidNodeId.value;
        hidNodeId.value = 0;
        sgv.graf.delNode(val);
        hideDialog();
    };


    function connectSelectN() {
        sgv.nodeToConnect = parseInt(ui.querySelector("#nodeId").value, 10);
        ui.style.display = "none";
    };

    function connectNodes() {
        var node1 = ui.querySelector("#nodeId").value;
        var node2 = ui.querySelector("#destN").value;

        if (sgv.graf !== null) {
            sgv.graf.addEdge(node1, node2);
            Dispatcher.graphChanged();
        }
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
