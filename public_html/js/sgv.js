/* global BABYLON, scene */


class Label {
    constructor(labelId, txt, position, scene) {
        this.id = labelId;
        this.createMe(txt,position,scene);
    };
    
    async createMe(txt,position,scene) {

        //Set font
        var font_size = 48;
        var font = "normal " + font_size + "px Arial";

        //Set height for plane
        var planeHeight = 4;

        //Set height for dynamic texture
        var DTHeight = 1.5 * font_size; //or set as wished

        //Calcultae ratio
        var ratio = planeHeight/DTHeight;

        //Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
        var temp = new BABYLON.DynamicTexture("DynamicTexture", 64, scene);
        var tmpctx = temp.getContext();
        tmpctx.font = font;
        
	//Set text
        var text = txt;
	
        var DTWidth = tmpctx.measureText(text).width + 8;
    
        //Calculate width the plane has to be 
        var planeWidth = DTWidth * ratio;

        //Create dynamic texture and write the text
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:DTWidth, height:DTHeight}, scene, false);
        mat.diffuseTexture.drawText(text, null, null, font, "#000000", "#ffff00", true);
    
        //const abstractPlane = BABYLON.Plane.FromPositionAndNormal(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 1, 0));
        //Create plane and set dynamic texture as material
        //this.plane = BABYLON.MeshBuilder.CreatePlane("plane", {sourcePlane: abstractPlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE, width:planeWidth, height:planeHeight}, scene);
    
        this.plane = BABYLON.MeshBuilder.CreatePlane(this.id+"_plane", {width:planeWidth, height:planeHeight, updatable:true}, scene);
        this.plane.material = mat;
        
        
        this.plane.position = position.add( new BABYLON.Vector3(0.0, 5.0, 0.0) );

        //console.log( position, this.plane.position );

        this.plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        
        this.plane.setEnabled(false);
        
        this.plane.isPickable = false;
    };
    
    setEnabled(b) {
        this.plane.setEnabled(b);
    };

}




class Label2 {
    constructor(labelId, txt, position, scene) {
        this.id = labelId;
        var text = txt;
        
        var lbLit = txt.length;
        
        var planeHeight = 48.0/15.0;
        var planeWidth = lbLit*26.0/15.0;

        const mat = new BABYLON.StandardMaterial("mat");

//       mat.diffuseTexture = BABYLON.Texture.CreateFromBase64String("data:image/jpg;base64,/9j/4AAQgABAQAAAD/2wBDAAgGBgcGBQ...", "texture name", scene); 
        
        mat.diffuseTexture = new BABYLON.Texture("cyferki.png");
        mat.diffuseTexture.uScale = lbLit/11.0;
        mat.diffuseTexture.vScale = 1.0;
        mat.diffuseTexture.uOffset = 1.0/11.0;
        mat.diffuseTexture.vOffset = 0.0;

        this.plane = BABYLON.MeshBuilder.CreatePlane(labelId+"_plane", {width:planeWidth, height:planeHeight, updatable:true}, scene);
        this.plane.material = mat;
        
        this.plane.position = position.add( new BABYLON.Vector3(0.0, 5.0, 0.0) );

        this.plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        
        this.plane.setEnabled(false);
        this.plane.isPickable = false;
    };
    
    setEnabled(b) {
        this.plane.setEnabled(b);
    };

}
"use strict";
/* global BABYLON, greenMat, redMat, grayMat0, grayMat1, advancedTexture, sgv */
const drawLabels = true;//false;

const createLabel = (id, position, scene) => {
    return new Label("q" + id, "q" + id, position, scene);
};


class Node {
    constructor(id, x, y, z, val) {
        var name = "node:" + id;

        this.id = id;
        this.active = true;
        this._chckedEdges = 0;
        
        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, {diameter: 3, segments: 8, updatable: true}, sgv.scene);
        //this.mesh = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, scene);
        //this.mesh = BABYLON.MeshBuilder.CreateDisc(name, {radius: 16, tessellation: 3}, scene);
        //this.mesh = BABYLON.MeshBuilder.CreatePlane(name, {width:3, height:3}, scene);
        //this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        
        this.mesh.position = new BABYLON.Vector3( x, y, z );

        this.values = {};

        this.setValue(getRandom(-0.99, 0.99), 'losowe');
        this.setValue(val);


        //this.label = new Label("q" + this.id, "q" + this.id, this.mesh.position, scene);
        this.label = createLabel(this.id, this.mesh.position, sgv.scene);
    }

    set position(pos) {
        this.mesh.position = pos;
        //this.label.plane.position.copyFrom( pos ).addInPlaceFromFloats(0.0, 5.0, 0.0);
    }

    get position() {
        return this.mesh.position;
    }

    clear() {
        this.mesh.dispose();
        delete this.mesh;
        this.label.plane.dispose();
        delete this.label.plane;
        delete this.label;
    }

    showLabel(b) {
        this.label.setEnabled(b);
    }

    move(diff) {
        this.mesh.position.addInPlace(diff);
        //this.updateLabel();
    }

    addCheck() {
        this._chckedEdges++;
        this.mesh.material = sgv.grayMat1;
    }

    delCheck() {
        this._chckedEdges--;
        if (this._chckedEdges === 0)
            this.mesh.material = sgv.grayMat0;
    }

    getValue(valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        
        return this.values[valId];
    }
    
    setValue(val, valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        this.values[valId] = val;

        var mat = new BABYLON.StandardMaterial("mat", sgv.scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveColor = valueToColor(val);

        this.mesh.material = mat;
    }
    
    displayValue(valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        
        if (valId in this.values) {
//            var mat = new BABYLON.StandardMaterial("mat", scene);
//            mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            mat.emissiveColor = valueToColor(this.values[valId]);

            this.mesh.material.emissiveColor = valueToColor(this.values[valId]);
        }
    }
}

"use strict";
/* global BABYLON, sgv */

class Edge {
    constructor(graf, b, e, val) {
        this.parentGraph = graf;
        this.values = {};

        this.begin = b;
        this.end = e;

        this._checked = false;

        this.createInstance(val);
    }

