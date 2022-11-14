/* global sgv, BABYLON, Edge */

var SPS = (function(scene) {
    var NodeSPS = new BABYLON.SolidParticleSystem("NodeSPS", scene, { isPickable: true, expandable: true, enableDepthSort: true });
    var EdgeSPS = new BABYLON.SolidParticleSystem("EdgeSPS", scene, { isPickable: true, expandable: true, enableDepthSort: true });

    var NodeSPSmesh = null;
    var EdgeSPSmesh = null;
    
    var eCnt = 0;
    var nCnt = 0;
    
    var nKilled = [];
    var eKilled = [];
    
    var defaultSphere = BABYLON.MeshBuilder.CreateSphere("defaultSphere", {diameter: 3, segments: 8, updatable: false});
    var defaultCylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:1, diameter:1, tessellation:6, updatable: false});
    
    defaultSphere.setEnabled(false);
    defaultCylinder.setEnabled(false);
    
    function initX() {
        NodeSPS.addShape(defaultSphere, 100);
        EdgeSPS.addShape(defaultCylinder, 100);

        NodeSPSmesh = NodeSPS.buildMesh();
        EdgeSPSmesh = EdgeSPS.buildMesh();

        for (let i=0; i<100; i++){
            NodeSPS.particles[i].isVisible = false;
            EdgeSPS.particles[i].isVisible = false;
        }

        refreshX();
    };

    function refreshX() {
        NodeSPS.setParticles();
        NodeSPS.refreshVisibleSize();

        EdgeSPS.setParticles();
        EdgeSPS.refreshVisibleSize();
    };
    
    function _uniqueNodeId() {
//        if (nKilled.length>0) {
//            return nKilled.pop();
//        }

        let id = nCnt++;
        let size = NodeSPS.nbParticles;
        if (id>=size) {
            NodeSPS.addShape(defaultSphere, 100);
            NodeSPSmesh = NodeSPS.buildMesh();

            for (let i=size; i<(size+100); i++){
                NodeSPS.particles[i].isVisible = false;
            }
        }
        return id;
    };
    
    function _uniqueEdgeId() {
//        if (eKilled.length>0) {
//            return eKilled.pop();
//        }

        let id = eCnt++;
        let size = EdgeSPS.nbParticles;
        if (id>=size) {
            EdgeSPS.addShape(defaultCylinder, 100);
            EdgeSPSmesh = EdgeSPS.buildMesh();

            for (let i=size; i<(size+100); i++){
                EdgeSPS.particles[i].isVisible = false;
            }
        }
        return id;
    };

    function bindNodeX(node, position, color) {
        let id = _uniqueNodeId();
        let m = NodeSPS.particles[id];

        if (typeof m !== 'undefined') {
            m.position = position;
            m.color = color;
            m.isVisible = true;
            
            m.nodeId = node.id;

            return m;
        }
        
        return null;
    }

    function updateNodeValueX(node, nodeColor) {
        let idx = node.meshId();
        let mesh = NodeSPS.particles[idx];
        
        mesh.color = nodeColor;
        mesh.isVisible = true;
    }

    function unbindNodeX(node) {
        let idx = node.meshId();
        //console.log(node);
        //console.log(NodeSPS.particles[idx]);
        NodeSPS.particles[idx].isVisible = false;
        NodeSPS.particles[idx].nodeId = null;
        
        nKilled.push(idx);
    }

    function setEdgeX(edge, edgeColor, edgeWidth, b, e) {
        let idx = edge.meshId();
        let mesh = EdgeSPS.particles[idx];
        
        let length = BABYLON.Vector3.Distance(b, e);

        let vec = e.subtract(b);
        vec.normalize();
        let p0 = new BABYLON.Vector3;
        p0.copyFrom(b);
        p0.addInPlace(vec.scale(length/2));

        mesh.rotation = PitchYawRollToMoveBetweenPoints(b, e);
        mesh.position = p0;
        mesh.color = edgeColor;
        mesh.scaling = new BABYLON.Vector3( edgeWidth, length, edgeWidth );
        mesh.isVisible = true;
    }

    function updateEdgeGeometryX(edge, b, e) {
        let idx = edge.meshId();
        let mesh = EdgeSPS.particles[idx];
        
        let length = BABYLON.Vector3.Distance(b, e);

        let vec = e.subtract(b);
        vec.normalize();
        let p0 = new BABYLON.Vector3;
        p0.copyFrom(b);
        p0.addInPlace(vec.scale(length/2));

        mesh.rotation = PitchYawRollToMoveBetweenPoints(b, e);
        mesh.position = p0;
        mesh.isVisible = true;
    }

    function updateEdgeValueX(edge, edgeColor, edgeWidth) {
        let idx = edge.meshId();
        let mesh = EdgeSPS.particles[idx];
        
        mesh.color = edgeColor;
        mesh.scaling.x = edgeWidth;
        mesh.scaling.z = edgeWidth;
        mesh.isVisible = true;
    }
    
    function bindEdgeX(edge) {
        let id = _uniqueEdgeId();
        let m = EdgeSPS.particles[id];

        if (typeof m !== 'undefined') {
            m.edgeId = edge.id;
            return m;
        }
        
        return null;
    }
    
    function unbindEdgeX(edge) {
        let idx = edge.meshId();
        //console.log(edge);
        //console.log(EdgeSPS.particles[idx]);
        EdgeSPS.particles[idx].isVisible = false;
        EdgeSPS.particles[idx].edgeId = null;
        
        eKilled.push(idx);
    }
    
    function onPickX(pickInfo) {
        let name = pickInfo.pickedMesh.name;

        if (name === NodeSPS.name){
            let nodeId = NodeSPS.particles[NodeSPS.pickedParticle(pickInfo).idx].nodeId;
            return { type: 'node', id: nodeId };
        }
        else if (name === EdgeSPS.name){
            let edgeId = EdgeSPS.particles[EdgeSPS.pickedParticle(pickInfo).idx].edgeId;
            return { type: 'edge', id: edgeId };
        }
        
        return { type: 'unknown', id: -1 };
    }
    
    function resetX() {
        nCnt = 0;
        eCnt = 0;
    }
    
    return {
        init: initX,
        reset: resetX,
        onPick: onPickX,
        refresh: refreshX,
        bindNode: bindNodeX,
        updateNodeValue: updateNodeValueX,
        unbindNode: unbindNodeX,
        bindEdge: bindEdgeX,
        setEdge: setEdgeX,
        updateEdgeGeometry: updateEdgeGeometryX,
        updateEdgeValue: updateEdgeValueX,
        unbindEdge: unbindEdgeX
    };
});

/* global BABYLON, sgv */


function valueToColorBAK(val) {
    if ((typeof val ==='undefined')||(val === null)|| isNaN(val)) {
        return new BABYLON.Color3(0.9, 0.9, 0.9);
    };

    let max = sgv.graf.greenLimit;
    let min = sgv.graf.redLimit;

    if (val > 0) {
        var r = 0;
        var g = (val < max) ? (val / max) : 1.0;
        var b = 1.0 - g;
    } else if (val < 0) {
        var r = (val > min) ? (val / min) : 1.0;
        var g = 0;
        var b = 1.0 - r;
    } else {
        var r = 0;
        var g = 0;
        var b = 1.0;
    }

    return new BABYLON.Color3(r, g, b);
}


function valueToColor(val) {
    if ((typeof val ==='undefined')||(val === null)|| isNaN(val)) {
        return new BABYLON.Color3(0.9, 0.9, 0.9);
    };

    let max = sgv.graf.greenLimit;
    let min = sgv.graf.redLimit;

    if (val > 0) {
        var r = 0;
        var g = (val < max) ? (val / max) : 1.0;
        var b = 0;
    } else if (val < 0) {
        var r = (val > min) ? (val / min) : 1.0;
        var g = 0;
        var b = 0;
    } else {
        var r = 0;
        var g = 0;
        var b = 0;
    }

    return new BABYLON.Color3(r, g, b);
}


function valueToEdgeWidth(val) {
    if ((typeof val ==='undefined')||(val === null)|| isNaN(val)) {
        return 0.2;
    };

    let max = Math.abs(sgv.graf.greenLimit);
    let min = Math.abs(sgv.graf.redLimit);

    max = (max>min)?max:min;
    
    val = Math.abs(val);
    
    if (val>max){
        return 1.2;
    }
    
    return 0.2 + ( val / max );
}

var Def2 = /*class*/( (_n1, _n2) => {
    this.n1 = _n1;
    this.n2 = _n2;
    this.values = {
            'default': Number.NaN
        };
    this.label = {
            text: null,
            enabled: false
        };    
});


function PitchYawRollToMoveBetweenPointsToRef(start, target, ref) {
    const diff = BABYLON.TmpVectors.Vector3[0];
    target.subtractToRef(start, diff);
    ref.y = Math.atan2(diff.x, diff.z) || 0;
    ref.x = Math.atan2(Math.sqrt(diff.x ** 2 + diff.z ** 2), diff.y) || 0;
    ref.z = 0;
    return ref;
}

function PitchYawRollToMoveBetweenPoints(start, target) {
    const ref = BABYLON.Vector3.Zero();
    return PitchYawRollToMoveBetweenPointsToRef(start, target, ref);
}


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

/* global BABYLON, sgv */

/**
 * Class Label
 * @param {Number|String} labelId is usually Node.id
 * @param {String} txt text to be displayed
 * @param {BABYLON.Vector3} position position over which the label is to be displayed
 * @returns {Label}
 */
var Label = (function (labelId, txt, position, enabled) {
    this.setText = async function(txt, enabled) {
        this.text = txt;
        
        if (this.plane!==null)
            this.plane.dispose();
        
        this.plane = this.createPlane();
        this.plane.position = this.position.add(new BABYLON.Vector3(0.0, 5.0, 0.0));
        this.plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        this.plane.setEnabled(enabled);
        this.plane.isPickable = false;
    };
    
    this.getText = function() {
        return this.text;
    };
    
    this.setPosition = function(pos) {
        this.position = pos;
        
        if (this.plane !==null)
            this.plane.position = pos.add(this.planeOffset);
    };

    this.createPlane = function() {
        let font_size = 64;
        let font = "bold " + font_size + "px Arial";

        let ratio = 0.075;

        let tmpTex = new BABYLON.DynamicTexture("DynamicTexture", 64, sgv.scene);
        let tmpCTX = tmpTex.getContext();

        tmpCTX.font = font;
        
        let DTWidth = tmpCTX.measureText(this.text).width + 8;
        let DTHeight = font_size + 8;

        var planeWidth = DTWidth * ratio;
        var planeHeight = DTHeight * ratio;

        var plane = BABYLON.MeshBuilder.CreatePlane(this.id + "_plane", {width: planeWidth, height: planeHeight, updatable: true}, sgv.scene);
        
        plane.material = new BABYLON.StandardMaterial(this.id + "_plane_material", sgv.scene);
        
        plane.material.diffuseTexture = new BABYLON.DynamicTexture(this.id + "_plane_texture", {width: DTWidth, height: DTHeight}, sgv.scene, false);

        plane.material.diffuseTexture.hasAlpha = true;
        plane.material.opacityTexture = plane.material.diffuseTexture;
        plane.material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
        plane.material.alpha = 1;
        
        plane.material.diffuseTexture.drawText(this.text, null, null, font, '#ffff00', 'rgba(0,0,255,0.7)', true);
        
        //plane.material.specularColor = new BABYLON.Color3(1, 1, 0);
        //plane.material.ambientColor = new BABYLON.Color3(1, 1, 0);
        plane.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        return plane;
    };

    /**
     * @param {type} txt
     * @param {type} position
     * @returns {undefined}
     */
    this.createMe = async function (position, enabled) {
        this.plane = this.createPlane();
        this.plane.position = position.add(this.planeOffset);
        this.plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        this.plane.setEnabled(enabled);
        this.plane.isPickable = false;
    };

    this.setEnabled = function (b) {
        if (this.plane!==null)
            this.plane.setEnabled(b);
    };

    this.text = txt;
    this.planeOffset = new BABYLON.Vector3(0.0, 5.0, 0.0);
    this.position = position;
    this.id = labelId;
    this.plane = null;
    this.createMe(position, enabled);
});


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

    this.values = {
        'default' : Number.NaN
    };

    for (const key in _values) {
        this.values[key] = _values[key];
    }

    Object.defineProperty(this, 'position', {
        get() {
            return this.mesh.position;
        },
        set(pos) {
            this.mesh.position.copyFrom(pos);
            if (typeof label !== 'undefined') {
                label.plane.position.copyFrom(pos);
            }
        }
    });

    this.dispose = function() {
        sgv.SPS.unbindNode(this);
        
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
        this.mesh.position.addInPlace(diff);
        //this.updateLabel();
    };

    this.addCheck = function() {
        this._chckedEdges++;
        //mesh.material = sgv.grayMat1;
    };

    this.delCheck = function() {
        this._chckedEdges--;
        //if (this._chckedEdges === 0)
        //    mesh.material = sgv.grayMat0;
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

        let color = valueToColor( (scope in this.values)?this.values[scope]:Number.NaN );
        
        sgv.SPS.updateNodeValue(this, color);
    };

    this.currentColor = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            return valueToColor( this.values[scope] );
        } else {
            return new BABYLON.Color4(0.2, 0.2, 0.2);
        }
    };

    this.meshId = ()=>this.mesh.idx;

    this.mesh = sgv.SPS.bindNode(this, new BABYLON.Vector3( x, y, z ), this.currentColor());
    
    if (this.mesh===null) {
        console.error("Can't bind NodeSPS");
    }
    else {
        var label = createLabel(this.id, this.mesh.position, sgv.scene, false);
    }

});



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

var Edge = /** @class */ (function (graf, b, e) {
    this.parentGraph = graf;

    this.values = {
        'default' : Number.NaN
    };

    if (b < e) {
        this.begin = b;
        this.end = e;
    } else {
        this.begin = e;
        this.end = b;
    }

    this.id = Edge.calcId(this.begin, this.end);

    this._checked = false;

    this.meshId = ()=>mesh.idx;
    
    this.clear = function() {
        sgv.SPS.unbindEdge(this);
    };

    this.switchCheckFlag = function () {
        this._checked = !this._checked;

        this.parentGraph.checkNode(this.begin, this._checked);
        this.parentGraph.checkNode(this.end, this._checked);

        //this.instance.material = this._checked ? sgv.grayMat1 : sgv.grayMat0;
    };

    this.delValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            delete this.values[scope];
        }
    };

    this.getValue = function (scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (this.values.hasOwnProperty(scope)){
            return this.values[scope];
        } else {
            return Number.NaN;
        }
    };

    this.setValue = function (val, valId) {
        if (typeof valId === 'undefined') {
            valId = 'default';
        }
        
        //console.log(valId, val);

        this.values[valId] = val;

        this.displayValue(valId);
    };

    this.displayValue = function (valId) {
        if (typeof valId === 'undefined') {
            valId = 'default';
        }

        let edgeColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        let edgeWidth = 0.1;
        if (valId in this.values) {
            edgeColor = valueToColor(this.values[valId]);
            edgeWidth = valueToEdgeWidth(this.values[valId]);
        }

        sgv.SPS.updateEdgeValue(this, edgeColor, edgeWidth);
    };

    this.update = ()=>{
        let val = this.values[this.parentGraph.currentScope];
        
        let edgeColor = valueToColor(val);
        let edgeWidth = valueToEdgeWidth(val);

        let b = this.parentGraph.nodePosition(this.begin);
        let e = this.parentGraph.nodePosition(this.end);

        sgv.SPS.setEdge(this, edgeColor, edgeWidth, b, e);
    };

    var mesh = sgv.SPS.bindEdge(this);
    if (mesh===null) {
        console.error("Can't bind EdgeSPS");
    }
    else {
        this.update();
    }

});

