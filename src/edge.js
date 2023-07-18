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
/* global BABYLON, sgv */

/**
 * Edge class representing an edge in a graph.
 * @class
 * @param {object} graf - The parent graph object.
 * @param {number|string} b - The identifier of the beginning node of the edge.
 * @param {number|string} e - The identifier of the ending node of the edge.
 */
var Edge = /** @class */ (function (graf, b, e) {
    this.parentGraph = graf;

    this.values = {
        'default' : Number.NaN
    };

    if (typeof b==='string') b = parseInt(b,10); 
    if (typeof e==='string') e = parseInt(e,10); 

    if ((typeof b !== 'number')||(typeof e !== 'number'))
        console.warning("Edge begin and end ids should be both a numbers, but are: "+b+" and "+e);

    if (!(b in this.parentGraph.nodes))
        console.warning("First node not exists in graph: "+b);

    if (!(e in this.parentGraph.nodes))
        console.warning("Second node not exists in graph: "+e);

    if (b < e) {
        this.begin = b;
        this.end = e;
    } else {
        this.begin = e;
        this.end = b;
    }

    this.id = Edge.calcId(this.begin, this.end);

    this._checked = false;

    /**
     * Retrieves the identifier of the mesh associated with the edge.
     * @returns {number} The mesh identifier.
     */
    this.meshId = ()=>mesh.idx;
    
    /**
     * Clears the edge by unbinding it from the scene particle system.
     */
    this.clear = function() {
        sgv.SPS.unbindEdge(this);
    };

    /**
     * Toggles the check flag of the edge.
     */
    this.switchCheckFlag = function () {
        this._checked = !this._checked;

        this.parentGraph.checkNode(this.begin, this._checked);
        this.parentGraph.checkNode(this.end, this._checked);

        //this.instance.material = this._checked ? sgv.grayMat1 : sgv.grayMat0;
    };

    /**
     * Deletes the value associated with a scope for the edge.
     * @param {string} [scope] - The scope for which to delete the value. If not provided, the current scope is used.
     */
    this.delValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            delete this.values[scope];
        }
    };

    /**
     * Retrieves the value associated with a scope for the edge.
     * @param {string} [scope] - The scope for which to retrieve the value. If not provided, the current scope is used.
     * @returns {number} The value associated with the scope.
     */
    this.getValue = function (scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (this.values.hasOwnProperty(scope)){
            return this.values[scope];
        } else {
            return Number.NaN;
        }
    };

    /**
     * Sets the value associated with a scope for the edge.
     * @param {number} val - The value to set.
     * @param {string} [valId='default'] - The value identifier. Defaults to 'default'.
     */
    this.setValue = function (val, valId) {
        if (typeof valId === 'undefined') {
            valId = 'default';
        }
        
        //console.log(valId, val);

        this.values[valId] = val;

        this.displayValue(valId);
    };

    /**
     * Displays the value associated with a value identifier for the edge.
     * @param {string} [valId='default'] - The value identifier. Defaults to 'default'.
     */
    this.displayValue = function (valId) {
        if (typeof valId === 'undefined') {
            valId = 'default';
        }

        let edgeColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        let edgeWidth = 0.1;
        if (valId in this.values) {
            edgeColor = valueToColor(this.values[valId]);
            edgeWidth = valueToEdgeWidth(this.values[valId]);
        }

        sgv.SPS.updateEdgeValue(this, edgeColor, edgeWidth);
    };

    /**
     * Updates the edge by setting its color, width, and position based on the current value.
     */
    this.update = ()=>{
        let val = this.values[this.parentGraph.currentScope];
        
        let edgeColor = valueToColor(val);
        let edgeWidth = valueToEdgeWidth(val);

        let b = this.parentGraph.nodePosition(this.begin);
        let e = this.parentGraph.nodePosition(this.end);

        sgv.SPS.setEdge(this, edgeColor, edgeWidth, b, e);
    };

    var mesh = sgv.SPS.bindEdge(this);
    if (mesh===null) {
        console.error("Can't bind EdgeSPS");
    }
    else {
        this.update();
    }

});

// Static method

/**
 * Calculates the identifier for an edge based on the beginning and ending node identifiers.
 * @param {number|string} b - The identifier of the beginning node of the edge.
 * @param {number|string} e - The identifier of the ending node of the edge.
 * @returns {string} The calculated identifier.
 */
Edge.calcId = (b, e) => {
    if (typeof b==='string') b = parseInt(b,10); 
    if (typeof e==='string') e = parseInt(e,10); 

    if ((typeof b !== 'number')||(typeof e !== 'number')) {
        console.error("Edge begin and end must be a numbers");
    }
    
    return (b < e)?("" + b + "," + e):("" + e + "," + b);
};
