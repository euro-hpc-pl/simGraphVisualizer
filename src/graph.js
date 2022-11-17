
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
/* global BABYLON, labelsVisible, sgv, Edge, Dispatcher, QbDescr, TempGraphStructure, GraphDescr */

const Graph = /** @class */ (function () {
    this.nodes = {};
    this.edges = {};
    this.missing = {};
    this.type = 'generic';
    this.scopeOfValues = ['default'];
    this.currentScope = 'default';
    this.greenLimit = 1.0;
    this.redLimit = -1.0;

    //this.labelsVisible = false;
    this.labelsVisible = false;

    this.dispose = function () {
        for (const key in this.edges) {
            this.edges[key].clear();
            delete this.edges[key];
        }
        for (const key in this.nodes) {
            this.nodes[key].clear();
            delete this.nodes[key];
        }
        
        Dispatcher.graphDeleted();
    };

    this.clear = function () {
        this.dispose();
    };

    this.maxNodeId = function () {
        return Object.keys(this.nodes).length;
    };

    this.addNode = function(nodeId, val) {
        values = {};
        
        if (typeof val==='number') {
            values['default'] = val;
        }
        
        let pos = this.calcPosition(nodeId);
        
        let n = new Node(this, nodeId, pos.x, pos.y, pos.z, values);
        n.showLabel(false);
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
        
        Dispatcher.graphChanged();
    };

    this.findAllConnected = (nodeId) => {
        var connected = {
                //all: [],
                internal: [],
                horizontal: [],
                vertical: [],
                up: [],
                down: [],
                other: []
            };

        function add(n2) {
            let q1 = QbDescr.fromNodeId(nodeId, sgv.graf.rows, sgv.graf.cols);
            let q2 = QbDescr.fromNodeId(n2, sgv.graf.rows, sgv.graf.cols);

            if ((q1.x===q2.x)&&(q1.y===q2.y)&&(q1.z===q2.z)) {
                connected.internal.push(n2);
            }
            else if ((q1.x!==q2.x)&&(q1.y===q2.y)&&(q1.z===q2.z)) {
                connected.horizontal.push(n2);
            }
            else if ((q1.x===q2.x)&&(q1.y!==q2.y)&&(q1.z===q2.z)) {
                connected.vertical.push(n2);
            }
            else if (q1.z<q2.z) {
                connected.up.push(n2);
            }
            else if (q1.z>q2.z) {
                connected.down.push(n2);
            }
            else {
                connected.other.push(n2);
            }
        }

        //console.log("graf.findEdges", nodeId);
        for (const key in this.edges) {
            if (this.edges[key].begin === nodeId) {
                add( this.edges[key].end );
            } else if (this.edges[key].end === nodeId) {
                add( this.edges[key].begin );
            }
        }

        return connected;
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
        
        Dispatcher.graphChanged();
    };

    this.restoreNode = function (nodeId) {
        if (nodeId in this.nodes) return false;
        
        if (!(nodeId in this.missing)) return false;
        
        let pos = this.calcPosition(nodeId);
        
        this.nodes[nodeId] = new Node(this, nodeId, pos.x, pos.y, pos.z, this.missing[nodeId].values);
        this.nodes[nodeId].setLabel(this.missing[nodeId].label.text,this.missing[nodeId].label.enabled);
        
        for (const key in this.missing[nodeId].edges) {
            var nKey = parseInt(key, 10);
            if (nKey in this.nodes) {
                let e = new Edge(this, nodeId, key);
                console.log(e);
                for (const vKey in this.missing[nodeId].edges[nKey].values) {
                    e.setValue(this.missing[nodeId].edges[nKey].values[vKey],vKey);    
                }
                
                this.edges[e.id] = e;
                console.log(e.id);
            } 
            else if (nKey in this.missing) {
                this.missing[nKey].edges[nodeId] = this.missing[nodeId].edges[nKey];
            }
        }

        delete this.missing[nodeId];

        if (Object.keys(this.missing).length === 0)
            sgv.dlgMissingNodes.hide();
        
        Dispatcher.graphChanged();
        
        return true;
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
                        result.edges[Edge.calcId(d.n1, d.n2)] = d.val;
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
        
        Dispatcher.currentScopeChanged();

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
            max: -Number.MAX_VALUE,
            com: ""
        };

        let nan = true;
        
        for (const key in this.edges) {
            let val = this.edges[key].getValue(scope);
            
            if (!isNaN(val)) {
                nan = false;

                if (val < result.min) {
                    result.min = val;
                }

                if (result.max < val) {
                    result.max = val;
                }
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
            max: -Number.MAX_VALUE,
            com: ""
        };

        let nan = true;

        for (const key in this.nodes) {
            let val = this.nodes[key].getValue(scope);
            
            if (!isNaN(val)) {
                nan = false;

                if (val < result.min) {
                    result.min = val;
                }

                if (result.max < val) {
                    result.max = val;
                }
            }
        }

        if (nan){
            result.min = Number.NaN;
            result.max = Number.NaN;
            result.com = "\nWARNING: The graph has no node that has a value in the current scope.\n";
        }

        return result;
    };

    this.getMinMaxVal = function (scope) {
        if ( (typeof scope === 'undefined') || ! this.scopeOfValues.includes(scope) ) {
            scope = this.currentScope;
        }

        let nMM = this.getMinMaxNodeVal(scope);
        let eMM = this.getMinMaxEdgeVal(scope);

        if (isNaN(nMM.min)) { // jeśli min jest NaN, to max również
            return {
                min: eMM.min,
                max: eMM.max
            };
        }
        else if (isNaN(eMM.min)) {
            return {
                min: nMM.min,
                max: nMM.max
            };
        }
        else {
            return {
                min: (nMM.min<eMM.min)?nMM.min:eMM.min,
                max: (nMM.max>eMM.max)?nMM.max:eMM.max
            };
        }
    };


    // Calculate position of node in space for visualisation.
    // The position depends on graph type and display mode,
    // so need to be overriden in derrived classes
    this.calcPosition = /*virtual*/ (nodeId) => new BABYLON.Vector3();


    this.setDisplayMode = function () {
        for (const key in this.nodes) {
            this.nodes[key].position = this.calcPosition(key);
        }

        for (const key in this.edges) {
            this.edges[key].update();
        }

        Dispatcher.viewModeChanged();
    };
    
    this.showLabels = function (b) {
        this.labelsVisible = b;
        for (const key in this.nodes) {
            this.nodes[key].showLabel();
        }
    };

    
    this.createStructureFromTempStruct = function (struct) {
        //console.log(struct);
        for (let tmpNode of struct.nodes){
            let n = this.addNode(tmpNode.id);
            n.values = tmpNode.values;
            if (tmpNode.label !== null) {
                n.setLabel(tmpNode.label.text, tmpNode.label.enabled);
            } else {
                n.showLabel(false);
            }
        }

        for (let tmpEdge of struct.edges){
            let e = this.addEdge(tmpEdge.n1, tmpEdge.n2);
            e.values = tmpEdge.values;
        }
        
        struct = null;
        //console.log(struct);
    };

});

