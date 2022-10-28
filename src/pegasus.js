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
/* global BABYLON, sgv, Graph */

const qD = function (x, y, z, i, j, k) {
    return new QbDescr(x, y, z, i, j, k);
};


const QbDescr = /** @class */ (function (x, y, z, i, j, k) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.i = i;
    this.j = j;
    this.k = k;

    this.n0 = function () {
        return (((this.i << 1) + this.j) << 1) + this.k;
    };
    this.n1 = function () {
        return (((this.i << 1) + this.j) << 1) + this.k + 1;
    };
    this.toNodeId = function (rows, cols) {
        return 8 * (this.x + (this.y + this.z * rows) * cols) + this.n1();
    };

});

QbDescr.fromNodeId = function (nodeIdA, rows, cols) {
    let nodeId = nodeIdA - 1;

    let n = nodeId % 8;

    let k = n % 2;
    let j = (n >> 1) % 2;
    let i = (n >> 2) % 2;

    let modId = nodeId >> 3;

    let layerSize = cols * rows;
    let currentLayer = Math.floor(modId / layerSize);
    let modIdInLayer = modId % layerSize;
    let currentRow = Math.floor(modIdInLayer / cols);
    let currentCol = modIdInLayer % cols;
    return new QbDescr(currentCol, currentRow, currentLayer, i, j, k);
};



var Pegasus = /** @class */ (function () {
    Graph.call(this);

    this.type = 'pegasus';

    this.modSize;
    this.nbModules;
    this.cols;
    this.rows;
    this.KL;
    this.KR;
    this.layers;

    this.setSize = function (c, r, kl, kr) {
        this.cols = c;
        this.rows = r;
        this.KL = kl;
        this.KR = kr;
        this.layers = 3;

        this.nbModules = this.cols * this.rows * this.layers;
        this.modSize = this.KL + this.KR;

        this.size = this.nbModules * this.modSize;
    };

    this.maxNodeId = function () {
        return this.cols * this.rows * 8;
    };

    this.createDefaultStructure = function () {
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.createModule2(x, y, z);
                }
            }
        }


        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < (this.rows - 1); y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.connectRowModules2(x, y, z);
                }
            }
        }


        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < (this.cols - 1); x++) {
                    this.connectColModules2(x, y, z);
                }
            }
        }

        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.connectEvenMoreIdioticPegasusEdges(x, y, z);
                }
            }
        }

        this.showLabels(true);
    };



    this.connect = function (qdA, qdB, value) {
        let idA = qdA.toNodeId(this.rows, this.cols);
        let idB = qdB.toNodeId(this.rows, this.cols);

        if ((idA in this.nodes) && (idB in this.nodes))
            this.addEdge(idA, idB, value);
    };



    this.connectEvenMoreIdioticPegasusEdges = function (x, y, z) {
        let val0 = 0.0;
        let val1 = 0.0; //-1.0;
        let val2 = 0.0; // 1.0;
        let val3 = 0.0; // 0.5;

        for (let kA = 0; kA < 2; kA++) {
            for (let jB = 0; jB < 2; jB++) {
                for (let kB = 0; kB < 2; kB++) {
                    if (z < this.layers - 1) {
                        this.connect(new QbDescr(x, y, z, 0, 0, kA), new QbDescr(x, y, z + 1, 1, jB, kB), val0);
                        this.connect(new QbDescr(x, y, z, 1, 0, kA), new QbDescr(x, y, z + 1, 0, jB, kB), val1);
                        if (x > 0)
                            this.connect(new QbDescr(x, y, z, 0, 1, kA), new QbDescr(x - 1, y, z + 1, 1, jB, kB), val2);
                        if (y > 0)
                            this.connect(new QbDescr(x, y, z, 1, 1, kA), new QbDescr(x, y - 1, z + 1, 0, jB, kB), val3);
                    } else {
                        if ((x < this.cols - 1) && (y < this.rows - 1)) {
                            this.connect(new QbDescr(x, y, z, 0, 0, kA), new QbDescr(x + 1, y + 1, 0, 1, jB, kB), val0);
                            this.connect(new QbDescr(x, y, z, 1, 0, kA), new QbDescr(x + 1, y + 1, 0, 0, jB, kB), val1);
                        }

                        if (y < this.rows - 1) {
                            this.connect(new QbDescr(x, y, z, 0, 1, kA), new QbDescr(x, y + 1, 0, 1, jB, kB), val2);
                        }

                        if (x < this.cols - 1) {
                            this.connect(new QbDescr(x, y, z, 1, 1, kA), new QbDescr(x + 1, y, 0, 0, jB, kB), val3);
                        }
                    }
                }
            }
        }
    };


    this.connectRowModules2 = function (x, y, z) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
                this.connect(new QbDescr(x, y, z, 1, j, k), new QbDescr(x, y + 1, z, 1, j, k), getRandom(-0.5, 0.5));//0.0 );          
            }
        }
    };