//static
Edge.calcId = (b, e) => (b < e)?("" + b + "," + e):("" + e + "," + b);


/* 
 * Copyright 2022 darek.
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
/* global BABYLON, labelsVisible, sgv, Edge */

//const txtFile = require("io_TXT.js");

var Graph = /** @class */ (function () {
    this.nodes = {};
    this.edges = {};
    this.missing = {};
    this.type = 'generic';
    this.scopeOfValues = ['default'];
    this.currentScope = 'default';
    this.greenLimit = 1.0;
    this.redLimit = -1.0;

    //this.labelsVisible = false;
    this.labelsVisible = false;

    this.dispose = function () {
        for (const key in this.edges) {
            this.edges[key].clear();
            delete this.edges[key];
        }
        for (const key in this.nodes) {
            this.nodes[key].clear();
            delete this.nodes[key];
        }
        
        sgv.SPS.reset();
        sgv.SPS.refresh();

//        for (const key in this.missing) {
//
//        }
    };

    this.clear = function () {
        this.dispose();
    };

    this.maxNodeId = function () {
        return Object.keys(this.nodes).length;
    };

    this.addNode = function(nodeId, pos, val) {
        values = {};
        
        if (typeof val==='number') {
            values['default'] = val;
        }
        
        let n = new Node(this, nodeId, pos.x, pos.y, pos.z, values);
        this.nodes[n.id] = n;
        return n;
    };

    this.getKeyByValue = function(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    };

    this.getScopeIndex = function(scope) {
        return Object.keys(this.scopeOfValues).find(key => this.scopeOfValues[key] === scope);
    };
    
    this.addEdge = function (node1, node2) {
        let id = Edge.calcId(node1, node2);
        if (id in this.edges) {
            console.log("edge already exists", id);
            return this.edges[id];
        }
        else {
            let e = new Edge(this, node1, node2);
            this.edges[id] = e;
            return e;
        }            
    };

    this.delEdge = function (edgeId) {
        this.edges[edgeId].clear();
        delete this.edges[edgeId];
        
        sgv.SPS.refresh();
    };

    this.findAndDeleteEdges = function (nodeId) {
        var removedEdges = {};

        console.log("graf.findAndDeleteEdges", nodeId);

        for (const key in this.edges) {
            if (this.edges[key].begin.toString() === nodeId) {
                removedEdges[ this.edges[key].end ] = {
                    values: this.edges[key].values
                };
                this.delEdge(key);
            } else if (this.edges[key].end.toString() === nodeId) {
                removedEdges[ this.edges[key].begin ] = {
                    values: this.edges[key].values
                };
                this.delEdge(key);
            }
        }

        return removedEdges;
    };

    this.delNode = function (nodeId) {
        var tmpEdges = this.findAndDeleteEdges(nodeId);

        this.missing[nodeId] = {
            label: {
                text: this.nodes[nodeId].getLabel(),
                enabled: this.nodes[nodeId].isLabelVisible()
            },
            values: this.nodes[nodeId].values,
            edges: {}
        };

        for (const key in tmpEdges) {
            this.missing[nodeId].edges[key] = tmpEdges[key];
        }
        
        //this.nodes[nodeId].mesh.dispose();
        this.nodes[nodeId].clear();
        delete this.nodes[nodeId];

        sgv.dlgMissingNodes.addNode(nodeId);
        
        sgv.SPS.refresh();
    };

    this.restoreNode = function (nodeId) {
        if (nodeId in this.nodes) return false;
        
        if (!(nodeId in this.missing)) return false;
        
        let pos = this.calcPosition(nodeId);
        
        this.nodes[nodeId] = new Node(this, nodeId, pos.x, pos.y, pos.z, this.missing[nodeId].values);
        this.nodes[nodeId].setLabel(this.missing[nodeId].label.text,this.missing[nodeId].label.enabled);
        
        for (const key in this.missing[nodeId].edges) {
            var nKey = parseInt(key, 10);
            if (nKey in this.nodes) {
                let e = new Edge(this, nodeId, key);

                for (const vKey in this.missing[nodeId].edges[nKey].values) {
                    e.setValue(this.missing[nodeId].edges[nKey].values[vKey],vKey);    
                }
                
                this.edges[e.id] = e;
            } 
            else if (nKey in this.missing) {
                this.missing[nKey].edges[nodeId] = this.missing[nodeId].edges[nKey];
            }
        }

        delete this.missing[nodeId];

        if (Object.keys(this.missing).length === 0)
            sgv.dlgMissingNodes.hide();
        
        sgv.SPS.refresh();
        
        return true;
    };


    this.findAndUpdateEdges = function (nodeId) {
        for (const key in this.edges) {
            if ((this.edges[key].begin.toString() === nodeId) || (this.edges[key].end.toString() === nodeId)) {
                this.edges[key].update();
            }
        }
    };

    this.stringToStruct = (string) => {
       if ((typeof string==='undefined')||(string===null)) return null;
    
        var result = {
            nodes: {},
            edges: {}
        };

        var lines = string.split("\n");

        var parseData = function (string) {
            var line = string.split(" ");
            if (line.length === 3) {
                return {
                    n1: parseInt(line[0], 10),
                    n2: parseInt(line[1], 10),
                    val: parseFloat(line[2], 10)
                };
            } else {
                return null;
            }
        };

        while (lines.length > 0) {
            if (lines[0][0] !== '#')
            {
                var d = parseData(lines[0]);
                if (d !== null) {
                    if (d.n1===d.n2) {
                        result.nodes[d.n1] = d.val;
                    } else {
                        result.edges[Edge.calcId(d.n1, d.n2)] = d.val;
                    }
                }
            }
            lines.shift();
        }
        return result;
    };

    this.loadScopeValues = (scope, data) => {
        let isNew = false;
        if ( (typeof scope !== 'undefined') && ! this.scopeOfValues.includes(scope) ) {
            this.scopeOfValues.push(scope);
            isNew = true;
        }
        
        var struct = this.stringToStruct(data);
        
        for (const key in struct.nodes) {
            this.nodes[key].setValue(struct.nodes[key],scope);
        }

        for (const key in struct.edges) {
            this.edges[key].setValue(struct.edges[key],scope);
        }
        
        this.displayValues(scope);
        
        return {n:isNew, i:this.scopeOfValues.indexOf(scope)};
    };

    this.addScopeOfValues = function(scope) {
        if ( (typeof scope !== 'undefined') && ! this.scopeOfValues.includes(scope) ) {
            this.scopeOfValues.push(scope);
            return this.scopeOfValues.indexOf(scope);
        }
        return -1;
    };

    this.delScopeOfValues = function(scope) {
        if ( (typeof scope !== 'undefined') && (scope !== 'default') ) {

            let idx = this.scopeOfValues.indexOf(scope);
            if (idx!==-1) {
                
                this.scopeOfValues.splice(idx,1);
                
                for (const key in this.nodes) {
                    this.nodes[key].delValue(scope);
                }

                if (this.currentScope === scope) {
                    this.currentScope = 'default';
                    this.displayValues('default');
                }

                return this.scopeOfValues.indexOf(this.currentScope);
            }
        }
        return -1;
    };

    this.hasScope = function (scope) {
        return (typeof scope !== 'undefined') && this.scopeOfValues.includes(scope);
    };
    
    this.displayValues = async function (scope) {
        if ( (typeof scope === 'undefined') || ! this.scopeOfValues.includes(scope) ) {
            scope = this.currentScope;
        } else {
            this.currentScope = scope;
        }
        
        for (const key in this.nodes) {
            this.nodes[key].displayValue(scope);
        }
        for (const key in this.edges) {
            this.edges[key].displayValue(scope);
        }
        
        sgv.SPS.refresh();

        return true;
    };

//    updateNodeLabels(show) {
//        for (const key in nodes) {
//            nodes[key].updateLabel(show);
//        }
//    }

    this.nodePosition = function (nodeId) {
        return this.nodes[nodeId].position;
    };

    this.checkNode = function (nodeId, check) {
        if (check) {
            this.nodes[nodeId].addCheck();
        } else {
            this.nodes[nodeId].delCheck();
        }
    };

    this.edgeDoubleClicked = function (id) {
        this.edges[id].switchCheckFlag();
    };

    this.moveNode = function (nodeId, diff) {
        this.nodes[nodeId].move(diff);
        this.findAndUpdateEdges(nodeId);
    };

    this.setEdgeValue = function (edgeId, value, scope) {
        this.edges[edgeId].setValue(value, scope);
        this.edges[edgeId].displayValue();
    };

    this.delEdgeValue = function (edgeId, scope) {
        this.edges[edgeId].delValue(scope);
        this.edges[edgeId].displayValue();
    };

    this.edgeValue = function(edgeId, scope) {
        return this.edges[edgeId].getValue(scope);
    };

    this.setNodeValue = function (nodeId, value, scope) {
        this.nodes[nodeId].setValue(value, scope);
        this.nodes[nodeId].displayValue();
    };

    this.delNodeValue = function (nodeId, scope) {
        this.nodes[nodeId].delValue(scope);
        this.nodes[nodeId].displayValue();
    };

    this.nodeValue = function (nodeId,scope) {
        return this.nodes[nodeId].getValue(scope);
    };

    this.getMinMaxEdgeVal = function (scope) {
        if ( (typeof scope === 'undefined') || ! this.scopeOfValues.includes(scope) ) {
            scope = this.currentScope;
        }
        
        var result = {
            min: Number.MAX_VALUE,
            max: -Number.MAX_VALUE,
            com: ""
        };

        let nan = true;
        
        for (const key in this.edges) {
            let val = this.edges[key].getValue(scope);
            
            if (!isNaN(val)) {
                nan = false;

                if (val < result.min) {
                    result.min = val;
                }

                if (result.max < val) {
                    result.max = val;
                }
            }
        }

        if (nan){
            result.min = Number.NaN;
            result.max = Number.NaN;
            result.com = "\nWARNING: The graph has no edge that has a weight in the current scope.\n";
        }

        return result;
    };

    this.getMinMaxNodeVal = function (scope) {
        if ( (typeof scope === 'undefined') || ! this.scopeOfValues.includes(scope) ) {
            scope = this.currentScope;
        }
        
        var result = {
            min: Number.MAX_VALUE,
            max: -Number.MAX_VALUE,
            com: ""
        };

        let nan = true;

        for (const key in this.nodes) {
            let val = this.nodes[key].getValue(scope);
            
            if (!isNaN(val)) {
                nan = false;

                if (val < result.min) {
                    result.min = val;
                }

                if (result.max < val) {
                    result.max = val;
                }
            }
        }

        if (nan){
            result.min = Number.NaN;
            result.max = Number.NaN;
            result.com = "\nWARNING: The graph has no node that has a value in the current scope.\n";
        }

        return result;
    };

    this.getMinMaxVal = function (scope) {
        if ( (typeof scope === 'undefined') || ! this.scopeOfValues.includes(scope) ) {
            scope = this.currentScope;
        }

        let nMM = this.getMinMaxNodeVal(scope);
        let eMM = this.getMinMaxEdgeVal(scope);

        if (isNaN(nMM.min)) { // jeśli min jest NaN, to max również
            return {
                min: eMM.min,
                max: eMM.max
            };
        }
        else if (isNaN(eMM.min)) {
            return {
                min: nMM.min,
                max: nMM.max
            };
        }
        else {
            return {
                min: (nMM.min<eMM.min)?nMM.min:eMM.min,
                max: (nMM.max>eMM.max)?nMM.max:eMM.max
            };
        }
    };


    // Calculate position of node in space for visualisation.
    // The position depends on graph type and display mode,
    // so need to be overriden in derrived classes
    this.calcPosition = /*virtual*/ (nodeId) => new BABYLON.Vector3();


    this.changeDisplayMode = function () {
        for (const key in this.nodes) {
            let pos = this.calcPosition(key);
            this.nodes[key].position = pos;
        }

        for (const key in this.edges) {
            this.edges[key].update();
        }
        
        sgv.SPS.refresh();
    };
    
    this.showLabels = function (b) {
        this.labelsVisible = b;
        for (const key in this.nodes) {
            this.nodes[key].showLabel();
        }
    };
    
    
    this.createStructureFromDef2 = function (def) {
        for (let i = 0; i < def.length; i++) {
            if (def[i].n1 === def[i].n2) {
                let nodeId = def[i].n1;

                let n = this.addNode(nodeId, this.calcPosition(nodeId), 0.0);

                for (const key in def[i].values) {
                    n.setValue(def[i].values[key], key);
                }
            }
            else {
                let n1 = def[i].n1;
                let n2 = def[i].n2;
                
                let e = this.addEdge(n1, n2);
         
                for (const key in def[i].values) {
                    e.setValue(def[i].values[key], key);
                }
            }
        }

        this.showLabels(true);
        this.displayValues('default');
    };
});



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


/* global sgv */

var UI = (function () {
    
//    this.graphCreateBtn = UI.createTransparentBtn('CREATE','sgvGraphCreateBtn',()=>{
//        sgv.dlgCreateGraph.show();
//    });
//
//    this.graphCreateBtn = UI.createTransparentBtn('LOAD','sgvGraphLoadBtn',()=>{
//        sgv.dlgCreateGraph.showLoad();
//    });
    
//    this.panelSwitch = UI.createPanelSwitch();
//    this.panelSwitch.addEventListener('click', function () {
//        sgv.dlgCPL.switchPanel();
//    });

//    this.consoleSwitch = UI.createConsoleSwitch();
//    this.consoleSwitch.addEventListener('click', function () {
//        sgv.dlgConsole.switchConsole();
//    });
//    this.dispModeSwitch = UI.createDispModeSwitch();
//    this.dispModeSwitch.addEventListener('click', function () {
//        sgv.switchDisplayMode();
//    });
});

UI.tag = function(_tag, _attrs, _props ) {
    var o = document.createElement(_tag);

    for (const key in _attrs) {
        o.setAttribute(key, _attrs[key]);
    }
    
    for (const key in _props) {
        o[key] = _props[key];
    }
    
    return o;
};

UI.span = function(_text, _attrs) {
    return UI.tag("span", _attrs, {'textContent': _text} );
};

UI.selectByKey = function(_select, _key) {
    let i = UI.findOption(_select, _key.toString());
    if ( i>-1 ) {
        _select.selectedIndex = i;
        return true;
    }
    return false;
};

UI.clearSelect = function(_select,_deleteFirst) {
    const first = _deleteFirst?0:1;
    for(var i=first; i<_select.options.length; i++) {
        _select.removeChild(_select.options[i]);
        i--; // options have now less element, then decrease i
    }
};

UI.findOption = function(_select,_value) {
    for (var i= 0; i<_select.options.length; i++) {
        if (_select.options[i].value===_value) {
            return i;
        }
    }
    return -1;
};

