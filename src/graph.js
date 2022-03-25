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

"use strict";
/* global BABYLON, labelsVisible, sgv */

var Graph = /** @class */ (function () {
    this.nodes = {};
    this.edges = {};
    this.missing = {};
    this.type = 'generic';

    this.dispose = function () {
        for (const key in this.edges) {
            this.edges[key].instance.dispose();
            delete this.edges[key];
        }
        for (const key in this.nodes) {
            this.nodes[key].clear();
            delete this.nodes[key];
        }
//        for (const key in this.missing) {
//
//        }
    };

    this.clear = function () {
        this.dispose();
    };

    this.maxNodeId = function () {
        return Object.keys(this.nodes).length;
    };

    this.addNode = function(nodeId, pos, val) {
        this.nodes[nodeId] = new Node(nodeId, pos.x, pos.y, pos.z, val);
    };

    this.restoreNode = function (nodeId) {
        this.addNode(nodeId, this.calcPosition(nodeId), this.missing[nodeId].value);

        for (const key in this.missing[nodeId].edges) {
            var nKey = parseInt(key, 10);
            if (nKey in this.nodes) {
                console.log("key: ", nKey, typeof (nKey));
                if (nodeId < key) {
                    this.addEdge(nodeId, nKey, this.missing[nodeId].edges[nKey]);
                } else {
                    this.addEdge(nKey, nodeId, this.missing[nodeId].edges[nKey]);
                }
            } else if (nKey in this.missing) {
                this.missing[nKey].edges[nodeId] = this.missing[nodeId].edges[nKey];
            }
        }

        delete this.missing[nodeId];

        if (Object.keys(this.missing).length === 0)
            sgv.ui.missingNodes.style.display = "none";
    };

    this.addEdge = function (node1, node2, val) {
        if (node1 < node2) {
            var strId = "" + node1 + "," + node2;
            this.edges[strId] = new Edge(this, node1, node2);//, val);
        } else {
            var strId = "" + node2 + "," + node1;
            this.edges[strId] = new Edge(this, node2, node1);//, val);
        }
    };

    this.delEdge = function (edgeId) {
        this.edges[edgeId].instance.dispose();
        delete this.edges[edgeId];
    };

    this.findAndDeleteEdges = function (nodeId) {
        var removedEdges = {};

        console.log("graf.findAndDeleteEdges", nodeId);

        for (const key in this.edges) {
            if (this.edges[key].begin.toString() === nodeId) {
                removedEdges[ this.edges[key].end ] = this.edges[key].value;
                this.delEdge(key);
            } else if (this.edges[key].end.toString() === nodeId) {
                removedEdges[ this.edges[key].begin ] = this.edges[key].value;
                this.delEdge(key);
            }
        }

        return removedEdges;
    };

    this.delNode = function (nodeId) {
        var tmpEdges = this.findAndDeleteEdges(nodeId);

        this.missing[nodeId] = {
            value: this.nodes[nodeId].value,
            edges: {}
        };

        for (const key in tmpEdges) {
            this.missing[nodeId].edges[key] = tmpEdges[key];
        }
        
        this.nodes[nodeId].mesh.dispose();
        delete this.nodes[nodeId];

        sgv.addToMissing(nodeId);
    };


    this.findAndUpdateEdges = function (nodeId) {
        for (const key in this.edges) {
            if ((this.edges[key].begin.toString() === nodeId) || (this.edges[key].end.toString() === nodeId)) {
                this.edges[key].update();
            }
        }
    };


    this.displayValues = function (valId) {
        let firstKey = Object.keys(this.nodes)[0];

        let prefix = '';

        if ((valId === undefined) || !(valId in this.nodes[firstKey].values)) {
            valId = 'value';
            prefix = "[incorrect, setting default] ";
        }

        for (const key in this.nodes) {
            this.nodes[key].displayValue(valId);
        }
        return prefix + valId;
    };

//    updateNodeLabels(show) {
//        for (const key in nodes) {
//            nodes[key].updateLabel(show);
//        }
//    }

    this.nodePosition = function (nodeId) {
        return this.nodes[nodeId].position;
    };

    this.checkNode = function (nodeId, check) {
        if (check) {
            this.nodes[nodeId].addCheck();
        } else {
            this.nodes[nodeId].delCheck();
        }
    };

    this.edgeDoubleClicked = function (id) {
        this.edges[id].switchCheckFlag();
    };

    this.moveNode = function (nodeId, diff) {
        this.nodes[nodeId].move(diff);
        this.findAndUpdateEdges(nodeId);
    };

    this.setEdgeValue = function (edgeId, value) {
        this.edges[edgeId].setValue(value);
    };

    this.edgeValue = function(edgeId) {
        return this.edges[edgeId].value;
    };

    this.setNodeValue = function (nodeId, value) {
        this.nodes[nodeId].setValue(value);
    };

    this.nodeValue = function (nodeId) {
        return this.nodes[nodeId].getValue();
    };

    this.getMinMaxVal = function () {
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
    };

    this.calcPosition = function (key) {
        // override in derrived class
        return new BABYLON.Vector3();
    };

    this.changeDisplayMode = function () {
        for (const key in this.nodes) {
            let pos = calcPosition(key);
            this.nodes[key].position.copyFrom(pos);
            this.nodes[key].label.plane.position.copyFrom(pos).addInPlaceFromFloats(0.0, 5.0, 0.0);
        }

        for (const key in this.edges) {
            this.edges[key].update();
        }
    };
    
    this.showLabels = function (b) {
        if (sgv.labelsVisible) {
            for (const key in this.nodes) {
                this.nodes[key].showLabel(b);
            }
        }
    };
});





function valueToColor(val) {
    var max = 1.0;

    if (val > 0) {
        var r = 0;
        var g = (val < max) ? (val / max) : 1.0;
        var b = 1.0 - g;
    } else if (val < 0) {
        var r = ((-val) < max) ? (-val / max) : 1.0;
        var g = 0;
        var b = 1.0 - r;
    } else {
        var r = 0;
        var g = 0;
        var b = 1.0;
    }

    return new BABYLON.Color3(r, g, b);
}


function valueToEdgeWidth(val) {
    var w = Math.abs(val) / 2;
    if (w > 0.5)
        w = 0.7;
    else if (w < 0.1)
        w = 0.1;

    return w;
}
