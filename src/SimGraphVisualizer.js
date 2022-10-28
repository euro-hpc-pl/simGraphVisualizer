/* 
 * Copyright 2022 Dariusz Pojda.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global global, BABYLON, URL, Chimera, Pegasus, UI, parserGEXF */
"use strict";

var getRandom = function(min, max) {
    return (min + (Math.random() * (max - min)));
};

var sgv = (typeof exports === "undefined") ? (function sgv() {}) : (exports);
if (typeof global !== "undefined") {
    global.sgv = sgv;
}

sgv.version = "0.1.0";
sgv.engine = null;
sgv.scene = null;
sgv.camera = null;
sgv.graf = null;
sgv.displayMode = 'classic';
sgv.labelsVisible = false;//true;

sgv.createCamera = function () {
    sgv.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), sgv.scene);
    //camera.setPosition(new BABYLON.Vector3(10, 100, 200));
    sgv.camera.setPosition(new BABYLON.Vector3(166, 150, 0));
    sgv.camera.attachControl(sgv.canvas, true);

    sgv.camera.inputs.attached.pointers.panningSensibility = 25;
    
    sgv.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    sgv.camera.inertia = 0.5;
};

sgv.createLights = function () {
    var light = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1), 1.8, 0.01, sgv.scene);
    //light.diffuse = new BABYLON.Color3(1, 1, 1);
    //light.specular = new BABYLON.Color3(1, 1, 1);

    light.intensity = 0.75;
    light.parent = sgv.camera;
    light.position = new BABYLON.Vector3(0, 0, 0);
    //light.radius = Math.PI;// / 2);
};

