

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

/* global Graph, BABYLON, sgv, QbDescr, qD, GraphSize */
"use strict";

/**
 * @class
 * @classdesc Represents a Chimera graph structure.
 * @memberOf sgv
 * 
 * @extends Graph
 * @constructor
 * @param {GraphSize} gSize - The size of the graph.
 */
const Chimera = /** @class */ (function (gSize) {
    Graph.call(this);

    /**
     * The type of the graph.
     * @type {string}
     */
    this.type = 'chimera';

    /**
     * Sets the size of the graph.
     * @param {GraphSize} gSize - The size of the graph.
     */
    this.setSize = function(gSize) {
        if (gSize instanceof GraphSize) {
            this.cols = gSize.cols;
            this.rows = gSize.rows;
            this.layers = gSize.lays;
            this.KL = gSize.KL;
            this.KR = gSize.KR;
        }
        else {
            this.cols = 2;
            this.rows = 2;
            this.layers = 1;
            this.KL = 4;
            this.KR = 4;
        }
    };

    this.setSize(gSize);

    /**
     * Calculates the maximum node ID in the graph.
     * @returns {number} The maximum node ID.
     */
    this.maxNodeId = function () {
        return this.cols * this.rows * 8;
    };


    /**
     * Connects two nodes in the graph.
     * @param {QbDescr} qdA - The first node descriptor.
     * @param {QbDescr} qdB - The second node descriptor.
     * @param {number} value - The value to set for the edge (optional).
     */
    this.connect = function (qdA, qdB, value) {
        let idA = qdA.toNodeId(this.rows, this.cols);
        let idB = qdB.toNodeId(this.rows, this.cols);

        if ((idA in this.nodes) && (idB in this.nodes)) {
            let e = this.addEdge(idA, idB);
            if (typeof value==='number') {
                e.setValue(value);
            }
        }
    };

    /**
     * Connects the vertical edges between nodes in the graph.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     */
    this.connectVertical = function (x, y, z) {
        for (let j of [0,1]) {
            for (let k of [0,1]) {
                // eq3
                this.connect(new QbDescr(x, y, z, 0, j, k), new QbDescr(x, y + 1, z, 0, j, k));
            }
        }
    };

    /**
     * Connects the horizontal edges between nodes in the graph.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     */
    this.connectHorizontal = function (x, y, z) {
        for (let j of [0,1]) {
            for (let k of [0,1]) {
                // eq2
                this.connect(new QbDescr(x, y, z, 1, j, k), new QbDescr(x + 1, y, z, 1, j, k));
            }
        }
    };

    /**
     * Connects the internal Chimera edges between nodes in the graph.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     */
    this.connectInternalChimeraEdges = function (x, y, z) {
        let v;

//        if (DEMO_MODE) {
//            v = -0.5;
//        } else {
            v = Number.NaN;
//        }

        for (let jA of [0, 1]) {
            for (let kA of [0, 1]) {
                for (let jB of [0, 1]) {
                    for (let kB of [0, 1]) {
                        // eq1
                        this.connect(new QbDescr(x, y, z, 0, jA, kA), new QbDescr(x, y, z, 1, jB, kB), v);
                    }
                }
            }
        }

    };

    this.modulePositionTEST = function( x, y, z ) {
        let d = 50.0;
        let mX = (d * ( ( this.rows - 1 ) / 2.0 ))-(d * x);
        let mY = (d * y) - (d * ( ( this.cols - 1 ) / 2.0 ));
        let mZ = ( d * z ) - (d*((this.layers - 1) / 2.0));
        return new BABYLON.Vector3(mX, mZ, mY);
    };

    /**
     * Calculates the position of a module in the graph.
     * @param {number} x - The x-coordinate of the module.
     * @param {number} y - The y-coordinate of the module.
     * @param {number} z - The z-coordinate of the module.
     * @returns {BABYLON.Vector3} The position of the module.
     */
    this.modulePosition = function( x, y, z ) {
        let d = 50.0;
        let mX = (d * ( ( this.cols - 1 ) / 2.0 ))-(d * y);
        let mY = (d * x) - (d * ( ( this.rows - 1 ) / 2.0 ));
        let mZ = ( d * z ) - (d*((this.layers - 1) / 2.0));
        return new BABYLON.Vector3(mX, mZ, mY);
    };
    
    /**
     * Calculates the position of a node in the graph.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     * @param {number} n0 - The n0 index of the node.
     * @returns {BABYLON.Vector3} The position of the node.
     */
    this.calcPosition2 = function (x, y, z, n0) {
        let newPos = this.modulePosition(x, y, z);
        newPos.addInPlace(this.getNodeOffset2(n0));
        return newPos;
    };

    /**
     * Calculates the position of a node in the graph.
     * @param {number} nodeId - The ID of the node.
     * @returns {BABYLON.Vector3} The position of the node.
     */
    this.calcPosition = function (nodeId) {
        let qd = QbDescr.fromNodeId(nodeId, this.rows, this.cols);
        return this.calcPosition2(qd.x, qd.y, qd.z, qd.n0());
    };


    /**
     * Adds a node to the graph based on the XYZIJK coordinates.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     * @param {number} i - The i index of the node.
     * @param {number} j - The j index of the node.
     * @param {number} k - The k index of the node.
     * @returns {number} The ID of the added node.
     */
    this.addNodeXYZIJK = function(x,y,z,i,j,k) {
        return this.addNode(qD(x,y,z,i,j,k).toNodeId(this.rows, this.cols));
    };

    /**
     * Adds a node to the graph based on the XYZn coordinates.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     * @param {number} n - The n index of the node.
     * @returns {number} The ID of the added node.
     */
    this.addNodeXYZn = function(x,y,z,n) {
        return this.addNode(qD(x,y,z,(n>>2)&1,(n>>1)&1,n&1).toNodeId(this.rows, this.cols));
    };

    /**
     * Creates the nodes for a module in the graph.
     * @param {number} x - The x-coordinate of the module.
     * @param {number} y - The y-coordinate of the module.
     * @param {number} z - The z-coordinate of the module.
     */
    this.createModuleNodes = function (x, y, z) {
        for (let n = 0; n < this.KL; n++) {
            this.addNodeXYZn(x,y,z,n);
        }
        for (let n = 0; n < this.KR; n++) {
            this.addNodeXYZn(x,y,z,n+4);
        }
    };

    /**
     * Retrieves the offset position of a node based on its index.
     * @param {number} idx - The index of the node.
     * @returns {BABYLON.Vector3} The offset position of the node.
     */
    this.getNodeOffset2 = function (idx) {
        let nodeOffset = {
            'classic': [
                new BABYLON.Vector3(15, -3, -10),
                new BABYLON.Vector3(5, -1, -10),
                new BABYLON.Vector3(-5, 1, -10),
                new BABYLON.Vector3(-15, 3, -10),
                new BABYLON.Vector3(15, 3, 10),
                new BABYLON.Vector3(5, 1, 10),
                new BABYLON.Vector3(-5, -1, 10),
                new BABYLON.Vector3(-15, -3, 10)],

            'diamond': [
                new BABYLON.Vector3(0, -5, 15),
                new BABYLON.Vector3(0, -1, 5),
                new BABYLON.Vector3(0, 1, -5),
                new BABYLON.Vector3(0, 5, -15),
                new BABYLON.Vector3(15, 5, 0),
                new BABYLON.Vector3(5, 1, 0),
                new BABYLON.Vector3(-5, -1, 0),
                new BABYLON.Vector3(-15, -5, 0)],

            'triangle': [
                new BABYLON.Vector3(-15, -3, 9),
                new BABYLON.Vector3(-15, -1, 3),
                new BABYLON.Vector3(-15, 1, -3),
                new BABYLON.Vector3(-15, 3, -9),
                new BABYLON.Vector3(9, 3, 15),
                new BABYLON.Vector3(3, 1, 15),
                new BABYLON.Vector3(-3, -1, 15),
                new BABYLON.Vector3(-9, -3, 15)]
        };


        return nodeOffset[Graph.currentDisplayMode][idx];
    };

    /**
     * Connects the vertical edges between modules in the graph.
     */
    this.verticalConnections = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < (this.rows - 1); y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.connectVertical(x, y, z);
                }
            }
        }
    };

    /**
     * Connects the horizontal edges between modules in the graph.
     */
    this.horizontalConnections = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < (this.cols - 1); x++) {
                    this.connectHorizontal(x, y, z);
                }
            }
        }
    };

    /**
     * Creates the modules and their connections in the graph.
     */
    this.createModules = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.createModuleNodes(x, y, z);
                    this.connectInternalChimeraEdges(x, y, z);
                }
            }
        }
    };

    /**
     * Creates the default Chimera graph structure.
     * @param {function} then - The callback function to be called after the structure is created.
     */
    this.createDefaultStructure = function (then) {
        if (this.layers>1) this.layers=1; //for safety
        
        sgv.dlgLoaderSplash.setInfo('creating modules', ()=>{
            this.createModules();

            //this.showLabels(true);
                        
            sgv.dlgLoaderSplash.setInfo('creating vertical connections',()=>{
                this.verticalConnections();

                sgv.dlgLoaderSplash.setInfo('creating horizontal connections',()=>{
                    this.horizontalConnections();

                    if (typeof then==='function') {
                        then();
                    }
                });
            });
        });
    };

});

Chimera.prototype = Object.create(Graph.prototype);
Chimera.prototype.constructor = Chimera;

/**
 * Registers the Chimera type in the Graph.
 * @param {string} 'chimera' - The type name of the graph.
 * @param {function} Chimera - The Chimera class.
 */
Graph.registerType('chimera', Chimera);
