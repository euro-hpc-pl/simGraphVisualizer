
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

/**
 * @class
 * @classdesc Represents a graph with nodes and edges.
 * @memberOf sgv
 */
const Graph = /** @class */ (function () {
    /** Object that holds nodes of the graph. Keys are node IDs.
     * @type {Object}
     */
    this.nodes = {};
    /** Object that holds edges of the graph. Keys are edge IDs.
     * @type {Object}
     */
    this.edges = {};
    /** Object that holds nodes that have been deleted. Keys are node IDs.
     * @type {Object}
     */
    this.missing = {};

    /** Represents the type of graph. Default is 'generic'.
     * @type {string}
     */
    this.type = 'generic';
    /** Array of value scopes available for this graph. Default is ['default'].
     * @type {string[]}
     */
    this.scopeOfValues = ['default'];
    /** Current scope of values to be shown on the graph. Default is 'default'.
     * @type {string}
     */
    this.currentScope = 'default';
    /** Limit of green color representation for values on the graph. Default is 1.0.
     * @type {number}
     */
    this.greenLimit = 1.0;
    /** Limit of red color representation for values on the graph. Default is -1.0.
     * @type {number}
     */
    this.redLimit = -1.0;

    /** Indicates whether node labels are visible or not. Default is false.
     * @type {Bool}
     */
    this.labelsVisible = false;

    /**
     * Dispose of the graph by deleting all its edges and nodes.
     * Also triggers graphDeleted event.
     */
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

    /**
     * Alias for dispose function.
     */
    this.clear = function () {
        this.dispose();
    };

    /**
     * Returns the number of nodes in the graph.
     * @returns {number}
     */
    this.maxNodeId = function () {
        return Object.keys(this.nodes).length;
    };


    /**
     * Add a node to the graph with given nodeId and value.
     * @param {number} nodeId
     * @param {number} val - Initial value for the node.
     * @returns {Node}
     */
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

    /**
     * Given an object and a value, it returns the key corresponding to the value.
     * @param {Object} object
     * @param {number|string} value
     * @returns {Object.key}
     */
    this.getKeyByValue = function(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    };

    /**
     * Given a scope, it returns the index of the scope in the scopeOfValues array.
     * @param {string} scope
     * @returns {number}
     */
    this.getScopeIndex = function(scope) {
        return Object.keys(this.scopeOfValues).find(key => this.scopeOfValues[key] === scope);
    };
    
    /**
     * Add an edge to the graph between given nodes. 
     * If edge already exists, return the existing edge.
     * @param {Node} node1
     * @param {Node} node2
     * @returns {Edge}
     */
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

    /**
     * Delete an edge from the graph.
     * Also triggers graphChanged event.
     * @param {number} edgeId
     */
    this.delEdge = function (edgeId) {
        this.edges[edgeId].clear();
        delete this.edges[edgeId];
        
        Dispatcher.graphChanged();
    };

    /**
     * Returns all nodes connected to the given node.
     * @param {number} nodeId
     * @returns {object} - An object containing arrays of different types of connected nodes.
     */
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
            if (this.edges[key].begin == nodeId) {
                add( this.edges[key].end );
            } else if (this.edges[key].end == nodeId) {
                add( this.edges[key].begin );
            }
        }

        return connected;
    };

    /**
     * Find and delete all edges connected to a node. Return removed edges.
     * @param {number} nodeId
     * @returns {object} - Removed edges.
     */
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

    /**
     * Delete a node from the graph.
     * Also triggers graphChanged event.
     * @param {number} nodeId
     */
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

    /**
     * Restore a deleted node back to the graph.
     * Also triggers graphChanged event.
     * @param {number} nodeId
     * @returns {boolean}
     */
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


    /**
     * Update all edges connected to a node.
     * @param {number} nodeId
     */
    this.findAndUpdateEdges = function (nodeId) {
        for (const key in this.edges) {
            if ((this.edges[key].begin.toString() === nodeId) || (this.edges[key].end.toString() === nodeId)) {
                this.edges[key].update();
            }
        }
    };

    /**
     * Converts a string representing graph structure into a structured object.
     * @param {string} string - String representation of the graph.
     * @returns {object|null}
     */
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

    /**
     * Load scope values into the graph. If the scope is new, add it to the scopeOfValues array.
     * @param {string} scope
     * @param {string} data - String representation of the graph structure.
     * @returns {object} - An object indicating whether the scope was new and its index in scopeOfValues array.
     */
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

    /**
     * Add a scope to the scopeOfValues array. Returns the index of the added scope.
     * @param {string} scope
     * @returns {number} - Index of the added scope.
     */
    this.addScopeOfValues = function(scope) {
        if ( (typeof scope !== 'undefined') && ! this.scopeOfValues.includes(scope) ) {
            this.scopeOfValues.push(scope);
            return this.scopeOfValues.indexOf(scope);
        }
        return -1;
    };

    /**
     * Delete a scope from the scopeOfValues array except 'default'. 
     * If the deleted scope was the currentScope, set the currentScope to 'default'.
     * Returns the index of the currentScope.
     * @param {string} scope
     * @returns {number} - Index of the current scope.
     */
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

    /**
     * Check if a scope exists in the scopeOfValues array.
     * @param {string} scope
     * @returns {boolean} - true if the scope exists, false otherwise.
     */
    this.hasScope = function (scope) {
        return (typeof scope !== 'undefined') && this.scopeOfValues.includes(scope);
    };
    
    /**
     * Display values of the given scope on the graph. If no scope is given, use currentScope.
     * @param {string} scope - optional
     * @returns {Promise<boolean>}
     */
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


    /**
     * returns the label visibility
     * @param {number} nodeId
     * @returns {boolean}
     */
    this.isNodeLabelVisible = function (nodeId) {
        return this.nodes[nodeId].isLabelVisible();
    };

    /**
     * Get the label of a node in the graph.
     * @param {number} nodeId
     * @returns {string}
     */
    this.nodeLabel = function (nodeId) {
        return this.nodes[nodeId].getLabel();
    };

    /**
     * Get the position of a node in the graph.
     * @param {number} nodeId
     * @returns {BABYLON.Vector3}
     */
    this.nodePosition = function (nodeId) {
        return this.nodes[nodeId].position;
    };

    /**
     * Add or remove check mark from a node.
     * @param {number} nodeId
     * @param {boolean} check - If true, add check mark, otherwise remove it.
     */
    this.checkNode = function (nodeId, check) {
        if (check) {
            this.nodes[nodeId].addCheck();
        } else {
            this.nodes[nodeId].delCheck();
        }
    };

    /**
     * Switch the check flag of an edge.
     * @param {number} id - ID of the edge.
     */
    this.edgeDoubleClicked = function (id) {
        this.edges[id].switchCheckFlag();
    };

    /**
     * Move a node by a given difference in position. Also updates all edges connected to the node.
     * @param {number} nodeId
     * @param {BABYLON.Vector3} diff - Difference in position.
     */
    this.moveNode = function (nodeId, diff) {
        this.nodes[nodeId].move(diff);
        this.findAndUpdateEdges(nodeId);
    };

    /**
     * Set the value of an edge for a given scope. Also updates the display.
     * @param {number} edgeId
     * @param {number} value
     * @param {string} scope
     */
    this.setEdgeValue = function (edgeId, value, scope) {
        this.edges[edgeId].setValue(value, scope);
        this.edges[edgeId].displayValue();
    };

    /**
     * Delete the value of an edge for a given scope. Also updates the display.
     * @param {number} edgeId
     * @param {string} scope
     */
    this.delEdgeValue = function (edgeId, scope) {
        this.edges[edgeId].delValue(scope);
        this.edges[edgeId].displayValue();
    };

    /**
     * Get the value of an edge for a given scope.
     * @param {number} edgeId
     * @param {string} scope
     * @returns {number}
     */
    this.edgeValue = function(edgeId, scope) {
        return this.edges[edgeId].getValue(scope);
    };

    /**
     * Set the value of a node for a given scope. Also updates the display.
     * @param {number} nodeId
     * @param {number} value
     * @param {string} scope
     */
    this.setNodeValue = function (nodeId, value, scope) {
        this.nodes[nodeId].setValue(value, scope);
        this.nodes[nodeId].displayValue();
    };

    /**
     * Delete the value of a node for a given scope. Also updates the display.
     * @param {number} nodeId
     * @param {string} scope
     */
    this.delNodeValue = function (nodeId, scope) {
        this.nodes[nodeId].delValue(scope);
        this.nodes[nodeId].displayValue();
    };

    /**
     * Get the value of a node for a given scope.
     * @param {number} nodeId
     * @param {string} scope
     * @returns {number}
     */
    this.nodeValue = function (nodeId,scope) {
        return this.nodes[nodeId].getValue(scope);
    };

    /**
     * Get the minimum and maximum edge value for a given scope. 
     * If no scope is given, use currentScope.
     * @param {string} scope - optional
     * @returns {object} - An object containing minimum and maximum edge value.
     */
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

    /**
     * Get the minimum and maximum node value for a given scope. 
     * If no scope is given, use currentScope.
     * @param {string} scope - optional
     * @returns {object} - An object containing minimum and maximum node value.
     */
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

    /**
     * Get the minimum and maximum value for a given scope from nodes and edges. 
     * If no scope is given, use currentScope.
     * @param {string} scope - optional
     * @returns {object} - An object containing minimum and maximum value.
     */
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


    /**
     * A placeholder function to calculate the position of a node in space for visualisation.
     * The actual implementation will be provided by the derived classes, as the position
     * depends on the type of graph and the display mode.
     * @param {number} nodeId - The id of the node for which the position needs to be calculated.
     * @returns {BABYLON.Vector3} - A new vector representing the position of the node.
     */
    this.calcPosition = /*virtual*/ (nodeId) => new BABYLON.Vector3();


    /**
     * Sets the display mode of the graph.
     * This function changes the position of all nodes and updates all edges according to the calculated positions.
     */
    this.setDisplayMode = function () {
        for (const key in this.nodes) {
            this.nodes[key].position = this.calcPosition(key);
        }

        for (const key in this.edges) {
            this.edges[key].update();
        }

        Dispatcher.viewModeChanged();
    };
    
    /**
     * Sets whether labels are visible on the nodes of the graph.
     * @param {boolean} b - If true, labels are shown. If false, they are hidden.
     */
    this.showLabels = function (b) {
        this.labelsVisible = b;
        for (const key in this.nodes) {
            this.nodes[key].showLabel();
        }
    };

    
    /**
     * Creates the structure of the graph from a temporary structure.
     * @param {object} struct - The temporary structure containing nodes and edges.
     * @returns {Promise<string>} - Resolves to 'ok' when the structure has been created.
     */
    this.createStructureFromTempStruct = function (struct) {
        return new Promise((resolve)=>{
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

            this.showLabels(true);
            resolve('ok');
        });
    };
    
    /**
     * Given a value, a minimum, and a maximum, it returns a value between 0 and 1 proportionate to the position of the value between the min and max.
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    this.scale = function (value, min, max) {
        if (min === max) return 0.5;
        return (value - min) / (max - min);
    };

});

/**
 * Available display modes for the graph.
 * @type {string[]}
 * @memberOf sgv.Graph
 */
