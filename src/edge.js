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

var Edge = /** @class */ (function (graf, b, e, val) {
    this.parentGraph = graf;
    this.values = {};

    this.begin = b;
    this.end = e;

    this._checked = false;

    this.update = function () {
        var options = {
            instance: this.instance,
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ]
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);
    };

    this.switchCheckFlag = function () {
        this._checked = !this._checked;

        this.parentGraph.checkNode(this.begin, this._checked);
        this.parentGraph.checkNode(this.end, this._checked);

        this.instance.material = this._checked ? sgv.grayMat1 : sgv.grayMat0;
    };


    this.getValue = function (valId) {
        if (valId === undefined) {
            valId = 'value';
        }

        return this.values[valId];
    };

    this.setValue = function (val, valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        this.values[valId] = val;

        this.displayValue(valId);
    };

    this.displayValue = function (valId) {
        if (valId === undefined) {
            valId = 'value';
        }

        let edgeColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        let edgeWidth = 0.1;
        if (valId in this.values) {
            edgeColor = valueToColor(this.values[valId]);
            edgeWidth = valueToEdgeWidth(this.values[valId]);
        }

        var options = {
            instance: this.instance,
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ],
            radius: edgeWidth
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);
        this.instance.material.emissiveColor = edgeColor;
    };

    this.createInstance = function (val) {
        let edgeColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        let edgeWidth = 0.1;

        if (val === undefined) {
            this.values['value'] = Number.NaN;
        } else {
            this.values['value'] = val;
            edgeColor = valueToColor(val);
            edgeWidth = valueToEdgeWidth(val);
        }

        var options = {
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ],
            radius: edgeWidth,
            updatable: true
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);

        var mat = new BABYLON.StandardMaterial("mat", sgv.scene);
        mat.diffuseColor = edgeColor;
        mat.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        mat.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);

        this.instance.material = mat;
    };

    this.createInstance(val);
});


class Edge1 {
    constructor(graf, b, e, val) {
        this.parentGraph = graf;
        this.values = {};

        this.begin = b;
        this.end = e;

        this._checked = false;

        this.createInstance(val);
    }

    update() {
        var options = {
            instance: this.instance,
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ]
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);
    }

    switchCheckFlag() {
        this._checked = !this._checked;

        this.parentGraph.checkNode(this.begin, this._checked);
        this.parentGraph.checkNode(this.end, this._checked);

        this.instance.material = this._checked ? sgv.grayMat1 : sgv.grayMat0;
    }

    getValue(valId) {
        if (valId === undefined) {
            valId = 'value';
        }

        return this.values[valId];
    }

    setValue(val, valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        this.values[valId] = val;

        this.displayValue(valId);
    }

    displayValue(valId) {
        if (valId === undefined) {
            valId = 'value';
        }

        let edgeColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        let edgeWidth = 0.1;
        if (valId in this.values) {
            edgeColor = valueToColor(this.values[valId]);
            edgeWidth = valueToEdgeWidth(this.values[valId]);
        }

        var options = {
            instance: this.instance,
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ],
            radius: edgeWidth
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);
        this.instance.material.emissiveColor = edgeColor;
    }

    createInstance(val) {
        let edgeColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        let edgeWidth = 0.1;

        if (val === undefined) {
            this.values['value'] = Number.NaN;
        } else {
            this.values['value'] = val;
            edgeColor = valueToColor(val);
            edgeWidth = valueToEdgeWidth(val);
        }

        var options = {
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ],
            radius: edgeWidth,
            updatable: true
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, sgv.scene);

        var mat = new BABYLON.StandardMaterial("mat", sgv.scene);
        mat.diffuseColor = edgeColor;
        mat.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        mat.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);

        this.instance.material = mat;
    }

}
;
