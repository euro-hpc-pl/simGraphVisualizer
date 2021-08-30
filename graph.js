/* global BABYLON */

class Graph {
    constructor(scene) {
        this.scene = scene;

        this.nodes = {};
        this.edges = {};
        
        this.missing = {};

        this.type = 'generic';
    }

    addNode(nodeId, x, y, z, val) {
        this.nodes[nodeId] = new Node(nodeId, x, y, z, val);
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

//    addEdge(node1, node2) {
//        if (node1<node2) {
//            var strId = "" + node1 + "," + node2;
//            this.edges[strId] = new Edge(this, node1, node2, 0.5);
//        }
//        else {
//            var strId = "" + node2 + "," + node1;
//            this.edges[strId] = new Edge(this, node2, node1, 0.5);
//        }
//    }

    addEdge(node1, node2, val) {
        if (node1<node2) {
            var strId = "" + node1 + "," + node2;
            this.edges[strId] = new Edge(this, node1, node2, val);
        }
        else {
            var strId = "" + node2 + "," + node1;
            this.edges[strId] = new Edge(this, node2, node1, val);
        }
    }

    delEdge(edgeId) {
        this.edges[edgeId].instance.dispose();
        delete this.edges[edgeId];
    }

    findAndDeleteEdges(nodeId)
    {
        var removedEdges = {};
        
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

    clear() {
        for (const key in this.edges) {
            this.edges[key].instance.dispose();
            delete this.edges[key];
        }
        for (const key in this.nodes) {
            this.nodes[key].mesh.dispose();
            delete this.nodes[key];
        }
    }

    findAndUpdateEdges(nodeId)
    {
        for (const key in this.edges) {
            if ((this.edges[key].begin.toString() === nodeId) || (this.edges[key].end.toString() === nodeId)) {
                this.edges[key].update();
            }
        }
    }

    updateNodeLabels() {
        for (let i = 0; i < this.nodes.length; i++)
        {
            this.nodes[i].updateLabel();
        }
    }

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
        return this.nodes[nodeId].value;
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
}

valueToColor = function(val) {
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
};


valueToEdgeWidth = function(val) {
    var w = Math.abs(val)/2;
    if ( w>0.5 )
        w = 0.7;
    else if ( w<0.1 )
        w = 0.1;

    return w;
}
