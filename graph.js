"use strict";
/* global BABYLON, scene, labelsVisible */


var graphVisualiser = ( function () {
    var addNodesPart = function(size) {
        var nodeModel = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, scene);//BABYLON.MeshBuilder.CreatePolyhedron("m", {}, scene);
        this.nodesSPS.addShape(nodeModel, size);
        const nodeMesh = this.nodesSPS.buildMesh();
        nodeModel.dispose();
    };
    
    return {
        initialize : function() {
            this.nodesSPS = new BABYLON.SolidParticleSystem('nodes_SPS', scene, {isPickable: true});
            //    var edgesSPS = new BABYLON.SolidParticleSystem('edges_SPS', scene, {isPickable: true});
            //    var labelsSPS = new BABYLON.SolidParticleSystem('labels_SPS', scene, {isPickable: true});

            addNodesPart(100);
            this.nextNodeId = 0;

            //    var labelModel = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, scene);//BABYLON.MeshBuilder.CreatePolyhedron("m", {}, scene);
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
    constructor(scene) {
        this.scene = scene;

        this.nodes = {};
        this.edges = {};
        
        this.missing = {};

        this.type = 'generic';
    }

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
            document.getElementById("missing").style.display = "none";
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
        
        addToMissing(nodeId);
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
        if (labelsVisible) {
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
