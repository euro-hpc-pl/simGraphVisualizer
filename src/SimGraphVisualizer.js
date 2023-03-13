
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

const DEFAULT_SCOPE = 'default';

var sgv = (typeof exports === "undefined") ? (function sgv() {}) : (exports);
if (typeof global !== "undefined") {
    global.sgv = sgv;
}

sgv.version = "1.0.0";
sgv.engine = null;
sgv.scene = null;
sgv.camera = null;
sgv.graf = null;

sgv.createScene = function () {
    sgv.scene = new BABYLON.Scene(sgv.engine);

    createCamera();
    createLights();

//====================================================================
// creating Solid Particle System for nodes/edges visualisation
//
    sgv.SPS = new SPS(sgv.scene);
    sgv.SPS.init();
//
//====================================================================
    
    sgv.nodeToConnect = 0;

    sgv.addEventsListeners();
    
    sgv.scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.7);


    function createCamera() {
        sgv.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), sgv.scene);
        
        //sgv.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        
        sgv.camera.setPosition(new BABYLON.Vector3(166, 150, 0));
        sgv.camera.attachControl(sgv.canvas, true);

        sgv.camera.inputs.attached.pointers.panningSensibility = 25;

        sgv.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
        sgv.camera.inertia = 0.5;
        
        //BABYLON.Camera.angularSensibilityX = 200;
        //BABYLON.Camera.angularSensibilityY = 200;
    };

    function createLights() {
        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), sgv.scene);
        //var light = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1), 1.8, 0.01, sgv.scene);
        //light.diffuse = new BABYLON.Color3(1, 1, 1);
        //light.specular = new BABYLON.Color3(1, 1, 1);

        light.intensity = 0.75;
        light.parent = sgv.camera;
        light.position = new BABYLON.Vector3(0, 0, 0);
        //light.radius = Math.PI;// / 2);
    };
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
            function onMeshPicked(pickInfo) {
                let picked = sgv.SPS.onPick(pickInfo);
                if ( (picked.type==='node') && ( picked.id in sgv.graf.nodes ) ) {
                    console.log('Node picked');
                    if (sgv.nodeToConnect !== 0) {
                        sgv.graf.addEdge(sgv.nodeToConnect, picked.id);
                        sgv.nodeToConnect = 0;
                        sgv.SPS.refresh();
                    }
                    else {
                        sgv.dlgNodeProperties.show(picked.id, sgv.scene.pointerX, sgv.scene.pointerY);
                    }
                }
                else if ( (picked.type==='edge') && (picked.id in sgv.graf.edges ) ) {
                    console.log('Edge picked');
                    sgv.dlgEdgeProperties.show(picked.id, sgv.scene.pointerX, sgv.scene.pointerY);
                }
                else {
                    console.log('Unknown mesh picked');
                    sgv.dlgEdgeProperties.hide();
                    sgv.dlgNodeProperties.hide();
                }
            };

            console.log("LEFT");
            if (pointerInfo.pickInfo.hit) {
                onMeshPicked(pointerInfo.pickInfo);
            } else {
                console.log('Probably ground picked');
                sgv.dlgEdgeProperties.hide();
                sgv.dlgNodeProperties.hide();
            }
            
        }

        function onMMBtap(pointerInfo) {
            console.log("MIDDLE");
            if (pointerInfo.pickInfo.hit) {
                let picked = sgv.SPS.onPick(pointerInfo.pickInfo);
                if ( (picked.type==='node') && ( picked.id in sgv.graf.nodes ) ) {
                    console.log('Node picked');
                 
                    if (sgv.nodeToConnect === 0) {
                        sgv.nodeToConnect = picked.id;
                    } else {
                        sgv.graf.addEdge(sgv.nodeToConnect, picked.id);
                        sgv.nodeToConnect = 0;
                        sgv.SPS.refresh();
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

    showSplashAndRun(()=>{
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
            let sceneToRender = sgv.scene;
            sgv.engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    //console.log('loop');
                    sceneToRender.render();
                }
            });
        });

        // Resize
        window.addEventListener("resize",
            function () {
                sgv.engine.resize();
                
                detectClient();
            });

        desktopInit();
    });
};



//=========================================
// functions overriden in desktop scripts

desktopInit = ()=>{
//        sgv.dlgCPL.addButton( "settings window", "cplElectronTestButton", ()=>{
//            sgv.dlgEditSettings.show();
//        } );
};
enableMenu = (id, enabled)=>{};

//=========================================