sgv.createMaterials = function () {
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

sgv.createDefaultObjects = () => {
    sgv.createMaterials();
    
    //this.mesh = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, scene);
    //this.mesh = BABYLON.MeshBuilder.CreateDisc(name, {radius: 16, tessellation: 3}, scene);
    //this.mesh = BABYLON.MeshBuilder.CreatePlane(name, {width:3, height:3}, scene);
    //this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
    sgv.defaultSphere = BABYLON.MeshBuilder.CreateSphere("defaultSphere", {diameter: 3, segments: 8, updatable: true}, sgv.scene);
    sgv.defaultSphere.material = new BABYLON.StandardMaterial("mat", sgv.scene);
    sgv.defaultSphere.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.defaultSphere.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sgv.defaultSphere.material.emissiveColor = new BABYLON.Color4(0.2, 0.2, 0.2);
    sgv.defaultSphere.setEnabled(false);
};

sgv.createScene = function () {
    sgv.scene = new BABYLON.Scene(sgv.engine);

    sgv.createCamera();
    sgv.createLights();

    sgv.createDefaultObjects();
    
    sgv.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    sgv.nodeToConnect = 0;

    sgv.addEventsListeners();
    
    sgv.scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    //sgv.scene.executeWhenReady(() => {
    //    console.log("ready");
    //});
};

sgv.switchDisplayMode = function () {
    if (sgv.displayMode === 'classic') {
        sgv.displayMode = 'triangle';
    } else if (sgv.displayMode === 'triangle') {
        sgv.displayMode = 'diamond';
    } else {
        sgv.displayMode = 'classic';
    }

    if (sgv.graf !== null) {
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
                console.log("mesh picked: " + mesh.name);
                var n2 = mesh.name.split(":");
                if (n2[0] === "edge") {
                    sgv.pokazOkienkoE(n2[1], sgv.scene.pointerX, sgv.scene.pointerY);
                } else if (n2[0] === "node") {
                    sgv.pokazOkienkoN(parseInt(n2[1], 10), sgv.scene.pointerX, sgv.scene.pointerY);
                    //sgv.ui.oknoN.show(parseInt(n2[1], 10), sgv.scene.pointerX, sgv.scene.pointerY);
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

    sgv.scene.onPointerObservable.add(function (pointerInfo) {
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

sgv.connectSelectN = function () {
    sgv.nodeToConnect = parseInt(sgv.ui.nodeProperties.querySelector("#nodeId").value, 10);
    sgv.ui.nodeProperties.style.display = "none";
};

sgv.connectNodes = function () {
    var node1 = sgv.ui.nodeProperties.querySelector("#nodeId").value;
    var node2 = sgv.ui.nodeProperties.querySelector("#destN").value;

    if (sgv.graf !== null) {
        sgv.graf.addEdge(node1, node2);
    }
};

sgv.addToMissing = function (nodeId) {
    let win = sgv.ui.missingNodes.querySelector("#misN");
    
    let i = UI.newInput("button", " q" + nodeId + " ", "", "rest" + nodeId );
    
    i.addEventListener('click', function () {
        sgv.restoreNode(nodeId);
    });
    win.appendChild(i);

    this.ui.missingNodes.style.display = "block";
};

sgv.restoreNode = function (nodeId) {
    sgv.graf.restoreNode(nodeId);

    var but = sgv.ui.missingNodes.querySelector("#rest" + nodeId);
    but.parentNode.removeChild(but);
};

sgv.delMissing = function () {
    var win = sgv.ui.missingNodes.querySelector("#misN");
    win.innerHTML = "";

    if (sgv.graf !== null) {
        sgv.graf.missing = {};
    }

    this.ui.missingNodes.style.display = "none";
};

sgv.pokazOkienkoE = function (edgeId, x, y) {
    var xOffset = this.canvas.clientLeft;

    sgv.ui.edgeProperties.querySelector(".titleText").innerHTML = "Edge q" + sgv.graf.edges[edgeId].begin + " &lt;---&gt; q" + sgv.graf.edges[edgeId].end;
    sgv.ui.edgeProperties.querySelector("#edgeId").value = edgeId;
    
    let currentValue = sgv.graf.edgeValue(edgeId);
    if (currentValue===null) {
        sgv.ui.edgeProperties.querySelector("#valueCheckE").checked = "";
        sgv.ui.edgeProperties.querySelector("#wagaE").value = null;
        sgv.ui.edgeProperties.querySelector("#wagaE").disabled = "disabled";
        sgv.ui.edgeProperties.querySelector("#setE").disabled = "disabled";
    } else {
        sgv.ui.edgeProperties.querySelector("#valueCheckE").checked = "checked";
        sgv.ui.edgeProperties.querySelector("#wagaE").value = currentValue;
        sgv.ui.edgeProperties.querySelector("#wagaE").disabled = "";
        sgv.ui.edgeProperties.querySelector("#setE").disabled = "";
    }

    
    //sgv.ui.edgeProperties.querySelector("#wagaE").value = sgv.graf.edgeValue(edgeId);

    sgv.ui.edgeProperties.style.top = y + "px";
    sgv.ui.edgeProperties.style.left = (xOffset + x) + "px";
    sgv.ui.edgeProperties.style.display = "block";
};

sgv.pokazOkienkoN = function (nodeId, x, y) {
    var xOffset = this.canvas.clientLeft;

    sgv.ui.nodeProperties.querySelector(".titleText").textContent = "Node q" + nodeId;
    sgv.ui.nodeProperties.querySelector("#nodeId").value = nodeId;
    
    
    let nss = sgv.ui.nodeProperties.querySelector("#nsSelectN");

    var length = nss.options.length;
    for (let i = length - 1; i >= 0; i--) {
        nss.options[i] = null;
    }

    for (const key in sgv.graf.scopeOfValues) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.innerHTML = sgv.graf.scopeOfValues[key];
        if ( sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
            opt.selected = "selected";
        }
        nss.appendChild(opt);
    }

    
    
    let currentValue = sgv.graf.nodeValue(nodeId);
    if ((currentValue===null)||isNaN(currentValue)) {
        sgv.ui.nodeProperties.querySelector("#valueCheckN").checked = "";
        sgv.ui.nodeProperties.querySelector("#wagaN").value = null;
        sgv.ui.nodeProperties.querySelector("#wagaN").disabled = "disabled";
        sgv.ui.nodeProperties.querySelector("#setN").disabled = "disabled";
    } else {
        sgv.ui.nodeProperties.querySelector("#valueCheckN").checked = "checked";
        sgv.ui.nodeProperties.querySelector("#wagaN").value = currentValue;
        sgv.ui.nodeProperties.querySelector("#wagaN").disabled = "";
        sgv.ui.nodeProperties.querySelector("#setN").disabled = "";
    }
        
    let select = sgv.ui.nodeProperties.querySelector("#destN");

    var length = select.options.length;
    for (let i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }

    for (const key in sgv.graf.nodes) {
        //console.log(nodeId, key);
        if (key.toString() !== nodeId.toString()) {
            var opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = "q" + key;
            select.appendChild(opt);
        }
    }

    sgv.ui.nodeProperties.style.top = y + "px";
    sgv.ui.nodeProperties.style.left = (xOffset + x) + "px";
    sgv.ui.nodeProperties.style.display = "block";
};


sgv.usunE = function () {
    sgv.graf.delEdge(sgv.ui.edgeProperties.querySelector("#edgeId").value);
    sgv.ui.edgeProperties.style.display = "none";
};

sgv.usunN = function () {
    sgv.graf.delNode(sgv.ui.nodeProperties.querySelector("#nodeId").value);
    sgv.ui.nodeProperties.style.display = "none";
};

sgv.cancelE = function () {
    sgv.ui.edgeProperties.style.display = "none";
};

sgv.cancelN = function () {
    sgv.ui.nodeProperties.style.display = "none";
};

sgv.changeScopeN = function () {
    console.log('changeScopeN: ' + event.target.value);
    
    let nodeId = sgv.ui.nodeProperties.querySelector("#nodeId").value;
    
    let currentValue = sgv.graf.nodeValue(nodeId,sgv.graf.scopeOfValues[event.target.value]);
    if ((currentValue===null)||isNaN(currentValue)) {
        console.log('NULL');
        sgv.ui.nodeProperties.querySelector("#valueCheckN").checked = "";
        sgv.ui.nodeProperties.querySelector("#wagaN").value = null;
        sgv.ui.nodeProperties.querySelector("#wagaN").disabled = "disabled";
        sgv.ui.nodeProperties.querySelector("#setN").disabled = "disabled";
    } else {
        console.log('NOT NULL');
        sgv.ui.nodeProperties.querySelector("#valueCheckN").checked = "checked";
        sgv.ui.nodeProperties.querySelector("#wagaN").value = currentValue;
        sgv.ui.nodeProperties.querySelector("#wagaN").disabled = "";
        sgv.ui.nodeProperties.querySelector("#setN").disabled = "";
    }
};


sgv.edycjaE = function () {
    let id = sgv.ui.edgeProperties.querySelector("#edgeId").value;
    let val = parseFloat(sgv.ui.edgeProperties.querySelector("#wagaE").value.replace(/,/g, '.'));
    sgv.graf.setEdgeValue(id, val);
    sgv.ui.edgeProperties.style.display = "none";
};

sgv.edycjaN = function () {
    let id = sgv.ui.nodeProperties.querySelector("#nodeId").value;
    let val = parseFloat(sgv.ui.nodeProperties.querySelector("#wagaN").value.replace(/,/g, '.'));
    let scope = sgv.graf.scopeOfValues[sgv.ui.nodeProperties.querySelector("#nsSelectN").value];
    sgv.graf.setNodeValue(id, val, scope);
    sgv.ui.nodeProperties.style.display = "none";
};

sgv.activateN = function () {
    let scope = sgv.graf.scopeOfValues[sgv.ui.nodeProperties.querySelector("#nsSelectN").value];
    let isActive = sgv.ui.nodeProperties.querySelector("#valueCheckN").checked;
    if (isActive) {
        sgv.ui.nodeProperties.querySelector("#wagaN").disabled = "";
        sgv.ui.nodeProperties.querySelector("#setN").disabled = "";
        let val = parseFloat(sgv.ui.nodeProperties.querySelector("#wagaN").value.replace(/,/g, '.'));
        if (val==="") {
            val=0;
            sgv.ui.nodeProperties.querySelector("#wagaN").value = val;
        }
        sgv.graf.setNodeValue(sgv.ui.nodeProperties.querySelector("#nodeId").value, val, scope);
    } else {
        sgv.ui.nodeProperties.querySelector("#wagaN").disabled = "disabled";
        sgv.ui.nodeProperties.querySelector("#setN").disabled = "disabled";
        sgv.graf.delNodeValue(sgv.ui.nodeProperties.querySelector("#nodeId").value, scope);
    }
};

sgv.activateE = function () {
    let isActive = sgv.ui.edgeProperties.querySelector("#valueCheckE").checked;
    if (isActive) {
        sgv.ui.edgeProperties.querySelector("#wagaE").disabled = "";
        sgv.ui.edgeProperties.querySelector("#setE").disabled = "";
        let val = parseFloat(sgv.ui.edgeProperties.querySelector("#wagaE").value.replace(/,/g, '.'));
        if (val==="") {
            val=0;
            sgv.ui.edgeProperties.querySelector("#wagaE").value = val;
        }
        sgv.graf.setEdgeValue(sgv.ui.edgeProperties.querySelector("#edgeId").value, val);
    } else {
        sgv.ui.edgeProperties.querySelector("#wagaE").disabled = "disabled";
        sgv.ui.edgeProperties.querySelector("#setE").disabled = "disabled";
        sgv.graf.delEdgeValue(sgv.ui.edgeProperties.querySelector("#edgeId").value);
    }
};

sgv.stringToScope = (data,newScope) => {
    let r = sgv.graf.loadScopeValues(newScope,data);
            
    if (r.n) {
        sgv.controlPanel.ui().querySelector("#cplDispValues").add(UI.option(newScope,newScope));
    }
    sgv.controlPanel.ui().querySelector("#cplDispValues").selectedIndex = r.i;
};

sgv.toGEXF = function () {
    function download(text, name, type) {
        //var a = document.getElementById("mysaver");
        let a = document.createElement("a");
        let file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    var string = sgv.graf.exportGEXF();

    download(string, 'graphDefinition.gexf', 'text/xml');
};

sgv.toTXT = function () {
    function download(text, name, type) {
        //var a = document.getElementById("mysaver");
        let a = document.createElement("a");
        let file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    var string = sgv.graf.exportTXT();

    download(string, 'graphDefinition.txt', 'text/plain');
};


sgv.fromTXT = function (string) {
    var res = [];
    var lines = string.split("\n");

    var gDesc = sgv.controlPanel.getGraphTypeAndSize();

    var parseComment = function (string) {
        var command = string.split("=");
        if (command[0] === 'type') {
            gDesc.type = command[1];
        } else if (command[0] === 'size') {
            var size = command[1].split(",");
            gDesc.size = {
                cols: parseInt(size[0], 10),
                rows: parseInt(size[1], 10),
                KL: parseInt(size[2], 10),
                KR: parseInt(size[3], 10)
            };
        }
    };

    var parseData = function (string) {
        var line = string.split(" ");
        if (line.length === 3) {
            return {
                n1: parseInt(line[0], 10),
                n2: parseInt(line[1], 10),
                val: parseFloat(line[2], 10)
            };
        } else {
            return null;
        }
    };

    while (lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            var d = parseData(lines[0]);
            if (d !== null) {
                res.push(d);
            }
        } else {
            var line = lines[0].split(" ");
            parseComment(line[1]);
        }
        lines.shift();
    }

    switch (gDesc.type) {
        case "chimera" :
            sgv.graf = Chimera.createNewGraph(gDesc.size);
            break;
        case "pegasus" :
            sgv.graf = Pegasus.createNewGraph(gDesc.size);
            break;
    }

    sgv.graf.createStructureFromDef(res);
};


//=======================


sgv.display = function(args) {
    if ((typeof args === 'undefined') || (typeof args !== 'object')) {
        args = {};
    }

    sgv.ui = new UI();


    let targetDIV = null;
    if ('target' in args) {
        targetDIV = document.getElementById(args.target);
    }

    // no args.target or HTML element not exists
    if (targetDIV === null) {
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
    }
    

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

    initFunction().then( function() {
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