    update() {
        var options = {
            instance: this.instance,
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ]
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);
    }

    switchCheckFlag() {
        this._checked = !this._checked;

        this.parentGraph.checkNode(this.begin, this._checked);
        this.parentGraph.checkNode(this.end, this._checked);

        this.instance.material = this._checked ? sgv.grayMat1 : sgv.grayMat0;
    }
    
    
    getValue(valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        
        return this.values[valId];
    }

    setValue(val, valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        this.values[valId] = val;

        this.displayValue(valId);
    }
    
    displayValue(valId) {
        if (valId === undefined) {
            valId = 'value';
        }

        let edgeColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        let edgeWidth = 0.1;
        if (valId in this.values) {
            edgeColor = valueToColor(this.values[valId]);
            edgeWidth = valueToEdgeWidth(this.values[valId]);
        }
        
        var options = {
            instance: this.instance,
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ],
            radius: edgeWidth
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);
        this.instance.material.emissiveColor = edgeColor;
    }
    
    
    createInstance(val) {
        let edgeColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        let edgeWidth = 0.1;
        
        if (val === undefined) {
            this.values['value'] = Number.NaN;
        } else {
            this.values['value'] = val;
            edgeColor = valueToColor(val);
            edgeWidth = valueToEdgeWidth(val);
        }
        
        var options = {
            path: [
                this.parentGraph.nodePosition( this.begin ),
                this.parentGraph.nodePosition( this.end )
            ],
            radius: edgeWidth,
            updatable: true
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);

        var mat = new BABYLON.StandardMaterial("mat", sgv.scene);
        mat.diffuseColor = edgeColor;
        mat.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        mat.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        
        this.instance.material = mat;        
    }

    
};
"use strict";
/* global BABYLON, labelsVisible, sgv */


var graphVisualiser = ( function () {
    var addNodesPart = function(size) {
        var nodeModel = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, sgv.scene);//BABYLON.MeshBuilder.CreatePolyhedron("m", {}, sgv.scene);
        this.nodesSPS.addShape(nodeModel, size);
        const nodeMesh = this.nodesSPS.buildMesh();
        nodeModel.dispose();
    };
    
    return {
        initialize : function() {
            this.nodesSPS = new BABYLON.SolidParticleSystem('nodes_SPS', sgv.scene, {isPickable: true});
            //    var edgesSPS = new BABYLON.SolidParticleSystem('edges_SPS', sgv.scene, {isPickable: true});
            //    var labelsSPS = new BABYLON.SolidParticleSystem('labels_SPS', sgv.scene, {isPickable: true});

            addNodesPart(100);
            this.nextNodeId = 0;

            //    var labelModel = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, sgv.scene);//BABYLON.MeshBuilder.CreatePolyhedron("m", {}, sgv.scene);
            //    nodesSPS.addShape(nodeModel, nb);
            //    const nodeMesh = nodesSPS.buildMesh();
            //    nodeModel.dispose();
        },
        
        dispose : function() {
            
        },
        
        getNodeModelId : function () {
            if (this.nextNodeId>=this.nodesSPS.nbParticles) {
                this.addNodesPart(100);
            }
            result = this.nextNodeId;
            this.nextNodeId++;
            
            return result;
        }
    };
});


class Graph {
    constructor() {
        this.nodes = {};
        this.edges = {};
        
        this.missing = {};

        this.type = 'generic';

    };

    dispose() {
        for (const key in this.edges) {
            this.edges[key].instance.dispose();
            delete this.edges[key];
        }
        for (const key in this.nodes) {
            this.nodes[key].clear();
            delete this.nodes[key];
        }
        for (const key in this.missing) {
            
        }
    }

    clear() {
        this.dispose();
    }

    maxNodeId() {
        return Object.keys(this.nodes).length;
    }

    addNode(nodeId, pos, val) {
        this.nodes[nodeId] = new Node(nodeId, pos.x, pos.y, pos.z, val);
    }

    restoreNode(nodeId) {
        this.addNode( nodeId, this.calcPosition(nodeId), this.missing[nodeId].value );

        for (const key in this.missing[nodeId].edges) {
            var nKey = parseInt(key,10);
            if (nKey in this.nodes) {
                console.log("key: ", nKey, typeof(nKey));
                if (nodeId < key) {
                    this.addEdge( nodeId, nKey, this.missing[nodeId].edges[nKey]);  
                }
                else {
                    this.addEdge(nKey, nodeId, this.missing[nodeId].edges[nKey]);  
                }
            }
            else if (nKey in this.missing) {
                this.missing[nKey].edges[nodeId] = this.missing[nodeId].edges[nKey];
            }
        }

        delete this.missing[nodeId];

        if ( Object.keys(this.missing).length === 0 )
            sgv.ui.missingNodes.style.display = "none";
    }

    addEdge(node1, node2, val) {
        if (node1<node2) {
            var strId = "" + node1 + "," + node2;
            this.edges[strId] = new Edge(this, node1, node2);//, val);
        }
        else {
            var strId = "" + node2 + "," + node1;
            this.edges[strId] = new Edge(this, node2, node1);//, val);
        }
    }

    delEdge(edgeId) {
        this.edges[edgeId].instance.dispose();
        delete this.edges[edgeId];
    }

    findAndDeleteEdges(nodeId)
    {
        var removedEdges = {};

        console.log("graf.findAndDeleteEdges", nodeId);
        
        for (const key in this.edges) {
            if ( this.edges[key].begin.toString() === nodeId ) {
                removedEdges[ this.edges[key].end ] = this.edges[key].value;
                this.delEdge(key);
            }
            else if ( this.edges[key].end.toString() === nodeId ) {
                removedEdges[ this.edges[key].begin ] = this.edges[key].value;
                this.delEdge(key);
            }
        }
        
        return removedEdges;
    }

    delNode(nodeId) {
        var tmpEdges = this.findAndDeleteEdges(nodeId);
        
        this.missing[nodeId] = {
            value : this.nodes[nodeId].value,
            edges : {}
        };
        
        for (const key in tmpEdges) {
            this.missing[nodeId].edges[key] = tmpEdges[key]; 
        };

        this.nodes[nodeId].mesh.dispose();
        delete this.nodes[nodeId];
        
        sgv.addToMissing(nodeId);
    }


    findAndUpdateEdges(nodeId)
    {
        for (const key in this.edges) {
            if ((this.edges[key].begin.toString() === nodeId) || (this.edges[key].end.toString() === nodeId)) {
                this.edges[key].update();
            }
        }
    }

    showLabels(b) {
        if (sgv.labelsVisible) {
            for (const key in this.nodes) {
                this.nodes[key].showLabel(b);
            }
        }
    }
    
