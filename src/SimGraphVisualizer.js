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

sgv.createScene = function () {
    function createCamera() {
        sgv.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), sgv.scene);
        //camera.setPosition(new BABYLON.Vector3(10, 100, 200));
        sgv.camera.setPosition(new BABYLON.Vector3(166, 150, 0));
        sgv.camera.attachControl(sgv.canvas, true);

        sgv.camera.inputs.attached.pointers.panningSensibility = 25;

        sgv.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
        sgv.camera.inertia = 0.5;
    };

    function createLights() {
        var light = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1), 1.8, 0.01, sgv.scene);
        //light.diffuse = new BABYLON.Color3(1, 1, 1);
        //light.specular = new BABYLON.Color3(1, 1, 1);

        light.intensity = 0.75;
        light.parent = sgv.camera;
        light.position = new BABYLON.Vector3(0, 0, 0);
        //light.radius = Math.PI;// / 2);
    };

    function createDefaultObjects() {
//        function createMaterials() {
//            sgv.grayMat0 = new BABYLON.StandardMaterial("grayMat0", sgv.scene);
//            sgv.grayMat0.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.grayMat0.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
//            sgv.grayMat0.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
//
//            sgv.grayMat1 = new BABYLON.StandardMaterial("grayMat1", sgv.scene);
//            sgv.grayMat1.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.grayMat1.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.grayMat1.emissiveColor = new BABYLON.Color3(0, 0, 0);
//
//
//            sgv.redMat = new BABYLON.StandardMaterial("redMat", sgv.scene);
//            sgv.redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.redMat.emissiveColor = BABYLON.Color3.Red();
//
//            sgv.greenMat = new BABYLON.StandardMaterial("greenMat", sgv.scene);
//            sgv.greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.greenMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0);
//
//            sgv.blueMat = new BABYLON.StandardMaterial("blueMat", sgv.scene);
//            sgv.blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.blueMat.emissiveColor = BABYLON.Color3.Blue();
//
//            sgv.purpleMat = new BABYLON.StandardMaterial("purpleMat", sgv.scene);
//            sgv.purpleMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.purpleMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            sgv.purpleMat.emissiveColor = BABYLON.Color3.Purple();
//
//            sgv.groundMaterial = new BABYLON.StandardMaterial("ground", sgv.scene);
//            sgv.groundMaterial.specularColor = BABYLON.Color3.Black();
//        };
//        createMaterials();

        //sgv.defaultSphere = BABYLON.MeshBuilder.CreateBox("defaultSphere", {size: 3}, sgv.scene);
        sgv.defaultSphere = BABYLON.MeshBuilder.CreateSphere("defaultSphere", {diameter: 3, segments: 8, updatable: true}, sgv.scene);
        sgv.defaultSphere.material = new BABYLON.StandardMaterial("mat", sgv.scene);
        sgv.defaultSphere.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        sgv.defaultSphere.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        sgv.defaultSphere.material.emissiveColor = new BABYLON.Color4(1.0, 1.0, 0.0);
        sgv.defaultSphere.setEnabled(false);
    };
    
    
    sgv.scene = new BABYLON.Scene(sgv.engine);

    createCamera();
    createLights();

    createDefaultObjects();
    
    sgv.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    sgv.nodeToConnect = 0;

    sgv.addEventsListeners();
    
    sgv.scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.7);
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
    };

    function pointerDblTap(mesh) {
        var n2 = mesh.name.split(":");
        if (n2[0] === "edge")
        {
            sgv.graf.edgeDoubleClicked(n2[1]);
        }
    };

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
    };

    function onPointerUp() {
        if (sgv.graf !== null) {
            sgv.graf.showLabels(true);
        }
        if (startingPoint) {
            sgv.camera.attachControl(sgv.canvas, true);
            startingPoint = null;

            return;
        }
    };

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
    };


    function onPointerTap(pointerInfo) {
        function onLMBtap(pointerInfo) {
            function onMeshPicked(mesh) {
                console.log("mesh picked: " + mesh.name);
                var n2 = mesh.name.split(":");
                if (n2[0] === "edge") {
                    //sgv.pokazOkienkoE(n2[1], sgv.scene.pointerX, sgv.scene.pointerY);
                    sgv.dlgEdgeProperties.show(n2[1], sgv.scene.pointerX, sgv.scene.pointerY);
                    
                } else if (n2[0] === "node") {
                    //sgv.pokazOkienkoN(parseInt(n2[1], 10), sgv.scene.pointerX, sgv.scene.pointerY);
                    sgv.dlgNodeProperties.show(parseInt(n2[1], 10), sgv.scene.pointerX, sgv.scene.pointerY);
                } else {
                    //sgv.cancelE();
                    sgv.dlgEdgeProperties.hide();
                    sgv.dlgNodeProperties.hide();
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
                    //sgv.cancelE();
                    sgv.dlgEdgeProperties.hide();
                    sgv.dlgNodeProperties.hide();
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
    };

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

    desktopInit();
};

//=========================================
// functions overriden
// in desktop scripts
//
desktopInit = ()=>{};
//showSplash = ()=>{};
//hideSplash = ()=>{};
enableMenu = (id, enabled)=>{};

