/* global global, BABYLON, URL, Chimera, Pegasus */
"use strict";

function getRandom(min, max) {
    return (min + (Math.random() * (max - min)));
}

var sgv = (typeof exports === "undefined")?(function sgv() {}):(exports);
if(typeof global !== "undefined") { global.sgv = sgv; }

sgv.version = "0.1.0";
sgv.engine = null;
sgv.scene = null;
sgv.camera = null;
sgv.graf = null;
sgv.displayMode = 'classic';

sgv.createCamera = () => {
    sgv.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), sgv.scene);
    //camera.setPosition(new BABYLON.Vector3(10, 100, 200));
    sgv.camera.setPosition(new BABYLON.Vector3(166, 150, 0));
    sgv.camera.attachControl(sgv.canvas, true);

    sgv.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    sgv.camera.inertia = 0.3;
};

sgv.createLights = () => {
    var light = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1), 1.8, 0.01, sgv.scene);
    //light.diffuse = new BABYLON.Color3(1, 1, 1);
    //light.specular = new BABYLON.Color3(1, 1, 1);

    light.intensity = 0.75;
    light.parent = sgv.camera;
    light.position = new BABYLON.Vector3(0, 0, 0);
    //light.radius = Math.PI;// / 2);
};

sgv.createMaterials = function() {
    sgv.grayMat0 = new BABYLON.StandardMaterial("grayMat0", sgv.scene);
    sgv.grayMat0.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.grayMat0.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    sgv.grayMat0.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    sgv.grayMat1 = new BABYLON.StandardMaterial("grayMat1", sgv.scene);
    sgv.grayMat1.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.grayMat1.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.grayMat1.emissiveColor = new BABYLON.Color3(0, 0, 0);


    sgv.redMat = new BABYLON.StandardMaterial("redMat", sgv.scene);
    sgv.redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.redMat.emissiveColor = BABYLON.Color3.Red();

    sgv.greenMat = new BABYLON.StandardMaterial("greenMat", sgv.scene);
    sgv.greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.greenMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0);

    sgv.blueMat = new BABYLON.StandardMaterial("blueMat", sgv.scene);
    sgv.blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.blueMat.emissiveColor = BABYLON.Color3.Blue();

    sgv.purpleMat = new BABYLON.StandardMaterial("purpleMat", sgv.scene);
    sgv.purpleMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.purpleMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.purpleMat.emissiveColor = BABYLON.Color3.Purple();

    sgv.groundMaterial = new BABYLON.StandardMaterial("ground", sgv.scene);
    sgv.groundMaterial.specularColor = BABYLON.Color3.Black();
};

sgv.createScene = () => {
    sgv.scene = new BABYLON.Scene(sgv.engine);

    sgv.createCamera();
    sgv.createLights();
    sgv.createMaterials();

    sgv.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    sgv.nodeToConnect = 0;
    
    sgv.addEventsListeners();
};

sgv.switchDisplayMode = function() {
    if (sgv.displayMode === 'classic') {
        sgv.displayMode = 'triangle';
    } else if (sgv.displayMode === 'triangle') {
        sgv.displayMode = 'diamond';
    } else {
        sgv.displayMode = 'classic';
    }
    
    if (sgv.graf!==null) {
        sgv.graf.changeDisplayMode();
    }
};


