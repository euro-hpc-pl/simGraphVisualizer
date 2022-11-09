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
/* global BABYLON, labelsVisible, sgv, Edge */

//const txtFile = require("io_TXT.js");

var Graph = /** @class */ (function () {
    this.nodes = {};
    this.edges = {};
    this.missing = {};
    this.type = 'generic';
    this.scopeOfValues = ['default'];
    this.currentScope = 'default';
    this.greenLimit = 1.0;
    this.redLimit = -1.0;

    //this.labelsVisible = false;
    this.labelsVisible = true;

    this.dispose = function () {
        for (const key in this.edges) {
            this.edges[key].clear();
            delete this.edges[key];
        }
        for (const key in this.nodes) {
            this.nodes[key].clear();
            delete this.nodes[key];
        }
        
        sgv.SPS.reset();
        sgv.SPS.refresh();

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
        values = {};
        
        if (typeof val==='number') {
            values['default'] = val;
        }
        
        let n = new Node(this, nodeId, pos.x, pos.y, pos.z, values);
        this.nodes[n.id] = n;
        return n;
    };

    this.getKeyByValue = function(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    };

    this.getScopeIndex = function(scope) {
        return Object.keys(this.scopeOfValues).find(key => this.scopeOfValues[key] === scope);
    };
    
    this.addEdge = function (node1, node2) {
        let id = Edge.calcId(node1, node2);
        if (id in this.edges) {
            console.log("edge already exists", id);
            return this.edges[id];
        }
        else {
            let e = new Edge(this, node1, node2);
            this.edges[id] = e;
            return e;
        }            
    };

    this.delEdge = function (edgeId) {
        this.edges[edgeId].clear();
        delete this.edges[edgeId];
        
        sgv.SPS.refresh();
    };

    this.findAndDeleteEdges = function (nodeId) {
        var removedEdges = {};

        console.log("graf.findAndDeleteEdges", nodeId);

        for (const key in this.edges) {
            if (this.edges[key].begin.toString() === nodeId) {
                removedEdges[ this.edges[key].end ] = {
                    values: this.edges[key].values
                };
                this.delEdge(key);
            } else if (this.edges[key].end.toString() === nodeId) {
                removedEdges[ this.edges[key].begin ] = {
                    values: this.edges[key].values
                };
                this.delEdge(key);
            }
        }

        return removedEdges;
    };

    this.delNode = function (nodeId) {
        var tmpEdges = this.findAndDeleteEdges(nodeId);

        this.missing[nodeId] = {
            label: {
                text: this.nodes[nodeId].getLabel(),
                enabled: this.nodes[nodeId].isLabelVisible()
            },
            values: this.nodes[nodeId].values,
            edges: {}
        };

        for (const key in tmpEdges) {
            this.missing[nodeId].edges[key] = tmpEdges[key];
        }
        
        //this.nodes[nodeId].mesh.dispose();
        this.nodes[nodeId].clear();
        delete this.nodes[nodeId];

        sgv.dlgMissingNodes.addNode(nodeId);
        
        sgv.SPS.refresh();
    };

    this.restoreNode = function (nodeId) {
        let pos = this.calcPosition(nodeId);
        
        this.nodes[nodeId] = new Node(this, nodeId, pos.x, pos.y, pos.z, this.missing[nodeId].values);
        this.nodes[nodeId].setLabel(this.missing[nodeId].label.text,this.missing[nodeId].label.enabled);
        
        for (const key in this.missing[nodeId].edges) {
            var nKey = parseInt(key, 10);
            if (nKey in this.nodes) {
                //console.log("key: ", nKey, typeof (nKey));
                var strId;
                if (nodeId < key) {
                    strId = "" + nodeId + "," + key;
                    this.edges[strId] = new Edge(this, nodeId, key);
                    //, this.missing[nodeId].edges[nKey]);
                } else {
                    strId = "" + key + "," + nodeId;
                    this.edges[strId] = new Edge(this, key, nodeId);
                    //, this.missing[nodeId].edges[nKey]);
                }
                for (const vKey in this.missing[nodeId].edges[nKey].values) {
                    this.edges[strId].setValue(this.missing[nodeId].edges[nKey].values[vKey],vKey);    
                }
                
            } else if (nKey in this.missing) {
                this.missing[nKey].edges[nodeId] = this.missing[nodeId].edges[nKey];
            }
        }

        delete this.missing[nodeId];

        if (Object.keys(this.missing).length === 0)
            sgv.dlgMissingNodes.hide();
        
        sgv.SPS.refresh();
    };


    this.findAndUpdateEdges = function (nodeId) {
        for (const key in this.edges) {
            if ((this.edges[key].begin.toString() === nodeId) || (this.edges[key].end.toString() === nodeId)) {
                this.edges[key].update();
            }
        }
    };

    this.stringToStruct = (string) => {
       if ((typeof string==='undefined')||(string===null)) return null;
    
        var result = {
            nodes: {},
            edges: {}
        };

        var lines = string.split("\n");

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
                    if (d.n1===d.n2) {
                        result.nodes[d.n1] = d.val;
                    } else {
                        if (d.n1 < d.n2) {
                            var strId = "" + d.n1 + "," + d.n2;
                            result.edges[strId] = d.val;
                        } else {
                            var strId = "" + d.n2 + "," + d.n1;
                            result.edges[strId] = d.val;
                        }
                    }
                }
            }
            lines.shift();
        }
        return result;
    };

    this.loadScopeValues = (scope, data) => {
        let isNew = false;
        if ( (typeof scope !== 'undefined') && ! this.scopeOfValues.includes(scope) ) {
            this.scopeOfValues.push(scope);
            isNew = true;
        }
        
        var struct = this.stringToStruct(data);
        
        for (const key in struct.nodes) {
            this.nodes[key].setValue(struct.nodes[key],scope);
        }

        for (const key in struct.edges) {
            this.edges[key].setValue(struct.edges[key],scope);
        }
        
        this.displayValues(scope);
        
        return {n:isNew, i:this.scopeOfValues.indexOf(scope)};
    };

    this.addScopeOfValues = function(scope) {
        if ( (typeof scope !== 'undefined') && ! this.scopeOfValues.includes(scope) ) {
            this.scopeOfValues.push(scope);
            return this.scopeOfValues.indexOf(scope);
        }
        return -1;
    };

    this.delScopeOfValues = function(scope) {
        if ( (typeof scope !== 'undefined') && (scope !== 'default') ) {

            let idx = this.scopeOfValues.indexOf(scope);
            if (idx!==-1) {
                
                this.scopeOfValues.splice(idx,1);
                
                for (const key in this.nodes) {
                    this.nodes[key].delValue(scope);
                }

                if (this.currentScope === scope) {
                    this.currentScope = 'default';
                    this.displayValues('default');
                }

                return this.scopeOfValues.indexOf(this.currentScope);
            }
        }
        return -1;
    };

    this.hasScope = function (scope) {
        return (typeof scope !== 'undefined') && this.scopeOfValues.includes(scope);
    };
    
    this.displayValues = async function (scope) {
        if ( (typeof scope === 'undefined') || ! this.scopeOfValues.includes(scope) ) {
            scope = this.currentScope;
        } else {
            this.currentScope = scope;
        }
        
        for (const key in this.nodes) {
            this.nodes[key].displayValue(scope);
        }
        for (const key in this.edges) {
            this.edges[key].displayValue(scope);
        }
        
        sgv.SPS.refresh();

        return true;
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

    this.setEdgeValue = function (edgeId, value, scope) {
        this.edges[edgeId].setValue(value, scope);
        this.edges[edgeId].displayValue();
    };

    this.delEdgeValue = function (edgeId, scope) {
        this.edges[edgeId].delValue(scope);
        this.edges[edgeId].displayValue();
    };

    this.edgeValue = function(edgeId, scope) {
        return this.edges[edgeId].getValue(scope);
    };

    this.setNodeValue = function (nodeId, value, scope) {
        this.nodes[nodeId].setValue(value, scope);
        this.nodes[nodeId].displayValue();
    };

    this.delNodeValue = function (nodeId, scope) {
        this.nodes[nodeId].delValue(scope);
        this.nodes[nodeId].displayValue();
    };

    this.nodeValue = function (nodeId,scope) {
        return this.nodes[nodeId].getValue(scope);
    };

    this.getMinMaxEdgeVal = function (scope) {
        if ( (typeof scope === 'undefined') || ! this.scopeOfValues.includes(scope) ) {
            scope = this.currentScope;
        }
        
        var result = {
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
            com: ""
        };

        let nan = true;
        
        for (const key in this.edges) {
            let val = this.edges[key].getValue(scope);
            
            if (val < result.min) {
                nan = false;
                result.min = val;
            }

            if (val > result.max) {
                nan = false;
                result.max = val;
            }
        }

        if (nan){
            result.min = Number.NaN;
            result.max = Number.NaN;
            result.com = "\nWARNING: The graph has no edge that has a weight in the current scope.\n";
        }

        return result;
    };

    this.getMinMaxNodeVal = function (scope) {
        if ( (typeof scope === 'undefined') || ! this.scopeOfValues.includes(scope) ) {
            scope = this.currentScope;
        }
        
        var result = {
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
            com: ""
        };

        let nan = true;

        for (const key in this.nodes) {
            let val = this.nodes[key].getValue(scope);
            
            if (val < result.min) {
                nan = false;
                result.min = val;
            }

            if (val > result.max) {
                nan = false;
                result.max = val;
            }
        }

        if (nan){
            result.min = Number.NaN;
            result.max = Number.NaN;
            result.com = "\nWARNING: The graph has no node that has a value in the current scope.\n";
        }

        return result;
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
            let pos = this.calcPosition(key);
            this.nodes[key].position = pos;
        }

        for (const key in this.edges) {
            this.edges[key].update();
        }
    };
    
    this.showLabels = function (b) {
        this.labelsVisible = b;
        for (const key in this.nodes) {
            this.nodes[key].showLabel();
        }
    };
    
    
    this.createStructureFromDef2 = function (def) {
        for (let i = 0; i < def.length; i++) {
            if (def[i].n1 === def[i].n2) {
                let nodeId = def[i].n1;

                this.addNode(nodeId, this.calcPosition(nodeId), 0.0);

                for (const key in def[i].values) {
                    let scope = def[i].values[key];
                    this.nodes[nodeId].setValue(scope, key);
                }
                this.nodes[nodeId].displayValue('default');
                this.nodes[nodeId].showLabel(false);
                
            } else {
                let n1 = def[i].n1;
                let n2 = def[i].n2;
                this.addEdge(n1, n2);
         
                var strId = "" + n1 + "," + n2;
                if (n2 < n1) {
                    strId = "" + n2 + "," + n1;
                }

                for (const key in def[i].values) {
                    this.edges[strId].setValue(def[i].values[key], key);
                }
                
                this.edges[strId].displayValue('default');
            }
        }
        //console.log(this.edges);
        //console.log(nodes);
    };
});