UI.option = function(_value, _text, _selected) {
    var o = document.createElement("option");
    o.value = _value;
    o.text = _text;
    
    if (typeof _selected!=='undefined')
        o.selected = _selected?'selected':'';
    
    return o;
};

UI.input = function(_props) {
    var o = document.createElement("input");
    //o.setAttribute("type", _type);
    for (const key in _props) {
        //if (o.hasOwnProperty(key)) {
            o.setAttribute(key, _props[key]);
        //}
    }
    return o;
};

UI.newInput = function (_type, _value, _class, _id) {
    var o = document.createElement("input");
    o.setAttribute("type", _type);
    o.value = _value;
    if ((typeof _class !== 'undefined') && (_class !== "")) {
        o.setAttribute("class", _class);
    }
    if ((typeof _id !== 'undefined') && (_id !== "")) {
        o.setAttribute("id", _id);
    }
    return o;
};


UI.createTitlebar = function (title, closebuttonVisible) {
    var t = UI.tag( "div", { "class": "title" });
    
    if (closebuttonVisible) {
        t.appendChild(
                UI.tag( "input", {
                        "type": "button",
                        "value": "x",
                        "class": "hidebutton" } ) );
    }

    t.appendChild( UI.tag( "span", { "class": "titleText" }, {"textContent": title}) );

    return t;
};

UI.createEmptyWindow = function (_class, _id, _title, _closebuttonVisible ) {//, _createContentDIV, _hiddenInput) {
    var o = document.createElement("div");
    
    if ((typeof _class !== 'undefined') && (_class !== "")) {
        o.setAttribute("class", _class);
    }
    if ((typeof _id !== 'undefined') && (_id !== "")) {
        o.setAttribute("id", _id);
    }

    let t = UI.createTitlebar(_title, _closebuttonVisible);

    
    o.offset = {x:0,y:0};
    o.isDown = false;
    
    t.addEventListener('mouseover', function() {
        t.style.cursor='pointer';
        movable = true;
    });

    t.addEventListener('mouseout', function() {
        movable = false;
    });

    t.addEventListener('mousedown', function (e) {
        o.isDown = movable;
        o.offset = {
            x: o.offsetLeft - e.clientX,
            y: o.offsetTop - e.clientY
        };
    }, true);

    t.addEventListener('mouseup', function () {
        o.isDown = false;
    }, true);

    document.addEventListener('mousemove', function (event) {
        //event.preventDefault();
        if (o.isDown) {
            let mousePosition = {
                x: event.clientX,
                y: event.clientY
            };

            o.style.left = (mousePosition.x + o.offset.x) + 'px';
            o.style.top = (mousePosition.y + o.offset.y) + 'px';
        }
    }, true);
    
    o.appendChild(t);
    
    return o;
};


UI.createGraphs = function (id) {
    var o = UI.createEmptyWindow("sgvUIwindow", id, "graphs", false);

    o.innerHTML += '<div class="content"></div>';

    document.body.appendChild(o);
    return o;
};


//UI.createPanelSwitch = function () {
//    let btn = UI.newInput("button", "CPL", "sgvTransparentButton", "sgvPanelSwitch");
//    document.body.appendChild(btn);
//    return btn;
//};
//
//UI.createConsoleSwitch = function () {
//    let btn = UI.newInput("button", "CON", "sgvTransparentButton", "sgvConsoleSwitch");
//    document.body.appendChild(btn);
//    return btn;
//};
//
//UI.createDispModeSwitch = function () {
//    let btn = UI.tag( "input", {
//                'type':     "button",
//                'value':    "DIS",
//                'class':    "sgvTransparentButton",
//                'id':       "sgvDispModeSwitch"
//            });
//    document.body.appendChild(btn);
//    return btn;
//};

UI.createTransparentBtn = function (txt, id, onclick) {
    let btn = UI.tag( "input", {
                'type':     "button",
                'value':    txt,
                'class':    "sgvTransparentButton1",
                'id':       id
            });
    //document.body.appendChild(btn);

    if (typeof onclick === 'function'){
        btn.addEventListener('click', function () {
            onclick();
        });
    }

    return btn;
};

UI.createTransparentBtn1 = function (txt, id, onclick) {
    let btn = UI.tag( "button", {
                'class':    "sgvTransparentButton1",
                'id':       id
            });

    btn.appendChild(UI.tag('span',{},{
        'innerHTML' : txt
    }));
    
    if (typeof onclick === 'function'){
        btn.addEventListener('click', function () {
            onclick();
        });
    }

    return btn;
};


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

/* global global, BABYLON, URL, Chimera, Pegasus, UI, parserGEXF */
"use strict";

const DEFAULT_SCOPE = 'default';

var getRandom = function(min, max) {
    return (min + (Math.random() * (max - min)));
};

var sgv = (typeof exports === "undefined") ? (function sgv() {}) : (exports);
if (typeof global !== "undefined") {
    global.sgv = sgv;
}

sgv.version = "1.0.0";
sgv.engine = null;
sgv.scene = null;
sgv.camera = null;
sgv.graf = null;
sgv.displayMode = 'classic';

sgv.createScene = function () {
    sgv.scene = new BABYLON.Scene(sgv.engine);

    createCamera();
    createLights();

//====================================================================
// creating Solid Particle System for nodes/edges visualisation
//
    sgv.SPS = new SPS(sgv.scene);
    sgv.SPS.init();
//
//====================================================================
    
    sgv.nodeToConnect = 0;

    sgv.addEventsListeners();
    
    sgv.scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.7);


    function createCamera() {
        sgv.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), sgv.scene);
        
        //sgv.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        
        sgv.camera.setPosition(new BABYLON.Vector3(166, 150, 0));
        sgv.camera.attachControl(sgv.canvas, true);

        sgv.camera.inputs.attached.pointers.panningSensibility = 25;

        sgv.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
        sgv.camera.inertia = 0.5;
        
        //BABYLON.Camera.angularSensibilityX = 200;
        //BABYLON.Camera.angularSensibilityY = 200;
    };

    function createLights() {
        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), sgv.scene);
        //var light = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1), 1.8, 0.01, sgv.scene);
        //light.diffuse = new BABYLON.Color3(1, 1, 1);
        //light.specular = new BABYLON.Color3(1, 1, 1);

        light.intensity = 0.75;
        light.parent = sgv.camera;
        light.position = new BABYLON.Vector3(0, 0, 0);
        //light.radius = Math.PI;// / 2);
    };
};


sgv.switchDisplayMode = function () {
    if (sgv.displayMode === 'classic') {
        sgv.displayMode = 'triangle';
    } else if (sgv.displayMode === 'triangle') {
        sgv.displayMode = 'diamond';
    } else {
        sgv.displayMode = 'classic';
    }

    if (sgv.graf !== null) {
        sgv.graf.changeDisplayMode();
    }
};


sgv.addEventsListeners = function () {
    var startingPoint;
    var currentMesh;
    var ground = null;//BABYLON.MeshBuilder.CreateGround("ground", {width:10*graf.N+20, height:10*graf.N+20}, scene, false);
    //ground.material = groundMaterial;

    function getGroundPosition()
    {
        var pickinfo = sgv.scene.pick(sgv.scene.pointerX, sgv.scene.pointerY, function (mesh) {
            return mesh === ground;
        });
        //var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh != null; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    };

    function pointerDblTap(mesh) {
        var n2 = mesh.name.split(":");
        if (n2[0] === "edge")
        {
            sgv.graf.edgeDoubleClicked(n2[1]);
        }
    };

    function pointerDown(event) {
        console.log("POINTER.DOWN");
        currentMesh = event.pickInfo.pickedMesh;

        startingPoint = getGroundPosition();
        if (startingPoint)
        { // we need to disconnect camera from canvas
            setTimeout(function () {
                sgv.camera.detachControl(sgv.canvas);
            }, 0);
        }
    };

    function onPointerUp() {
        if (sgv.graf !== null) {
            sgv.graf.showLabels(true);
        }
        if (startingPoint) {
            sgv.camera.attachControl(sgv.canvas, true);
            startingPoint = null;

            return;
        }
    };

    function onPointerMove() {
        if (sgv.graf === null)
            return;

        //graf.updateNodeLabels();

        if (!startingPoint) {
            return;
        }
        var current = getGroundPosition();
        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);

        var n2 = currentMesh.name.split(":");
        if (n2[0] === "node")
        {
            sgv.graf.moveNode(parseInt(n2[1], 10), diff);

            startingPoint = current;
        }
    };


    function onPointerTap(pointerInfo) {
        function onLMBtap(pointerInfo) {
            function onMeshPicked(pickInfo) {
                let picked = sgv.SPS.onPick(pickInfo);
                if ( (picked.type==='node') && ( picked.id in sgv.graf.nodes ) ) {
                    console.log('Node picked');
                    if (sgv.nodeToConnect !== 0) {
                        sgv.graf.addEdge(sgv.nodeToConnect, picked.id);
                        sgv.nodeToConnect = 0;
                        sgv.SPS.refresh();
                    }
                    else {
                        sgv.dlgNodeProperties.show(picked.id, sgv.scene.pointerX, sgv.scene.pointerY);
                    }
                }
                else if ( (picked.type==='edge') && (picked.id in sgv.graf.edges ) ) {
                    console.log('Edge picked');
                    sgv.dlgEdgeProperties.show(picked.id, sgv.scene.pointerX, sgv.scene.pointerY);
                }
                else {
                    console.log('Unknown mesh picked');
                    sgv.dlgEdgeProperties.hide();
                    sgv.dlgNodeProperties.hide();
                }
            };

            console.log("LEFT");
            if (pointerInfo.pickInfo.hit) {
                onMeshPicked(pointerInfo.pickInfo);
            } else {
                console.log('Probably ground picked');
                sgv.dlgEdgeProperties.hide();
                sgv.dlgNodeProperties.hide();
            }
            
        }

        function onMMBtap(pointerInfo) {
            console.log("MIDDLE");
            if (pointerInfo.pickInfo.hit) {
                let picked = sgv.SPS.onPick(pointerInfo.pickInfo);
                if ( (picked.type==='node') && ( picked.id in sgv.graf.nodes ) ) {
                    console.log('Node picked');
                 
                    if (sgv.nodeToConnect === 0) {
                        sgv.nodeToConnect = picked.id;
                    } else {
                        sgv.graf.addEdge(sgv.nodeToConnect, picked.id);
                        sgv.nodeToConnect = 0;
                        sgv.SPS.refresh();
                    }
                    
                }
            }
        }

        function onRMBtap(pointerInfo) {
            console.log("RIGHT");
        }

        switch (pointerInfo.event.button) {
            case 0:
                onLMBtap(pointerInfo);
                break;
            case 1:
                onMMBtap(pointerInfo);
                break;
            case 2:
                onRMBtap(pointerInfo);
                break;
        }
    };

    sgv.scene.onPointerObservable.add(function (pointerInfo) {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERTAP:
                onPointerTap(pointerInfo);
                break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh !== ground) {
                    pointerDblTap(pointerInfo.pickInfo.pickedMesh);
                }
                break;
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh !== ground) {
                    pointerDown(pointerInfo);
                }

                if (sgv.graf !== null) {
                    sgv.graf.showLabels(false);
                }

                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                onPointerUp();
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                onPointerMove();
                break;
        }
    });
};


sgv.display = function(args) {
    if ((typeof args === 'undefined') || (typeof args !== 'object')) {
        args = {};
    }

    showSplashAndRun(()=>{
        let targetDIV = null;
        if ('target' in args) {
            targetDIV = document.getElementById(args.target);
        }

        // no args.target or HTML element not exists
        if (targetDIV === null) {
            targetDIV = document.createElement("div");
            targetDIV.setAttribute("id", "sgvWorkspaceArea");
            document.body.appendChild(targetDIV);
        }

        // add canvas to targeDIV
        sgv.canvas = document.createElement("canvas");
        sgv.canvas.setAttribute("id", "sgvRenderCanvas");
        targetDIV.appendChild(sgv.canvas);

        function createDefaultEngine() {
            return new BABYLON.Engine(sgv.canvas, true, {doNotHandleContextLost: true, preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false});
        }

        window.initFunction = async function () {
            var asyncEngineCreation = async function () {
                try {
                    return createDefaultEngine();
                } catch (e) {
                    console.log("the available createEngine function failed. Creating the default engine instead");
                    return createDefaultEngine();
                }
            };

            sgv.engine = await asyncEngineCreation();

            if (!sgv.engine)
                throw 'engine should not be null.';

            sgv.engine.enableOfflineSupport = false;

            sgv.createScene();
        };

        initFunction().then( function() {
            let sceneToRender = sgv.scene;
            sgv.engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                }
            });
        });

        // Resize
        window.addEventListener("resize",
            function () {
                sgv.engine.resize();
            });

        desktopInit();
    });
};

//=========================================
// functions overriden in desktop scripts

desktopInit = ()=>{};
enableMenu = (id, enabled)=>{};

//=========================================


/* global sgv, NaN */

"use strict";

var ParserTXT = {};

ParserTXT.importGraph = (string) => {
    var res = [];
    var lines = string.split("\n");

    var gDesc = {};
    
    var parseComment = function (string) {
        var command = string.split("=");
        if (command[0] === 'type') {
            gDesc.type = command[1];
        } else if (command[0] === 'size') {
            var size = command[1].split(",");
            if (size.length >= 5) {
                gDesc.size = {
                    cols: parseInt(size[0], 10),
                    rows: parseInt(size[1], 10),
                    lays: parseInt(size[2], 10),
                    KL: parseInt(size[3], 10),
                    KR: parseInt(size[4], 10)
                };
            } else if (size.length === 4) {
                gDesc.size = {
                    cols: parseInt(size[0], 10),
                    rows: parseInt(size[1], 10),
                    lays: 1,
                    KL: parseInt(size[2], 10),
                    KR: parseInt(size[3], 10)
                };
            }
        }
    };

    var parseData = function (string) {
        var line = string.trim().split(/\s+/);
        if (line.length < 3) return null;
        
        let _n1 = parseInt(line[0], 10);
        let _n2 = parseInt(line[1], 10);
        let _val = parseFloat(line[2], 10);

        if (isNaN(_n1)||isNaN(_n2)) return null;    
        else return { n1: _n1, n2: _n2, val: _val };
    };

    while (lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            let d = parseData(lines[0]);
            if (d !== null) res.push(d);
        } else {
            let line = lines[0].trim().split(/\s+/);
            if (line.length > 1) parseComment(line[1]);
        }
        lines.shift();
    }

    if (typeof gDesc.type==='undefined') {
        sgv.dlgCreateGraph.show('load', res);
    } else {
        sgv.createGraph( gDesc, res );
    }
};

ParserTXT.exportGraph = (graph) => {
    if ((typeof graph==='undefined')||(graph === null)) return null;

    var string = "# type=" + graph.type + "\n";
    string += "# size=" + graph.cols + "," + graph.rows + "," + graph.layers + "," + graph.KL + "," + graph.KR + "\n";

    for (const key in graph.nodes) {
        string += key + " " + key + " ";
        string += graph.nodes[key].getValue() + "\n";
    }

    for (const key in graph.edges) {
        string += graph.edges[key].begin + " " + graph.edges[key].end + " ";
        string += graph.edges[key].getValue() + "\n";
    }

    return string;
};


/* global sgv, Chimera, Pegasus */

