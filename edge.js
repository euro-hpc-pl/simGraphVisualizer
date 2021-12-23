"use strict";
/* global BABYLON, greenMat, redMat, grayMat0, grayMat1 */

class Edge {
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
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, this.parentGraph.scene);
    }

    switchCheckFlag() {
        this._checked = !this._checked;

        this.parentGraph.checkNode(this.begin, this._checked);
        this.parentGraph.checkNode(this.end, this._checked);

        this.instance.material = this._checked ? grayMat1 : grayMat0;
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
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, this.parentGraph.scene);
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
                this.parentGraph.nodePosition( this.begin ),
                this.parentGraph.nodePosition( this.end )
            ],
            radius: edgeWidth,
            updatable: true
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, this.parentGraph.scene);

        var mat = new BABYLON.StandardMaterial("mat", this.parentGraph.scene);
        mat.diffuseColor = edgeColor;
        mat.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        mat.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        
        this.instance.material = mat;        
    }

    
};
