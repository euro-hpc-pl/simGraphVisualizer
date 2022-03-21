"use strict";
/* global BABYLON, greenMat, redMat, grayMat0, grayMat1, advancedTexture, sgv */
const drawLabels = true;//false;

const createLabel = (id, position, scene) => {
    return new Label("q" + id, "q" + id, position, scene);
};


class Node {
    constructor(id, x, y, z, val) {
        var name = "node:" + id;

        this.id = id;
        this.active = true;
        this._chckedEdges = 0;
        
        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, {diameter: 3, segments: 8, updatable: true}, sgv.scene);
        //this.mesh = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, scene);
        //this.mesh = BABYLON.MeshBuilder.CreateDisc(name, {radius: 16, tessellation: 3}, scene);
        //this.mesh = BABYLON.MeshBuilder.CreatePlane(name, {width:3, height:3}, scene);
        //this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        
        this.mesh.position = new BABYLON.Vector3( x, y, z );

        this.values = {};

        this.setValue(getRandom(-0.99, 0.99), 'losowe');
        this.setValue(val);


        //this.label = new Label("q" + this.id, "q" + this.id, this.mesh.position, scene);
        this.label = createLabel(this.id, this.mesh.position, sgv.scene);
    }

    set position(pos) {
        this.mesh.position = pos;
        //this.label.plane.position.copyFrom( pos ).addInPlaceFromFloats(0.0, 5.0, 0.0);
    }

    get position() {
        return this.mesh.position;
    }

    clear() {
        this.mesh.dispose();
        delete this.mesh;
        this.label.plane.dispose();
        delete this.label.plane;
        delete this.label;
    }

    showLabel(b) {
        this.label.setEnabled(b);
    }

    move(diff) {
        this.mesh.position.addInPlace(diff);
        //this.updateLabel();
    }

    addCheck() {
        this._chckedEdges++;
        this.mesh.material = sgv.grayMat1;
    }

    delCheck() {
        this._chckedEdges--;
        if (this._chckedEdges === 0)
            this.mesh.material = sgv.grayMat0;
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

        var mat = new BABYLON.StandardMaterial("mat", sgv.scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveColor = valueToColor(val);

        this.mesh.material = mat;
    }
    
    displayValue(valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        
        if (valId in this.values) {
//            var mat = new BABYLON.StandardMaterial("mat", scene);
//            mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            mat.emissiveColor = valueToColor(this.values[valId]);

            this.mesh.material.emissiveColor = valueToColor(this.values[valId]);
        }
    }
}