    displayValues(valId) {
        let firstKey = Object.keys(this.nodes)[0];
        
        let prefix = '';
        
        if ( (valId === undefined) || !(valId in this.nodes[firstKey].values) ) {
            valId = 'value';
            prefix = "[incorrect, setting default] ";
        }
        
        for (const key in this.nodes) {
            this.nodes[key].displayValue(valId);
        }
        return prefix + valId;
    }
    
//    updateNodeLabels(show) {
//        for (const key in this.nodes) {
//            this.nodes[key].updateLabel(show);
//        }
//    }

    nodePosition(nodeId) {
        return this.nodes[nodeId].position;
    }

    checkNode(nodeId, check) {
        if (check) {
            this.nodes[nodeId].addCheck();
        } else {
            this.nodes[nodeId].delCheck();
        }
    }

    edgeDoubleClicked(id) {
        this.edges[id].switchCheckFlag();
    }

    moveNode(nodeId, diff) {
        this.nodes[nodeId].move(diff);
        this.findAndUpdateEdges(nodeId);
    }

    setEdgeValue(edgeId, value) {
        this.edges[edgeId].setValue(value);
    }

    edgeValue(edgeId) {
        return this.edges[edgeId].value;
    }

    setNodeValue(nodeId, value) {
        this.nodes[nodeId].setValue(value);
    }

    nodeValue(nodeId) {
        return this.nodes[nodeId].getValue();
    }
    
    getMinMaxVal() {
        var result = {
            min: 99999.9,
            max: -99999.9
        };
        
        for (const key in this.edges) {
            if (this.edges[key].value < result.min) {
                result.min = this.edges[key].value;
            }

            if (this.edges[key].value > result.max) {
                result.max = this.edges[key].value;
            }
        }
        for (const key in this.nodes) {
            if (this.nodes[key].value < result.min) {
                result.min = this.nodes[key].value;
            }

            if (this.nodes[key].value > result.max) {
                result.max = this.nodes[key].value;
            }
        }
        
        return result;
    }
    
    calcPosition(key){
        // override in derrived class
        return new BABYLON.Vector3();
    }
    
    changeDisplayMode() {
        for (const key in this.nodes) {
            let pos = this.calcPosition(key);
            this.nodes[key].position.copyFrom( pos );
            this.nodes[key].label.plane.position.copyFrom( pos ).addInPlaceFromFloats(0.0, 5.0, 0.0);
        }
        
        for (const key in this.edges) {
            this.edges[key].update();
        }
    }
}

function valueToColor(val) {
    var max = 1.0;

    if ( val > 0 ) {
        var r = 0;
        var g = (val < max) ? (val / max) : 1.0;
        var b = 1.0 - g;
    }
    else if ( val < 0 ) {
        var r = ((-val) < max) ? (-val / max) : 1.0;
        var g = 0;
        var b = 1.0 - r;
    }
    else {
        var r = 0;
        var g = 0;
        var b = 1.0;
    }

    return new BABYLON.Color3(r, g, b);
}


function valueToEdgeWidth(val) {
    var w = Math.abs(val)/2;
    if ( w>0.5 )
        w = 0.7;
    else if ( w<0.1 )
        w = 0.1;

    return w;
}
"use strict";
/* global BABYLON, displayMode, sgv */

class Chimera extends Graph {
    constructor() {
        super();

        this.type = 'chimera';

        //this.setSize(4,4,4,4);
    }
    
    static createNewGraph(size) {
        var g = new Chimera();
        
        g.cols = size.cols;
        g.rows = size.rows;
        g.KL =   size.KL;
        g.KR =   size.KR;
        
        g.nbModules = g.cols * g.rows;
        g.modSize = g.KL + g.KR;

        g.size = g.nbModules * g.modSize;

        g.createNew();

        return g;
    }

    
    setSize(c, r, kl, kr) {
        this.cols = c;
        this.rows = r;
        this.KL = kl;
        this.KR = kr;
        
        this.nbModules = this.cols * this.rows;
        this.modSize = this.KL + this.KR;

        this.size = this.nbModules * this.modSize;
    }
    
    maxNodeId() {
        return this.cols * this.rows * (this.KL + this.KR);
    }

    createNew() {
        //const start = performance.now();
        for (let m = 0; m<this.nbModules; m++) {
            this.createModule( m );
        }
        //const end = performance.now();
        //console.log(end - start);
        
        for (let x=0; x<this.nbModules; x+=this.rows)
            for (let y=1; y<this.rows; y++) {
                this.connectRowModules( x+(y-1), x+y );
            }    
    
        for (let y=0; y<this.rows; y++)
            for (let x=this.rows; x<this.nbModules; x+=this.rows) {
                this.connectColModules( (x-this.rows)+y, x+y );
            }    
    
        super.showLabels(true);
    }
    

    connectRowModules(module1id, module2id) {
        for (let i=(this.KL+1); i<=this.modSize; i++) {
            this.addEdge(this.modSize*module1id + i, this.modSize*module2id + i, 0.0);
        }
    }

    connectColModules(module1id, module2id) {
        for (let i=1; i<=this.KL; i++) {
            this.addEdge(this.modSize*module1id + i, this.modSize*module2id + i, 0.0);
        }
    }


    createModule(moduleId) {
        var offset = this.modSize*moduleId;
        
        // MODULE NODES
        for (let i=1; i<=this.modSize; i++) {
            this.addNode( offset+i, this.calcPosition(offset+i), 0.0 );
        }

        // INTERNAL MODULE EDGES
        for (let x=1; x<=this.KL; x++)
            for (let y=(this.KL+1); y<=this.modSize; y++) {
                this.addEdge( offset + x, offset + y, 0.0);        
            }
    }
    
    mX = {
      '-8': 375,
      '-7': 325,
      '-6': 275,
      '-5': 225,
      '-4': 175,
      '-3': 125,
      '-2': 75,
      '-1': 25,
      '0': -25,
      '1': -75,
      '2': -125,
      '3': -175,
      '4': -225,
      '5': -275,
      '6': -325,
      '7': -375
    };

    mmX(i) {
        return -25 - 50 * i;
    }

    mY = {
      '-8': 75,
      '-7': 65,
      '-6': 55,
      '-5': 45,
      '-4': 35,
      '-3': 25,
      '-2': 15,
      '-1':  5,
      '0':  -5,
      '1': -15,
      '2': -25,
      '3': -35,
      '4': -45,
      '5': -55,
      '6': -65,
      '7': -75
    };
    