Graph.displayModes = [ 'classic', 'triangle', 'diamond' ];
Graph.currentDisplayMode = 'classic';

Graph.switchDisplayMode = ()=>{
    if (sgv.graf === null) {
        console.warning('graf not defined');
        return;
    }

    let idx = Graph.displayModes.indexOf(Graph.currentDisplayMode) + 1;
    if (idx===Graph.displayModes.length) idx=0;
    Graph.currentDisplayMode = Graph.displayModes[idx];

    sgv.graf.setDisplayMode();
};

Graph.knownGraphTypes = {};
Graph.registerType = (txt,Type)=>{Graph.knownGraphTypes[txt] = Type;};
Graph.knowType = (txt)=>(txt in Graph.knownGraphTypes);


/**
 * @param {GraphDescr} gDesc - Graph structure description
 * @param {TempGraphStructure} struct - optional Graph data
 */
Graph.create = (gDesc, struct)=>{
    Graph.remove();

    if (gDesc instanceof GraphDescr){
        if (gDesc.type in Graph.knownGraphTypes) {
            sgv.graf = Graph.knownGraphTypes[gDesc.type].createNewGraph(gDesc.size);
        } else {
            console.error('unknown graph type');
            return;
        }
    } else {
        console.error('unknown graph type');
        return;
    }
    
    //console.log(typeof struct, struct.constructor.name, TempGraphStructure.name, struct);
    if (struct instanceof TempGraphStructure){
        sgv.graf.createStructureFromTempStruct(struct);
        sgv.setModeDescription();
        sgv.graf.displayValues();
        hideSplash();
    }
    else {
        sgv.graf.createDefaultStructure(() => {
            sgv.setModeDescription();
            sgv.graf.displayValues();
            hideSplash();
        });
    }
    
};

Graph.remove = ()=>{
    if (sgv.graf !== null) {
        sgv.graf.dispose();
        sgv.graf = null;
        
        Dispatcher.graphDeleted();
    }
};
