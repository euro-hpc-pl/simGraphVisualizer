/* global graf, scene */

var setSize = function() {
    if (graf!==null) {
        graf.setSize( parseInt(document.getElementById("graphSize").value, 10) );
    }
};


var connectNodes = function() {
    var node1 = document.getElementById("nodeId").value;
    var node2 = document.getElementById("destN").value;
  
    if (graf!==null) {
        graf.addEdge(node1, node2);
    }    
};

var addToMissing = function(nodeId) {
    var win = document.getElementById("misN");
    win.innerHTML += "<input type=\"button\" id=\"rest"+nodeId+"\" value=\" q"+nodeId+" \" onClick=\"restoreNode("+nodeId+")\">";
    document.getElementById("missing").style.display = "block";
};

var restoreNode = function(nodeId) {
    graf.restoreNode(nodeId);
    
    var but = document.getElementById("rest"+nodeId);
    but.parentNode.removeChild(but);
};


var pokazOkienkoE = function(edgeId, x, y) {
    var okienko = document.getElementById("okienkoE");
    //var xOffset = document.getElementById("sterowanie").clientWidth - okienko.clientWidth/2;
    var xOffset = document.getElementById("renderCanvas").clientLeft;// - okienko.clientWidth/2;

    document.getElementById("titleE").innerHTML = "Edge q"+graf.edges[edgeId].begin+" &lt;---&gt; q"+graf.edges[edgeId].end;
    
    document.getElementById("edgeId").value = edgeId;
    document.getElementById("wagaE").value = graf.edgeValue(edgeId);
    
    okienko.style.top = y+"px";
    okienko.style.left = (xOffset+x)+"px";

    okienko.style.display = "block";
};

var pokazOkienkoN = function(nodeId, x, y) {
    var okienko = document.getElementById("okienkoN");
    //var xOffset = document.getElementById("sterowanie").clientWidth - okienko.clientWidth/2;
    var xOffset = document.getElementById("renderCanvas").clientLeft;// - okienko.clientWidth/2;

    document.getElementById("titleN").textContent = "Node q"+nodeId;
    
    document.getElementById("nodeId").value = nodeId;
    document.getElementById("wagaN").value = graf.nodeValue(nodeId);
    
    
    let select = document.getElementById('destN');

    var length = select.options.length;
    for (let i = length-1; i >= 0; i--) {
        select.options[i] = null;
    }

    for (const key in graf.nodes) {
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


var usunE = function() {
    graf.delEdge(document.getElementById("edgeId").value);
    document.getElementById("okienkoE").style.display = "none";
};

var usunN = function() {
    graf.delNode(document.getElementById("nodeId").value);
    document.getElementById("okienkoN").style.display = "none";
};


var cancelE = function() {
    document.getElementById("okienkoE").style.display = "none";
};

var cancelN = function() {
    document.getElementById("okienkoN").style.display = "none";
};


var edycjaE = function() {
    graf.setEdgeValue(document.getElementById("edgeId").value, document.getElementById("wagaE").value);
    document.getElementById("okienkoE").style.display = "none";
};

var edycjaN = function() {
    graf.setNodeValue(document.getElementById("nodeId").value, document.getElementById("wagaN").value);
    document.getElementById("okienkoN").style.display = "none";
};



var connectSelectN = function() {
    nodeToConnect = parseInt( document.getElementById("nodeId").value, 10 );
    document.getElementById("okienkoN").style.display = "none";
};

//    
//    text0() {
//        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
//        var text1 = new BABYLON.GUI.TextBlock();
//        text1.text = "q1";
//        text1.color = "white";
//        text1.fontSize = 18;
//        //text1.position = this.nodes[0].position;
//        //text1.position = new BABYLON.Vector3(10, 50, 0);
//        
//        //var pt = camera.WorldToScreenPoint (this.nodes[0].position);
//        var pt = BABYLON.Vector3.Project(
//                       this.nodes[0].position,
//                        BABYLON.Matrix.Identity(),
//                        this.scene.getTransformMatrix(),
//                        camera.viewport.toGlobal(
//                            window.engine.getRenderWidth(),
//                            window.engine.getRenderHeight(),
//                    ));
//        
//        text1.left = pt.x;
//        text1.top = pt.y;
//        advancedTexture.addControl(text1);
//    }
//    
//    text1() {
//        //Create dynamic texture
//        var textureResolution = 512;
//	var textureGround = new BABYLON.DynamicTexture("dynamic texture", {width:512, height:256}, scene);   
//	var textureContext = textureGround.getContext();
//	
//	var materialGround = new BABYLON.StandardMaterial("Mat", scene);    				
//	materialGround.diffuseTexture = textureGround;
//	this.nodes[0].mesh.material = materialGround;
//	
//        //Add text to dynamic texture
//        var font = "bold 12px monospace";
//        textureGround.drawText("q1", 75, 135, font, "green", "white", true, true);
//    }