    mmY(i) {
        return -5 - 10 * i;
    }
    
    mZ = {
      '-8': -375,
      '-7': -325,
      '-6': -275,
      '-5': -225,
      '-4': -175,
      '-3': -125,
      '-2': -75,
      '-1': -25,
      '0':   25,
      '1':   75,
      '2':  125,
      '3':  175,
      '4':  225,
      '5':  275,
      '6':  325,
      '7':  375
    };

    mmZ(i) {
        return 25 + 50 * i;
    }



    getNodeOffset(nodeId) {
        //console.log(nodeId);
        
        let nodeOffset = {
            'classic': [    new BABYLON.Vector3(  15, -3, -10),
                            new BABYLON.Vector3(   5, -1, -10),
                            new BABYLON.Vector3(  -5,  1, -10),
                            new BABYLON.Vector3( -15,  3, -10),
                            new BABYLON.Vector3(  15,  3,  10),
                            new BABYLON.Vector3(   5,  1,  10),
                            new BABYLON.Vector3(  -5, -1,  10),
                            new BABYLON.Vector3( -15, -3,  10)],

            'diamond': [    new BABYLON.Vector3(   0, -3,   9),
                            new BABYLON.Vector3(   0, -1,   3),
                            new BABYLON.Vector3(   0,  1,  -3),
                            new BABYLON.Vector3(   0,  3,  -9),
                            new BABYLON.Vector3(   9,  3,   0),
                            new BABYLON.Vector3(   3,  1,   0),
                            new BABYLON.Vector3(  -3, -1,   0),
                            new BABYLON.Vector3(  -9, -3,   0)],

            'triangle': [   new BABYLON.Vector3(  -15, -3,   9),
                            new BABYLON.Vector3(  -15, -1,   3),
                            new BABYLON.Vector3(  -15,  1,  -3),
                            new BABYLON.Vector3(  -15,  3,  -9),
                            new BABYLON.Vector3(   9,  3, 15),
                            new BABYLON.Vector3(   3,  1, 15),
                            new BABYLON.Vector3(  -3, -1, 15),
                            new BABYLON.Vector3(  -9, -3, 15)]
        };
        
        let idx = nodeId;
        if (idx<this.KL) {
            return nodeOffset[sgv.displayMode][idx];
        }
        else {
            idx -= this.KL;
            idx += 4;
            return nodeOffset[sgv.displayMode][idx];
        }
    }
    
    
    calcPosition(nodeId) {
        var moduleId = Math.floor( (nodeId-1) / this.modSize );
        var nodeIdInModule = Math.floor( (nodeId-1) % this.modSize );

        var moduleRow = Math.floor( moduleId / this.rows ) - (this.rows/2);
        var moduleCol = Math.floor( moduleId % this.cols ) - (this.cols/2);
        
        var newPos = new BABYLON.Vector3( this.mX[moduleRow], this.mY[moduleRow], this.mZ[moduleCol] );
        //var newPos = new BABYLON.Vector3( this.mmX(moduleRow), this.mmY(moduleRow), this.mmZ(moduleCol) );
        
        newPos.addInPlace( this.getNodeOffset(nodeIdInModule) );

        return newPos;
    };
    
    
   
    fromDef = function(def) {
        for (let i = 0; i<def.length; i++) {
            if (def[i].n1 === def[i].n2) {
                let nodeId = def[i].n1;

                this.addNode( nodeId, this.calcPosition(nodeId), def[i].val );
            }
            else {
                let n1 = def[i].n1;
                let n2 = def[i].n2;
                this.addEdge( n1, n2, def[i].val );
                //let strId = "" + n1 + "," + n2;
                //this.edges[strId].setValue(  );
            }
        }
        //console.log(this.nodes);
    };
    
    
    
    
    
}

"use strict";
/* global BABYLON, sgv */

function qD(x,y,z,i,j,k) {
    return new QbDescr( x, y, z, i, j, k ); 
}


class QbDescr {
    constructor(x,y,z,i,j,k) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.i = i;
        this.j = j;
        this.k = k;
    };
    
    n0() { return ( ( ( this.i << 1 ) + this.j ) << 1 ) + this.k; };

    n1() { return ( ( ( this.i << 1 ) + this.j ) << 1 ) + this.k + 1; };
    
    toNodeId(rows,cols) { return 8 * ( this.x + (this.y + this.z*rows)*cols ) + this.n1(); }
    
    static fromNodeId(nodeIdA, rows, cols) {
        let nodeId = nodeIdA-1;

        let n = nodeId % 8;

        let k = n % 2;
        let j = ( n >> 1 ) % 2;
        let i = ( n >> 2 ) % 2;

        let modId = nodeId >> 3;

        let layerSize = cols*rows;
        let currentLayer = Math.floor(modId / layerSize);
        let modIdInLayer = modId % layerSize;
        let currentRow = Math.floor(modIdInLayer / cols);
        let currentCol = modIdInLayer % cols;
        return new QbDescr(currentCol, currentRow, currentLayer, i, j, k);
    };
};

class Pegasus extends Graph {
    constructor() {
        super();

        this.type = 'pegasus';
        
        //this.setSize(4,4,4,4);
    }
    
    static createNewGraph(size) {
        var g = new Pegasus();
        
        g.cols = size.cols;
        g.rows = size.rows;
        g.KL =   size.KL;
        g.KR =   size.KR;

        g.layers = 3;

        g.nbModules = g.cols * g.rows * g.layers;
        
        g.modSize = g.KL + g.KR;

        g.size = g.nbModules * g.modSize;
        
        g.createNew();

        return g;
    }

   
    setSize(c, r, kl, kr) {
        this.cols = c;
        this.rows = r;
        this.KL = kl;
        this.KR = kr;
        this.layers = 3;
        
        this.nbModules = this.cols * this.rows * this.layers;
        this.modSize = this.KL + this.KR;

        this.size = this.nbModules * this.modSize;
    }
    
    maxNodeId() {
        return this.cols * this.rows * 8;
    }

