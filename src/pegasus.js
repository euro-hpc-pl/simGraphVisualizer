
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
/* global BABYLON, sgv, Graph, QbDescr, Chimera, DEMO_MODE */

/**
 * @class
 * @classdesc Represents a Pegasus graph structure.
 * @memberOf sgv
 * @extends Chimera
 * @constructor
 * @param {number} gSize - The size of the graph.
 */
var Pegasus = /** @class */ (function (gSize) {
    Chimera.call(this, gSize);

    /**
     * The type of the graph.
     * @type {string}
     */
    this.type = 'pegasus';

    /**
     * Connects the Pegasus edges.
     */
    this.pegasusConnections = () => {
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.connectInternalPegasusEdges(x, y, z); // additional in-module edges [eq4]
                    this.connectExternalPegasusEdges(x, y, z); // layer to layer edges [eq12 - eq19]
                }
            }
        }
    };

    /**
     * Creates the default Pegasus graph structure.
     * @param {function} then - The callback function to be called after the structure is created.
     */
    this.createDefaultStructure = function (then) {
        sgv.dlgLoaderSplash.setInfo('creating modules', () => {
            this.createModules(); // derrived from Chimera

            sgv.dlgLoaderSplash.setInfo('creating vertical connections', () => {
                this.verticalConnections();  // derrived from Chimera

                sgv.dlgLoaderSplash.setInfo('creating horizontal connections', () => {
                    this.horizontalConnections();  // derrived from Chimera

                    sgv.dlgLoaderSplash.setInfo('creating specific pegasus connections', () => {
                        this.pegasusConnections();

                        if (typeof then === 'function') {
                            then();
                        }
                    });
                });
            });
        });
    };

    /**
     * Connects the external Pegasus edges.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     */
    this.connectExternalPegasusEdges = function (x, y, z) {
        let v12, v13, v14, v15, v16, v17, v18, v19;

        if (DEMO_MODE) {
            v12 = v16 = 0;
            v13 = v17 = -1;
            v14 = v18 = 1;
            v15 = v19 = 0.5;
        } else {
            v12 = v13 = v14 = v15 = v16 = v17 = v18 = v19 = Number.NaN;
        }

        let firstColumn = (x === 0);
        let lastColumn = (x === (this.cols - 1));
        let firstRow = (y === 0);
        let lastRow = (y === (this.rows - 1));
        let lastLayer = (z === (this.layers - 1));

        for (let kA of [0, 1]) {
            for (let jB of [0, 1]) {
                for (let kB of [0, 1]) {
                    if (!lastLayer) {
                        // eq12
                        this.connect(new QbDescr(x, y, z, 0, 0, kA), new QbDescr(x, y, z + 1, 1, jB, kB), v12);
                        //eq13
                        this.connect(new QbDescr(x, y, z, 1, 0, kA), new QbDescr(x, y, z + 1, 0, jB, kB), v13);

                        //eq14
                        if (!firstColumn)
                            this.connect(new QbDescr(x, y, z, 0, 1, kA), new QbDescr(x - 1, y, z + 1, 1, jB, kB), v14);

                        //eq15
                        if (!firstRow)
                            this.connect(new QbDescr(x, y, z, 1, 1, kA), new QbDescr(x, y - 1, z + 1, 0, jB, kB), v15);
                    } else { // for last layer (z===2 if 3-layers pegasus)
                        if (!(lastColumn || lastRow)) {
                            //eq16
                            this.connect(new QbDescr(x, y, z, 0, 0, kA), new QbDescr(x + 1, y + 1, 0, 1, jB, kB), v16);
                            //eq17
                            this.connect(new QbDescr(x, y, z, 1, 0, kA), new QbDescr(x + 1, y + 1, 0, 0, jB, kB), v17);
                        }

                        //eq18
                        if (!lastRow) {
                            this.connect(new QbDescr(x, y, z, 0, 1, kA), new QbDescr(x, y + 1, 0, 1, jB, kB), v18);
                        }

                        //eq19
                        if (!lastColumn) {
                            this.connect(new QbDescr(x, y, z, 1, 1, kA), new QbDescr(x + 1, y, 0, 0, jB, kB), v19);
                        }
                    }
                }
            }
        }
    };

    /**
     * Connects the internal Pegasus edges.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     */
    this.connectInternalPegasusEdges = function (x, y, z) {
        let v;

        if (DEMO_MODE) {
            v = -0.5;
        } else {
            v = Number.NaN;
        }

        // eq4
        for (let i of [0, 1]) {
            for (let j of [0, 1]) {
                this.connect(new QbDescr(x, y, z, i, j, 0), new QbDescr(x, y, z, i, j, 1), v);
            }
        }

    };
});

Pegasus.prototype = Object.create(Chimera.prototype);
Pegasus.prototype.constructor = Pegasus;

/**
 * Registers the Pegasus type in the Graph.
 * @param {string} 'pegasus' - The type name of the graph.
 * @param {function} Pegasus - The Pegasus class.
 */
Graph.registerType('pegasus', Pegasus);
