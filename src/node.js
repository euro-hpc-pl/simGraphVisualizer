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

const createLabel = function(id, position, scene, enabled) {
    return new Label("q" + id, "q" + id, position, scene, enabled);
};

var Node = /** @class */ (function(graf, id, x, y, z, _values) {
    var name = "node:" + id;

    this.parentGraph = graf;
    this.id = id;
    this.active = true;
    this._chckedEdges = 0;

    this.labelIsVisible = false;

    var mesh = sgv.defaultSphere.clone(id);
    mesh.material = sgv.defaultSphere.material.clone();
    mesh.position = new BABYLON.Vector3( x, y, z );
    mesh.name = name;
    mesh.setEnabled(true);

    this.values = {
        'default' : null
    };

    for (const key in _values) {
        this.values[key] = _values[key];
    }

    var label = createLabel(this.id, mesh.position, sgv.scene, this.labelIsVisible);

    Object.defineProperty(this, 'position', {
        get() {
            return mesh.position;
        },
        set(pos) {
            mesh.position.copyFrom(pos);
            if (typeof label !== 'undefined') {
                label.plane.position.copyFrom(pos).addInPlaceFromFloats(0.0, 5.0, 0.0);
            }
        }

    });

    this.dispose = function() {
        mesh.dispose();
        delete mesh;
        if (label.plane!==null) {
            label.plane.dispose();
//            delete this.label.plane;
        }
        delete this.label;
    };

    this.clear = function() {
        this.dispose();
    };

    this.showLabel = function(b) {
        if (typeof b!== 'undefined') {
            this.labelIsVisible = b;
        }
        
        label.setEnabled(this.labelIsVisible && this.parentGraph.labelsVisible);
    };

    this.setLabel = function( t, b ) {
        if (typeof b!== 'undefined') {
            this.labelIsVisible = b;
        }

        label.setText(t, this.labelIsVisible && this.parentGraph.labelsVisible);
    };

    this.isLabelVisible = function() {
        return this.labelIsVisible;
    };

    this.getLabel = function() {
        return label.getText();
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
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (this.values.hasOwnProperty(scope)){
            return this.values[scope];
        } else {
            return Number.NaN;
        }
    };

    this.exportGEXF = function() {
        let xml = "      <node id=\""+this.id+"\">\n";
        xml += "        <attvalues>\n";
        for (const key in this.values) {
            xml += "          <attvalue for=\""+this.parentGraph.getScopeIndex(key)+"\" value=\""+this.values[key]+"\"/>\n";
        }
        xml += "        </attvalues>\n";
        xml += "      </node>\n";
        return xml;
    };

    this.delValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            delete this.values[scope];
        }
    };
    
    this.setValue = function(val, scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        this.values[scope] = val;
    };
    
    this.displayValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            mesh.material.emissiveColor = valueToColor( this.values[scope] );
        } else {
            mesh.material.emissiveColor = new BABYLON.Color4(0.2, 0.2, 0.2);
        }
    };

    this.displayValue();
});