    createNew() {
        for (let z = 0; z < this.layers; z++) {
            for (let y=0; y<this.rows; y++) {
                for (let x=0; x<this.cols; x++) {
                    this.createModule2( x, y, z );
                }
            }
        }
        

        for (let z = 0; z < this.layers; z++) {
            for (let y=0; y<(this.rows-1); y++) {
                for (let x=0; x<this.cols; x++) {
                    this.connectRowModules2( x, y, z );
                }
            }
        }        

        
        for (let z = 0; z < this.layers; z++) {
            for (let y=0; y<this.rows; y++) {
                for (let x=0; x<(this.cols-1); x++) {
                    this.connectColModules2( x, y, z );
                }
            }
        }        
    
        for (let z = 0; z < this.layers; z++) {
            for (let y=0; y<this.rows; y++) {
                for (let x=0; x<this.cols; x++) {
                    this.connectEvenMoreIdioticPegasusEdges(x, y, z);
                }
            }
        }
        
        super.showLabels(true);
    }



    connect(qdA, qdB, value) {
        let idA = qdA.toNodeId(this.rows, this.cols);
        let idB = qdB.toNodeId(this.rows, this.cols);
        
        if ((idA in this.nodes) && (idB in this.nodes))
            this.addEdge( idA , idB, value );
    }
    

    
    connectEvenMoreIdioticPegasusEdges(x, y, z) {
        let val0 = 0.0;
        let val1 = 0.0; //-1.0;
        let val2 = 0.0; // 1.0;
        let val3 = 0.0; // 0.5;
        
        for ( let kA=0; kA<2; kA++ ) {
            for ( let jB=0; jB<2; jB++ ) {
                for ( let kB=0; kB<2; kB++ ){
                    if ( z < this.layers-1 ) {
                        this.connect( new QbDescr(x,y,z,0,0,kA), new QbDescr(x,y,z+1,1,jB,kB), val0 );
                        this.connect( new QbDescr(x,y,z,1,0,kA), new QbDescr(x,y,z+1,0,jB,kB), val1 );
                        if (x>0) this.connect( new QbDescr(x,y,z,0,1,kA), new QbDescr(x-1,y,z+1,1,jB,kB), val2 );
                        if (y>0) this.connect( new QbDescr(x,y,z,1,1,kA), new QbDescr(x,y-1,z+1,0,jB,kB), val3 );
                    } else {
                        if ( (x<this.cols-1) && (y<this.rows-1) ) {
                            this.connect( new QbDescr(x,y,z,0,0,kA), new QbDescr(x+1,y+1,0,1,jB,kB), val0 );
                            this.connect( new QbDescr(x,y,z,1,0,kA), new QbDescr(x+1,y+1,0,0,jB,kB), val1 );
                        }
                        
                        if ( y<this.rows-1 ) {
                            this.connect( new QbDescr(x,y,z,0,1,kA), new QbDescr(x,y+1,0,1,jB,kB), val2 );
                        }
                        
                        if ( x<this.cols-1 ) {
                            this.connect( new QbDescr(x,y,z,1,1,kA), new QbDescr(x+1,y,0,0,jB,kB), val3 );
                        }
                    }
                }
            }
        }
    }
    

    connectRowModules2(x, y, z) {
        for ( let j=0; j<2; j++ ) {
            for ( let k=0; k<2; k++ ){
                this.connect( new QbDescr(x,y,z,1,j,k), new QbDescr(x,y+1,z,1,j,k), getRandom(-0.5, 0.5));//0.0 );          
            }
        }
    }


//    connectRowModules(module1id, module2id) {
//        for (let i=(this.KL+1); i<=this.modSize; i++) {
//            this.addEdge(this.modSize*module1id + i, this.modSize*module2id + i, 0.0);
//        }
//    }

    connectColModules2(x, y, z) {
        for ( let j=0; j<2; j++ ) {
            for ( let k=0; k<2; k++ ){
                this.connect( new QbDescr(x,y,z,0,j,k), new QbDescr(x+1,y,z,0,j,k), getRandom(-0.5, 0.5));//0.0 );          
            }
        }
    }

//    connectColModules(module1id, module2id) {
//        for (let i=1; i<=this.KL; i++) {
//            this.addEdge(this.modSize*module1id + i, this.modSize*module2id + i, 0.0);
//        }
//    }


    connectInternalPegasusEdges(x, y, z) {
        let moduleId = x + (y + z*this.rows)*this.cols;

        let offset = 8*moduleId;

        // PEGASUS ADDITIONAL EDGES
        if (this.KL>1) {
            this.addEdge( offset + 1, offset + 2, getRandom(-0.5, 0.5));//0.0 ); 
            if (this.KL>3) {
                this.addEdge( offset + 3, offset + 4, getRandom(-0.5, 0.5));//0.0 ); 
            }
        }
        
        offset += 4;
        
        if (this.KR>1) {
            this.addEdge( offset + 1, offset + 2, getRandom(-0.5, 0.5));//0.0 ); 
            if (this.KR>3) {
                this.addEdge( offset + 3, offset + 4, getRandom(-0.5, 0.5));//0.0 ); 
            }
        }
    }

    createModule2(x, y, z) {
        let moduleId = x + (y + z*this.rows)*this.cols;

        let offset = 8*moduleId;
        
        // MODULE NODES
        for (let n=0; n<this.KL; n++) {
            this.addNode( offset+n+1, this.calcPosition2(x, y, z, n), getRandom(-1.0, 1.0));//0.0 );
        }
        for (let n=4; n<this.KR+4; n++) {
            this.addNode( offset+n+1, this.calcPosition2(x, y, z, n), getRandom(-1.0, 1.0));//0.0 );
        }

        // INTERNAL MODULE EDGES
        for (let x=0; x<this.KL; x++)
            for (let y=0; y<this.KR; y++) {
                this.addEdge( offset + x + 1, offset + 4 + y + 1, getRandom(-0.5, 0.5));//0.0 );        
            }
        
        this.connectInternalPegasusEdges(x, y, z);
    }


    
    mX = {
      '-8': 375,
      '-7': 325,
      '-6': 275,
      '-5': 225,
      '-4': 175,
      '-3': 125,
      '-2': 75,
      '-1': 25,
      '0': -25,
      '1': -75,
      '2': -125,
      '3': -175,
      '4': -225,
      '5': -275,
      '6': -325,
      '7': -375
    };

    mmX(i) {
        return -25 - 50 * i;
    }

    mY = {
      '-8': 75,
      '-7': 65,
      '-6': 55,
      '-5': 45,
      '-4': 35,
      '-3': 25,
      '-2': 15,
      '-1':  5,
      '0':  -5,
      '1': -15,
      '2': -25,
      '3': -35,
      '4': -45,
      '5': -55,
      '6': -65,
      '7': -75
    };
    