sgv.addEventsListeners = function () {
    var startingPoint;
    var currentMesh;
    var ground = null;//BABYLON.MeshBuilder.CreateGround("ground", {width:10*graf.N+20, height:10*graf.N+20}, scene, false);
    //ground.material = groundMaterial;

    function getGroundPosition()
    {
        var pickinfo = sgv.scene.pick(sgv.scene.pointerX, sgv.scene.pointerY, function (mesh) {
            return mesh === ground;
        });
        //var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh != null; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }
    ;

    function pointerDblTap(mesh) {
        var n2 = mesh.name.split(":");
        if (n2[0] === "edge")
        {
            sgv.graf.edgeDoubleClicked(n2[1]);
        }
    }
    ;

    function pointerDown(event) {
        console.log("POINTER.DOWN");
        currentMesh = event.pickInfo.pickedMesh;

        startingPoint = getGroundPosition();
        if (startingPoint)
        { // we need to disconnect camera from canvas
            setTimeout(function () {
                sgv.camera.detachControl(sgv.canvas);
            }, 0);
        }
    }
    ;

    function onPointerUp() {
        if (sgv.graf !== null) {
            sgv.graf.showLabels(true);
        }
        if (startingPoint) {
            sgv.camera.attachControl(sgv.canvas, true);
            startingPoint = null;

            return;
        }
    }
    ;

    function onPointerMove() {
        if (sgv.graf === null)
            return;

        //graf.updateNodeLabels();

        if (!startingPoint) {
            return;
        }
        var current = getGroundPosition();
        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);

        var n2 = currentMesh.name.split(":");
        if (n2[0] === "node")
        {
            sgv.graf.moveNode(parseInt(n2[1], 10), diff);

            startingPoint = current;
        }
    }
    ;


    function onPointerTap(pointerInfo) {
        function onLMBtap(pointerInfo) {
            function onMeshPicked(mesh) {
                console.log("mesh picked: "+mesh.name);
                var n2 = mesh.name.split(":");
                if (n2[0] === "edge") {
                    sgv.pokazOkienkoE(n2[1], sgv.scene.pointerX, sgv.scene.pointerY);
                } else if (n2[0] === "node") {
                    sgv.pokazOkienkoN(parseInt(n2[1], 10), sgv.scene.pointerX, sgv.scene.pointerY);
                } else {
                    sgv.cancelE();
                    sgv.cancelN();
                }
            }
            ;

            console.log("LEFT");
            if (sgv.nodeToConnect !== 0) {
                if (pointerInfo.pickInfo.hit) {
                    var n2 = pointerInfo.pickInfo.pickedMesh.name.split(":");
                    if (n2[0] === "node") {
                        let strId1 = "" + sgv.nodeToConnect + "," + parseInt(n2[1], 10);
                        let strId2 = "" + parseInt(n2[1], 10) + "," + sgv.nodeToConnect;
                        if (!(strId1 in sgv.graf.edges) && !(strId2 in sgv.graf.edges))
                            sgv.graf.addEdge(sgv.nodeToConnect, parseInt(n2[1], 10), 0.5);
                        else
                            console.log("edge already exists");
                    }
                }
                sgv.nodeToConnect = 0;
            } else {
                if (pointerInfo.pickInfo.hit) {
                    onMeshPicked(pointerInfo.pickInfo.pickedMesh);
                } else {
                    sgv.cancelE();
                    sgv.cancelN();
                }
            }
        }

        function onMMBtap(pointerInfo) {
            console.log("MIDDLE");
            if (pointerInfo.pickInfo.hit) {
                var n2 = pointerInfo.pickInfo.pickedMesh.name.split(":");
                if (n2[0] === "node") {
                    if (sgv.nodeToConnect === 0) {
                        sgv.nodeToConnect = parseInt(n2[1], 10);
                    } else {
                        let strId1 = "" + sgv.nodeToConnect + "," + parseInt(n2[1], 10);
                        let strId2 = "" + parseInt(n2[1], 10) + "," + sgv.nodeToConnect;
                        if (!(strId1 in sgv.graf.edges) && !(strId2 in sgv.graf.edges))
                            sgv.graf.addEdge(sgv.nodeToConnect, parseInt(n2[1], 10), 0.5);
                        else
                            console.log("edge already exists");
                        sgv.nodeToConnect = 0;
                    }
                }
            }
        }

        function onRMBtap(pointerInfo) {
            console.log("RIGHT");
        }

        switch (pointerInfo.event.button) {
            case 0:
                onLMBtap(pointerInfo);
                break;
            case 1:
                onMMBtap(pointerInfo);
                break;
            case 2:
                onRMBtap(pointerInfo);
                break;
        }
    }
    ;

    sgv.scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERTAP:
                onPointerTap(pointerInfo);
                break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh !== ground) {
                    pointerDblTap(pointerInfo.pickInfo.pickedMesh);
                }
                break;
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh !== ground) {
                    pointerDown(pointerInfo);
                }

                if (sgv.graf !== null) {
                    sgv.graf.showLabels(false);
                }

                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                onPointerUp();
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                onPointerMove();
                break;
        }
    });


};