"use strict";

var ParserGEXF = {};

ParserGEXF.importGraph = (string) => {
    var graphType = "unknown";
    var graphSize = { cols:0, rows:0, KL:0, KR:0 };
    var nodeAttrs = {};
    var edgeAttrs = {};
    var newGraph = null;
    var def2 = [];
    
    function parseNodes(parentNode) {
        let nodes = parentNode.getElementsByTagName("nodes");
        let node = nodes[0].getElementsByTagName("node");
        
        for ( let i =0; i<node.length; i++){
            let def = {};

            let id = node[i].getAttribute("id");
            
            def.n1 = def.n2 = parseInt(id);
            def.values = {};
            
            let attvals = node[i].getElementsByTagName("attvalues");
            
            if (attvals.length>0) {
                let vals = attvals[0].getElementsByTagName("attvalue");
            
                for ( let j =0; j<vals.length; j++){
                    let value = vals[j].getAttribute("value");
                    let k = vals[j].getAttribute("for");
                    let title = nodeAttrs[k];
                    def.values[title] = parseFloat(value);
                }    
            }
            
            def2.push(def);
        }
    };
    
    function parseEdges(parentNode) {
        let nodes = parentNode.getElementsByTagName("edges");
        let node = nodes[0].getElementsByTagName("edge");
        
        for ( let i =0; i<node.length; i++){
            let def = {};

            let source = node[i].getAttribute("source");
            let target = node[i].getAttribute("target");
            
            def.n1 = parseInt(source);
            def.n2 = parseInt(target);
            def.values = {};
            
            let attvals = node[i].getElementsByTagName("attvalues");
            
            if (attvals.length>0) {
                let vals = attvals[0].getElementsByTagName("attvalue");
            
                for ( let j =0; j<vals.length; j++){
                    let value = vals[j].getAttribute("value");
                    let k = vals[j].getAttribute("for");
                    let title = edgeAttrs[k];
                    def.values[title] = parseFloat(value);
                }    
            }
            
            //def.values.default = 0.0;
            def2.push(def);
        }
    };

    function parseNodeAttribute(attributeNode) {
        let id = attributeNode.getAttribute("id");
        let title = attributeNode.getAttribute("title");

        if (title.startsWith('default')){
            let list = title.split(";");

            title = list[0];
            let type = list[1];
            let size = list[2];

            return {id,title,type,size};
        }

        return {id,title};
    };
    

    function parseEdgeAttribute(attributeNode) {
        let id = attributeNode.getAttribute("id");
        let title = attributeNode.getAttribute("title");
        return {id,title};
    };


    function parseAttributes(parentNode){
        let attrs = parentNode.getElementsByTagName("attributes");

        for ( let i =0; i<attrs.length; i++){
            let attrsClass = attrs[i].getAttribute("class");

            let attr = attrs[i].getElementsByTagName("attribute");

            for ( let j =0; j<attr.length; j++){
                if (attrsClass === "node" ) {
                    let result = parseNodeAttribute(attr[j]);

                    nodeAttrs[result.id] = result.title;


                    if ('type' in result){ //default with graph type and size
                        graphType = result.type;
                    }

                    if ('size' in result){
                        let ss = result.size.split(",");
                        //if (ss.lenght>3){
                            graphSize.cols = parseInt(ss[0]);
                            graphSize.rows = parseInt(ss[1]);
                            graphSize.lays = parseInt(ss[2]);
                            graphSize.KL = parseInt(ss[3]);
                            graphSize.KR = parseInt(ss[4]);
                        //}
                    }  
                } else if (attrsClass === "edge" ) {
                    let result = parseEdgeAttribute(attr[j]);
                    edgeAttrs[result.id] = result.title;
                }
            }
        }
    };
    
    
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(string, "text/xml");
    }
    else { // Internet Explorer 
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(string);
    }
    
    //console.log(xmlDoc);
    
    parseAttributes(xmlDoc);
    parseNodes(xmlDoc);
    parseEdges(xmlDoc);
   
    //console.log(def2);

    if (graphType === "chimera"){
        sgv.graf = Chimera.createNewGraph(graphSize);
    } else if (graphType === "pegasus"){
        sgv.graf = Pegasus.createNewGraph(graphSize);
    } else {
        return false;
    }
    
    for (const i in nodeAttrs) {
        if (!sgv.graf.scopeOfValues.includes(nodeAttrs[i]))
            sgv.graf.scopeOfValues.push(nodeAttrs[i]);
    }

    sgv.graf.createStructureFromDef2(def2);
    
    sgv.graf.displayValues();

    return true;
};

ParserGEXF.exportGraph = function(graph) {
    if ((typeof graph==='undefined')||(graph === null)) return null;
    
    function exportNode(node) {
        let xml = "      <node id=\""+node.id+"\">\n";
        xml += "        <attvalues>\n";
        for (const key in this.values) {
            xml += "          <attvalue for=\""+node.parentGraph.getScopeIndex(key)+"\" value=\""+node.values[key]+"\"/>\n";
        }
        xml += "        </attvalues>\n";
        xml += "      </node>\n";
        return xml;
    };

    function exportEdge(edge, tmpId) {
        let xml = "      <edge id=\""+tmpId+"\" source=\""+edge.begin+"\" target=\""+edge.end+"\">\n";
        xml += "        <attvalues>\n";
        for (const key in edge.values) {
            xml += "          <attvalue for=\""+edge.parentGraph.getScopeIndex(key)+"\" value=\""+edge.values[key]+"\"/>\n";
        }
        xml += "        </attvalues>\n";
        xml += "      </edge>\n";
        return xml;
    };

    var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    //xml += "<gexf xmlns=\"http://www.gexf.net/1.2draft\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema−instance\" xsi:schemaLocation=\"http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd\" version=\"1.2\">\n";
    xml += "<gexf xmlns=\"http://gexf.net/1.2\" version=\"1.2\">\n";
    xml += "  <meta>\n";// lastmodifieddate=\"2009−03−20\">\n";
    xml += "    <creator>IITiS.pl</creator>\n";
    xml += "    <description>SimGraphVisualizer GEXF export</description>\n";
    xml += "  </meta>\n";


    xml += "  <graph defaultedgetype=\"undirected\">\n";

    xml += "    <attributes class=\"node\">\n";
    for (const key in graph.scopeOfValues) {
        let val = graph.scopeOfValues[key];
        if (val==='default'){
            val+= ";" + graph.type + ";" + graph.cols + "," + graph.rows + "," + graph.layers + "," + graph.KL + "," + graph.KR;
        }
        xml += "      <attribute id=\""+key+"\" title=\""+val+"\" type=\"float\"/>\n";
    }
    xml += "    </attributes>\n";

    xml += "    <nodes>\n";
    for (const key in graph.nodes) {
        xml += exportNode(graph.nodes[key]);
    }
    xml += "    </nodes>\n";

    xml += "    <attributes class=\"edge\">\n";
    for (const key in graph.scopeOfValues) {
        let val = graph.scopeOfValues[key];
//            if (val==='default'){
//                val+= ";" + graph.type + ";" + graph.cols + "," + graph.rows + "," + graph.KL + "," + graph.KR;
//            }
        xml += "      <attribute id=\""+key+"\" title=\""+val+"\" type=\"float\"/>\n";
    }
    xml += "    </attributes>\n";


    xml += "    <edges>\n";
    let tmpId = 0;
    for (const key in graph.edges) {
        xml += exportEdge(graph.edges[key], ++tmpId);
    }
    xml += "    </edges>\n";
    xml += "  </graph>\n";
    xml += "</gexf>\n";

    return xml;
};


/* global sgv, UI, URL, Chimera, Pegasus, ParserGEXF, ParserTXT */
var FileIO = {};

FileIO.onLoadButton = () => {
    let btnLoad1 = UI.tag('input',{
        'type':'file',
        'id':'inputfile',
        'display':'none'
    });
    btnLoad1.addEventListener('change', (e)=>{
        if (typeof btnLoad1.files[0]!=='undefined') {
            showSplashAndRun(()=>{
                FileIO.loadGraph(btnLoad1.files[0]);
                //btnLoad1.value = ""; //if I need to read the same file again
            });
        }
    });

    btnLoad1.click();
};

FileIO.onSaveButton = ()=>{
    return new Promise((resolve,reject)=>{
        if (typeof window.showSaveFilePicker === 'function') {
            const options = {
                suggestedName: 'name.txt',
                excludeAcceptAllOption: true,
                types: [
                    {
                        description: 'Text file',
                        accept: {'text/plain': ['.txt']}
                    }, {
                        description: 'GEXF files',
                        accept: {'application/xml': ['.gexf']}
                    }]
            };

            window.showSaveFilePicker(options)
                .then((handle)=>{
                    let blob;

                    if (handle.name.endsWith('.txt')) {
                        blob = new Blob([ParserTXT.exportGraph(sgv.graf)]);    
                    } else if (handle.name.endsWith('.gexf')) {
                        blob = new Blob([ParserGEXF.exportGraph(sgv.graf)]);
                    } else {
                        reject('point 1');
                    }

                    handle.createWritable()
                        .then( (writableStream)=> {
                            writableStream.write(blob)
                            .then( () => {
                                writableStream.close();                        
                                resolve('point 3 (OK)'); });
                        }).catch( ()=>{
                            reject('point 5'); });
                }).catch(()=>{
                    reject('point 2');
                });
        } else {
            sgv.dlgAlternateFileSave.show();
            resolve('point 4 (OK)');
        }
    });
    
}; 

FileIO.download = (text, name, type) => {
    let a = document.createElement("a");
    let file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
};

FileIO.alternateSave = (name, ext) => {
    if (ext === '.txt') {
        let string = ParserTXT.exportGraph(sgv.graf);
        FileIO.download(string, name+ext, 'text/plain');
    } else if (ext === '.gexf') {
        let string = ParserGEXF.exportGraph(sgv.graf);
        FileIO.download(string, name+ext, 'application/xml');
    }
};

sgv.stringToScope = (data,newScope) => {
    let r = sgv.graf.loadScopeValues(newScope,data);
            
    if (r.n) {
        sgv.dlgCPL.addScope(newScope);
    }
    sgv.dlgCPL.selScope(newScope);
};


FileIO.loadGraph = function(selectedFile) {
    const name = selectedFile.name;
    const reader = new FileReader();
    if (selectedFile) {
        reader.addEventListener('error', () => {
            console.error(`Error occurred reading file: ${selectedFile.name}`);
        });

        reader.addEventListener('load', () => {
            FileIO.loadGraph2(name, reader.result);
        });

        if ( name.endsWith("txt") || name.endsWith("gexf") ) {
            reader.readAsText(selectedFile); 
        } else {
            console.error(`Incorrect file extension...`);
        }
    }                    
};
        
FileIO.loadGraph2 = function(name,data) {
    if (name.endsWith("txt")) {
        if (sgv.graf!==null) {
            sgv.removeGraph();
        }
        ParserTXT.importGraph(data);
    } else if(name.endsWith("gexf")) {
        if (sgv.graf!==null) {
            sgv.removeGraph();
        }
        if (ParserGEXF.importGraph(data)){
            sgv.setModeDescription();
        }
    };
};


"use strict";
/* global sgv, Chimera, Pegasus, UI, parserGEXF, dialog, FileIO */


