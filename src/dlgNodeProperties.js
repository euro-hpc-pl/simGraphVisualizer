/* global UI, sgv, Edge, Dispatcher */

sgv.dlgNodeProperties = new function() {
   
    var hidNodeId;
    var selectNodeId, selectScope, checkValueN, editWagaN;
    var btnSetN, btnConnectN, selectDestN, btnConnectSelectN;
    var checkLabelN, editLabelN;
    var content, zeroInfo, svgView;
    var prevFocused=null;
    
    var _width = 250;
    var _height = 250;

    var ui = createUI();

    ui.addEventListener('keydown', onKeyDownX );
    
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
        showDialog(0);
        
        window.addEventListener('orientationchange', sgv.dlgNodeProperties.onOrientationChange );
        //new ResizeObserver(()=>console.log('resize')).observe(svgView);
    });

    function onOrientationChange() {
        
        
    }

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

        var labelBlock = UI.tag("div");
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


        selectScope = UI.tag('select',{'id':'nsSelectN'});
        selectScope.addEventListener('change', function () {
            sgv.graf.displayValues(selectScope.value);
            sgv.dlgCPL.selScope(selectScope.value);
            sgv.dlgCPL.updateSliders();
            changeScopeN();
        });
        content.appendChild(UI.tag('label',{'for':'nsSelectN'},{'innerHTML':'Scope: '}));
        content.appendChild(selectScope);
        
        //content.appendChild(document.createElement("br"));

        checkValueN = UI.newInput("checkbox", "", "", "valueCheckN");
        checkValueN.addEventListener('click', function () {
            activateN();
        });
        content.appendChild(checkValueN);
        
        editWagaN = UI.newInput("number", "0", "", "wagaN");
        editWagaN.addEventListener('change', function () {
            edycjaN();
        });
        content.appendChild(editWagaN);
        
        btnSetN = UI.newInput("button", "set", "setvaluebutton", "setN");
        btnSetN.addEventListener('click', function () {
            edycjaN();
        });
        content.appendChild(btnSetN);
        
        
        content.appendChild(document.createElement("br"));
        
        btnConnectN = UI.newInput("button", "connect to...", "", "connectN");
        btnConnectN.addEventListener('click', function () {
            connectNodes();
        });
        content.appendChild(btnConnectN);

        selectDestN = UI.tag('select',{'id':'destN'});
        content.appendChild(selectDestN);

        btnConnectSelectN = UI.newInput("button", "^", "", "connectSelectN");
        btnConnectSelectN.addEventListener('click', function () {
            connectSelectN();
        });
        content.appendChild(btnConnectSelectN);

        content.appendChild(document.createElement("br"));

        btnDeleteNode = UI.newInput("button", "delete", "delbutton", "");
        btnDeleteNode.addEventListener('click', function () {
            usunN();
        });
        content.appendChild(btnDeleteNode);

        content.style['min-width'] = '240px'; 
        content.style['min-height'] = '105px'; 

        main.appendChild(content);

        zeroInfo = UI.tag("div", {'id':'zeroInfo', 'class':'content'});
        zeroInfo.innerHTML = "Select a node, please.";
        zeroInfo.style['min-width'] = '240px'; 
        zeroInfo.style['min-height'] = '105px'; 
        main.appendChild(zeroInfo);
        
        return ui;
    }

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

    function drawNode(nodeId) {
        if (typeof nodeId === 'undefined') {
            nodeId = hidNodeId.value;
        }
 
        UI.selectByKey(selectScope, sgv.graf.currentScope);
        
        svgView.innerHTML = '';
        if ((nodeId) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(nodeId);
            let color = valueToColor(val);

            drawConnectedEdges(nodeId);
            
            SVG.drawSvgNode(svgView, nodeId, 125, 125, 25, color.toHexString(), ()=>{});
            SVG.drawSvgText(svgView, nodeId, 125, 125, nodeId.toString(), 'yellow', '', ()=>{});
        }
    }

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
            return;
        } else {
            zeroInfo.style.display = 'none';
            content.style.display = 'block';
        }

        hidNodeId.value = nodeId;

        drawNode(nodeId);

        editLabelN.value = sgv.graf.nodes[nodeId].getLabel();
        if ( sgv.graf.nodes[nodeId].isLabelVisible() ) {
            checkLabelN.checked = "checked";
            editLabelN.disabled = "";
        } else {
            checkLabelN.checked = "";
            editLabelN.disabled = "disabled";
        }

        UI.clearSelect(selectScope, true);
        for (const key in sgv.graf.scopeOfValues) {
            selectScope.appendChild(UI.option(sgv.graf.scopeOfValues[key], sgv.graf.scopeOfValues[key]),( sgv.graf.currentScope === sgv.graf.scopeOfValues[key]));
            //var opt = UI.tag('option',{'value':key},{'innerHTML':sgv.graf.scopeOfValues[key]});
            //if ( sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
            //    opt.selected = "selected";
            //}
            //selectScope.appendChild(opt);
        }


        let currentValue = sgv.graf.nodeValue(nodeId);
        if ((currentValue===null)||isNaN(currentValue)) {
            ui.querySelector("#valueCheckN").checked = "";
            ui.querySelector("#wagaN").value = null;
            ui.querySelector("#wagaN").disabled = "disabled";
            ui.querySelector("#setN").disabled = "disabled";
        } else {
            ui.querySelector("#valueCheckN").checked = "checked";
            ui.querySelector("#wagaN").value = currentValue;
            ui.querySelector("#wagaN").disabled = "";
            ui.querySelector("#setN").disabled = "";
        }

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
    }
    
    
    function selectedNodeId() {
        showDialog(event.target.value);
    }
    

    function usunN() {
        sgv.graf.delNode(hidNodeId.value);
        ui.style.display = "none";
    };


    function changeScopeN() {
        console.log('changeScopeN: ' + event.target.value);

        let nodeId = ui.querySelector("#nodeId").value;

        //let currentValue = sgv.graf.nodeValue(nodeId,sgv.graf.scopeOfValues[event.target.value]);
        let currentValue = sgv.graf.nodeValue(nodeId, event.target.value);
        if ((currentValue===null)||isNaN(currentValue)) {
            console.log('NULL');
            ui.querySelector("#valueCheckN").checked = "";
            ui.querySelector("#wagaN").value = null;
            ui.querySelector("#wagaN").disabled = "disabled";
            ui.querySelector("#setN").disabled = "disabled";
        } else {
            console.log('NOT NULL');
            ui.querySelector("#valueCheckN").checked = "checked";
            ui.querySelector("#wagaN").value = currentValue;
            ui.querySelector("#wagaN").disabled = "";
            ui.querySelector("#setN").disabled = "";
        }
    };


    function edycjaN() {
        let id = ui.querySelector("#nodeId").value;
        let val = parseFloat(ui.querySelector("#wagaN").value.replace(/,/g, '.'));
        let scope = sgv.graf.scopeOfValues[ui.querySelector("#nsSelectN").value];
        sgv.graf.setNodeValue(id, val, scope);
        //ui.style.display = "none";
        Dispatcher.graphChanged();
    };

    function activateN() {
        let scope = sgv.graf.scopeOfValues[ui.querySelector("#nsSelectN").value];
        let isActive = ui.querySelector("#valueCheckN").checked;
        if (isActive) {
            ui.querySelector("#wagaN").disabled = "";
            ui.querySelector("#setN").disabled = "";
            let val = parseFloat(ui.querySelector("#wagaN").value.replace(/,/g, '.'));
            if (val==="") {
                val=0;
                ui.querySelector("#wagaN").value = val;
            }
            sgv.graf.setNodeValue(ui.querySelector("#nodeId").value, val, scope);
        } else {
            ui.querySelector("#wagaN").disabled = "disabled";
            ui.querySelector("#setN").disabled = "disabled";
            sgv.graf.delNodeValue(ui.querySelector("#nodeId").value, scope);
        }
        Dispatcher.graphChanged();
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
    
    return {
        show: showDialog,
        hide: hideDialog,
        refresh: drawNode,
        isVisible: () => {
            return (ui!==null)&&(ui.style.display === "block");
        }
    };
    
};
