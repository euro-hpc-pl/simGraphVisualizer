
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
/* global BABYLON, sgv, Graph, QbDescr, Chimera */

var Pegasus = /** @class */ (function () {
    Chimera.call(this);

    this.type = 'pegasus';

    this.createModules = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.createModule2(x, y, z);    // structure derrived from Chimera
                    this.connectInternalPegasusEdges(x, y, z); // additional in-module edges
                }
            }
        }
    };

    this.pegasusConnections = ()=>{
        // layer to layer connections
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.connectExternalPegasusEdges(x, y, z);
                }
            }
        }
    };
    
    this.createDefaultStructure = function (then) {
        sgv.dlgLoaderSplash.setInfo('creating modules', ()=>{
            this.createModules(); // overriden

            this.showLabels(true);
                        
            sgv.dlgLoaderSplash.setInfo('creating row connections',()=>{
                this.rowConnections();  // derrived from Chimera

                sgv.dlgLoaderSplash.setInfo('creating col connections',()=>{
                    this.colConnections();  // derrived from Chimera

                    sgv.dlgLoaderSplash.setInfo('creating specific pegasus connections',()=>{
                        this.pegasusConnections();

                        if (typeof then==='function') {
                            then();
                        }
                    });
                });
            });
        });
    };


    this.connectExternalPegasusEdges = function (x, y, z) {
        let val0 = Number.NaN;
        let val1 = val0; //-1.0;
        let val2 = val0; // 1.0;
        let val3 = val0; // 0.5;

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


    this.connectInternalPegasusEdges = function (x, y, z) {
        let moduleId = x + (y + z * this.rows) * this.cols;

        let offset = 8 * moduleId;

        // PEGASUS ADDITIONAL EDGES
        if (this.KL > 1) {
            this.addEdge(offset + 1, offset + 2);
            if (this.KL > 3) {
                this.addEdge(offset + 3, offset + 4);
            }
        }

        offset += 4;

        if (this.KR > 1) {
            this.addEdge(offset + 1, offset + 2);
            if (this.KR > 3) {
                this.addEdge(offset + 3, offset + 4);
            }
        }
    };
});

Pegasus.prototype = Object.create(Pegasus.prototype);
Pegasus.prototype.constructor = Pegasus;

Pegasus.createNewGraph = function (size) {
    var g = new Pegasus();
    if (typeof size.lays!=='undefined') {
        g.setSize(size.cols, size.rows, size.KL, size.KR, size.lays);
    } else {
        g.setSize(size.cols, size.rows, size.KL, size.KR);
    }
    return g;
};
