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
/* global BABYLON, greenMat, redMat, grayMat0, grayMat1, advancedTexture, sgv */

const createLabel = function(id, position, scene) {
    return new Label("q" + id, "q" + id, position, scene);
};

var Node = /** @class */ (function(id, x, y, z, val) {
        var name = "node:" + id;

        this.id = id;
        this.active = true;
        this._chckedEdges = 0;
        
        var mesh = BABYLON.MeshBuilder.CreateSphere(name, {diameter: 3, segments: 8, updatable: true}, sgv.scene);
        //this.mesh = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, scene);
        //this.mesh = BABYLON.MeshBuilder.CreateDisc(name, {radius: 16, tessellation: 3}, scene);
        //this.mesh = BABYLON.MeshBuilder.CreatePlane(name, {width:3, height:3}, scene);
        //this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        
        mesh.position = new BABYLON.Vector3( x, y, z );

        this.values = {};



        //this.label = new Label("q" + this.id, "q" + this.id, this.mesh.position, scene);
        this.label = createLabel(this.id, mesh.position, sgv.scene);

    Object.defineProperty(this, 'position', {
        get() {
            return mesh.position;
        },
        set(pos) {
            mesh.position = pos;
            //this.label.plane.position.copyFrom( pos ).addInPlaceFromFloats(0.0, 5.0, 0.0);
        }

    });

    this.clear = function() {
        mesh.dispose();
        delete this.mesh;
        this.label.plane.dispose();
        delete this.label.plane;
        delete this.label;
    };

    this.showLabel = function(b) {
        this.label.setEnabled(b);
    };

    this.move = function(diff) {
        mesh.position.addInPlace(diff);
        //this.updateLabel();
    };

    this.addCheck = function() {
        this._chckedEdges++;
        mesh.material = sgv.grayMat1;
    };

    this.delCheck = function() {
        this._chckedEdges--;
        if (this._chckedEdges === 0)
            mesh.material = sgv.grayMat0;
    };

    this.getValue = function(valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        
        return this.values[valId];
    };
    
    this.setValue = function(val, valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        this.values[valId] = val;

        var mat = new BABYLON.StandardMaterial("mat", sgv.scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveColor = valueToColor(val);

        mesh.material = mat;
    };
    
    this.displayValue = function(valId) {
        if (valId === undefined) {
            valId = 'value';
        }
        
        if (valId in this.values) {
//            var mat = new BABYLON.StandardMaterial("mat", scene);
//            mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
//            mat.emissiveColor = valueToColor(this.values[valId]);

            mesh.material.emissiveColor = valueToColor(this.values[valId]);
        }
    };

        this.setValue(getRandom(-0.99, 0.99), 'losowe');
        this.setValue(val);

});