sgv.dlgCPL = new function() {
    var com, sel, des;
    var selectScope;
    var sliderRedLimit, sliderGreenLimit;
    var spanRed, spanGreen;
    var btnDispMode, btnShowConsole, btnSaveTXT, btnClear;

    var btnShowConsole2, btnCreate, btnLoad;
    
    var elm = createDialog();
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(elm);
    });

    function createDialog() {
        let elm = UI.tag( "dialog", { "class": "sgvUIwindow", "id": "sgvDlgCPL" });
        
        function divSel() {
            var divSel = UI.tag( "div", { "class": "content", "id": "graphSelection" });
            
            divSel.appendChild(
                    btnShowConsole2 = UI.createTransparentBtn1('show console',"cplShowConsoleButton",()=>{
                        sgv.dlgConsole.switchConsole();
                    }));

            divSel.appendChild(
                    btnCreate = UI.createTransparentBtn1('create graph',"cplCreateButton",()=>{
                        sgv.dlgCreateGraph.show();
                    }));

            divSel.appendChild(
                    btnLoad = UI.createTransparentBtn1('load graph', 'cplLoadButton', ()=>{
                        FileIO.onLoadButton();
            }));

            divSel.style.display = "block";
            
            return divSel;
        };

        
        function divDesc() {
            function createInfoBlock() {
                var i = UI.tag("div", {});

                i.innerHTML = "Current graph type: ";
                i.appendChild( UI.span("unknown", {'id':"dscr_type"}) );

                i.innerHTML += ', size: <span id="dscr_cols">0</span>x<span id="dscr_rows">0</span>xK<sub><span id="dscr_KL">0</span>,<span id="dscr_KR">0</span></sub><br/> \
                        Number of nodes: <span id="dscr_nbNodes">0</span>, number of edges: <span id="dscr_nbEdges">0</span>';

                return i;
            }

            function createLimitSlidersPanel() {
                let sldPanel = UI.tag('div',{'id':'panelLimitSliders'});
                
                sldPanel.appendChild( spanRed=UI.tag("span",{'id':'spanRed'},{'textContent':'-1.0'}) );

                sliderRedLimit = UI.tag('input',{
                    'type':'range',
                    'class':'graphLimit',
                    'id':'redLimit',
                    'value':'-1.0',
                    'min':'-1.0',
                    'max':'0.0',
                    'step':'0.01'
                });
                sliderRedLimit.addEventListener('input', async (e)=>{
                    if (sgv.graf !== null) {
                        sgv.graf.redLimit = e.target.value;

                        spanRed.textContent = ''+sgv.graf.redLimit+' ';

                        sgv.graf.displayValues();
                    }
                });

                sldPanel.appendChild(sliderRedLimit);

                sldPanel.appendChild( UI.tag("span",{'id':'spanZero'},{'textContent':' 0 '}) );

                sliderGreenLimit = UI.tag('input',{
                    'type':'range',
                    'class':'graphLimit',
                    'id':'greenLimit',
                    'value':'1.0',
                    'min':'0.0',
                    'max':'1.0',
                    'step':'0.01'
                });
                sliderGreenLimit.addEventListener('input', async (e)=>{
                    if (sgv.graf !== null) {
                        sgv.graf.greenLimit = e.target.value;

                        spanGreen.textContent = ' '+sgv.graf.greenLimit;

                        sgv.graf.displayValues();

                    }
                });

                sldPanel.appendChild(sliderGreenLimit);

                sldPanel.appendChild( spanGreen=UI.tag("span",{'id':'spanGreen'},{'textContent':'1.0'}) );
                
                return sldPanel;
            }

            var divDesc = UI.tag("div", {"class": "content", "id": "graphDescription"});

            divDesc.appendChild(createInfoBlock());

            let divNS = UI.tag( "div", {'class': "sgvD1", 'id': "cplDivNS" }, {'textContent': "add new scope: "} );
            divNS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplSkipAddScope", 'value': "<" } ) );
            divNS.appendChild( UI.tag("input", { 'type': "text", 'id': "cplAddScopeInput", 'value': "newScope" } ) );
            divNS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplAcceptAddScope",'value': "+" } ) );
            divNS.style.display = "none";

            let divDS = UI.tag( "div", {'class': "sgvD1", 'id': "cplDivDS" }, {'textContent': "current scope: "} );
            
            selectScope = UI.tag( "select", {'id': "cplDispValues" } );
            selectScope.addEventListener('change', () => {
                sgv.graf.displayValues(selectScope.value);
                updateSlidersX();
            });
            divDS.appendChild( selectScope );

            divDS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplAddScope", 'value': "+" } ) );
            divDS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplDelScope", 'value': "-" } ) );

            
            let scope = UI.tag( "div", {'class': "sgvSelectBox", 'id': "cplScope" } );
            scope.appendChild(divNS);
            scope.appendChild(divDS);
            divDesc.appendChild(scope);

            let sldPanel = createLimitSlidersPanel();
            divDesc.appendChild(sldPanel);

            let btnPanel = UI.tag('div',{'id':'panelBtns'});
            
            btnPanel.appendChild(
                    btnDispMode = UI.createTransparentBtn1('display mode',"cplDispModeButton",()=>{
                        sgv.switchDisplayMode();
                    }));

            btnPanel.appendChild(
                    btnShowConsole = UI.createTransparentBtn1('show console',"cplShowConsoleButton",()=>{
                        sgv.dlgConsole.switchConsole();
                    }));

            btnPanel.appendChild(
                    btnSaveTXT = UI.createTransparentBtn1('save graph',"cplSaveButton", ()=>{
                        FileIO.onSaveButton()
                            .then( result => console.log( result ) )
                            .catch( error => console.log( error ) );
                    }));

            btnPanel.appendChild(
                    btnClear = UI.createTransparentBtn1('delete graph',"cplClearButton",()=>{
                        sgv.removeGraph();
                    }));

            divDesc.appendChild(btnPanel);
            
            divDesc.style.display = "none";
            return divDesc;
        };

        sel = divSel();
        des = divDesc();
        
        com = UI.tag('div', {});
        com.style.display = 'block';
        
        com.appendChild(sel);
        com.appendChild(des);
        
        elm.appendChild(com);



        elm.querySelector("#cplSkipAddScope").addEventListener('click',
            function() {
                elm.querySelector("#cplDivNS").style.display = "none";
                elm.querySelector("#cplDivDS").style.display = "block";
            });

        elm.querySelector("#cplAcceptAddScope").addEventListener('click',
            function() {
                let scope = elm.querySelector("#cplAddScopeInput").value;
                let idx = sgv.graf.addScopeOfValues(scope);

                if (idx>=0) {
                    elm.querySelector("#cplDispValues").add(UI.option(scope,scope));
                    elm.querySelector("#cplDispValues").selectedIndex = idx;
                    sgv.graf.displayValues(scope);
                }

                elm.querySelector("#cplDivNS").style.display = "none";
                elm.querySelector("#cplDivDS").style.display = "inline";
            });

        elm.querySelector("#cplAddScope").addEventListener('click',
            function() {
                elm.querySelector("#cplDivNS").style.display = "inline";
                elm.querySelector("#cplDivDS").style.display = "none";
            });

        elm.querySelector("#cplDelScope").addEventListener('click',
            function() {
                const select = elm.querySelector("#cplDispValues"); 

                let idx = sgv.graf.delScopeOfValues(select.value);

                if (  idx >= 0 ) {
                    select.remove(select.selectedIndex);
                    select.selectedIndex = idx;
                }
            });



        var swt = UI.tag('div', {'id':'switch'});
        
        swt.addEventListener('click',() => {
           switchDialog(); 
        });
        
        swt.innerHTML = '. . .';
        elm.appendChild(swt);
        
        elm.style.display = 'block';
        
        return elm;
    };
    
    function showDialog() {
        updateSlidersX();
        com.style.display = "block";
    };
    
    function hideDialog() {
        com.style.display = "none";
    };
    
    function switchDialog() {
        //updateSlidersX();
        com.style.display = (com.style.display === "none")?"block":"none";
    };
    
    function addScopeX(scope,idx) {
        selectScope.add(UI.option(scope,scope));
        selectScope.selectedIndex = idx;
    }
    
    function delScopeX(scope,idx2) {
        let i = UI.findOption(selectScope, scope);
        if ( i>-1 ) {
            selectScope.remove(i);
        }
        selectScope.selectedIndex = idx2;
    }
    
    function selScopeX(scope) {
        let i = UI.findOption(selectScope, scope);
        if ( i>-1 ) {
            selectScope.selectedIndex = i;
        }
    }
    
    function setModeSelectionX() {
        sel.style.display = "block";
        des.style.display = "none";
        
        enableMenu('menuGraphSave', false);
        enableMenu('menuGraphClear', false);
        enableMenu('menuViewDisplayMode', false);
        
    };

    function updateSlidersX() {
        if (sgv.graf === null) return;
        
        let r = sgv.graf.getMinMaxVal();
        
        // min should to bee negative or :
        if (r.min>0) r.min = Number.NaN;

        // max should to bee positive:
        if (r.max<0) r.max = Number.NaN;

        
        updateRed(r.min);
        updateGreen(r.max);

        function updateRed(min) {
            if (isNaN(min)) {
                sliderRedLimit.disabled = 'disabled';
                spanRed.textContent = 'NaN';
            }
            else {
                min = Math.floor(min * 100) / 100;
                
                if (sgv.graf.redLimit<min) {
                    sgv.graf.redLimit = min;
                }
                
                sliderRedLimit.min = min;
                sliderRedLimit.value = sgv.graf.redLimit;

                spanRed.textContent = sgv.graf.redLimit+' ';
                sliderRedLimit.disabled = '';
            }
        };
        function updateGreen(max) {
            if (isNaN(max)) {
                sliderGreenLimit.disabled = 'disabled'; 
                spanGreen.textContent = 'NaN';
            }
            else {
                max = Math.ceil(max * 100) / 100;
                
                if (sgv.graf.greenLimit>max) {
                    sgv.graf.greenLimit=max;
                }
                
                sliderGreenLimit.max = max;
                sliderGreenLimit.value = sgv.graf.greenLimit;
                
                spanGreen.textContent = ' '+sgv.graf.greenLimit;
                sliderGreenLimit.disabled = '';
            }
        };
    };


    function setModeDescriptionX() {
        function refreshScopes() {
            if (sgv.graf!==null){
                UI.clearSelect(selectScope, true);
                for (const key in sgv.graf.scopeOfValues) {
                    let scope = sgv.graf.scopeOfValues[key];
                    let opt = UI.option(scope, scope);
                    if ( sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
                        opt.selected = "selected";
                    }
                    selectScope.appendChild(opt);
                }
            }
        }

        
        function updateInfoBlock() {
            elm.querySelector("#dscr_type").textContent = sgv.graf.type;
            elm.querySelector("#dscr_cols").textContent = sgv.graf.cols;
            elm.querySelector("#dscr_rows").textContent = sgv.graf.rows;
            elm.querySelector("#dscr_KL").textContent = sgv.graf.KL;
            elm.querySelector("#dscr_KR").textContent = sgv.graf.KR;
            elm.querySelector("#dscr_nbNodes").textContent = Object.keys(sgv.graf.nodes).length;
            elm.querySelector("#dscr_nbEdges").textContent = Object.keys(sgv.graf.edges).length;
            
            
        };

        updateSlidersX();
        updateInfoBlock();
        refreshScopes();

        enableMenu('menuGraphSave', true);
        enableMenu('menuGraphClear', true);
        enableMenu('menuViewDisplayMode', true);

        sel.style.display = "none";
        des.style.display = "block";
    };


    return {
        desc: des,
        show: showDialog,
        hide: hideDialog,
        switchPanel: switchDialog,
        setModeDescription: setModeDescriptionX,
        setModeSelection: setModeSelectionX,
        updateSliders: updateSlidersX,
        addScope: addScopeX,
        delScope: delScopeX,
        selScope: selScopeX
    };
};

sgv.setModeSelection = sgv.dlgCPL.setModeSelection;
sgv.setModeDescription = sgv.dlgCPL.setModeDescription;

sgv.removeGraph = function() {
    if (sgv.graf!==null) {
        sgv.graf.dispose();
        //delete graf;
        sgv.graf = null;
    }

    sgv.dlgMissingNodes.delAll();
    sgv.setModeSelection();
};

sgv.createGraph = function(gDesc, res) {
    if (sgv.graf!==null) {
        sgv.removeGraph();
    }

    switch ( gDesc.type ) {
        case "chimera" :
            sgv.graf = Chimera.createNewGraph(gDesc.size);
            break;
        case "pegasus" :
            sgv.graf = Pegasus.createNewGraph(gDesc.size);
            break;
        default:
            return;
    }

    if (typeof res === 'undefined')
        sgv.graf.createDefaultStructure(()=>{
            sgv.setModeDescription();
            sgv.graf.displayValues();
            hideSplash();
        });
    else {
        sgv.graf.createStructureFromDef(res);
        sgv.setModeDescription();
        sgv.graf.displayValues();
        hideSplash();
    }
};


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
/* global scene, sgv, Chimera, Pegasus, UI */

sgv.dlgConsole = new function () {
    var isDown;
    var cmdHistory = [];
    var cmdHistoryPtr = -1;
    var movable = false;
    
    var ui = createUI("sgvConsole");
    initConsole();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function initConsole() {
        let domCmdline = ui.querySelector("#commandline");

        domCmdline.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                let txtarea = document.getElementById("consoleHistory");
                //txtarea.disabled = false;
                txtarea.textContent += "> " + domCmdline.value + "\n";

                txtarea.textContent += parseCommand(domCmdline.value) + "\n";

                txtarea.scrollTop = txtarea.scrollHeight;
                //txtarea.disabled = true;

                if (cmdHistory.length > 10)
                    cmdHistory.shift();
                cmdHistory.push(domCmdline.value);
                cmdHistoryPtr = cmdHistory.length;

                domCmdline.value = "";
            } else if (event.keyCode === 38) {
                if (cmdHistoryPtr > 0) {
                    cmdHistoryPtr--;
                    domCmdline.value = cmdHistory[cmdHistoryPtr];
                }
            } else if (event.keyCode === 40) {
                if (cmdHistoryPtr < cmdHistory.length) {
                    domCmdline.value = cmdHistory[cmdHistoryPtr];
                    cmdHistoryPtr++;
                } else {
                    domCmdline.value = "";
                }
            }
        });

        ui.querySelector(".hidebutton").addEventListener('click', function() { sgv.dlgConsole.hideConsole(); });