    mmY(i) {
        return -5 - 10 * i;
    }
    
    mZ = {
      '-8': -375,
      '-7': -325,
      '-6': -275,
      '-5': -225,
      '-4': -175,
      '-3': -125,
      '-2': -75,
      '-1': -25,
      '0':   25,
      '1':   75,
      '2':  125,
      '3':  175,
      '4':  225,
      '5':  275,
      '6':  325,
      '7':  375
    };

    mmZ(i) {
        return 25 + 50 * i;
    }



    getNodeOffset(nodeId) {
        //console.log(nodeId);
        
        let nodeOffset = [
            new BABYLON.Vector3(  15, -3, -10),
            new BABYLON.Vector3(   5, -1, -10),
            new BABYLON.Vector3(  -5,  1, -10),
            new BABYLON.Vector3( -15,  3, -10),
            new BABYLON.Vector3(  15,  3,  10),
            new BABYLON.Vector3(   5,  1,  10),
            new BABYLON.Vector3(  -5, -1,  10),
            new BABYLON.Vector3( -15, -3,  10)
        ];
        
        let idx = nodeId;
        if (idx<this.KL) {
            return nodeOffset[idx];
        }
        else {
            idx -= this.KL;
            idx += 4;
            return nodeOffset[idx];
        }
    }

    getNodeOffset2(idx) {
        //console.log(nodeId);
        
//        let nodeOffset = [
//            new BABYLON.Vector3(  15, -3, -10),
//            new BABYLON.Vector3(   5, -1, -10),
//            new BABYLON.Vector3(  -5,  1, -10),
//            new BABYLON.Vector3( -15,  3, -10),
//            new BABYLON.Vector3(  15,  3,  10),
//            new BABYLON.Vector3(   5,  1,  10),
//            new BABYLON.Vector3(  -5, -1,  10),
//            new BABYLON.Vector3( -15, -3,  10)
//        ];

        let nodeOffset = {
            'classic': [    new BABYLON.Vector3(  15, -3, -10),
                            new BABYLON.Vector3(   5, -1, -10),
                            new BABYLON.Vector3(  -5,  1, -10),
                            new BABYLON.Vector3( -15,  3, -10),
                            new BABYLON.Vector3(  15,  3,  10),
                            new BABYLON.Vector3(   5,  1,  10),
                            new BABYLON.Vector3(  -5, -1,  10),
                            new BABYLON.Vector3( -15, -3,  10)],

            'diamond': [    new BABYLON.Vector3(   0, -3,   9),
                            new BABYLON.Vector3(   0, -1,   3),
                            new BABYLON.Vector3(   0,  1,  -3),
                            new BABYLON.Vector3(   0,  3,  -9),
                            new BABYLON.Vector3(   9,  3,   0),
                            new BABYLON.Vector3(   3,  1,   0),
                            new BABYLON.Vector3(  -3, -1,   0),
                            new BABYLON.Vector3(  -9, -3,   0)],

            'triangle': [   new BABYLON.Vector3(  -15, -3,   9),
                            new BABYLON.Vector3(  -15, -1,   3),
                            new BABYLON.Vector3(  -15,  1,  -3),
                            new BABYLON.Vector3(  -15,  3,  -9),
                            new BABYLON.Vector3(   9,  3, 15),
                            new BABYLON.Vector3(   3,  1, 15),
                            new BABYLON.Vector3(  -3, -1, 15),
                            new BABYLON.Vector3(  -9, -3, 15)]
        };
        
        
        return nodeOffset[sgv.displayMode][idx];
    }
    

    calcPosition(nodeId) {
        let qd = QbDescr.fromNodeId(nodeId, this.rows, this.cols);

        return this.calcPosition2(qd.x, qd.y, qd.z, qd.n0());
    };


    calcPosition2(x, y, z, n) {
        var newPos = new BABYLON.Vector3( this.mmX(x), this.mmY(x), this.mmZ(y) );
        
        newPos.addInPlace( new BABYLON.Vector3( 0.0, 40.0*z, 0.0 ) );
          
        //console.log(n);
        newPos.addInPlace( this.getNodeOffset2(n) );

        return newPos;
    };
    
    
    
    fromDef = function(def) {
        for (let i = 0; i<def.length; i++) {
            if (def[i].n1 === def[i].n2) {
                let nodeId = def[i].n1;

                let qb = QbDescr.fromNodeId(nodeId, this.rows, this.cols);
                this.addNode( nodeId, this.calcPosition2( qb.x, qb.y, qb.z, qb.n0() ), def[i].val );
            }
            else {
                let n1 = def[i].n1;
                let n2 = def[i].n2;
                this.addEdge( n1, n2, def[i].val );
                //let strId = "" + n1 + "," + n2;
                //this.edges[strId].setValue(  );
            }
        }
        //console.log(this.nodes);
    };
    
}

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

//export { sgv };"use strict";
/* global sgv, Chimera, Pegasus, UI */