sgv.connectNodes = function() {
    var node1 = document.getElementById("nodeId").value;
    var node2 = document.getElementById("destN").value;
  
    if (sgv.graf!==null) {
        sgv.graf.addEdge(node1, node2);
    }    
};

sgv.addToMissing = function(nodeId) {
    var win = document.getElementById("misN");
    win.innerHTML += "<input type=\"button\" id=\"rest"+nodeId+"\" value=\" q"+nodeId+" \" onClick=\"sgv.restoreNode("+nodeId+")\">";
    this.ui.missingNodes.style.display = "block";
};

sgv.restoreNode = function(nodeId) {
    sgv.graf.restoreNode(nodeId);
    
    var but = document.getElementById("rest"+nodeId);
    but.parentNode.removeChild(but);
};

sgv.delMissing = function() {
    var win = document.getElementById("misN");
    win.innerHTML = "";

    if (sgv.graf!==null) {
        sgv.graf.missing = {};
    }    
    
    this.ui.missingNodes.style.display = "none";
};

sgv.pokazOkienkoE = function(edgeId, x, y) {
    var xOffset = this.canvas.clientLeft;

    sgv.ui.edgeProperties.querySelector(".titleText").innerHTML = "Edge q"+sgv.graf.edges[edgeId].begin+" &lt;---&gt; q"+sgv.graf.edges[edgeId].end;
    sgv.ui.edgeProperties.querySelector("#edgeId").value = edgeId;
    sgv.ui.edgeProperties.querySelector("#wagaE").value = sgv.graf.edgeValue(edgeId);
    
    sgv.ui.edgeProperties.style.top = y+"px";
    sgv.ui.edgeProperties.style.left = (xOffset+x)+"px";
    sgv.ui.edgeProperties.style.display = "block";
};

sgv.pokazOkienkoN = function(nodeId, x, y) {
    var xOffset = this.canvas.clientLeft;

    sgv.ui.nodeProperties.querySelector(".titleText").textContent = "Node q"+nodeId;
    sgv.ui.nodeProperties.querySelector("#nodeId").value = nodeId;
    sgv.ui.nodeProperties.querySelector("#wagaN").value = sgv.graf.nodeValue(nodeId);
    
    let select = sgv.ui.nodeProperties.querySelector("#destN");

    var length = select.options.length;
    for (let i = length-1; i >= 0; i--) {
        select.options[i] = null;
    }

    for (const key in sgv.graf.nodes) {
        //console.log(nodeId, key);
        if (key.toString()!==nodeId.toString()) {
            var opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = "q"+key;
            select.appendChild(opt);
        }
    }
    
    sgv.ui.nodeProperties.style.top = y+"px";
    sgv.ui.nodeProperties.style.left = (xOffset+x)+"px";
    sgv.ui.nodeProperties.style.display = "block";
};


sgv.usunE = function() {
    sgv.graf.delEdge(sgv.ui.edgeProperties.querySelector("#edgeId").value);
    sgv.ui.edgeProperties.style.display = "none";
};

sgv.usunN = function() {
    sgv.graf.delNode(sgv.ui.nodeProperties.querySelector("#nodeId").value);
    sgv.ui.nodeProperties.style.display = "none";
};

sgv.cancelE = function() {
    sgv.ui.edgeProperties.style.display = "none";
};

sgv.cancelN = function() {
    sgv.ui.nodeProperties.style.display = "none";
};


sgv.edycjaE = function() {
    sgv.graf.setEdgeValue(sgv.ui.edgeProperties.querySelector("#edgeId").value, sgv.ui.edgeProperties.querySelector("#wagaE").value);
    sgv.ui.edgeProperties.style.display = "none";
};

sgv.edycjaN = function() {
    sgv.graf.setNodeValue(sgv.ui.nodeProperties.querySelector("#nodeId").value, sgv.ui.nodeProperties.querySelector("#wagaN").value);
    sgv.ui.nodeProperties.style.display = "none";
};

sgv.connectSelectN = function() {
    nodeToConnect = parseInt( sgv.ui.nodeProperties.querySelector("#nodeId").value, 10 );
    sgv.ui.nodeProperties.style.display = "none";
};




