

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

/* global Graph, BABYLON, sgv, QbDescr */
"use strict";

var Chimera = /** @class */ (function () {
    Graph.call(this);

    this.type = 'chimera';

    this.cols;
    this.rows;
    this.KL;
    this.KR;
    this.layers = 1;
    
    this.maxNodeId = function () {
        return this.cols * this.rows * 8;
    };


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

    this.connectRowModules2 = function (x, y, z) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
                this.connect(new QbDescr(x, y, z, 1, j, k), new QbDescr(x, y + 1, z, 1, j, k));
            }
        }
    };

    this.connectColModules2 = function (x, y, z) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
                this.connect(new QbDescr(x, y, z, 0, j, k), new QbDescr(x + 1, y, z, 0, j, k));
            }
        }
    };


    this.modulePosition = function( x, y, z ) {
        let d = 50.0;
        let mX = (d * ( ( this.cols - 1 ) / 2.0 ))-(d * x);
        let mY = (d * y) - (d * ( ( this.rows - 1 ) / 2.0 ));
        let mZ = ( d * z ) - (d*((this.layers - 1) / 2.0));
        return new BABYLON.Vector3(mX, mZ, mY);
    };
    
    this.calcPosition2 = function (x, y, z, n0) {
        let newPos = this.modulePosition(x, y, z);
        newPos.addInPlace(this.getNodeOffset2(n0));
        return newPos;
    };

    this.calcPosition = function (nodeId) {
        let qd = QbDescr.fromNodeId(nodeId, this.rows, this.cols);
        return this.calcPosition2(qd.x, qd.y, qd.z, qd.n0());
    };

    this.createModule2 = function (x, y, z) {
        let moduleId = x + (y + z * this.rows) * this.cols;

        let offset = 8 * moduleId;

        // MODULE NODES
        for (let n = 0; n < this.KL; n++) {
            this.addNode(offset + n + 1, this.calcPosition2(x, y, z, n), Number.NaN);
        }
        for (let n = 4; n < this.KR + 4; n++) {
            this.addNode(offset + n + 1, this.calcPosition2(x, y, z, n), Number.NaN);
        }

        // INTERNAL MODULE EDGES
        for (let x = 0; x < this.KL; x++)
            for (let y = 0; y < this.KR; y++) {
                this.addEdge(offset + x + 1, offset + 4 + y + 1);
            }
    };



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


        return nodeOffset[sgv.displayMode][idx];
    };

    this.rowConnections = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < (this.rows - 1); y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.connectRowModules2(x, y, z);
                }
            }
        }
    };

    this.colConnections = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < (this.cols - 1); x++) {
                    this.connectColModules2(x, y, z);
                }
            }
        }
    };

    this.createModules = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.createModule2(x, y, z);    // structure derrived from Chimera
                }
            }
        }
    };

    this.createDefaultStructure = function (then) {
        this.createModules();
        this.showLabels(true);

        this.rowConnections();
        this.colConnections();

        if (typeof then==='function') {
            then();
        }
    };


    this.createStructureFromDef = function (def) {
        for (let i = 0; i < def.length; i++) {
            if (def[i].n1 === def[i].n2) {
                let nodeId = def[i].n1;

                this.addNode(nodeId, this.calcPosition(nodeId), def[i].val);
                this.nodes[nodeId].showLabel(false);
            } else {
                let n1 = def[i].n1;
                let n2 = def[i].n2;
                this.addEdge(n1, n2).setValue(def[i].val, 'default');
            }
        }
    };

    this.setSize = function(c, r, kl, kr, lay) {
        this.cols = c;
        this.rows = r;
        this.KL = kl;
        this.KR = kr;
        if (typeof lay!=='undefined') {
            this.layers = lay;
        } else {
            this.layers = 1;
        }
    };
});

Chimera.prototype = Object.create(Chimera.prototype);
Chimera.prototype.constructor = Chimera;

Chimera.createNewGraph = function (size) {
    var g = new Chimera();
    g.setSize(size.cols, size.rows, size.KL, size.KR);
    return g;
};