Graph.displayModes = [ 'classic', 'triangle', 'diamond' ];

/**
 * Current display mode for the graph.
 * @type {string}
 * @memberOf sgv.Graph
 */
Graph.currentDisplayMode = 'classic';

/**
 * Switch the display mode of the graph to the next available mode.
 * If the graph does not exist, a warning is logged and the function does nothing.
 * @function
 * @memberOf sgv.Graph
 */
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

/** An object mapping known graph types to their corresponding constructor functions.
 * 
 * @type Object
 * @memberOf sgv.Graph
 */
Graph.knownGraphTypes = {};

/**
 * Registers a new graph type.
 * @function
 * @param {string} txt - The name of the graph type.
 * @param {Function} Type - The constructor function of the graph type.
 * @memberOf sgv.Graph
 */
Graph.registerType = (txt,Type)=>{Graph.knownGraphTypes[txt] = Type;};

/**
 * Checks if a graph type is known.
 * @function
 * @param {string} txt - The name of the graph type.
 * @returns {boolean} - True if the graph type is known, false otherwise.
 * @memberOf sgv.Graph
 */
Graph.knowType = (txt)=>(txt in Graph.knownGraphTypes);


/**
 * Create a new graph from a GraphDescr and optionally a TempGraphStructure.
 * If a graph already exists, it is first removed.
 * If the graph type is not known or not a GraphDescr, an error is logged and the function does nothing.
 * @function
 * @param {GraphDescr} gDesc - The description of the graph structure.
 * @param {TempGraphStructure} struct - Optional. The graph data.
 * @memberOf sgv.Graph
 */
Graph.create = (gDesc, struct)=>{
    Graph.remove();
    if (gDesc instanceof GraphDescr){
        if (gDesc.type in Graph.knownGraphTypes) {
            sgv.graf = new Graph.knownGraphTypes[gDesc.type](gDesc.size);
        } else {
            console.error('unknown graph type');
            return;
        }
    } else {
        console.error('unknown graph type');
        return;
    }
    
    if (struct instanceof TempGraphStructure){
        sgv.graf.createStructureFromTempStruct(struct)
                .then(()=>Dispatcher.graphCreated());
    }
    else {
        sgv.graf.createDefaultStructure(()=>Dispatcher.graphCreated());
    }
    
};

/**
 * Removes the current graph if it exists.
 * @function
 * @memberOf sgv.Graph
 */
Graph.remove = ()=>{
    if (sgv.graf !== null) {
        sgv.graf.dispose();
        sgv.graf = null;
        
        Dispatcher.graphDeleted();
    }
};