//        let titlebar = ui.querySelector(".title");
//        var offset;
//
//        titlebar.addEventListener('mouseover', function() {
//            ui.querySelector(".title").style.cursor='pointer';
//            movable = true;
//        });
//
//        titlebar.addEventListener('mouseout', function() {
//            movable = false;
//        });
//
//        titlebar.addEventListener('mousedown', function (e) {
//            isDown = movable;
//            offset = {
//                x: ui.offsetLeft - e.clientX,
//                y: ui.offsetTop - e.clientY
//            };
//        }, true);
//
//        titlebar.addEventListener('mouseup', function () {
//            isDown = false;
//        }, true);
//
//        document.addEventListener('mousemove', function (event) {
//            //event.preventDefault();
//            if (isDown) {
//                let mousePosition = {
//                    x: event.clientX,
//                    y: event.clientY
//                };
//
//                ui.style.left = (mousePosition.x + offset.x) + 'px';
//                ui.style.top = (mousePosition.y + offset.y) + 'px';
//            }
//        }, true);
    };

    function createUI(id) {
        var o = UI.createEmptyWindow("sgvUIwindow", id, "console", true);

        o.innerHTML += '<div class="content"> \
                <textarea id="consoleHistory" readonly></textarea> \
                <input type="text" id="commandline"> \
            </div>';
        return o;
    };

    function parseCommand(line) {
        function set(node, value) {
            var id = parseInt(node, 10);
            var val = parseFloat(value);

            if (!isNaN(id) && !isNaN(val)) {
                if (sgv.graf !== null) {
                    if (id in sgv.graf.nodes) {
                        sgv.graf.setNodeValue(id, val);
                        return "modified node q" + id + " = " + val;
                    } else if ( sgv.dlgMissingNodes.restoreNode(id) ) {
                            sgv.graf.setNodeValue(id, val);
                            return "restored node q" + id + " = " + val;
                    }
                    else {
                        //sgv.graf.addNode(id, sgv.graf.calcPosition(id), val);
                        //return "added node q" + id + " = " + val;
                        return "not implemented yet";
                    }
                } else {
                    return "no graph defined";
                }
            }
        }

        function del(node) {
            if (sgv.graf === null) {
                return "no graph defined";
            } else {
                let id = parseInt(node, 10);
                if (isNaN(id) || (id === 0)) {
                    return "bad NodeId";
                } else if (id in sgv.graf.nodes) {
                    sgv.graf.delNode(id);
                    return "deleted node q" + id;
                } else {
                    return "node q" + id + " not exists";
                }
            }
        }

        function scope(action, scope) {
            if (sgv.graf === null) {
                return "no graph defined";
            } else {
                switch(action) {
                    case "list":
                        return sgv.graf.scopeOfValues.toString();
                        break;
                    case "add":
                        let idx = sgv.graf.addScopeOfValues(scope);

                        if (idx>=0) {
                            sgv.dlgCPL.addScope(scope,idx);
                            sgv.graf.displayValues(scope);
                        }
                        
                        return "Added scope "+scope;
                        break;
                    case "delete":
                        let idx2 = sgv.graf.delScopeOfValues(scope);
                    
                        if (  idx2 >= 0 ) {
                            sgv.dlgCPL.delScope(scope, idx2);
                            return "Deleted scope "+scope+", current scope: "+sgv.graf.currentScope;
                        }

                        return "Scope "+scope+" could not to be deleted... Current scope: "+sgv.graf.currentScope;
                        break;
                    case "set":
                        if (sgv.graf.hasScope(scope)) {
                            if ( sgv.graf.displayValues(scope) ) {
                                sgv.dlgCPL.selScope(scope);
                            }
                            
                            return "Current scope: "+sgv.graf.currentScope;
                        }
                        return "Bad scope name: "+scope+"... Current scope: "+sgv.graf.currentScope;
                        break;
                    default:
                        return "Current scope: "+sgv.graf.currentScope;
                        break;
                }
            }
        }

        function create(type, sizeTXT) {
            if (sgv.graf === null) {
                const sizesTXT = sizeTXT.split(",");

                size = {
                    cols:   parseInt(sizesTXT[0], 10),
                    rows:   parseInt(sizesTXT[1], 10),
                    KL:     parseInt(sizesTXT[2], 10),
                    KR:     parseInt(sizesTXT[3], 10)
                };
                
                switch (type) {
                    case "chimera" :
                        sgv.graf = Chimera.createNewGraph(size);
                        sgv.graf.createDefaultStructure();
                        break;
                    case "pegasus" :
                        sgv.graf = Pegasus.createNewGraph(size);
                        sgv.graf.createDefaultStructure();
                        break;
                    default:
                        return "unknown graph type";
                }

                sgv.setModeDescription();

                return "graph created";
            } else {
                return "graf exists, type: clear <Enter> to delete it";
            }

        }

        function clear() {
            sgv.removeGraph();
            return "graph removed";
        }

        function con(node1, node2, value) {
            if (sgv.graf === null) {
                return "no graph defined";
            } else {
                let id1 = parseInt(node1, 10);
                let id2 = parseInt(node2, 10);
                var val = parseFloat(value);

                if (isNaN(id1) || (id1 === 0) || isNaN(id2) || (id2 === 0)) {
                    return "bad node";
                } else if (isNaN(val)) {
                    return "bad value";
                } else if (id1 in sgv.graf.nodes) {
                    if (id2 in sgv.graf.nodes) {
                        sgv.graf.addEdge(id1, id2).setValue(val);
                        return "added edge: q" + id1 + " -> g" + id2;
                    } else {
                        return "node q" + id2 + " was probably deleted earlier";
                    }

                } else {
                    return "node q" + id1 + " was probably deleted earlier";
                }
            }
        }

        function set2(command) {
            function setN(split2, val) {
                if (split2[0][0] === 'q') {
                    let id = parseInt(split2[0].slice(1), 10);

                    if (isNaN(id) || (id === 0) || (id > sgv.graf.maxNodeId())) {
                        return "bad node Id";
                    }

                    if (isNaN(val)) {
                        if (id in sgv.graf.nodes) {
                            sgv.graf.delNode(id.toString());
                            return "deleted node q" + id;
                        } else {
                            return "node q" + id + " already deleted";
                        }
                    } else {
                        if (id in sgv.graf.nodes) {
                            sgv.graf.setNodeValue(id, val);
                            return "modified node q" + id + " = " + val;
                        } else if (id in sgv.graf.missing) {
                            sgv.graf.restoreNode(id);
                            let but = document.getElementById("rest" + id);
                            but.parentNode.removeChild(but);
                            sgv.graf.setNodeValue(id, val);
                            return "restored and modified node q" + id + " = " + val;
                        } else {
                            sgv.graf.addNode(id, sgv.graf.calcPosition(id), val);
                            return "added node q" + id + " = " + val;
                        }
                    }
                }
            }

            function setE(split2, val) {
                if ((split2[0][0] === 'q') && (split2[1][0] === 'q')) {
                    let id1 = parseInt(split2[0].slice(1), 10);
                    let id2 = parseInt(split2[1].slice(1), 10);

                    if (isNaN(id1) || (id1 === 0)) {
                        return "bad node Id: " + split2[0];
                    }

                    if (isNaN(id2) || (id2 === 0)) {
                        return "bad node Id: " + split2[1];
                    }

                    let strId = "" + id1 + "," + id2;
                    if (id1 > id2) {
                        strId = "" + id2 + "," + id1;
                    }

                    if (isNaN(val)) {
                        if (strId in sgv.graf.edges) {
                            sgv.graf.delEdge(strId);
                            return "deleted edge " + strId;
                        } else {
                            return "edge " + strId + " not exists";
                        }
                    } else {
                        if (strId in sgv.graf.edges) {
                            sgv.graf.setEdgeValue(strId, val);
                            return "modified edge " + strId;
                        } else {
                            if ((id1 in sgv.graf.nodes) && (id2 in sgv.graf.nodes)) {
                                sgv.graf.addEdge(id1, id2).setValue(val);
                                return "added edge " + strId;
                            } else {
                                return "NOT DONE: both connected nodes must exist in the graph";
                            }
                        }
                    }
                }
            }

            if (sgv.graf === null) {
                return "no graph defined";
            }

            let split1 = command.split('=');
            console.log(split1);

            if (split1.length < 2) {
                return "too few arguments";
            }

            let val = parseFloat(split1[1].replace(/,/g, '.'));
            // if NaN -> delete

            let split2 = split1[0].split('+');

            if (split2.length === 1) { // set node
                return setN(split2, val);
            } else if (split2.length === 2) { //set edge
                return setE(split2, val);
            }

            return "bad arguments";
        }

        function display(valId) {
            return "displayed value: " + sgv.graf.displayValues(valId);
        }
        
        function limits(cmds) {
            if (sgv.graf === null) {
                return "no graph defined";
            }

            //let cmds = polecenie.split(" ");
            
            let response = "";
            
            if (cmds.length===1) {
                response = "Current display limits [red, green] are set to [" + sgv.graf.redLimit+", "+sgv.graf.greenLimit+"]\n";
                let minmax = sgv.graf.getMinMaxNodeVal();
                response+= "\nnode values range in current scope is: [" + minmax.min + ", " + minmax.max +"] "+minmax.com;
                minmax = sgv.graf.getMinMaxEdgeVal();
                response+= "\nedge weights range in current scope is: [" + minmax.min + ", " + minmax.max +"] "+minmax.com;
                return response;
            }
            
            
            switch (cmds[1]) {
                case "set":
                    if (cmds.length<4){
                        return "too few arguments\nUse: limits set <min> <max>";
                    }
                    
                    let min = parseFloat(cmds[2].replace(/,/g, '.'));
                    let max = parseFloat(cmds[3].replace(/,/g, '.'));
                    
                    if (isNaN(min)||isNaN(max)){
                        return "Bad arguments: <min> and <max> should be numbers.";
                    }

                    if ((min>0)||(max<0)||(min===max)){
                        return "Bad arguments: <min> cannot be greater than zero, <max> cannot be less than zero and both values cannot be zero at the same time.";
                    }

                    sgv.graf.redLimit = min;
                    sgv.graf.greenLimit = max;

                    response = "Display limits [red, green] are set to [" + sgv.graf.redLimit+", "+sgv.graf.greenLimit+"]";
                    
                    break;
//                case "red":
//                    if (cmds.length>2){
//                        sgv.graf.redLimit = parseFloat(cmds[2]);
//                        response = "red limit set to " + sgv.graf.redLimit;
//                    } else {
//                        return "current red limit = "+sgv.graf.redLimit;
//                    }
//                    break;
//                case "green":
//                    if (cmds.length>2){
//                        sgv.graf.greenLimit = parseFloat(cmds[2]);
//                        response = "green limit set to " + sgv.graf.greenLimit;
//                    } else {
//                        return "current green limit = "+sgv.graf.greenLimit;
//                    }
//                    break;
                default:
                    return "bad arguments";
            }
            
            sgv.graf.displayValues(sgv.graf.currentScope);
            return response;
        }
        
        function getHelp(command) {
            switch (command) {
                case "set":
                    return "Set or remove value of node or edge\n\nset [nodeId](=value)\nset [nodeId]+[nodeId](=value)";
                case "create":
                    return "Create new default graph\n\ncreate [chimera|pegasus] [4|8|12|16],[4|8|12|16],[1..4],[1..4]";
                case "clear":
                    return "Remove current graph if exists\n\nclear";
                case "display":
                    return "Switch between sets of displayed values\n\ndisplay [valueId]";
                case "displaymode":
                    return "Set style of graph display.\n\ndisplaymode [classic|triangle|diamond]";
                case "":
                default:
                    return "For more information on a specific command, type: help command-name\n\nset\t\tSet or remove value of node or edge\ncreate\t\tCreate new default graph\nclear\t\tRemove current graph if exists\ndisplay\t\tSwitch between sets of displayed values\ndisplaymode\tSet style of graph display";
            }
        }

        line = line.trim().toLowerCase().replace(/\s+/g, ' ');
        var command = line.split(' ');

        let sp = line.indexOf(' ');
        var polecenie = line.substring(sp + 1).replace(/\s+/g, '');

        var result = "";

        switch (command[0].trim()) {
            case "help":
            case "?":
                result = getHelp(command[1]);
                break;
            case "limits":
                result = limits(command);
                break;
            case "create":
                result = create(command[1], command[2]);
                break;
            case "clear":
                result = clear();
                break;
            case "set":
                result = set2(polecenie);
                break;
            case "scope":
                result = scope(command[1], command[2]);
                break;
//            case "set":
//                result = set(command[1], command[2]);
//                break;
//            case "delete":
//            case "del":
//                result = del(command[1]);
//                break;
//            case "connect":
//            case "con":
//                result = con(command[1], command[2], command[3]);
//                break;
            case "display":
                result = display(command[1]);
                break;
            case "displaymode":
                if ((command[1]==='classic')||(command[1]==='diamond')||(command[1]==='triangle')) {
                    sgv.displayMode = command[1];
                    sgv.graf.changeDisplayMode();
                    result = "current displayMode = " + command[1];
                } else {
                    result = "unknown mode\n\n" + getHelp('displaymode');
                }
                break;
            default:
                result = "unknown command\n\n" + getHelp();
                break;
        }

        return result;
    }

    return {// public interface
        switchConsole: function () {
            if (ui.style.display !== "block") {
                ui.style.display = "block";
            } else {
                ui.style.display = "none";
            }
        },

        showConsole: function () {
            ui.style.display = "block";
        },

        hideConsole: function () {
            ui.style.display = "none";
        }
    };
};

/* global sgv, UI */

sgv.dlgModuleView = new function() {
    var selectGraphCols, selectGraphRows, selectGraphLays, selectScope;

    var r,c,l;
    
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function createUI() {
        r = c = l = 0;
        
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvDlgModuleView", "Cell view", true);

        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialog();
        });

        let content = UI.tag( "div", { "class": "content", "id": "graphSelection" });

        content.appendChild(UI.tag('div',{'id':'description'}));
        let g = UI.tag('div',{'id':'description'});

        g.style['text-align']='center';

        selectGraphCols = UI.tag('select',{'id':'graphCols'});
        selectGraphCols.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10)); 
            });

        g.appendChild(UI.tag('label',{'for':'graphCols'},{'innerHTML':' column: '}));
        g.appendChild(selectGraphCols);

        selectGraphRows = UI.tag('select',{'id':'graphRows'});
        selectGraphRows.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10)); 
            });

        g.appendChild(UI.tag('label',{'for':'graphRows'},{'innerHTML':' row: '}));
        g.appendChild(selectGraphRows);

        selectGraphLays = UI.tag('select',{'id':'graphLays'});
        selectGraphLays.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10)); 
            });

        g.appendChild(UI.tag('label',{'for':'graphLays'},{'innerHTML':' layer: '}));
        g.appendChild(selectGraphLays);

        selectScope = UI.tag( "select", {'id': "selectScope" } );
        selectScope.addEventListener('change', () => {
            sgv.graf.displayValues(selectScope.value);
            sgv.dlgCPL.selScope(selectScope.value);
            sgv.dlgCPL.updateSliders();
            drawModule();
        });
        g.appendChild(UI.tag('label',{'for':'selectScope'},{'innerHTML':' scope: '}));
        g.appendChild( selectScope );


        content.appendChild(g);

        let div = UI.tag('div');
        div.style.width='fit-content';
        div.style.height='fit-content';
        div.style.background='#fff';
        content.appendChild(div);

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "id",'svgView');
        svg.setAttributeNS(null, "height",600);
        svg.setAttributeNS(null, "width",400);
        div.appendChild(svg);

        ui.appendChild(content);

        ui.style.display = "none";
        ui.style['top']='10vh';
        return ui;
    };

    function onClick(e) {
        var element = e.target;
        var offsetX = 0, offsetY = 0;

            if (element.offsetParent) {
          do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
          } while ((element = element.offsetParent));
        }

        x = e.pageX - offsetX;
        y = e.pageY - offsetY;
        
        console.log(x,y);
    }

    function pos(id, mode) {
        const pos = {
            'classic': [
                {x: -60, y: 150},
                {x: -90, y:  50},
                {x:-120, y: -50},
                {x:-150, y:-150},
                {x: 140, y: 200},
                {x: 110, y: 100},
                {x:  80, y:   0},
                {x:  50, y:-100}]
        };
        
        const ctrX = 200;
        const ctrY = 300;
        
        mode = 'classic'; //temporary
        
        return {
            x: ctrX+pos[mode][id].x,
            y: ctrY+pos[mode][id].y
        };
    }
    
    function drawInternalEdge(offset, iB, iE) {
        let b = offset + iB;
        let e = offset + iE;
        let eid = (b < e)?("" + b + "," + e):("" + e + "," + b);
        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 5*valueToEdgeWidth(val);
            
            var svgns = "http://www.w3.org/2000/svg",
            container = document.getElementById( 'svgView' );
            
            var newLine = document.createElementNS(svgns,'line');
            newLine.setAttributeNS(null, 'id',eid);
            newLine.setAttributeNS(null, 'x1',pos(iB).x);
            newLine.setAttributeNS(null, 'y1',pos(iB).y);
            newLine.setAttributeNS(null, 'x2',pos(iE).x);
            newLine.setAttributeNS(null, 'y2',pos(iE).y);
            newLine.setAttributeNS(null, 'style', 'stroke: '+color.toHexString()+'; stroke-width: '+wth+'px;' );
            container.appendChild(newLine);

            newLine.addEventListener('click',(e)=>{
                e.preventDefault();
                let rect = newLine.getBoundingClientRect();
                sgv.dlgEdgeProperties.show(newLine.id,rect.x,rect.y);
            });            
            
        }
    }
    

    function drawNode(offset, id) {
        if ((offset+id) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(offset+id);
            let color = valueToColor(val);

            var svgns = "http://www.w3.org/2000/svg",
            container = document.getElementById( 'svgView' );

            x = pos(id).x;
            y = pos(id).y;

            var circle = document.createElementNS(svgns, 'circle');
            circle.setAttributeNS(null, 'id', offset+id);
            circle.setAttributeNS(null, 'cx', x);
            circle.setAttributeNS(null, 'cy', y);
            circle.setAttributeNS(null, 'r', 20);
            circle.setAttributeNS(null, 'style', 'fill: '+color.toHexString()+'; stroke: black; stroke-width: 1px;' );
            container.appendChild(circle);

            circle.addEventListener('click',(e)=>{
                e.preventDefault();
                let rect = circle.getBoundingClientRect();
                sgv.dlgNodeProperties.show(circle.id,rect.x,rect.y);
            });
        }
    }

    function drawExtEdge(offset, ijk, e, endX, endY) {
        let b = offset+ijk;
        eid = (b < e)?("" + b + "," + e):("" + e + "," + b);
            console.log(eid);
        if (eid in sgv.graf.edges) {
            console.log(eid);
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 5*valueToEdgeWidth(val);
            
            var svgns = "http://www.w3.org/2000/svg",
            container = document.getElementById( 'svgView' );
            
            var newLine = document.createElementNS(svgns,'line');
            newLine.setAttributeNS(null, 'id',eid);
            newLine.setAttributeNS(null, 'x1',pos(ijk).x);
            newLine.setAttributeNS(null, 'y1',pos(ijk).y);
            newLine.setAttributeNS(null, 'x2',endX);
            newLine.setAttributeNS(null, 'y2',endY);
            newLine.setAttributeNS(null, 'style', 'stroke: '+color.toHexString()+'; stroke-width: '+wth+'px;' );
            container.appendChild(newLine);

            newLine.addEventListener('click',(e)=>{
                e.preventDefault();
                let rect = newLine.getBoundingClientRect();
                sgv.dlgEdgeProperties.show(newLine.id,rect.x,rect.y);
            });            
        }            
    }
    
    function calcOffset(col, row, layer) {
        let offset = layer*sgv.graf.cols*sgv.graf.rows;
        offset += row*sgv.graf.cols;
        offset += col;
        offset *= 8;

        offset += 1;
        
        return offset;
    }
    
    function drawModule(col, row, layer) {
        container = document.getElementById( 'svgView' );
        container.innerHTML = '';

        if (sgv.graf===null) return;

        if (typeof col==='undefined') col=c;
        else c=col;

        if (typeof row==='undefined') row=r;
        else r=row;

        if (typeof layer==='undefined') layer=l;
        else l=layer;
        
        UI.selectByKey(selectGraphCols, col);
        UI.selectByKey(selectGraphRows, row);
        UI.selectByKey(selectGraphLays, layer);
        
        if ((col>=sgv.graf.cols)||(row>=sgv.graf.rows)||(layer>=sgv.graf.layers)) return;

        let offset = calcOffset(col, row, layer);
        let offDown = calcOffset(col, row-1, layer);
        let offUp = calcOffset(col, row+1, layer);
        let offRight = calcOffset(col+1, row, layer);
        let offLeft = calcOffset(col-1, row, layer);

        for (i=0;i<4;i++){
            if(row<(sgv.graf.rows-1)) {
                drawExtEdge(offset, i, offUp+i, pos(i).x, 20);
            }

            if(row>0) {
                drawExtEdge(offset, i, offDown+i, pos(i).x, 580);
            }

            if(col<(sgv.graf.cols-1)) {
                drawExtEdge(offset, i+4, offRight+i+4, 380, pos(i+4).y);
            }
            
            if(col>0) {
                drawExtEdge(offset, i+4, offLeft+i+4, 20, pos(i+4).y);
            }
        }

        for (let iL=0;iL<4;iL++){
            for (let iR=4;iR<8;iR++){
                drawInternalEdge(offset, iL, iR);
            }
        }

        if (sgv.graf.type==='pegasus') {
            drawInternalEdge(offset, 0, 1);
            drawInternalEdge(offset, 2, 3);
            drawInternalEdge(offset, 4, 5);
            drawInternalEdge(offset, 6, 7);
            
            //if (layer===(sgv.graf.layers-1) {
            //    drawExtEdge(offset, i+4, offLeft+i+4, 20, pos(i+4).y);
        }
    };
};
/* global sgv, UI */