sgv.toTXT = function() {
    function download(text, name, type) {
        //var a = document.getElementById("mysaver");
        let a = document.createElement("a");
        let file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    };
    
    var string = "# type=" + sgv.graf.type + "\n";
    string += "# size=" + sgv.graf.cols + "," + sgv.graf.rows + "," + sgv.graf.KL + "," + sgv.graf.KR + "\n";

    for (const key in sgv.graf.nodes) {
        string +=  key + " " + key + " ";
        string += sgv.graf.nodes[key].value + "\n";
    }
    
    for (const key in sgv.graf.edges) {
        string += sgv.graf.edges[key].begin + " " + sgv.graf.edges[key].end + " ";
        string += sgv.graf.edges[key].value + "\n";
    }
    
    //console.log(string);
    
    download(string, 'graphDefinition.txt', 'text/plain');
};


sgv.fromTXT = function(string) {
    var res = [];
    var lines = string.split("\n");
            
    var gDesc = sgv.controlPanel.getGraphTypeAndSize();

    var parseComment = function(string) {
        var command = string.split("=");
        if (command[0] === 'type'){
            gDesc.type = command[1];
        }
        else if (command[0] === 'size'){
            var size = command[1].split(",");
            gDesc.size = {
                cols: parseInt(size[0], 10),
                rows: parseInt(size[1], 10),
                KL:   parseInt(size[2], 10),
                KR:   parseInt(size[3], 10)
            };
        }
    };

    var parseData = function(string) {
        var line = string.split(" ");
        if (line.length===3) {
            return {
                    n1: parseInt(line[0], 10),
                    n2: parseInt(line[1], 10),
                    val: parseFloat(line[2], 10)
                };
        }
        else {
            return null;
        }
    };
    
    while(lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            var d = parseData( lines[0] );
            if (d!==null) {
                res.push( d );
            }
        }
        else {
            var line = lines[0].split(" ");
            parseComment(line[1]);
        }
        lines.shift();
    }
    
    switch ( gDesc.type ) {
        case "chimera" :
            sgv.graf = Chimera.createNewGraph(gDesc.size);
            break;
        case "pegasus" :
            sgv.graf = Pegasus.createNewGraph(gDesc.size);
            break;
    }
    
    sgv.graf.fromDef(res);
};

class UI {
    static createTitlebar(title, closebuttonVisible) {
        var t = document.createElement("div");
        t.setAttribute("class", "title");
        if (closebuttonVisible) {
            let btn = document.createElement("input");
            btn.setAttribute("type", "button");
            btn.setAttribute("class", "hidebutton");
            btn.setAttribute("value", "x");
            t.appendChild(btn);
        }
        let span = document.createElement("span");
        span.setAttribute("class", "titleText");
        span.textContent = title;
        
        t.appendChild(span);
        
        return t;
    };
    
    static createEmptyWindow = (id, title, closebuttonVisible, createContentDIV, hiddenInput) => {
        var o = document.createElement("div");
        o.setAttribute("class", "sgvUIwindow");
        o.setAttribute("id", "sgvNodeProperties");
        let t = UI.createTitlebar( title, closebuttonVisible );
        o.appendChild( t );
    };
    
    
    static createNodeProperties = () => {
        var o = document.createElement("div");
        o.setAttribute("class", "sgvUIwindow");
        o.setAttribute("id", "sgvNodeProperties");
        let t = UI.createTitlebar( 'Node: q1', true );
        o.appendChild( t );
        o.innerHTML += 
        '<input id="nodeId" type="hidden" value="0"> \
        <div class="content"> \
            <input id="wagaN" type="number" value="0"><input class="setvaluebutton" id="setN" type="button" value="set"> \
            <br/><input id="connectN" type="button" value="connect to..."><select id="destN"></select><input id="connectSelectN" type="button" value="^"> \
            <br/><input class="delbutton" type="button" value="delete"> \
        </div>';
        document.body.appendChild(o);
        return o;
    };

    static createEdgeProperties = () => {
        var o = document.createElement("div");
        o.setAttribute("class", "sgvUIwindow");
        o.setAttribute("id", "sgvEdgeProperties");
        o.appendChild( UI.createTitlebar( 'Edge: q1 &lt;---&gt; q2', true ) );
        o.innerHTML += '<input id="edgeId" type="hidden" value="0"> \
        <div class="content"> \
            <input id="wagaE" type="number" value="0"><input class="setvaluebutton" id="setE" type="button" value="set"> \
            <br/><input class="delbutton" type="button" value="delete"> \
        </div>';
        document.body.appendChild(o);
        return o;
    };
    