//    connectRowModules(module1id, module2id) {
//        for (let i=(this.KL+1); i<=this.modSize; i++) {
//            this.addEdge(this.modSize*module1id + i, this.modSize*module2id + i, 0.0);
//        }
//    }

    this.connectColModules2 = function (x, y, z) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
                this.connect(new QbDescr(x, y, z, 0, j, k), new QbDescr(x + 1, y, z, 0, j, k), getRandom(-0.5, 0.5));//0.0 );          
            }
        }
    };

//    connectColModules(module1id, module2id) {
//        for (let i=1; i<=this.KL; i++) {
//            this.addEdge(this.modSize*module1id + i, this.modSize*module2id + i, 0.0);
//        }
//    }


    this.connectInternalPegasusEdges = function (x, y, z) {
        let moduleId = x + (y + z * this.rows) * this.cols;

        let offset = 8 * moduleId;

        // PEGASUS ADDITIONAL EDGES
        if (this.KL > 1) {
            this.addEdge(offset + 1, offset + 2, getRandom(-0.5, 0.5));//0.0 ); 
            if (this.KL > 3) {
                this.addEdge(offset + 3, offset + 4, getRandom(-0.5, 0.5));//0.0 ); 
            }
        }

        offset += 4;

        if (this.KR > 1) {
            this.addEdge(offset + 1, offset + 2, getRandom(-0.5, 0.5));//0.0 ); 
            if (this.KR > 3) {
                this.addEdge(offset + 3, offset + 4, getRandom(-0.5, 0.5));//0.0 ); 
            }
        }
    };

    this.createModule2 = function (x, y, z) {
        let moduleId = x + (y + z * this.rows) * this.cols;

        let offset = 8 * moduleId;

        // MODULE NODES
        for (let n = 0; n < this.KL; n++) {
            this.addNode(offset + n + 1, this.calcPosition2(x, y, z, n), getRandom(-1.0, 1.0));//0.0 );
        }
        for (let n = 4; n < this.KR + 4; n++) {
            this.addNode(offset + n + 1, this.calcPosition2(x, y, z, n), getRandom(-1.0, 1.0));//0.0 );
        }

        // INTERNAL MODULE EDGES
        for (let x = 0; x < this.KL; x++)
            for (let y = 0; y < this.KR; y++) {
                this.addEdge(offset + x + 1, offset + 4 + y + 1, getRandom(-0.5, 0.5));//0.0 );        
            }

        this.connectInternalPegasusEdges(x, y, z);
    };



    this.mX = {
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

    this.mmX = function (i) {
        return -25 - 50 * i;
    };

    this.mY = {
        '-8': 75,
        '-7': 65,
        '-6': 55,
        '-5': 45,
        '-4': 35,
        '-3': 25,
        '-2': 15,
        '-1': 5,
        '0': -5,
        '1': -15,
        '2': -25,
        '3': -35,
        '4': -45,
        '5': -55,
        '6': -65,
        '7': -75
    };

    this.mmY = function (i) {
        return -5 - 10 * i;
    };

    this.mZ = {
        '-8': -375,
        '-7': -325,
        '-6': -275,
        '-5': -225,
        '-4': -175,
        '-3': -125,
        '-2': -75,
        '-1': -25,
        '0': 25,
        '1': 75,
        '2': 125,
        '3': 175,
        '4': 225,
        '5': 275,
        '6': 325,
        '7': 375
    };

    this.mmZ = function (i) {
        return 25 + 50 * i;
    };



    this.getNodeOffset = function (nodeId) {
        //console.log(nodeId);

        let nodeOffset = [
            new BABYLON.Vector3(15, -3, -10),
            new BABYLON.Vector3(5, -1, -10),
            new BABYLON.Vector3(-5, 1, -10),
            new BABYLON.Vector3(-15, 3, -10),
            new BABYLON.Vector3(15, 3, 10),
            new BABYLON.Vector3(5, 1, 10),
            new BABYLON.Vector3(-5, -1, 10),
            new BABYLON.Vector3(-15, -3, 10)
        ];

        let idx = nodeId;
        if (idx < this.KL) {
            return nodeOffset[idx];
        } else {
            idx -= this.KL;
            idx += 4;
            return nodeOffset[idx];
        }
    };

    this.getNodeOffset2 = function (idx) {
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
            'classic': [new BABYLON.Vector3(15, -3, -10),
                new BABYLON.Vector3(5, -1, -10),
                new BABYLON.Vector3(-5, 1, -10),
                new BABYLON.Vector3(-15, 3, -10),
                new BABYLON.Vector3(15, 3, 10),
                new BABYLON.Vector3(5, 1, 10),
                new BABYLON.Vector3(-5, -1, 10),
                new BABYLON.Vector3(-15, -3, 10)],

            'diamond': [new BABYLON.Vector3(0, -3, 9),
                new BABYLON.Vector3(0, -1, 3),
                new BABYLON.Vector3(0, 1, -3),
                new BABYLON.Vector3(0, 3, -9),
                new BABYLON.Vector3(9, 3, 0),
                new BABYLON.Vector3(3, 1, 0),
                new BABYLON.Vector3(-3, -1, 0),
                new BABYLON.Vector3(-9, -3, 0)],

            'triangle': [new BABYLON.Vector3(-15, -3, 9),
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


    this.calcPosition = function (nodeId) {
        let qd = QbDescr.fromNodeId(nodeId, this.rows, this.cols);

        return this.calcPosition2(qd.x, qd.y, qd.z, qd.n0());
    };


    this.calcPosition2 = function (x, y, z, n) {
        var newPos = new BABYLON.Vector3(this.mmX(x), this.mmY(x), this.mmZ(y));

        newPos.addInPlace(new BABYLON.Vector3(0.0, 40.0 * z, 0.0));

        //console.log(n);
        newPos.addInPlace(this.getNodeOffset2(n));

        return newPos;
    };



    this.createStructureFromDef = function (def) {
        for (let i = 0; i < def.length; i++) {
            if (def[i].n1 === def[i].n2) {
                let nodeId = def[i].n1;

                let qb = QbDescr.fromNodeId(nodeId, this.rows, this.cols);
                this.addNode(nodeId, this.calcPosition2(qb.x, qb.y, qb.z, qb.n0()), def[i].val);
            } else {
                let n1 = def[i].n1;
                let n2 = def[i].n2;
                this.addEdge(n1, n2, def[i].val);
                //let strId = "" + n1 + "," + n2;
                //this.edges[strId].setValue(  );
            }
        }
        //console.log(this.nodes);
    };

});

Pegasus.prototype = Object.create(Pegasus.prototype);
Pegasus.prototype.constructor = Pegasus;

Pegasus.createNewGraph = function (size) {
    var g = new Pegasus();

    g.cols = size.cols;
    g.rows = size.rows;
    g.KL = size.KL;
    g.KR = size.KR;

    g.layers = 3;

    g.nbModules = g.cols * g.rows * g.layers;

    g.modSize = g.KL + g.KR;

    g.size = g.nbModules * g.modSize;

    //g.createDefaultStructure();

    return g;
};