sgv.dlgCreateGraph = new function() {
    var selectGraphType;
    var selectGraphCols, selectGraphRows, selectGraphLays;
    var selectGraphKL, selectGraphKR;
    
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function createUI() {
        let ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgCreateGraph" });

        let t = UI.createTitlebar("Create graph", false);
        ui.appendChild(t);

        let divSel = UI.tag( "div", { "class": "content", "id": "graphSelection" });

        divSel.appendChild(UI.tag('div',{'id':'description'}));
        let g = UI.tag('div',{'id':'description'});

        g.style['text-align']='center';

        selectGraphType = UI.tag('select',{'id':'graphType'});
        selectGraphType.appendChild(UI.option('chimera','chimera'));
        selectGraphType.appendChild(UI.option('pegasus','pegasus'));

        selectGraphType.addEventListener('change', (e)=>{
            if (e.target.value === 'chimera') {
                selectGraphLays.selectedIndex = 0;
                selectGraphLays.disabled = 'disabled';
            } else {
                selectGraphLays.disabled = '';
            }
        });
        g.appendChild(UI.tag('label',{'for':'graphType'},{'innerHTML':'graph type: '}));
        g.appendChild(selectGraphType);

        g.appendChild(UI.tag('hr'));
        
        selectGraphCols = UI.tag('select',{'id':'graphCols'});
        selectGraphCols.appendChild(UI.option('4','4',true));
        selectGraphCols.appendChild(UI.option('8','8'));
        selectGraphCols.appendChild(UI.option('12','12'));
        selectGraphCols.appendChild(UI.option('16','16'));

        g.appendChild(UI.tag('label',{'for':'graphCols'},{'innerHTML':' columns: '}));
        g.appendChild(selectGraphCols);

        selectGraphRows = UI.tag('select',{'id':'graphRows'});
        selectGraphRows.appendChild(UI.option('4','4',true));
        selectGraphRows.appendChild(UI.option('8','8'));
        selectGraphRows.appendChild(UI.option('12','12'));
        selectGraphRows.appendChild(UI.option('16','16'));

        g.appendChild(UI.tag('label',{'for':'graphRows'},{'innerHTML':' rows: '}));
        g.appendChild(selectGraphRows);

//        editGraphLays = UI.tag('input', {
//            'type':'number',
//            'id':'graphLays',
//            'value':1,
//            'min':'1',
//            'max':'9'
//        });
//        editGraphLays.style.width = '3em';

        selectGraphLays = UI.tag('select',{'id':'graphLays'});
        selectGraphLays.appendChild(UI.option('1','1',true));
        for (let i=2; i<10; i++ ) {
            selectGraphLays.appendChild(UI.option(i,i));
        }
        selectGraphLays.disabled = 'disabled';
        g.appendChild(UI.tag('label',{'for':'graphLays'},{'innerHTML':' layers: '}));
        g.appendChild(selectGraphLays);

        g.appendChild(UI.tag('hr'));

        selectGraphKL = UI.tag('select',{'id':'graphKL'});
        selectGraphKL.appendChild(UI.option('1','1'));
        selectGraphKL.appendChild(UI.option('2','2'));
        selectGraphKL.appendChild(UI.option('3','3'));
        selectGraphKL.appendChild(UI.option('4','4',true));

        g.appendChild(UI.tag('label',{'for':'graphKL'},{'innerHTML':'module size: K = '}));
        g.appendChild(selectGraphKL);

        selectGraphKR = UI.tag('select',{'id':'graphKR'});
        selectGraphKR.appendChild(UI.option('1','1'));
        selectGraphKR.appendChild(UI.option('2','2'));
        selectGraphKR.appendChild(UI.option('3','3'));
        selectGraphKR.appendChild(UI.option('4','4',true));

        g.appendChild(UI.tag('label',{'for':'graphKR'},{'innerHTML':', '}));
        g.appendChild(selectGraphKR);

        divSel.appendChild(g);

        divSel.appendChild(UI.tag('div',{'id':'buttons'}));

        ui.appendChild(divSel);

        ui.style.display = "none";
        
        return ui;
    };
    
    function showDialog( type, res ) {
        if (type==='load') {
            ui.querySelector("#buttons").innerHTML = 
                '<input class="actionbutton" id="cplCancelButton" name="cancelButton" type="button" value="Cancel"> \
                 <input class="actionbutton" id="cplCreateButton" name="createButton" type="button" value="Load">';

            ui.querySelector(".titleText").textContent = "Load graph";

        } else {
            ui.querySelector("#buttons").innerHTML = 
                '<input class="actionbutton" id="cplCancelButton" name="cancelButton" type="button" value="Cancel"> \
                 <input class="actionbutton" id="cplCreateButton" name="createButton" type="button" value="Create">';

            ui.querySelector(".titleText").textContent = "New graph";
        }

        ui.style.display = "block";
        ui.querySelector("#cplCreateButton").addEventListener('click', ()=>{
            showSplashAndRun(()=>{
                hideDialog();
                setTimeout(()=>{
                    sgv.createGraph( getGraphTypeAndSize(), res );
                }, 100);
            },true);
        } );

        ui.querySelector("#cplCancelButton").addEventListener('click', ()=>{
            hideDialog();
        } );

        ui.showModal();
    };

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
    function getGraphTypeAndSize() {
        return {
            type: ui.querySelector("#graphType").value,
            size: {
                cols: parseInt(ui.querySelector("#graphCols").value, 10),
                rows: parseInt(ui.querySelector("#graphRows").value, 10),
                lays: parseInt(ui.querySelector("#graphLays").value, 10),
                KL: parseInt(ui.querySelector("#graphKL").value, 10),
                KR: parseInt(ui.querySelector("#graphKR").value, 10)
            }
        };
    };
        
    return {
        show: showDialog,
        hide: hideDialog
    };
};




/* global sgv, UI */

sgv.dlgEdgeProperties = new function() {
    var precontent, content, zeroInfo;
    var hidEdgeId;
    var selectEdgeId, selectScope;
    var checkValueE, editWagaE;
    var btnSetE, btnDeleteE;

    var ui = createUI();
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function createUI() {
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvEdgeProperties", "Edge properties", true);
        
        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialog();
        });

        hidEdgeId = UI.newInput('hidden', '0', '', 'edgeId');
        ui.appendChild(hidEdgeId);

        precontent = UI.tag("div", {'class':'content'});

        selectEdgeId = UI.tag('select',{'id':'selectEdgeId'});
        selectEdgeId.appendChild(UI.tag('option',{'value':0,'selected':true},{'innerHTML':'-- id --'}));
        selectEdgeId.addEventListener('change', function () {
            selectedEdgeId();
        });
        precontent.appendChild(UI.tag('label',{'for':'selectEdgeId'},{'innerHTML':'Edge: '}));
        precontent.appendChild(selectEdgeId);

        ui.appendChild(precontent);

        content = UI.tag("div", {'class':'content'});
        ui.appendChild(content);

        content.appendChild(UI.tag('label',{'for':'nsSelectE'},{'innerHTML':'Scope: '}));

        selectScope = UI.tag('select',{'id':'nsSelectE'});
        selectScope.addEventListener('change', function () {
            changeScopeE();
        });
        content.appendChild(selectScope);


        content.appendChild(document.createElement("br"));

        checkValueE = UI.newInput("checkbox", "", "", "valueCheckE");
        checkValueE.addEventListener('click', function () {
            activateE();
        });
        content.appendChild(checkValueE);

        editWagaE = UI.newInput("number", "0", "", "wagaE");
        content.appendChild(editWagaE);

        btnSetE = UI.newInput("button", "set", "setvaluebutton", "setE");
        btnSetE.addEventListener('click', function () {
            edycjaE();
        });
        content.appendChild(btnSetE);

        btnDeleteE = UI.newInput("button", "delete", "delbutton", "");
        btnDeleteE.addEventListener('click', function () {
            usunE();
        });
        content.appendChild(btnDeleteE);

        content.style['min-width'] = '240px'; 
        content.style['min-height'] = '105px'; 


        zeroInfo = UI.tag("div", {'class':'content'});
        zeroInfo.innerHTML = "Select an edge, please.";
        zeroInfo.style['min-width'] = '240px'; 
        zeroInfo.style['min-height'] = '105px'; 
        ui.appendChild(zeroInfo);
        
        return ui;
    };

    function showDialog(edgeId, x, y) {
        if (typeof edgeId !== 'undefined') {
            edgeId = edgeId.toString();
            hidEdgeId.value = edgeId;
        } else {
            edgeId = hidEdgeId.value;
        }
        
        if ( edgeId === '0' ) {
            content.style.display = 'none';
            zeroInfo.style.display = 'block';
            return;
        } else {
            zeroInfo.style.display = 'none';
            content.style.display = 'block';
        }

        UI.clearSelect(selectEdgeId, false);
        for (const key in sgv.graf.edges) {
            selectEdgeId.appendChild(UI.tag('option',{'value':key},{'innerHTML':"q" + sgv.graf.edges[key].begin + " - q" + sgv.graf.edges[key].end}));
        }
        UI.selectByKey( selectEdgeId, edgeId );

        UI.clearSelect(selectScope, true);
        for (const key in sgv.graf.scopeOfValues) {
            let opt = UI.tag('option',{'value':key},{'innerHTML':sgv.graf.scopeOfValues[key]});
            if ( sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
                opt.selected = "selected";
            }
            selectScope.appendChild(opt);
        }

        let currentValue = sgv.graf.edgeValue(edgeId);
        if (currentValue===null) {
            checkValueE.checked = "";
            editWagaE.value = null;
            editWagaE.disabled = "disabled";
            btnSetE.disabled = "disabled";
        } else {
            checkValueE.checked = "checked";
            editWagaE.value = currentValue;
            editWagaE.disabled = "";
            btnSetE.disabled = "";
        }

        if ((typeof x!=='undefined')&&(typeof y!=='undefined')) {
            let xOffset = sgv.canvas.clientLeft;
            ui.style.top = y + "px";
            ui.style.left = (xOffset + x) + "px";
        }

        ui.style.display = "block";
    };


    function hideDialog() {
        if (ui!==null) ui.style.display = "none";
    };

    function selectedEdgeId() {
        showDialog(event.target.value);
    }

    function changeScopeE() {
        let scopeId = event.target.value;

        let edgeId = ui.querySelector("#edgeId").value;

        let currentValue = sgv.graf.edgeValue(edgeId,sgv.graf.scopeOfValues[scopeId]);
        
        if ((currentValue===null)||isNaN(currentValue)) {
            console.log('NULL');
            checkValueE.checked = "";
            editWagaE.value = null;
            editWagaE.disabled = "disabled";
            btnSetE.disabled = "disabled";
        } else {
            console.log('NOT NULL');
            checkValueE.checked = "checked";
            editWagaE.value = currentValue;
            editWagaE.disabled = "";
            btnSetE.disabled = "";
        }
    };



    function usunE() {
        sgv.graf.delEdge(ui.querySelector("#edgeId").value);
        ui.style.display = "none";
    };

    function edycjaE() {
        let id = ui.querySelector("#edgeId").value;
        let val = parseFloat(editWagaE.value.replace(/,/g, '.'));
        let scope = sgv.graf.scopeOfValues[selectScope.value];
        
        sgv.graf.setEdgeValue(id, val, scope);
        ui.style.display = "none";
    };

    function activateE() {
        let isActive = checkValueE.checked;
        let scope = sgv.graf.scopeOfValues[selectScope.value];
        if (isActive) {
            editWagaE.disabled = "";
            btnSetE.disabled = "";
            let val = parseFloat(editWagaE.value.replace(/,/g, '.'));
            if (val==="") {
                val=0;
                editWagaE.value = val;
            }
            sgv.graf.setEdgeValue(ui.querySelector("#edgeId").value, val, scope);
        } else {
            editWagaE.disabled = "disabled";
            btnSetE.disabled = "disabled";
            sgv.graf.delEdgeValue(ui.querySelector("#edgeId").value, scope);
        }
    };

    return {
        show: showDialog,
        hide: hideDialog,
        isVisible: () => {
            return (ui!==null)&&(ui.style.display === "block");
        }
    };
};

/* global UI, sgv, Edge */

