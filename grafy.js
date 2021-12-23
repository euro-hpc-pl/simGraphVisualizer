"use strict";
/* global BABYLON, myConsole, Promise */

var camera = null;

var canvas = document.getElementById("renderCanvas");

var advancedTexture = null;

var engine = null;
var scene = null;
var sceneToRender = null;

var grayMat0 = null;
var grayMat1 = null;


var redMat = null;
var greenMat = null;
var blueMat = null;
var purpleMat = null;
var groundMaterial = null;

var graf = null;

var displayMode = 'classic';

var nodeToConnect = 0;

var testLabel = null;

var labelsVisible = false;

function getRandom(min, max) {
  return ( min + (Math.random()*(max-min)));
};

function createMaterials(scene) {
    grayMat0 = new BABYLON.StandardMaterial("grayMat0", scene);
    grayMat0.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    grayMat0.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    grayMat0.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    grayMat1 = new BABYLON.StandardMaterial("grayMat1", scene);
    grayMat1.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    grayMat1.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    grayMat1.emissiveColor = new BABYLON.Color3(0, 0, 0);


    redMat = new BABYLON.StandardMaterial("redMat", scene);
    redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    redMat.emissiveColor = BABYLON.Color3.Red();

    greenMat = new BABYLON.StandardMaterial("greenMat", scene);
    greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    greenMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0);

    blueMat = new BABYLON.StandardMaterial("blueMat", scene);
    blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.emissiveColor = BABYLON.Color3.Blue();

    purpleMat = new BABYLON.StandardMaterial("purpleMat", scene);
    purpleMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    purpleMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    purpleMat.emissiveColor = BABYLON.Color3.Purple();

    groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.specularColor = BABYLON.Color3.Black();
};


var createSPS = function () {

};


function createCamera(scene) {
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    //camera.setPosition(new BABYLON.Vector3(10, 100, 200));
    camera.setPosition(new BABYLON.Vector3(166, 150, 0));
    camera.attachControl(canvas, true);

    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.inertia = 0.3;

    return camera;
}
;

function createLights(scene) {
    // Light
    //var light = new BABYLON.PointLight("pointLight", camera.position, scene);
    //var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
    //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, -1), scene);

    var light = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1), 1.8, 0.01, scene);
    //light.diffuse = new BABYLON.Color3(1, 1, 1);
    //light.specular = new BABYLON.Color3(1, 1, 1);

    light.intensity = 0.75;
    light.parent = camera;
    light.position = new BABYLON.Vector3(0, 0, 0);
    //light.radius = Math.PI;// / 2);
}
;

function addEventsListeners(scene) {
    var startingPoint;
    var currentMesh;
    var ground = null;//BABYLON.MeshBuilder.CreateGround("ground", {width:10*graf.N+20, height:10*graf.N+20}, scene, false);
    //ground.material = groundMaterial;

    function getGroundPosition()
    {
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
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
            graf.edgeDoubleClicked(n2[1]);
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
                camera.detachControl(canvas);
            }, 0);
        }
    }
    ;

    function onPointerUp() {
        if (graf !== null) {
            graf.showLabels(true);
        }
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;

            return;
        }
    }
    ;

    function onPointerMove() {
        if (graf === null)
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
            graf.moveNode(parseInt(n2[1], 10), diff);

            startingPoint = current;
        }
    }
    ;


    function onPointerTap(pointerInfo) {
        function onLMBtap(pointerInfo) {
            function onMeshPicked(mesh) {
                var n2 = mesh.name.split(":");
                if (n2[0] === "edge") {
                    pokazOkienkoE(n2[1], scene.pointerX, scene.pointerY);
                } else if (n2[0] === "node") {
                    pokazOkienkoN(parseInt(n2[1], 10), scene.pointerX, scene.pointerY);
                } else {
                    cancelE();
                    cancelN();
                }
            }
            ;

            console.log("LEFT");
            if (nodeToConnect !== 0) {
                if (pointerInfo.pickInfo.hit) {
                    var n2 = pointerInfo.pickInfo.pickedMesh.name.split(":");
                    if (n2[0] === "node") {
                        let strId1 = "" + nodeToConnect + "," + parseInt(n2[1], 10);
                        let strId2 = "" + parseInt(n2[1], 10) + "," + nodeToConnect;
                        if (!(strId1 in graf.edges) && !(strId2 in graf.edges))
                            graf.addEdge(nodeToConnect, parseInt(n2[1], 10), 0.5);
                        else
                            console.log("edge already exists");
                    }
                }
                nodeToConnect = 0;
            } else {
                if (pointerInfo.pickInfo.hit) {
                    onMeshPicked(pointerInfo.pickInfo.pickedMesh);
                } else {
                    cancelE();
                    cancelN();
                }
            }
        }

        function onMMBtap(pointerInfo) {
            console.log("MIDDLE");
            if (pointerInfo.pickInfo.hit) {
                var n2 = pointerInfo.pickInfo.pickedMesh.name.split(":");
                if (n2[0] === "node") {
                    if (nodeToConnect === 0) {
                        nodeToConnect = parseInt(n2[1], 10);
                    } else {
                        let strId1 = "" + nodeToConnect + "," + parseInt(n2[1], 10);
                        let strId2 = "" + parseInt(n2[1], 10) + "," + nodeToConnect;
                        if (!(strId1 in graf.edges) && !(strId2 in graf.edges))
                            graf.addEdge(nodeToConnect, parseInt(n2[1], 10), 0.5);
                        else
                            console.log("edge already exists");
                        nodeToConnect = 0;
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

    scene.onPointerObservable.add((pointerInfo) => {
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

                if (graf !== null) {
                    graf.showLabels(false);
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
}

function createScene() {
    var scene = new BABYLON.Scene(engine);

    camera = createCamera(scene);
    createLights(scene);
    createMaterials(scene);

    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    document.getElementById('inputfile').addEventListener('change',
            function () {
                loadGraph(this.files[0]);
            });



    addEventsListeners(scene);

    /*
     var oldCamPosition = BABYLON.Vector3.Zero();
     // console.log(camera.position);
     scene.beforeRender=()=>{
     //console.log(camera.position + "   " + oldCamPosition);
     
     // camera.update();
     // if (!camera.position.equals(oldCamPosition)) {
     if (!camera.position.equals(oldCamPosition)) {
     //scene.clearColor = new BABYLON.Color3.Random();
     console.log("camera moved");
     if (graf!==null) graf.updateNodeLabels();
     oldCamPosition.copyFrom(camera.position);
     }
     };
     */


//    scene.registerBeforeRender(() => {
//        var screenXY = BABYLON.Vector3.Project(
//            graf.nodes[0].position,
//            BABYLON.Matrix.Identity(),
//            camera.getTransformationMatrix(),
//            camera.viewport.toGlobal(engine.getRenderWidth(true), engine.getRenderHeight(true))
//        );
//        console.log(screenXY);
//    });


    return scene;
}
;

window.onload = function (e) {
    myConsole.initConsole();
//    console.log("onload!");
};

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

var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, {doNotHandleContextLost: true, preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false});
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

    window.engine = await asyncEngineCreation();

    if (!engine)
        throw 'engine should not be null.';

    engine.enableOfflineSupport = false;

    window.scene = createScene();
};

initFunction().then(() => {
    sceneToRender = scene;
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
});

// Resize
window.addEventListener("resize",
        function () {
            engine.resize();
        });