    static createMissing(id) {
        var o = document.createElement("div");
        o.setAttribute("class", "sgvUIwindow");
        o.setAttribute("id", id);
        o.appendChild( UI.createTitlebar( 'removed nodes', false ) );

        o.innerHTML += '<div class="content"><div id="misN"></div> \
        <input class="delbutton" type="button" value="clear history"> \
        </div>';
    
        document.body.appendChild(o);
        return o;
    };

    static createGraphs(id) {
        var o = document.createElement("div");
        o.setAttribute("class", "sgvUIwindow");
        o.setAttribute("id", id);
        o.appendChild( UI.createTitlebar( 'graphs', false ) );

        o.innerHTML += '<div class="content"></div>';
    
        document.body.appendChild(o);
        return o;
    };
    
    static createConsole(id) {
        var o = document.createElement("div");
        o.setAttribute("class", "sgvUIwindow");
        o.setAttribute("id", id);
        o.appendChild( UI.createTitlebar( 'console', true ) );

        o.innerHTML += '<div class="content"> \
            <textarea id="consoleHistory" readonly></textarea> \
            <input type="text" id="commandline"> \
        </div> \
        <div style="background-color:blue;height:5px;width:15px;float:right"></div><div style="background-color:green;height:5px;width:15px;float:left"></div><div style="background-color:red;height:5px;width:auto"></div>';
        document.body.appendChild(o);
        return o;
    };
    
    static createControlPanel(id) {
        var o = document.createElement("div");
        o.setAttribute("class", "sgvUIwindow");
        o.setAttribute("id", id);
        o.appendChild( UI.createTitlebar( 'control panel', true ) );
        
        var divSel = document.createElement("div");
        divSel.setAttribute("class", "content");
        divSel.setAttribute("id", "graphSelection");
        divSel.style.display = "block";
        divSel.innerHTML = '<div>graph: <select id="graphType"><option value="chimera">chimera</option><option value="pegasus">pegasus</option></select> \
        size: <select id="graphCols"><option selected="selected" value="4">4</option><option value="8">8</option><option value="12">12</option><option value="16">16</option></select> \
        x <select id="graphRows"><option selected="selected" value="4">4</option><option value="8">8</option><option value="12">12</option><option value="16">16</option></select> \
        K <select id="graphKL"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="selected" value="4">4</option></select> \
        , <select id="graphKR"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="selected" value="4">4</option></select> \
        </div><div><input class="" id="cplCreateButton" name="createButton" type="button" value="Create default"></div> \
        <div>Read from .txt file: <input id="inputfile" type="file"></div>';
        
        var divDesc = document.createElement("div");
        divDesc.setAttribute("class", "content");
        divDesc.setAttribute("id", "graphDescription");
        divDesc.style.display = "none";
        divDesc.innerHTML = 'Current graph type: <span id="dscr_type">unknown</span>, \
        size: <span id="dscr_cols">0</span>x<span id="dscr_rows">0</span>xK<sub><span id="dscr_KL">0</span>,<span id="dscr_KR">0</span></sub><br/> \
            Number of nodes: <span id="dscr_nbNodes">0</span>, number of edges: <span id="dscr_nbEdges">0</span> \
            <div><input class="actionbutton" id="cplSaveButton" type="button" value="save to file"></div> \
            <div><input class="delbutton" id="cplDeleteButton" type="button" value="clear workspace"></div>';
        
        o.appendChild(divSel);
        o.appendChild(divDesc);
        
        document.body.appendChild(o);

        return o;
    };
    