sgv.dlgNodeProperties = new function() {
   
    var hidNodeId;
    var selectNodeId, selectScope, checkValueN, editWagaN;
    var btnSetN, btnConnectN, selectDestN, btnConnectSelectN;
    var checkLabelN, editLabelN;
    var content, zeroInfo;
    
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function createUI() {
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvNodeProperties", "Node properties", true);

        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialog();
        });
        
        
        hidNodeId = UI.newInput('hidden', '0', '', 'nodeId');
        ui.appendChild(hidNodeId);

        var precontent = UI.tag("div", {'class':'content'});

        selectNodeId = UI.tag('select',{'id':'selectNodeId'});
        selectNodeId.appendChild(UI.tag('option',{'value':0,'selected':true},{'innerHTML':'-- id --'}));
        selectNodeId.addEventListener('change', function () {
            selectedNodeId();
        });
        precontent.appendChild(UI.tag('label',{'for':'selectNodeId'},{'innerHTML':'Node: '}));
        precontent.appendChild(selectNodeId);

        ui.appendChild(precontent);


        content = UI.tag("div", {'class':'content'});

        var labelBlock = UI.tag("div");
        checkLabelN = UI.newInput("checkbox", "", "", "checkLabelN");
        checkLabelN.addEventListener('click', function (e) {
            let checked = e.target.checked;

            editLabelN.disabled = checked?"":"disabled";
            sgv.graf.nodes[hidNodeId.value].showLabel(checked);
        });
        labelBlock.appendChild(UI.tag('label',{'for':'checkLabelN'},{'innerHTML':'Label: '}));
        labelBlock.appendChild(checkLabelN);

        editLabelN = UI.newInput("text", "", "", "editLabelN");
        editLabelN.addEventListener('change', function (e) {
            sgv.graf.nodes[hidNodeId.value].setLabel(e.target.value, true);
        });
        labelBlock.appendChild(editLabelN);
        
        content.appendChild(labelBlock);


        selectScope = UI.tag('select',{'id':'nsSelectN'});
        selectScope.addEventListener('change', function () {
            changeScopeN();
        });
        content.appendChild(UI.tag('label',{'for':'nsSelectN'},{'innerHTML':'Scope: '}));
        content.appendChild(selectScope);
        
        content.appendChild(document.createElement("br"));

        checkValueN = UI.newInput("checkbox", "", "", "valueCheckN");
        checkValueN.addEventListener('click', function () {
            activateN();
        });
        content.appendChild(checkValueN);
        
        editWagaN = UI.newInput("number", "0", "", "wagaN");
        content.appendChild(editWagaN);
        
        btnSetN = UI.newInput("button", "set", "setvaluebutton", "setN");
        btnSetN.addEventListener('click', function () {
            edycjaN();
        });
        content.appendChild(btnSetN);
        
        
        content.appendChild(document.createElement("br"));
        
        btnConnectN = UI.newInput("button", "connect to...", "", "connectN");
        btnConnectN.addEventListener('click', function () {
            connectNodes();
        });
        content.appendChild(btnConnectN);

        selectDestN = UI.tag('select',{'id':'destN'});
        content.appendChild(selectDestN);

        btnConnectSelectN = UI.newInput("button", "^", "", "connectSelectN");
        btnConnectSelectN.addEventListener('click', function () {
            connectSelectN();
        });
        content.appendChild(btnConnectSelectN);

        content.appendChild(document.createElement("br"));

        btnDeleteNode = UI.newInput("button", "delete", "delbutton", "");
        btnDeleteNode.addEventListener('click', function () {
            usunN();
        });
        content.appendChild(btnDeleteNode);

        content.style['min-width'] = '240px'; 
        content.style['min-height'] = '105px'; 

        ui.appendChild(content);

        zeroInfo = UI.tag("div", {'class':'content'});
        zeroInfo.innerHTML = "Select a node, please.";
        zeroInfo.style['min-width'] = '240px'; 
        zeroInfo.style['min-height'] = '105px'; 
        ui.appendChild(zeroInfo);
        
        return ui;
    }


    function showDialog(nodeId, x, y) {
        if (typeof nodeId !== 'undefined') {
            nodeId = nodeId.toString();
            hidNodeId.value = nodeId;
        } else {
            nodeId = hidNodeId.value;
        }

        if ( nodeId === '0' ) {
            content.style.display = 'none';
            zeroInfo.style.display = 'block';
            return;
        } else {
            zeroInfo.style.display = 'none';
            content.style.display = 'block';
        }

        hidNodeId.value = nodeId;

        editLabelN.value = sgv.graf.nodes[nodeId].getLabel();
        if ( sgv.graf.nodes[nodeId].isLabelVisible() ) {
            checkLabelN.checked = "checked";
            editLabelN.disabled = "";
        } else {
            checkLabelN.checked = "";
            editLabelN.disabled = "disabled";
        }

        UI.clearSelect(selectScope, true);
        for (const key in sgv.graf.scopeOfValues) {
            var opt = UI.tag('option',{'value':key},{'innerHTML':sgv.graf.scopeOfValues[key]});
            if ( sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
                opt.selected = "selected";
            }
            selectScope.appendChild(opt);
        }


        let currentValue = sgv.graf.nodeValue(nodeId);
        if ((currentValue===null)||isNaN(currentValue)) {
            ui.querySelector("#valueCheckN").checked = "";
            ui.querySelector("#wagaN").value = null;
            ui.querySelector("#wagaN").disabled = "disabled";
            ui.querySelector("#setN").disabled = "disabled";
        } else {
            ui.querySelector("#valueCheckN").checked = "checked";
            ui.querySelector("#wagaN").value = currentValue;
            ui.querySelector("#wagaN").disabled = "";
            ui.querySelector("#setN").disabled = "";
        }

        UI.clearSelect(selectDestN, true);
        UI.clearSelect(selectNodeId, false);

        for (const key in sgv.graf.nodes) {
            let isDifferentId = (key.toString() !== nodeId.toString());

            selectNodeId.appendChild(UI.tag('option',{'value':key},{'innerHTML':"q" + key}));
            
            if (isDifferentId) {
                 selectDestN.appendChild(UI.tag('option',{'value':key},{'innerHTML':"q" + key}));
            }
        }
        
        UI.selectByKey( selectNodeId, nodeId );

        if ((typeof x!=='undefined')&&(typeof y!=='undefined')) {
            let xOffset = sgv.canvas.clientLeft;

            ui.style.top = y + "px";
            ui.style.left = (xOffset + x) + "px";
        }

        ui.style.display = "block";
    };
    
    
    
    
    function hideDialog() {
        if (ui!==null) ui.style.display = "none";
    }
    
    
    function selectedNodeId() {
        showDialog(event.target.value);
    }
    

    function usunN() {
        sgv.graf.delNode(hidNodeId.value);
        ui.style.display = "none";
    };


    function changeScopeN() {
        console.log('changeScopeN: ' + event.target.value);

        let nodeId = ui.querySelector("#nodeId").value;

        let currentValue = sgv.graf.nodeValue(nodeId,sgv.graf.scopeOfValues[event.target.value]);
        if ((currentValue===null)||isNaN(currentValue)) {
            console.log('NULL');
            ui.querySelector("#valueCheckN").checked = "";
            ui.querySelector("#wagaN").value = null;
            ui.querySelector("#wagaN").disabled = "disabled";
            ui.querySelector("#setN").disabled = "disabled";
        } else {
            console.log('NOT NULL');
            ui.querySelector("#valueCheckN").checked = "checked";
            ui.querySelector("#wagaN").value = currentValue;
            ui.querySelector("#wagaN").disabled = "";
            ui.querySelector("#setN").disabled = "";
        }
    };


    function edycjaN() {
        let id = ui.querySelector("#nodeId").value;
        let val = parseFloat(ui.querySelector("#wagaN").value.replace(/,/g, '.'));
        let scope = sgv.graf.scopeOfValues[ui.querySelector("#nsSelectN").value];
        sgv.graf.setNodeValue(id, val, scope);
        ui.style.display = "none";
        sgv.SPS.refresh();
    };

    function activateN() {
        let scope = sgv.graf.scopeOfValues[ui.querySelector("#nsSelectN").value];
        let isActive = ui.querySelector("#valueCheckN").checked;
        if (isActive) {
            ui.querySelector("#wagaN").disabled = "";
            ui.querySelector("#setN").disabled = "";
            let val = parseFloat(ui.querySelector("#wagaN").value.replace(/,/g, '.'));
            if (val==="") {
                val=0;
                ui.querySelector("#wagaN").value = val;
            }
            sgv.graf.setNodeValue(ui.querySelector("#nodeId").value, val, scope);
        } else {
            ui.querySelector("#wagaN").disabled = "disabled";
            ui.querySelector("#setN").disabled = "disabled";
            sgv.graf.delNodeValue(ui.querySelector("#nodeId").value, scope);
        }
        sgv.SPS.refresh();
    };
    
    function connectSelectN() {
        sgv.nodeToConnect = parseInt(ui.querySelector("#nodeId").value, 10);
        ui.style.display = "none";
    };

    function connectNodes() {
        var node1 = ui.querySelector("#nodeId").value;
        var node2 = ui.querySelector("#destN").value;

        if (sgv.graf !== null) {
            sgv.graf.addEdge(node1, node2);
            sgv.SPS.refresh();
        }
    };
    
    return {
        show: showDialog,
        hide: hideDialog,
        isVisible: () => {
            return (ui!==null)&&(ui.style.display === "block");
        }
    };
    
};

/* global sgv, UI, FileIO */

sgv.dlgAlternateFileSave = new function() {
    var selectType, selectName, spanExt;
    var btnCancel, btnSave;
    
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function createUI() {
        //let ui = UI.createEmptyWindow("sgvUIwindow sgvModalDialog", "sgvSaveGraphDlg", "Save graph", true);
        let ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgAltSaveGraph" });
        
        let tt = UI.createTitlebar("Save graph", false);
        ui.appendChild(tt);

        content = UI.tag("div", {'class':'content'});

        content.appendChild(UI.tag("div",{},{
            'style':'max-width:400px',
            'textContent':
"Your browser does not allow us to open the system window for selecting a file to save. \
Please select the file format and its name and click Save button. \
Depending on your browser's settings, the file will be saved in \
the default location (usually: Downloads) or a selection window will appear."
        }));
        
        content.appendChild(UI.tag("hr"));
        
        let t = UI.tag("div");
        selectType = UI.tag( "select", {'id': "savSelectType" } );
        selectType.appendChild(UI.option('.txt','TXT'));
        selectType.appendChild(UI.option('.gexf','GEXF'));
        selectType.addEventListener('change', (e) => {
            spanExt.textContent = e.target.value;
        });
        t.appendChild(UI.tag('label',{'for':'savSelectType'},{'innerHTML':'Select format: '}));
        t.appendChild( selectType );
        content.appendChild(t);

        let n = UI.tag("div");
        selectName = UI.tag( "input", {'type':'text', 'id': 'savSelectName', 'value':'filename' } );
        n.appendChild(UI.tag('label',{'for':'savSelectname'},{'innerHTML':'Select filename: '}));
        n.appendChild( selectName );
        spanExt = UI.tag("span",{},{'textContent':'.txt'});
        n.appendChild( spanExt );
        content.appendChild(n);

        btnCancel = UI.newInput("button", "cancel", "actionbutton", "");
        btnCancel.addEventListener('click', function () {
            hideDialog();
        });
        content.appendChild(btnCancel);

        btnSave = UI.newInput("button", "save", "actionbutton", "");
        btnSave.addEventListener('click', function () {
            FileIO.alternateSave(selectName.value, spanExt.textContent);
            hideDialog();
        });
        content.appendChild(btnSave);
        
        ui.appendChild(content);
        
        ui.style.display = "none";
        return ui;
    };
    
    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
    function showDialog() {
        ui.style.display = "block";
        ui.showModal();
    };
    
    return {
        show: showDialog,
        hide: hideDialog
    };
};


/* global sgv, UI */

sgv.dlgMissingNodes = new function() {
    
    var misN;
    var ui = createUI('sgvMissingNodes');

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });


    function createUI(id) {
        let o = UI.createEmptyWindow("sgvUIwindow", id, "removed nodes", true);

        var content = UI.tag("div", {'class':'content'});
        misN = UI.tag("div", {'id':'misN'});
        content.appendChild(misN);

        var del = UI.newInput("button", "clear history", "delbutton", "");
        del.addEventListener('click', function () {
            delMissingX();
        });
        content.appendChild(del);

        o.appendChild(content);
        return o;
    };

    function addNodeX(nodeId) {
        let i = UI.newInput("button", " q" + nodeId + " ", "", "rest" + nodeId );

        i.addEventListener('click', function () {
            restoreNodeX(nodeId);
        });
        
        misN.appendChild(i);
        
        ui.style.display = "block";
    };
    
    function restoreNodeX(nodeId) {
        if (sgv.graf.restoreNode(nodeId)) {
            let but = ui.querySelector("#rest" + nodeId);
            but.parentNode.removeChild(but);
            
            return true;
        }
        return false;
    };
    
    function delMissingX() {
        misN.innerHTML = "";

        if (sgv.graf !== null) {
            sgv.graf.missing = {};
        }

        ui.style.display = "none";
    };

    
    return {
        show: ()=>{ui.style.display = "block";},
        hide: ()=>{ui.style.display = "none";},
        addNode: addNodeX,
        restoreNode: restoreNodeX,
        delAll: delMissingX
    };

};


sgv.dlgAbout = new function() {
    var ui = null;

    function createDialog() {
        if (ui===null) {
            ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgAbout" });
        }
        
        var content = UI.tag( "div", { "class": "content" });

        content.style['text-align'] = 'center';
        content.style.width = 'fit-content';
        content.innerHTML += '<div><img src="pics/EuroHPC.jpg"></div>';
        content.innerHTML += '<div>Narodowa Infrastruktura Superkomputerowa dla EuroHPC - EuroHPC PL</div>';
        content.innerHTML += '<div class="info">simGraphVisualizer v.1.0</div>';
        content.innerHTML += '<div><img src="pics/Flagi.jpg"></div>';

        let btn = UI.tag( "input", {
            'type':     "button",
            'value':    "Close",
            'class':    "actionbutton",
            'id':       "closeButton",
            'name':     "closeButton"
        });
        content.appendChild(btn);

        btn.addEventListener('click', function () {
            hideDialog();
        });

        let t = UI.createTitlebar("About", false);
        ui.appendChild(t);
        ui.appendChild(content);

        ui.style.display = "none";
        window.document.body.appendChild(ui);
    };

    function showDialog() {
        if (ui===null) {
            createDialog();
        }
        ui.style.display = "block";

        ui.showModal();
    };

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };


    return {
        //ui: ui,
        create: createDialog,
        show: showDialog,
        hide: hideDialog
    };
};




/* global sgv, UI */

sgv.dlgLoaderSplash = new function() {
    var ui = null;
    var info;
    
    function createDialog() {
        if (ui===null) {
            ui = UI.tag( "dialog", { "class": "sgvModalDialog", "id": "loaderSplash" });
        }
        
        ui.appendChild(UI.tag('span',{},{'textContent':'working hard for you'}));
        ui.appendChild(UI.tag('div',{'class':'loader'}));
        ui.appendChild(UI.tag('span',{},{'textContent':'... please wait ...'}));
        ui.appendChild(info = UI.tag('div',{'id':'infoBlock'}));

        ui.style.display = "none";
        window.document.body.appendChild(ui);
    };

    function showDialog() {
        if (ui===null) createDialog();
        if (ui.open) ui.close();
        
        ui.style.display = "block";
        ui.showModal();
    };

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };

    function setInfoX(text,action) {
        if (ui.open) ui.close();
            ui.style.display = "block";
        ui.showModal();
        info.innerHTML = text;
        if (typeof action==='function'){
            setTimeout( ()=>{
                action();
            }, 200);
        }
    };
    
    return {
        setInfo: setInfoX,
        show: showDialog,
        hide: hideDialog
    };
};


function  showSplash() {
    sgv.dlgLoaderSplash.show();
};

function hideSplash() {
    setTimeout(function () {
        sgv.dlgLoaderSplash.hide();
    }, 200);
};

function showSplashAndRun(f,noHide) {
    if (typeof noHide==='undefined')
        noHide = false;
    
    showSplash();
    setTimeout(()=>{
        f();
        if (!noHide) hideSplash();
    }, 100);
};