sgv.controlPanel = new function() {
    var cpl = null;
    
    return {
        init: function(id) {
            cpl = UI.createControlPanel(id);
            
            cpl.querySelector("#cplCreateButton").addEventListener('click',
                function() {
                    sgv.controlPanel.createGraph();
                });

            cpl.querySelector("#cplDeleteButton").addEventListener('click',
                function() {
                    sgv.controlPanel.removeGraph();
                });

            cpl.querySelector("#cplSaveButton").addEventListener('click',
                function() {
                    sgv.toTXT();
                });

            cpl.querySelector('#inputfile').addEventListener('change',
                function () {
                    sgv.controlPanel.loadGraph(this.files[0]);
                });

            //console.log(cpl);
        },
        
        show: function(b) {
            cpl.style.display = (isUndefined(b)||(b!==0))?"block":"none";
        },

        hide: function(b) {
            cpl.style.display = (isUndefined(b)||(b!==0))?"none":"block";
        },

        switchPanel: function() {
            cpl.style.display = (cpl.style.display === "none")?"block":"none";
        },

        setModeSelection: function() {
            document.getElementById("graphSelection").style.display = "block";
            document.getElementById("graphDescription").style.display = "none";
        },
        
        setModeDescription: function() {
            document.getElementById("graphSelection").style.display = "none";
            document.getElementById("graphDescription").style.display = "block";

            this.updateDescription();
        },
        
        updateDescription: function() {
            document.getElementById("dscr_type").textContent = sgv.graf.type;
            document.getElementById("dscr_cols").textContent = sgv.graf.cols;
            document.getElementById("dscr_rows").textContent = sgv.graf.rows;
            document.getElementById("dscr_KL").textContent = sgv.graf.KL;
            document.getElementById("dscr_KR").textContent = sgv.graf.KR;
            document.getElementById("dscr_nbNodes").textContent = Object.keys(sgv.graf.nodes).length;
            document.getElementById("dscr_nbEdges").textContent = Object.keys(sgv.graf.edges).length;
        },
        
        getGraphTypeAndSize() {
            return {
                type: document.getElementById("graphType").value,
                size: {
                    cols: parseInt(document.getElementById("graphCols").value, 10),
                    rows: parseInt(document.getElementById("graphRows").value, 10),
                    KL: parseInt(document.getElementById("graphKL").value, 10),
                    KR: parseInt(document.getElementById("graphKR").value, 10)
                }
            };
        },
        
        createGraph: function() {
            if (sgv.graf!==null) {
                this.removeGraph();
            }

            let gDesc = this.getGraphTypeAndSize();

            switch ( gDesc.type ) {
                case "chimera" :
                    sgv.graf = Chimera.createNewGraph(gDesc.size);
                    this.setModeDescription();
                    break;
                case "pegasus" :
                    sgv.graf = Pegasus.createNewGraph(gDesc.size);
                    this.setModeDescription();
                    break;
            }
        },
        
        removeGraph: function() {
            if (sgv.graf!==null) {
                sgv.graf.dispose();
                //delete graf;
                sgv.graf = null;
            }

            sgv.delMissing();
            this.setModeSelection();
        },
        
        loadGraph: function(file) {
            var fr = new FileReader(); 
            fr.onload = function(){
                if (sgv.graf!==null) {
                    this.removeGraph();
                }

                sgv.fromTXT(fr.result);

                sgv.controlPanel.setModeDescription();
            }; 
            fr.readAsText(file); 
        }
    };
};
"use strict";
/* global scene, sgv, Chimera, Pegasus, UI */

