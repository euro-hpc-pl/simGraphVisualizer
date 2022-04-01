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

var Node = /** @class */ (function(graf, id, x, y, z, val) {
        var name = "node:" + id;

        this.parentGraph = graf;
        this.id = id;
        this.active = true;
        this._chckedEdges = 0;
        
        var mesh = BABYLON.MeshBuilder.CreateSphere(name, {diameter: 3, segments: 8, updatable: true}, sgv.scene);
        //this.mesh = BABYLON.MeshBuilder.CreateBox(name, {size: 3}, scene);
        //this.mesh = BABYLON.MeshBuilder.CreateDisc(name, {radius: 16, tessellation: 3}, scene);
        //this.mesh = BABYLON.MeshBuilder.CreatePlane(name, {width:3, height:3}, scene);
        //this.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        
        mesh.material = new BABYLON.StandardMaterial("mat", sgv.scene);
        mesh.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mesh.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mesh.material.emissiveColor = new BABYLON.Color4(0.2, 0.2, 0.2);
        
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

    this.dispose = function() {
        mesh.dispose();
        delete mesh;
        this.label.plane.dispose();
        delete this.label.plane;
        delete this.label;
    };

    this.clear = function() {
        this.dispose();
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

    this.getValue = function(scope) {
        if (scope === undefined) {
            scope = this.parentGraph.currentScope;
        }
        
        if (this.values.hasOwnProperty(scope)){
            return this.values[scope];
        } else {
            return null;
        }
    };

    this.delValue = function(scope) {
        if (scope === undefined) {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            delete this.values[scope];
        }
    };
    
    this.setValue = function(val, scope) {
        if (scope === undefined) {
            scope = this.parentGraph.currentScope;
        }
        this.values[scope] = val;
    };
    
    this.displayValue = function(scope) {
        if (scope === undefined) {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            //mesh.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            mesh.material.emissiveColor = valueToColor(this.values[scope]);
        } else {
            //mesh.material.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
            mesh.material.emissiveColor = new BABYLON.Color4(0.2, 0.2, 0.2);
        }
    };

    this.setValue(val);
    this.setValue(getRandom(-0.99, 0.99), 'losowe');

    this.displayValue();
});

