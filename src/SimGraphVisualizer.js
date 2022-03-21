/* global global, BABYLON, myConsole, URL */
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

sgv.display = (renderCanvas) => {
    sgv.canvas = document.getElementById(renderCanvas);

    sgv.advancedTexture = null;
    sgv.sceneToRender = null;

    function createDefaultEngine() {
        sgv.engine = new BABYLON.Engine(sgv.canvas, true, {doNotHandleContextLost: true, preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false});
        return sgv.engine;
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

        //window.engine = 
                await asyncEngineCreation();

        if (!sgv.engine)
            throw 'engine should not be null.';

        sgv.engine.enableOfflineSupport = false;

        sgv.createScene();
        //window.scene = sgv.scene;
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
                //sgv.engine.resize();
            });

    sgv.console.initConsole("konsola");  
    sgv.controlPanel.init("sterowanie"); // ID okienka !!!
};


sgv.switchDisplayMode = function() {
    if (sgv.displayMode === 'classic') {
        sgv.displayMode = 'triangle';
    } else if (sgv.displayMode === 'triangle') {
        sgv.displayMode = 'diamond';
    } else {
        sgv.displayMode = 'classic';
    }
    sgv.graf.changeDisplayMode();
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


sgv.setSize = function() {
    if (sgv.graf!==null) {
        sgv.graf.setSize( parseInt(document.getElementById("graphSize").value, 10) );
    }
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
    win.innerHTML += "<input type=\"button\" id=\"rest"+nodeId+"\" value=\" q"+nodeId+" \" onClick=\"restoreNode("+nodeId+")\">";
    document.getElementById("missing").style.display = "block";
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
    
    document.getElementById("missing").style.display = "none";
};

sgv.pokazOkienkoE = function(edgeId, x, y) {
    var okienko = document.getElementById("okienkoE");
    //var xOffset = document.getElementById("sterowanie").clientWidth - okienko.clientWidth/2;
    var xOffset = document.getElementById("renderCanvas").clientLeft;// - okienko.clientWidth/2;

    document.getElementById("titleE").innerHTML = "Edge q"+sgv.graf.edges[edgeId].begin+" &lt;---&gt; q"+sgv.graf.edges[edgeId].end;
    
    document.getElementById("edgeId").value = edgeId;
    document.getElementById("wagaE").value = sgv.graf.edgeValue(edgeId);
    
    okienko.style.top = y+"px";
    okienko.style.left = (xOffset+x)+"px";

    okienko.style.display = "block";
};

sgv.pokazOkienkoN = function(nodeId, x, y) {
    var okienko = document.getElementById("okienkoN");
    //var xOffset = document.getElementById("sterowanie").clientWidth - okienko.clientWidth/2;
    var xOffset = document.getElementById("renderCanvas").clientLeft;// - okienko.clientWidth/2;

    document.getElementById("titleN").textContent = "Node q"+nodeId;
    
    document.getElementById("nodeId").value = nodeId;
    document.getElementById("wagaN").value = sgv.graf.nodeValue(nodeId);
    
    
    let select = document.getElementById('destN');

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
    
    okienko.style.top = y+"px";
    okienko.style.left = (xOffset+x)+"px";

    okienko.style.display = "block";
};


sgv.usunE = function() {
    sgv.graf.delEdge(document.getElementById("edgeId").value);
    document.getElementById("okienkoE").style.display = "none";
};

sgv.usunN = function() {
    sgv.graf.delNode(document.getElementById("nodeId").value);
    document.getElementById("okienkoN").style.display = "none";
};


sgv.cancelE = function() {
    document.getElementById("okienkoE").style.display = "none";
};

sgv.cancelN = function() {
    document.getElementById("okienkoN").style.display = "none";
};


sgv.edycjaE = function() {
    sgv.graf.setEdgeValue(document.getElementById("edgeId").value, document.getElementById("wagaE").value);
    document.getElementById("okienkoE").style.display = "none";
};

sgv.edycjaN = function() {
    sgv.graf.setNodeValue(document.getElementById("nodeId").value, document.getElementById("wagaN").value);
    document.getElementById("okienkoN").style.display = "none";
};



sgv.connectSelectN = function() {
    nodeToConnect = parseInt( document.getElementById("nodeId").value, 10 );
    document.getElementById("okienkoN").style.display = "none";
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
            
    var graphType = '';
    var graphSize = [0,0,0,0];

    var parseComment = function(string) {
        var command = string.split("=");
        if (command[0] === 'type'){
            graphType = command[1];
        }
        else if (command[0] === 'size'){
            var size = command[1].split(",");
            graphSize[0] = parseInt(size[0], 10);
            graphSize[1] = parseInt(size[1], 10);
            graphSize[2] = parseInt(size[2], 10);
            graphSize[3] = parseInt(size[3], 10);
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
      
    if (graphType==='chimera') {
        sgv.graf = new Chimera();
    } else {
        sgv.graf = new Pegasus();
    }
    
    if (graphSize[0]===0){
        sgv.graf.setSizeFromWindow();
    }
    else {
        sgv.graf.setSize(graphSize[0],graphSize[1],graphSize[2],graphSize[3]);
    }
    
    sgv.graf.fromDef(res);
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