sgv.console = new function () {
    var isDown;
    var cmdHistory = [];
    var cmdHistoryPtr = -1;
    var movable = false;
    let ui;

    function parseCommand(line) {
        function set(node, value) {
            var id = parseInt(node, 10);
            var val = parseFloat(value);

            if (!isNaN(id) && !isNaN(val)) {
                if (sgv.graf !== null) {
                    if (id in sgv.graf.nodes) {
                        sgv.graf.setNodeValue(id, val);
                        return "modified node q" + id + " = " + val;
                    } else {
                        sgv.graf.addNode(id, val);
                        return "added node q" + id + " = " + val;
                    }
                } else {
                    return "no graph defined";
                }
            }
        }

        function del(node) {
            if (sgv.graf === null) {
                return "no graph defined";
            } else {
                let id = parseInt(node, 10);
                if (isNaN(id) || (id === 0)) {
                    return "bad NodeId";
                } else if (id in sgv.graf.nodes) {
                    sgv.graf.delNode(id);
                    return "deleted node q" + id;
                } else {
                    return "node q" + id + " not exists";
                }
            }
        }

        function create(type, sizeTXT) {
            if (sgv.graf === null) {
                const sizesTXT = sizeTXT.split(",");

                size = {
                    cols:   parseInt(sizesTXT[0], 10),
                    rows:   parseInt(sizesTXT[1], 10),
                    KL:     parseInt(sizesTXT[2], 10),
                    KR:     parseInt(sizesTXT[3], 10)
                };
                
                switch (type) {
                    case "chimera" :
                        sgv.graf = Chimera.createNewGraph(size);
                        break;
                    case "pegasus" :
                        sgv.graf = Pegasus.createNewGraph(size);
                        break;
                    default:
                        return "unknown graph type";
                }

                sgv.controlPanel.setModeDescription();

                return "graph created";
            } else {
                return "graf exists, type: clear <Enter> to delete it";
            }

        }

        function clear() {
            sgv.controlPanel.removeGraph();
            return "graph removed";
        }

        function con(node1, node2, value) {
            if (sgv.graf === null) {
                return "no graph defined";
            } else {
                let id1 = parseInt(node1, 10);
                let id2 = parseInt(node2, 10);
                var val = parseFloat(value);

                if (isNaN(id1) || (id1 === 0) || isNaN(id2) || (id2 === 0)) {
                    return "bad node";
                } else if (isNaN(val)) {
                    return "bad value";
                } else if (id1 in sgv.graf.nodes) {
                    if (id2 in sgv.graf.nodes) {
                        sgv.graf.addEdge(id1, id2, val);
                        return "added edge: q" + id1 + " -> g" + id2;
                    } else {
                        return "node q" + id2 + " was probably deleted earlier";
                    }

                } else {
                    return "node q" + id1 + " was probably deleted earlier";
                }
            }
        }

        function set2(command) {
            function setN(split2, val) {
                if (split2[0][0] === 'q') {
                    let id = parseInt(split2[0].slice(1), 10);

                    if (isNaN(id) || (id === 0) || (id > sgv.graf.maxNodeId())) {
                        return "bad node Id";
                    }

                    if (isNaN(val)) {
                        if (id in sgv.graf.nodes) {
                            sgv.graf.delNode(id.toString());
                            return "deleted node q" + id;
                        } else {
                            return "node q" + id + " already deleted";
                        }
                    } else {
                        if (id in sgv.graf.nodes) {
                            sgv.graf.setNodeValue(id, val);
                            return "modified node q" + id + " = " + val;
                        } else if (id in sgv.graf.missing) {
                            sgv.graf.restoreNode(id);
                            let but = document.getElementById("rest" + id);
                            but.parentNode.removeChild(but);
                            sgv.graf.setNodeValue(id, val);
                            return "restored and modified node q" + id + " = " + val;
                        } else {
                            sgv.graf.addNode(id, val);
                            return "added node q" + id + " = " + val;
                        }
                    }
                }
            }

            function setE(split2, val) {
                if ((split2[0][0] === 'q') && (split2[1][0] === 'q')) {
                    let id1 = parseInt(split2[0].slice(1), 10);
                    let id2 = parseInt(split2[1].slice(1), 10);

                    if (isNaN(id1) || (id1 === 0)) {
                        return "bad node Id: " + split2[0];
                    }

                    if (isNaN(id2) || (id2 === 0)) {
                        return "bad node Id: " + split2[1];
                    }

                    let strId = "" + id1 + "," + id2;
                    if (id1 > id2) {
                        strId = "" + id2 + "," + id1;
                    }

                    if (isNaN(val)) {
                        if (strId in sgv.graf.edges) {
                            sgv.graf.delEdge(strId);
                            return "deleted edge " + strId;
                        } else {
                            return "edge " + strId + " not exists";
                        }
                    } else {
                        if (strId in sgv.graf.edges) {
                            sgv.graf.setEdgeValue(strId, val);
                            return "modified edge " + strId;
                        } else {
                            if ((id1 in sgv.graf.nodes) && (id2 in sgv.graf.nodes)) {
                                sgv.graf.addEdge(id1, id2, val);
                                return "added edge " + strId;
                            } else {
                                return "NOT DONE: both connected nodes must exist in the graph";
                            }
                        }
                    }
                }
            }

            if (sgv.graf === null) {
                return "no graph defined";
            }

            let split1 = command.split('=');
            console.log(split1);

            if (split1.length < 2) {
                return "too few arguments";
            }

            let val = parseFloat(split1[1]);
            // if NaN -> delete

            let split2 = split1[0].split('+');

            if (split2.length === 1) { // set node
                return setN(split2, val);
            } else if (split2.length === 2) { //set edge
                return setE(split2, val);
            }

            return "bad arguments";
        }

        function display(valId) {
            return "displayed value: " + sgv.graf.displayValues(valId);
        }
        
        function getHelp(command) {
            switch (command) {
                case "set":
                    return "Set or remove value of node or edge\n\nset [nodeId](=value)\nset [nodeId]+[nodeId](=value)";
                case "create":
                    return "Create new default graph\n\ncreate [chimera|pegasus] [4|8|12|16],[4|8|12|16],[1..4],[1..4]";
                case "clear":
                    return "Remove current graph if exists\n\nclear";
                case "display":
                    return "Switch between sets of displayed values\n\ndisplay [valueId]";
                case "displaymode":
                    return "Set style of graph display.\n\ndisplaymode [classic|triangle|diamond]";
                case "":
                default:
                    return "For more information on a specific command, type: help command-name\n\nset\t\tSet or remove value of node or edge\ncreate\t\tCreate new default graph\nclear\t\tRemove current graph if exists\ndisplay\t\tSwitch between sets of displayed values\ndisplaymode\tSet style of graph display";
            }
        }

        line = line.trim().toLowerCase().replace(/\s+/g, ' ');
        var command = line.split(' ');

        let sp = line.indexOf(' ');
        var polecenie = line.substring(sp + 1).replace(/\s+/g, '');

        var result = "";

        switch (command[0].trim()) {
            case "help":
            case "?":
                result = getHelp(command[1]);
                break;
            case "create":
                result = create(command[1], command[2]);
                break;
            case "clear":
                result = clear();
                break;
            case "set":
                result = set2(polecenie);
                break;
//            case "set":
//                result = set(command[1], command[2]);
//                break;
//            case "delete":
//            case "del":
//                result = del(command[1]);
//                break;
//            case "connect":
//            case "con":
//                result = con(command[1], command[2], command[3]);
//                break;
            case "display":
                result = display(command[1]);
                break;
            case "displaymode":
                if ((command[1]==='classic')||(command[1]==='diamond')||(command[1]==='triangle')) {
                    sgv.displayMode = command[1];
                    sgv.graf.changeDisplayMode();
                    result = "current displayMode = " + command[1];
                } else {
                    result = "unknown mode\n\n" + getHelp('displaymode');
                }
                break;
            default:
                result = "unknown command\n\n" + getHelp();
                break;
        }

        return result;
    }

    return {// public interface
        switchConsole: function () {
            if (ui.style.display !== "block") {
                ui.style.display = "block";
            } else {
                ui.style.display = "none";
            }
        },

        showConsole: function () {
            ui.style.display = "block";
        },

        hideConsole: function () {
            ui.style.display = "none";
        },

        initConsole: function (id) {
            ui = UI.createConsole(id);

            let domCmdline = ui.querySelector("#commandline");
            
            domCmdline.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    let txtarea = document.getElementById("consoleHistory");
                    //txtarea.disabled = false;
                    txtarea.textContent += "> " + domCmdline.value + "\n";

                    txtarea.textContent += parseCommand(domCmdline.value) + "\n";

                    txtarea.scrollTop = txtarea.scrollHeight;
                    //txtarea.disabled = true;

                    if (cmdHistory.length > 10)
                        cmdHistory.shift();
                    cmdHistory.push(domCmdline.value);
                    cmdHistoryPtr = cmdHistory.length;

                    domCmdline.value = "";
                } else if (event.keyCode === 38) {
                    if (cmdHistoryPtr > 0) {
                        cmdHistoryPtr--;
                        domCmdline.value = cmdHistory[cmdHistoryPtr];
                    }
                } else if (event.keyCode === 40) {
                    if (cmdHistoryPtr < cmdHistory.length) {
                        domCmdline.value = cmdHistory[cmdHistoryPtr];
                        cmdHistoryPtr++;
                    } else {
                        domCmdline.value = "";
                    }
                }
            });

            ui.querySelector(".hidebutton").addEventListener('click', () => { sgv.console.hideConsole(); });

            let titlebar = ui.querySelector(".title");
            var offset;
            
            titlebar.addEventListener('mouseover', () => {
                ui.querySelector(".title").style.cursor='pointer';
                movable = true;
            });
            
            titlebar.addEventListener('mouseout', () => {
                movable = false;
            });

            titlebar.addEventListener('mousedown', function (e) {
                isDown = movable;
                offset = {
                    x: ui.offsetLeft - e.clientX,
                    y: ui.offsetTop - e.clientY
                };
            }, true);

            titlebar.addEventListener('mouseup', function () {
                isDown = false;
            }, true);

            document.addEventListener('mousemove', function (event) {
                event.preventDefault();
                if (isDown) {
                    let mousePosition = {
                        x: event.clientX,
                        y: event.clientY
                    };

                    ui.style.left = (mousePosition.x + offset.x) + 'px';
                    ui.style.top = (mousePosition.y + offset.y) + 'px';
                }
            }, true);
        }

    };
};