    static createPanelSwitch() {
        let btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "sgvTransparentButton");
        btn.setAttribute("id", "sgvPanelSwitch");
        btn.setAttribute("value", "CPL");
        document.body.appendChild(btn);
        return btn;
    };

    static createConsoleSwitch() {
        let btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "sgvTransparentButton");
        btn.setAttribute("id", "sgvConsoleSwitch");
        btn.setAttribute("value", "CON");
        document.body.appendChild(btn);
        return btn;
    };

    static createDispModeSwitch() {
        let btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "sgvTransparentButton");
        btn.setAttribute("id", "sgvDispModeSwitch");
        btn.setAttribute("value", "DIS");
        document.body.appendChild(btn);
        return btn;
    };
    
   
    constructor() {
        this.panelSwitch = UI.createPanelSwitch();
        this.panelSwitch.addEventListener('click', () => { sgv.controlPanel.switchPanel(); });
        this.consoleSwitch = UI.createConsoleSwitch();
        this.consoleSwitch.addEventListener('click', () => { sgv.console.switchConsole(); });
        this.dispModeSwitch = UI.createDispModeSwitch();
        this.dispModeSwitch.addEventListener('click', () => { sgv.switchDisplayMode(); });
        
        this.nodeProperties = UI.createNodeProperties();
        this.nodeProperties.querySelector(".hidebutton").addEventListener('click', () => { sgv.cancelN(); });
        this.nodeProperties.querySelector("#setN").addEventListener('click', () => { sgv.edycjaN(); });
        this.nodeProperties.querySelector("#connectN").addEventListener('click', () => { sgv.connectNodes(); });
        this.nodeProperties.querySelector("#connectSelectN").addEventListener('click', () => { sgv.connectSelectN(); });
        this.nodeProperties.querySelector(".delbutton").addEventListener('click', () => { sgv.usunN(); });


        this.edgeProperties = UI.createEdgeProperties();
        this.edgeProperties.querySelector(".hidebutton").addEventListener('click', () => { sgv.cancelE(); });
        this.edgeProperties.querySelector("#setE").addEventListener('click', () => { sgv.edycjaE(); });
        this.edgeProperties.querySelector(".delbutton").addEventListener('click', () => { sgv.usunE(); });
        
        this.missingNodes = UI.createMissing('sgvMissingNodes');
        this.missingNodes.querySelector(".delbutton").addEventListener('click', () => { sgv.delMissing(); });

        //this.wykresy = UI.createGraphs('wykresy');
    };
};

sgv.display = (args) => {
    if ((typeof args === 'undefined')||(typeof args !== 'object')) {
        args = {};
    }
    
    sgv.ui = new UI();

   
    let targetDIV = null;
    if ('target' in args) {
        targetDIV = document.getElementById(args.target);
    }

    // no args.target or HTML element not exists
    if (targetDIV===null) {
        targetDIV = document.createElement("div");
        targetDIV.setAttribute("id", "sgvWorkspaceArea");
        document.body.appendChild(targetDIV);
    }
    
    // add canvas to targeDIV
    sgv.canvas = document.createElement("canvas");
    sgv.canvas.setAttribute("id", "sgvRenderCanvas");
    targetDIV.appendChild(sgv.canvas);

    sgv.console.initConsole("sgvConsole");
    sgv.controlPanel.init("sgvControlPanel"); // ID okienka !!!
    
    sgv.advancedTexture = null;
    sgv.sceneToRender = null;

    function createDefaultEngine() {
        return new BABYLON.Engine(sgv.canvas, true, {doNotHandleContextLost: true, preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false});
    };

    window.initFunction = async function () {
        var asyncEngineCreation = async function () {
            try {
                return createDefaultEngine();
            } catch (e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
            }
        };

        sgv.engine = await asyncEngineCreation();

        if (!sgv.engine)
            throw 'engine should not be null.';

        sgv.engine.enableOfflineSupport = false;

        sgv.createScene();
    };

    initFunction().then(() => {
        sgv.sceneToRender = sgv.scene;
        sgv.engine.runRenderLoop(function () {
            if (sgv.sceneToRender && sgv.sceneToRender.activeCamera) {
                sgv.sceneToRender.render();
            }
        });
    });

    // Resize
    window.addEventListener("resize",
        function () {
            sgv.engine.resize();
        });

};



//var createSPS = function () {
//
//};
//
//window.onload = function (e) {
//    myConsole.initConsole();
//};

//$(document).ready(function () {
//    // Executes when the HTML document is loaded and the DOM is ready
//    console.log("ready!");
//});

//$(window).on("load", function () {
//
//    // Executes when complete page is fully loaded, including
//    // all frames, objects and images
//    console.log("Window is loaded");
//});

//var sgv = new SimGraphVisualizer;



//var graf = sgv.graf;
//var scene = sgv.scene;

//export { sgv };