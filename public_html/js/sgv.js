/* global BABYLON, sgv */

const DEMO_MODE = false;

function getRandom(min, max) {
    return (min + (Math.random() * (max - min)));
};


function valueToColor(val) {
    if ((typeof val ==='undefined')||(val === null)|| isNaN(val)) {
        return new BABYLON.Color3(0.9, 0.9, 0.9);
    };
    
    if (DEMO_MODE) {
        if (val===0) return new BABYLON.Color3(0.0, 0.0, 1.0);
        else if (val===-1) return new BABYLON.Color3(1.0, 0.0, 0.0);
        else if (val===1) return new BABYLON.Color3(0.0, 1.0, 0.0);
        else if (val===0.5) return new BABYLON.Color3(1.0, 0.65, 0.0);
        else if (val===-0.5) return new BABYLON.Color3(1.0, 0.0, 1.0);
        else return new BABYLON.Color3(0.9, 0.9, 0.9);
    }


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

function valueToColorBAK(val) {
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
    if (DEMO_MODE) return 0.2;
    
    if ((typeof val ==='undefined')||(val === null)|| isNaN(val)) {
        return 0.2;
    };

    let max = Math.abs(sgv.graf.greenLimit);
    let min = Math.abs(sgv.graf.redLimit);

    max = (max>min)?max:min;
    
    if ((val===0)||(max===0)) return 0.2;
    
    val = Math.abs(val);
    
    if (val>max){
        return 1.2;
    }
    
    return 0.2 + ( val / max );
}

//function PitchYawRollToMoveBetweenPointsToRef(start, target, ref) {
//    const diff = BABYLON.TmpVectors.Vector3[0];
//    target.subtractToRef(start, diff);
//    ref.y = Math.atan2(diff.x, diff.z) || 0;
//    ref.x = Math.atan2(Math.sqrt(diff.x ** 2 + diff.z ** 2), diff.y) || 0;
//    ref.z = 0;
//    return ref;
//}

//function PitchYawRollToMoveBetweenPoints(start, target) {
//    const ref = BABYLON.Vector3.Zero();
//    return PitchYawRollToMoveBetweenPointsToRef(start, target, ref);
//}

var isMobile = false;

function detectClient() {
    //console.log(navigator.userAgent);
    //if(navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) {}
    let ua = navigator.userAgent.toLowerCase();
    isMobile = ( ua.indexOf("android") > -1 )
            || ( ua.indexOf("blackberry") > -1 )
            || ( ua.indexOf("iemobile") > -1 )
            || ( ua.indexOf("opera mini") > -1 )
            || ( ua.indexOf("iphone") > -1 )
            || ( ua.indexOf("ipod") > -1 )
            || ( ua.indexOf("ipad") > -1 );
}


detectClient();

window.addEventListener('load', () => {
    var r = document.querySelector(':root');
    var linkElement = this.document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    if (isMobile) {
        linkElement.setAttribute('href', "css/mobile.css");
        r.style.setProperty('--isMobile', 1);
        r.style.setProperty('@mobile', 1);
    }
    else {
        linkElement.setAttribute('href', "css/desktop.css");
        r.style.setProperty('--isMobile', 0);
    }
    document.head.appendChild(linkElement);
});

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

const SVG = {};

SVG.NS = "http://www.w3.org/2000/svg";

SVG.createSVG = (_id, _width, _height, _onClick ) => {
    let svgView = document.createElementNS(SVG.NS, "svg");
    svgView.setAttributeNS(null, "id", _id);
    svgView.setAttributeNS(null, "height", _height);
    svgView.setAttributeNS(null, "width", _width);
    //svgView.setAttributeNS(null, "viewBox", "0 0 250 250");
    
    if (typeof _onClick === 'function') {
        svgView.addEventListener('click', _onClick);
    }

    svgView.style.display = 'block';
    return svgView;
};

SVG.createSVG2 = (_id, _width, _height, _onClick ) => {
    let svgView = document.createElementNS(SVG.NS, "svg");
    svgView.setAttributeNS(null, "id", _id);
    //svgView.setAttributeNS(null, "height", _height);
    //svgView.setAttributeNS(null, "width", _width);
    svgView.setAttributeNS(null, "viewBox", "0 0 "+_width+" "+_height);
    
    if (typeof _onClick === 'function') {
        svgView.addEventListener('click', _onClick);
    }

    svgView.style.display = 'block';
    return svgView;
};

SVG.drawSvgText = (svgView, id, x, y, txt, txtColor, bgColor, onClick) => {
    var text = document.createElementNS(SVG.NS, 'text');
    text.setAttributeNS(null, 'id', 'text_' + id);
    text.setAttributeNS(null, 'x', x);
    text.setAttributeNS(null, 'y', y);
    text.setAttributeNS(null, 'text-anchor', 'middle');
    text.setAttributeNS(null, 'alignment-baseline', 'middle');
    //text.setAttributeNS(null, 'stroke', txtColor);
    //text.setAttributeNS(null, 'stroke-width', '0');
    text.setAttributeNS(null, 'font-size', '12px');
    text.setAttributeNS(null, 'font-family', 'Arial, Helvetica, sans-serif');
    text.setAttributeNS(null, 'fill', txtColor);
    //text.setAttributeNS(null, 'fill-opacity', '1');
    text.textContent = txt;
    svgView.appendChild(text);

    text.addEventListener('click', onClick);

    if (bgColor !== '') {
        //let bbox = text.getBBox();
        //let bbox = text.getComputedTextLength();
        let w = 24; //bbox.width + 4;
        let h = 12; //bbox.height + 4;
        var rect = document.createElementNS(SVG.NS, 'rect');
        rect.setAttributeNS(null, 'id', 'textBG_' + id);
        rect.setAttributeNS(null, "x", x - w/2);
        rect.setAttributeNS(null, "y", y - (1 + h/2));
        rect.setAttributeNS(null, "width", w);
        rect.setAttributeNS(null, "height", h);
        rect.setAttributeNS(null, "fill", bgColor);
        svgView.insertBefore(rect, text);

        rect.addEventListener('click', onClick);
    }
};


SVG.drawSvgNode = (svgView, nodeId, x, y, r, color, onClick) => {
    var circle = document.createElementNS(SVG.NS, 'circle');
    circle.setAttributeNS(null, 'id', 'node_' + nodeId);
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', r);
    //circle.setAttributeNS(null, 'style', 'fill: ' + color + '; stroke: black; stroke-width: 1px;');
    circle.setAttributeNS(null, 'fill', color);
    circle.setAttributeNS(null, 'stroke', 'black');
    circle.setAttributeNS(null, 'stroke-width', '1');
    svgView.appendChild(circle);

    circle.addEventListener('click', onClick);
};


SVG.drawSvgEdge = (svgView, eid, bX, bY, eX, eY, color, wth, onClick) => {
    var newLine = document.createElementNS(SVG.NS, 'line');
    newLine.setAttributeNS(null, 'id', 'edge_' + eid);
    newLine.setAttributeNS(null, 'x1', bX);
    newLine.setAttributeNS(null, 'y1', bY);
    newLine.setAttributeNS(null, 'x2', eX);
    newLine.setAttributeNS(null, 'y2', eY);
    //newLine.setAttributeNS(null, 'style', 'stroke: ' + color + '; stroke-width: ' + wth + 'px;');
    newLine.setAttributeNS(null, 'stroke', color);
    newLine.setAttributeNS(null, 'stroke-width', wth);
    svgView.appendChild(newLine);

    newLine.addEventListener('click', onClick);
};



/* global sgv */

var Dispatcher = {};

Dispatcher.graphDeleted = ()=>{
    sgv.SPS.reset();
    sgv.SPS.refresh();
    sgv.dlgMissingNodes.delAll();
    sgv.dlgCPL.setModeSelection();
    sgv.dlgCellView.hide();

    //interface to desktop application
    enableMenu('menuGraphSave', false);
    enableMenu('menuGraphClear', false);
    enableMenu('menuViewDisplayMode', false);
    enableMenu('menuViewCellView', false);
};

Dispatcher.graphCreated = ()=>{
    sgv.dlgCellView.hide();
    sgv.dlgCPL.setModeDescription();
    sgv.graf.displayValues();
    hideSplash();
    
    //interface to desktop application
    enableMenu('menuGraphSave', true);
    enableMenu('menuGraphClear', true);
    enableMenu('menuViewDisplayMode', true);
    enableMenu('menuViewCellView', true);
};

Dispatcher.graphChanged = ()=>{
    sgv.dlgCPL.refresh();
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

Dispatcher.currentScopeChanged = ()=>{
    sgv.dlgCPL.refresh();
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

Dispatcher.viewModeChanged = ()=>{
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

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
    
    function initX(nbN, nbE) {
        if (typeof nbN !== 'number') nbN = 100;
        if (typeof nbE !== 'number') nbE = 500;

        NodeSPS.addShape(defaultSphere, nbN);
        NodeSPSmesh = NodeSPS.buildMesh();

        for (let i=0; i<nbN; i++){
            NodeSPS.particles[i].isVisible = false;
        }

        EdgeSPS.addShape(defaultCylinder, nbE);
        EdgeSPSmesh = EdgeSPS.buildMesh();

        for (let i=0; i<nbE; i++){
            EdgeSPS.particles[i].isVisible = false;
        }

        refreshX();
    };

    function addSpaceForEdgesX(nb) {
        if (typeof nb !== 'number') nb = 500;

        let size = EdgeSPS.nbParticles;
        
        EdgeSPS.addShape(defaultCylinder, nb);
        EdgeSPSmesh = EdgeSPS.buildMesh();

        for (let i=size; i<(size+nb); i++){
            EdgeSPS.particles[i].isVisible = false;
        }
        
        //console.log('EdgeSPS: ',EdgeSPS.nbParticles);
    }
        
    function addSpaceForNodesX(nb) {
        if (typeof nb !== 'number') nb = 100;
        
        let size = NodeSPS.nbParticles;

        NodeSPS.addShape(defaultSphere, nb);
        NodeSPSmesh = NodeSPS.buildMesh();

        for (let i=size; i<(size+nb); i++){
            NodeSPS.particles[i].isVisible = false;
        }

        //console.log('NodeSPS: ',NodeSPS.nbParticles);
    }

    function refreshNodesX() {
        NodeSPS.setParticles();
        NodeSPS.refreshVisibleSize();
    };

    function refreshEdgesX() {
        EdgeSPS.setParticles();
        EdgeSPS.refreshVisibleSize();
    };

    function refreshX() {
        refreshNodesX();
        refreshEdgesX();
    };
    
    function _uniqueNodeId() {
//        if (nKilled.length>0) {
//            return nKilled.pop();
//        }

        let id = nCnt++;
        let size = NodeSPS.nbParticles;
        if (id>=size) addSpaceForNodesX(100);
        return id;
    };
    
    function _uniqueEdgeId() {
//        if (eKilled.length>0) {
//            return eKilled.pop();
//        }

        let id = eCnt++;
        let size = EdgeSPS.nbParticles;
        if (id>=size) addSpaceForEdgesX(500);
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

        //mesh.rotation = PitchYawRollToMoveBetweenPoints(b, e);
        mesh.rotation = BABYLON.Vector3.PitchYawRollToMoveBetweenPoints(b, e);
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
        refreshNodes: refreshNodesX,
        refreshEdges: refreshEdgesX,
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

var GraphSize = (function(c, r, l, kl, kr) {
        this.cols = c;
        this.rows = r;
        this.lays = l;
        this.KL = kl;
        this.KR = kr;
});

var GraphDescr = (function() {
    this.size = new GraphSize(0,0,0,0,0);

    this.set = function(_t, _c, _r, _l, _kl, _kr) {
        this.setType(_t);
        this.setSize(_c, _r, _l, _kl, _kr);
    };
    
    this.setType = function(_t) {
        this.type = _t;
    };

    this.setSize = function(_c, _r, _l, _kl, _kr) {
        this.size = new GraphSize( _c, _r, _l, _kl, _kr );
    };
});


var TempGraphStructure = (function() {
    this.nodes = [];
    this.edges = [];
    
    this.addEdge1 = function(_n1, _n2, _value) {
        this.edges.push({
            n1: _n1,
            n2: _n2,
            values: {
                'default': _value
            }
        });
    };

    this.addEdge2 = function(_n1, _n2, _values) {
        this.edges.push({
            n1: _n1,
            n2: _n2,
            values: _values
        });
    };
    
    this.addNode1 = function(_id, _value, _label) {
        let node = {
            id: _id,
            values: {
                'default': _value
            },
            label: null
        };
        
        if (typeof _label !== 'undefined') {
            node.label = {
                text: _label,
                enabled: true
            };
        }
        
        this.nodes.push( node );
    };

    this.addNode2 = function(_id, _values, _label) {
        let node = {
            id: _id,
            values: _values,
            label: null
        };
        
        if (typeof _label !== 'undefined') {
            node.label = {
                text: _label,
                enabled: true
            };
        }
        
        this.nodes.push( node );
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

/* global BABYLON, sgv */

/**
 * Class Label
 * @param {Number|String} labelId is usually Node.id
 * @param {String} txt text to be displayed
 * @param {BABYLON.Vector3} position position over which the label is to be displayed
 * @returns {Label}
 */
var Label = (function (labelId, txt, position) {
    /**
     * @param {BABYLON.Vector3} position
     * @param {boolean} enabled
     * @returns {undefined}
     */
    this.createMe = async function (position, enabled) {
        this.plane = this.createPlane();
        this.plane.position = position.add(this.planeOffset);
        this.plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        this.plane.setEnabled(enabled);
        this.plane.isPickable = false;
    };

    /**
     * @param {string} txt
     * @param {boolean} enabled
     * @returns {undefined}
     */
    this.setText = async function(txt, enabled) {
        this.text = txt;
        
        if (this.plane!==null)
            this.plane.dispose();
        
        this.createMe(this.position, enabled);
    };
    
    /**
     * @returns {string}
     */
    this.getText = function() {
        return this.text;
    };
    
    /**
     * @param {BABYLON.Vector3} position
     * @returns {undefined}
     */
    this.setPosition = function(pos) {
        this.position = pos;
        
        if (this.plane !==null)
            this.plane.position = pos.add(this.planeOffset);
    };

    /**
     * @returns {BABYLON.Plane}
     */
    this.createPlane = function() {
        let font_size = 64;
        let font = "normal " + font_size + "px Arial,Helvetica,sans-serif";

        let ratio = 0.05;

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
     * @param {boolean} b
     * @returns {undefined}
     */
    this.setEnabled = function (b) {
        if (this.plane!==null)
            this.plane.setEnabled(b);
        else if (b) {
            this.createMe(this.position, true);
        }
    };

    this.text = txt;
    this.planeOffset = new BABYLON.Vector3(0.0, 5.0, 0.0);
    this.position = position;
    this.id = labelId;
    this.plane = null;
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

const createLabel = function(id, position) {
    return new Label("q" + id, "q" + id, position);
};

var Node = /** @class */ (function(graf, id, x, y, z, _values) {
    var name = "node:" + id;

    this.parentGraph = graf;
    
    if (typeof id==='string') id = parseInt(id,10); 
    if (typeof id !== 'number')
        console.warning("Node id should be a number, but is: "+id);
    
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
            if (label.plane !== null) {
                label.plane.position.copyFrom(pos);
            }
        }
    });

    this.dispose = function() {
        sgv.SPS.unbindNode(this);
        
        if ((label!==null) && (label.plane!==null)) {
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
        var label = createLabel(this.id, this.mesh.position);
    }

});

Node.fromQDescr = (graf, qd)=>{
    let pos = graf.calcPosition2(qd.x, qd.y, qd.z, qd.n0());
    return new Node(graf, qd.toNodeId(graf.rows, graf.cols), pos.x, pos.y, pos.z );
};

Node.fromXYZIJK = (graf, x, y, z, i, j, k)=>{
    return Node.fromQDescr(graf, qD(x,y,z,i,j,k));
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
/* global BABYLON, sgv */

var Edge = /** @class */ (function (graf, b, e) {
    this.parentGraph = graf;

    this.values = {
        'default' : Number.NaN
    };

    if (typeof b==='string') b = parseInt(b,10); 
    if (typeof e==='string') e = parseInt(e,10); 

    if ((typeof b !== 'number')||(typeof e !== 'number'))
        console.warning("Edge begin and end ids should be both a numbers, but are: "+b+" and "+e);

    if (!(b in this.parentGraph.nodes))
        console.warning("First node not exists in graph: "+b);

    if (!(e in this.parentGraph.nodes))
        console.warning("Second node not exists in graph: "+e);

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
Edge.calcId = (b, e) => {
    if (typeof b==='string') b = parseInt(b,10); 
    if (typeof e==='string') e = parseInt(e,10); 

    if ((typeof b !== 'number')||(typeof e !== 'number')) {
        console.error("Edge begin and end must be a numbers");
    }
    
    return (b < e)?("" + b + "," + e):("" + e + "," + b);
};


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

/*
 * @class QbDescr
 * @param {Int} x
 * @param {Int} y
 * @param {Int} z
 * @param {[0,1]} i
 * @param {[0,1]} j
 * @param {[0,1]} k
 */
const QbDescr = (function (x, y, z, i, j, k) {
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
    this.toNodeId = function(rows, cols) {
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

    let z = Math.floor(modId / layerSize);

    let modIdInLayer = modId % layerSize;
    let y = Math.floor(modIdInLayer / cols);
    let x = modIdInLayer % cols;
    let q =new QbDescr(x, y, z, i, j, k);
    
    return q;
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
/* global BABYLON, labelsVisible, sgv, Edge, Dispatcher, QbDescr, TempGraphStructure, GraphDescr */

const Graph = /** @class */ (function () {
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
        
        Dispatcher.graphDeleted();
    };

    this.clear = function () {
        this.dispose();
    };

    this.maxNodeId = function () {
        return Object.keys(this.nodes).length;
    };


    this.addNode = function(nodeId, val) {
        values = {};
        
        if (typeof val==='number') {
            values['default'] = val;
        }
        
        let pos = this.calcPosition(nodeId);
        
        let n = new Node(this, nodeId, pos.x, pos.y, pos.z, values);
        n.showLabel(false);
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
        
        Dispatcher.graphChanged();
    };

    this.findAllConnected = (nodeId) => {
        var connected = {
                //all: [],
                internal: [],
                horizontal: [],
                vertical: [],
                up: [],
                down: [],
                other: []
            };

        function add(n2) {
            let q1 = QbDescr.fromNodeId(nodeId, sgv.graf.rows, sgv.graf.cols);
            let q2 = QbDescr.fromNodeId(n2, sgv.graf.rows, sgv.graf.cols);

            if ((q1.x===q2.x)&&(q1.y===q2.y)&&(q1.z===q2.z)) {
                connected.internal.push(n2);
            }
            else if ((q1.x!==q2.x)&&(q1.y===q2.y)&&(q1.z===q2.z)) {
                connected.horizontal.push(n2);
            }
            else if ((q1.x===q2.x)&&(q1.y!==q2.y)&&(q1.z===q2.z)) {
                connected.vertical.push(n2);
            }
            else if (q1.z<q2.z) {
                connected.up.push(n2);
            }
            else if (q1.z>q2.z) {
                connected.down.push(n2);
            }
            else {
                connected.other.push(n2);
            }
        }

        //console.log("graf.findEdges", nodeId);
        for (const key in this.edges) {
            if (this.edges[key].begin == nodeId) {
                add( this.edges[key].end );
            } else if (this.edges[key].end == nodeId) {
                add( this.edges[key].begin );
            }
        }

        return connected;
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
        
        Dispatcher.graphChanged();
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
                console.log(e);
                for (const vKey in this.missing[nodeId].edges[nKey].values) {
                    e.setValue(this.missing[nodeId].edges[nKey].values[vKey],vKey);    
                }
                
                this.edges[e.id] = e;
                console.log(e.id);
            } 
            else if (nKey in this.missing) {
                this.missing[nKey].edges[nodeId] = this.missing[nodeId].edges[nKey];
            }
        }

        delete this.missing[nodeId];

        if (Object.keys(this.missing).length === 0)
            sgv.dlgMissingNodes.hide();
        
        Dispatcher.graphChanged();
        
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
        
        Dispatcher.currentScopeChanged();

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


    this.setDisplayMode = function () {
        for (const key in this.nodes) {
            this.nodes[key].position = this.calcPosition(key);
        }

        for (const key in this.edges) {
            this.edges[key].update();
        }

        Dispatcher.viewModeChanged();
    };
    
    this.showLabels = function (b) {
        this.labelsVisible = b;
        for (const key in this.nodes) {
            this.nodes[key].showLabel();
        }
    };

    
    this.createStructureFromTempStruct = function (struct) {
        return new Promise((resolve)=>{
            for (let tmpNode of struct.nodes){
                let n = this.addNode(tmpNode.id);
                n.values = tmpNode.values;
                if (tmpNode.label !== null) {
                    n.setLabel(tmpNode.label.text, tmpNode.label.enabled);
                } else {
                    n.showLabel(false);
                }
            }

            for (let tmpEdge of struct.edges){
                let e = this.addEdge(tmpEdge.n1, tmpEdge.n2);
                e.values = tmpEdge.values;
            }

            this.showLabels(true);
            resolve('ok');
        });
    };

});

Graph.displayModes = [ 'classic', 'triangle', 'diamond' ];
Graph.currentDisplayMode = 'classic';

Graph.switchDisplayMode = ()=>{
    if (sgv.graf === null) {
        console.warning('graf not defined');
        return;
    }

    let idx = Graph.displayModes.indexOf(Graph.currentDisplayMode) + 1;
    if (idx===Graph.displayModes.length) idx=0;
    Graph.currentDisplayMode = Graph.displayModes[idx];

    sgv.graf.setDisplayMode();
};

Graph.knownGraphTypes = {};
Graph.registerType = (txt,Type)=>{Graph.knownGraphTypes[txt] = Type;};
Graph.knowType = (txt)=>(txt in Graph.knownGraphTypes);


/**
 * @param {GraphDescr} gDesc - Graph structure description
 * @param {TempGraphStructure} struct - optional Graph data
 */
Graph.create = (gDesc, struct)=>{
    Graph.remove();
    if (gDesc instanceof GraphDescr){
        if (gDesc.type in Graph.knownGraphTypes) {
            sgv.graf = new Graph.knownGraphTypes[gDesc.type](gDesc.size);
        } else {
            console.error('unknown graph type');
            return;
        }
    } else {
        console.error('unknown graph type');
        return;
    }
    
    if (struct instanceof TempGraphStructure){
        sgv.graf.createStructureFromTempStruct(struct)
                .then(()=>Dispatcher.graphCreated());
    }
    else {
        sgv.graf.createDefaultStructure(()=>Dispatcher.graphCreated());
    }
    
};

Graph.remove = ()=>{
    if (sgv.graf !== null) {
        sgv.graf.dispose();
        sgv.graf = null;
        
        Dispatcher.graphDeleted();
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

/* global Graph, BABYLON, sgv, QbDescr, qD, GraphSize */
"use strict";

const Chimera = /** @class */ (function (gSize) {
    Graph.call(this);

    this.type = 'chimera';

    this.setSize = function(gSize) {
        if (gSize instanceof GraphSize) {
            this.cols = gSize.cols;
            this.rows = gSize.rows;
            this.layers = gSize.lays;
            this.KL = gSize.KL;
            this.KR = gSize.KR;
        }
        else {
            this.cols = 2;
            this.rows = 2;
            this.layers = 1;
            this.KL = 4;
            this.KR = 4;
        }
    };

    this.setSize(gSize);

    this.maxNodeId = function () {
        return this.cols * this.rows * 8;
    };


    /*
     * @param {QbDescr} qdA
     * @param {QbDescr} qdB
     * @param {Number} value
     */
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

    this.connectVertical = function (x, y, z) {
        for (let j of [0,1]) {
            for (let k of [0,1]) {
                // eq3
                this.connect(new QbDescr(x, y, z, 0, j, k), new QbDescr(x, y + 1, z, 0, j, k));
            }
        }
    };

    this.connectHorizontal = function (x, y, z) {
        for (let j of [0,1]) {
            for (let k of [0,1]) {
                // eq2
                this.connect(new QbDescr(x, y, z, 1, j, k), new QbDescr(x + 1, y, z, 1, j, k));
            }
        }
    };

    this.connectInternalChimeraEdges = function (x, y, z) {
        let v;

//        if (DEMO_MODE) {
//            v = -0.5;
//        } else {
            v = Number.NaN;
//        }

        for (let jA of [0, 1]) {
            for (let kA of [0, 1]) {
                for (let jB of [0, 1]) {
                    for (let kB of [0, 1]) {
                        // eq1
                        this.connect(new QbDescr(x, y, z, 0, jA, kA), new QbDescr(x, y, z, 1, jB, kB), v);
                    }
                }
            }
        }

    };

    this.modulePositionTEST = function( x, y, z ) {
        let d = 50.0;
        let mX = (d * ( ( this.rows - 1 ) / 2.0 ))-(d * x);
        let mY = (d * y) - (d * ( ( this.cols - 1 ) / 2.0 ));
        let mZ = ( d * z ) - (d*((this.layers - 1) / 2.0));
        return new BABYLON.Vector3(mX, mZ, mY);
    };

    this.modulePosition = function( x, y, z ) {
        let d = 50.0;
        let mX = (d * ( ( this.cols - 1 ) / 2.0 ))-(d * y);
        let mY = (d * x) - (d * ( ( this.rows - 1 ) / 2.0 ));
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


    this.addNodeXYZIJK = function(x,y,z,i,j,k) {
        return this.addNode(qD(x,y,z,i,j,k).toNodeId(this.rows, this.cols));
    };

    this.addNodeXYZn = function(x,y,z,n) {
        return this.addNode(qD(x,y,z,(n>>2)&1,(n>>1)&1,n&1).toNodeId(this.rows, this.cols));
    };

    this.createModuleNodes = function (x, y, z) {
        for (let n = 0; n < this.KL; n++) {
            this.addNodeXYZn(x,y,z,n);
        }
        for (let n = 0; n < this.KR; n++) {
            this.addNodeXYZn(x,y,z,n+4);
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


        return nodeOffset[Graph.currentDisplayMode][idx];
    };

    this.verticalConnections = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < (this.rows - 1); y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.connectVertical(x, y, z);
                }
            }
        }
    };

    this.horizontalConnections = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < (this.cols - 1); x++) {
                    this.connectHorizontal(x, y, z);
                }
            }
        }
    };

    this.createModules = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.createModuleNodes(x, y, z);
                    this.connectInternalChimeraEdges(x, y, z);
                }
            }
        }
    };

    this.createDefaultStructure = function (then) {
        if (this.layers>1) this.layers=1; //for safety
        
        sgv.dlgLoaderSplash.setInfo('creating modules', ()=>{
            this.createModules();

            //this.showLabels(true);
                        
            sgv.dlgLoaderSplash.setInfo('creating vertical connections',()=>{
                this.verticalConnections();

                sgv.dlgLoaderSplash.setInfo('creating horizontal connections',()=>{
                    this.horizontalConnections();

                    if (typeof then==='function') {
                        then();
                    }
                });
            });
        });
    };

});

Chimera.prototype = Object.create(Graph.prototype);
Chimera.prototype.constructor = Chimera;

Graph.registerType('chimera', Chimera);


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

var Pegasus = /** @class */ (function (gSize) {
    Chimera.call(this, gSize);

    this.type = 'pegasus';

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

Graph.registerType('pegasus', Pegasus);


/* global sgv */

var UI = (function () {});


UI.tag = function(_tag, _attrs, _props, _evnts ) {
    var o = document.createElement(_tag);

    for (const key in _attrs) {
        o.setAttribute(key, _attrs[key]);
    }
    
    for (const key in _props) {
        o[key] = _props[key];
    }

    for (const key in _evnts) {
        if ((typeof key==='string')&&(typeof _evnts[key]==='function')) {
            o.addEventListener(key, _evnts[key]);
        }
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
                UI.tag( "button", {
                        //"type": "button",
                        //"value": '\u274C',
                        "class": "hidebutton" },
                    {"innerHTML": '<span id="X">\u274C</span><span id="value"></span>'}) );
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
    
    o.setAttribute('tabindex', '0');
    return o;
};




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
 * Copyright 2022 pojdulos.
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


/* global UI */

const GenericWindow = /** @class */ (function (_id, _title, args) {
    var prevFocused = null;

    this.ui = UI.tag("div", {'class': 'sgvUIwindow'});
    var movable = false;
    
    if ((typeof _id !== 'undefined') && (_id !== "")) {
        this.ui.setAttribute("id", _id);
    }

    let titleBar = UI.tag( "div", { "class": "title" });
    titleBar.appendChild( UI.tag( "span", { "class": "titleText" }, {"textContent": _title}) );
    
    if (('closeButton' in args)&&(args['closeButton']===true)) {
        let closeButton = UI.tag( "input", {'type':'button', 'class':'hidebutton', 'value': '\u274C'});
        closeButton.addEventListener('click', ()=>this._hide());
        titleBar.appendChild(closeButton);
    }
    this.ui.appendChild(titleBar);

    if (('setMovable' in args)&&(args['setMovable']===true)) {
        setMovable(this.ui);
    }
    this.ui.setAttribute('tabindex', '0');

    window.addEventListener('load', () => window.document.body.appendChild(this.ui));
    
    function setMovable(ui) {
        ui.offset = {x:0,y:0};
        ui.isDown = false;

        titleBar.addEventListener('mouseover', function() {
            titleBar.style.cursor='pointer';
            movable = true;
        });

        titleBar.addEventListener('mouseout', function() {
            movable = false;
        });

        titleBar.addEventListener('mousedown', function (e) {
            ui.isDown = movable;
            ui.offset = {
                x: ui.offsetLeft - e.clientX,
                y: ui.offsetTop - e.clientY
            };
        }, true);

        titleBar.addEventListener('mouseup', function () {
            ui.isDown = false;
        }, true);

        document.addEventListener('mousemove', function (event) {
            //event.preventDefault();
            if (ui.isDown) {
                let mousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };

                ui.style.left = (mousePosition.x + ui.offset.x) + 'px';
                ui.style.top = (mousePosition.y + ui.offset.y) + 'px';
            }
        }, true);
    }
    
    this._show = ()=>{
        prevFocused = window.document.activeElement;
        this.ui.style.display = "block";
        this.ui.focus({focusVisible: false});
    };
    
    this._hide = ()=>{
        this.ui.style.display = "none";
        if (prevFocused !== null) prevFocused.focus({focusVisible: false});
    };
    
    this._switch = ()=>{
        if (this.ui.style.display === "none") {
            this._show();
        } else {
            this._hide();
        }
    };
    
    this._test = function() { console.log('test 1a'); };
    
});

GenericWindow.prototype.show = this._show;
GenericWindow.prototype.hide = this._hide;
GenericWindow.prototype.switch = this._switch;
GenericWindow.prototype.test = ()=> { console.log('test 1'); };
    
/****************************************************************************/
/*                            TESTY                                         */
/****************************************************************************/


function ExePanel() {
    function PathLine(id) {
        let content = UI.tag( "div" );
        content.append(
                UI.tag('input',{'type':'button','id':'btnDelPath'+id,'value':'\u2796'}),
                UI.tag('input',{'type':'text','id':'dispBtn'+id,'value':'Button text'}),
                UI.tag('input',{'type':'text','id':'editPath'+id,'value':'d:/any/path/to/prog.exe'}),
                UI.tag('input',{'type':'button','id':'btnPath'+id,'value':'...'})
        );
        return content;
    }

    let paths = [];
    paths.push(PathLine(1));
    paths.push(PathLine(2));
    paths.push(PathLine(3));

    let content = UI.tag( "div", { "class": "content", "id": "graphSelection" });

    paths.forEach((path)=>{
        content.appendChild(path);
    });
    
    content.appendChild(UI.tag('input',{'type':'button','id':'btnDelPath1','value':'\u2795'}));
    
    return {
        ui: content
    };
}

function KnownProgsPanel() {
    function PathLine(id) {
        let content = UI.tag( "div" );
        let edit;
        content.append(
                UI.tag('input',{'type':'checkbox','id':'chkPath'+id,'checked':'checked'}),
                UI.tag('label',{'for':'editPath'+id},{'innerHTML':' Path to prog.'+id+' '}),
                edit = UI.tag('input',{'type':'text','id':'editPath'+id,'value':'d:/any/path/to/prog.exe'}),
                UI.tag('input',{'type':'button','id':'btnPath'+id,'value':'...'},{},{
                    'click': ()=>{
                        let btnLoad1 = UI.tag('input',{'type':'file', 'id':'inputfile', 'display':'none'});

                        btnLoad1.addEventListener('change', ()=>{
                            if (typeof btnLoad1.files[0]!=='undefined') {
                                edit.value = btnLoad1.files[0].name;
                            }
                        });

                        btnLoad1.click();
                    }
                })
        );
        return content;
    }

    let paths = [];
    paths.push(PathLine(1));
    paths.push(PathLine(2));
    paths.push(PathLine(3));

    let content = UI.tag( "div", { "class": "content", "id": "graphSelection" });

    paths.forEach((path)=>{
        content.appendChild(path);
    });
    
    //content.appendChild(UI.tag('input',{'type':'button','id':'btnDelPath1','value':'\u2795'}));
    
    return {
        ui: content
    };
}

const DlgPreferences = (function(){
    GenericWindow.call(this, 'sgvPrefsDlg', 'Preferences', {closeButton: true, setMovable: true});
    
    var BtnsPanel = ()=>{
        let btns = UI.tag('div',{'id':'buttons'});

        btns.appendChild(UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCancelButton', 'name':'cancelButton', 'value':'Cancel'},{},{
            'click': this._hide
        }));

        let createButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCreateButton', 'name':'createButton', 'value':'OK'});
        //createButton.addEventListener('click', ()=>{onCreateButton();});
        btns.appendChild(createButton);

        return {
            ui: btns
        };
    };
    
    this.ui.appendChild(KnownProgsPanel().ui);
    this.ui.appendChild(BtnsPanel().ui);

//    this.test = () => {
//        console.log('test 0');
//        GenericWindow.prototype.test();
//        this._test();
//        console.log('test 2');
//    };
});

var parentPrototype = Object.create(GenericWindow.prototype);
parentPrototype.constructor = DlgPreferences;
DlgPreferences.prototype = parentPrototype;

//var test = new DlgPreferences();
//
//test.test();
//test._test();


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

var sgv = (typeof exports === "undefined") ? (function sgv() {}) : (exports);
if (typeof global !== "undefined") {
    global.sgv = sgv;
}

sgv.version = "1.0.0";
sgv.engine = null;
sgv.scene = null;
sgv.camera = null;
sgv.graf = null;

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
                    //console.log('loop');
                    sceneToRender.render();
                }
            });
        });

        // Resize
        window.addEventListener("resize",
            function () {
                sgv.engine.resize();
                
                detectClient();
            });

        desktopInit();
    });
};



//=========================================
// functions overriden in desktop scripts

desktopInit = ()=>{};
enableMenu = (id, enabled)=>{};

//=========================================



/* global sgv, NaN, Graph */

"use strict";

var ParserTXT = {};

ParserTXT.importGraph = (string) => {
    var struct = new TempGraphStructure();

    var res = [];
    var lines = string.split("\n");

    let gDesc = new GraphDescr();
    
    var parseComment = function (string) {
        var command = string.split("=");
        if (command[0] === 'type') {
            gDesc.setType(command[1]);
        } else if (command[0] === 'size') {
            var size = command[1].split(",");
            if (size.length >= 5) {
                gDesc.setSize(
                    parseInt(size[0], 10),
                    parseInt(size[1], 10),
                    parseInt(size[2], 10),
                    parseInt(size[3], 10),
                    parseInt(size[4], 10));
            } else if (size.length === 4) {
                gDesc.setSize(
                    parseInt(size[0], 10),
                    parseInt(size[1], 10),
                    1,
                    parseInt(size[2], 10),
                    parseInt(size[3], 10));
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
            if (d !== null) {
                res.push(d);
                if (d.n1 === d.n2) {
                    struct.addNode1(d.n1, d.val);
                } else {
                    struct.addEdge1(d.n1, d.n2, d.val);
                }
            }
        } else {
            let line = lines[0].trim().split(/\s+/);
            if (line.length > 1) parseComment(line[1]);
        }
        lines.shift();
    }

    if (typeof gDesc.type==='undefined') {
        sgv.dlgCreateGraph.show('load', struct);
    } else {
        Graph.create( gDesc, struct );
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


/* global sgv, Chimera, Pegasus, Graph */

"use strict";

var ParserGEXF = {};

ParserGEXF.importGraph = (string) => {
    //var graphType = "unknown";
    //var graphSize = { cols:0, rows:0, lays:0, KL:0, KR:0 };
    var graphDescr = new GraphDescr();
    var nodeAttrs = {};
    var edgeAttrs = {};
    var struct = new TempGraphStructure();
    
    function parseNodes(parentNode) {
        let nodes = parentNode.getElementsByTagName("nodes");
        let node = nodes[0].getElementsByTagName("node");
        
        for ( let i =0; i<node.length; i++){
            let def = {};

            let id = node[i].getAttribute("id");
            
            def.n1 = def.n2 = parseInt(id);
            def.values = {};

            let label = node[i].getAttribute("label");
            
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
            
            if (label===null)
                struct.addNode2(def.n1, def.values);
            else
                struct.addNode2(def.n1, def.values, label);
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
            
            struct.addEdge2(def.n1, def.n2, def.values);
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
                        graphDescr.setType(result.type);
                    }

                    if ('size' in result){
                        let ss = result.size.split(",");
                        //if (ss.lenght>3){
                            graphDescr.setSize(
                                parseInt(ss[0]),
                                parseInt(ss[1]),
                                parseInt(ss[2]),
                                parseInt(ss[3]),
                                parseInt(ss[4]));
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
   
    Graph.create(graphDescr, struct);
    
    for (const i in nodeAttrs) {
        if (!sgv.graf.scopeOfValues.includes(nodeAttrs[i]))
            sgv.graf.scopeOfValues.push(nodeAttrs[i]);
    }

    return true;
};

ParserGEXF.exportGraph = function(graph) {
    if ((typeof graph==='undefined')||(graph === null)) return null;
    
    function exportNode(node) {
        let xml = '      <node id="' + node.id;
        if (node.isLabelVisible()) {
            xml += '" label="' + node.getLabel();
        }
        xml += '">\n';
        xml += "        <attvalues>\n";
        for (const key in node.values) {
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


/* global sgv, UI, URL, Chimera, Pegasus, ParserGEXF, ParserTXT, Graph, Dispatcher */
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
        Graph.remove();
        ParserTXT.importGraph(data);
    } else if(name.endsWith("gexf")) {
        Graph.remove();
        if (ParserGEXF.importGraph(data)){
            Dispatcher.graphCreated();
        }
    };
};

/* 
 * Copyright 2022 pojdulos.
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


/* global UI, sgv, Dispatcher */

const ScopePanel = (function(addButtons,lbl) {
    let divNS, divDS;
    
    this.addScope = (scope, idx) => {
        selectScope.add(UI.option(scope, scope));
        selectScope.selectedIndex = idx;
    };
    
    this.delScope = (scope, idx2) => {
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.remove(i);
        }
        selectScope.selectedIndex = idx2;
    };

    this.selScope = (scope)=>{
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.selectedIndex = i;
        }
    };
    
    this.getScope = ()=> {
        return selectScope.value;
    };

    this.getScopeIndex = ()=> {
        return selectScope.selectedIndex;
    };
    
    this.refresh = () => {
        if (sgv.graf !== null) {
            UI.clearSelect(selectScope, true);
            for (const key in sgv.graf.scopeOfValues) {
                let scope = sgv.graf.scopeOfValues[key];
                let opt = UI.option(scope, scope);
                if (sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
                    opt.selected = "selected";
                }
                selectScope.appendChild(opt);
            }
        }
    };
    
    
    function EditPanel(scopeToEdit) {
        let createNew = true;
        if ((typeof scopeToEdit === 'string')&&(scopeToEdit!=='')) createNew = false;
        
        let divNS = UI.tag("div", {'class': "sgvD1", 'id': "cplDivNS"}, {'textContent': isMobile?'':(createNew)?"add new scope: ":"edit scope: "});
        
        let editAddScope = UI.tag("input", {'type': "text", 'id': "cplAddScopeInput", 'value': (createNew)?"newScope":scopeToEdit});
        divNS.appendChild(editAddScope);

        let btnAcceptAddScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplAcceptAddScope", 'value': ''});
        btnAcceptAddScope.addEventListener('click', ()=>{
            if (createNew){
                let scope = editAddScope.value;
                let idx = sgv.graf.addScopeOfValues(scope);
                
                Dispatcher.graphChanged();
            }
            else {
                //edit existing
            }
            
            divNS.style.display = "none";
            divDS.style.display = "inline";
        });
        divNS.appendChild(btnAcceptAddScope);

        let btnSkipAddScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplSkipAddScope", 'value': ''});
        btnSkipAddScope.addEventListener('click', ()=>{
                    divNS.style.display = "none";
                    divDS.style.display = "block";
                });
        divNS.appendChild(btnSkipAddScope);


        divNS.style.display = "none";
        
        return {
            ui: divNS,
            show: ()=>(divNS.style.display = "block"),
            hide: ()=>(divNS.style.display = "none")
        };
    }
    
    if (typeof addButtons!=='boolean') addButtons = true;
    
    this.ui = UI.tag("div", {'class': "sgvSelectBox", 'id': "ScopePanel"});
    
    //divDS = UI.tag("div", {'class': "sgvD1", 'id': "cplDivDS"}, {'textContent': isMobile?'':"current scope: "});
    divDS = UI.tag("div", {'class': "sgvD1", 'id': "cplDivDS"});
    this.ui.appendChild(divDS);

    if (typeof lbl==='string') {
        divDS.appendChild(UI.tag("label", {'for': "cplDispValues"}, {'innerHTML':lbl}));
    }
    
    let selectScope = UI.tag("select", {'id': "cplDispValues"});
    selectScope.addEventListener('change', () => {
        sgv.graf.displayValues(selectScope.value);
    });
    divDS.appendChild(selectScope);

    if (addButtons) {
//        let btnEditScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplEditScope", 'value': ''});
//        btnEditScope.addEventListener('click',()=>{
//                });
//        divDS.appendChild(btnEditScope);


        let btnDelScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplDelScope", 'value': ''});
        btnDelScope.addEventListener('click',()=>{
            let idx = sgv.graf.delScopeOfValues(this.getScope());
            Dispatcher.graphChanged();
        });

        divDS.appendChild(btnDelScope);

        let btnAddScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplAddScope", 'value': ''});
        btnAddScope.addEventListener('click',()=>{
                    divNS.show();
                    divDS.style.display = "none";
                });
        divDS.appendChild(btnAddScope);

        this.ui.appendChild((divNS = EditPanel()).ui);
    }    


});




/* 
 * Copyright 2022 pojdulos.
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

/* global sgv, UI */

const SlidersPanel = (function() {
    var sliderRedLimit, sliderGreenLimit;
    var spanRed, spanGreen;

    this.ui = UI.tag('div', {'id': 'LimitSlidersPanel'});

    this.ui.appendChild(spanRed = UI.tag("span", {'id': 'spanRed'}, {'textContent': '-1.0'}));

    sliderRedLimit = UI.tag('input', {
        'type': 'range',
        'class': 'graphLimit',
        'id': 'redLimit',
        'value': '-1.0',
        'min': '-1.0',
        'max': '0.0',
        'step': '0.01'
    });
    sliderRedLimit.addEventListener('input', async (e) => {
        if (sgv.graf !== null) {
            sgv.graf.redLimit = e.target.value;

            spanRed.textContent = '' + sgv.graf.redLimit + ' ';

            sgv.graf.displayValues();
        }
    });

    this.ui.appendChild(sliderRedLimit);

    this.ui.appendChild(UI.tag("span", {'id': 'spanZero'}, {'textContent': ' 0 '}));

    sliderGreenLimit = UI.tag('input', {
        'type': 'range',
        'class': 'graphLimit',
        'id': 'greenLimit',
        'value': '1.0',
        'min': '0.0',
        'max': '1.0',
        'step': '0.01'
    });
    sliderGreenLimit.addEventListener('input', async (e) => {
        if (sgv.graf !== null) {
            sgv.graf.greenLimit = e.target.value;

            spanGreen.textContent = ' ' + sgv.graf.greenLimit;

            sgv.graf.displayValues();

        }
    });

    this.ui.appendChild(sliderGreenLimit);

    this.ui.appendChild(spanGreen = UI.tag("span", {'id': 'spanGreen'}, {'textContent': '1.0'}));
    
    this.refresh = () => {
        if (sgv.graf === null)
            return;

        let r = sgv.graf.getMinMaxVal();

        // min should to bee negative or :
        if (r.min > 0)
            r.min = Number.NaN;

        // max should to bee positive:
        if (r.max < 0)
            r.max = Number.NaN;


        updateRed(r.min);
        updateGreen(r.max);

        function updateRed(min) {
            if (isNaN(min)) {
                sliderRedLimit.disabled = 'disabled';
                spanRed.textContent = 'NaN';
            } else {
                min = Math.floor(min * 100) / 100;

                if (sgv.graf.redLimit < min) {
                    sgv.graf.redLimit = min;
                }

                sliderRedLimit.min = min;
                sliderRedLimit.value = sgv.graf.redLimit;

                spanRed.textContent = sgv.graf.redLimit + ' ';
                sliderRedLimit.disabled = '';
            }
        }

        function updateGreen(max) {
            if (isNaN(max)) {
                sliderGreenLimit.disabled = 'disabled';
                spanGreen.textContent = 'NaN';
            } else {
                max = Math.ceil(max * 100) / 100;

                if (sgv.graf.greenLimit > max) {
                    sgv.graf.greenLimit = max;
                }

                sliderGreenLimit.max = max;
                sliderGreenLimit.value = sgv.graf.greenLimit;

                spanGreen.textContent = ' ' + sgv.graf.greenLimit;
                sliderGreenLimit.disabled = '';
            }
        }

    };
    
});



"use strict";
/* global sgv, Chimera, Pegasus, UI, parserGEXF, dialog, FileIO, Graph */

sgv.dlgCPL = new function () {
    var switchableContent; 
    var selectionPanel, descriptionPanel;
    var scopePanel, slidersPanel;
    var switchHandle;
    
    var ui = createDialog();

    window.addEventListener('load', () => {
        window.document.body.appendChild(ui);
    });

    function createDialog() {
        let ui = UI.tag("div", {"class": "sgvUIwindow disable-select", "id": "sgvDlgCPL"});

        function SelectionPanel() {
            let btnShowConsole2, btnCreate, btnLoad;
            var divSel = UI.tag("div", {"class": "content", "id": "graphSelection"});

            divSel.appendChild(
                    btnShowConsole2 = UI.createTransparentBtn1('show console', "cplShowConsoleButton", () => {
                        sgv.dlgConsole.switchConsole();
                    }));

            divSel.appendChild(
                    btnCreate = UI.createTransparentBtn1('create graph', "cplCreateButton", () => {
                        sgv.dlgCreateGraph.show();
                    }));

            divSel.appendChild(
                    btnLoad = UI.createTransparentBtn1('load graph', 'cplLoadButton', () => {
                        FileIO.onLoadButton();
                    }));

            divSel.style.display = "block";

            return {
                ui: divSel,
                show: ()=>{divSel.style.display = "block";},
                hide: ()=>{divSel.style.display = "none";}
            };
        }

        function DescriptionPanel() {
            function InfoBlock() {
                let i = UI.tag("div", {});
                
                let sub = UI.tag('sub');
                sub.append(
                    UI.span('0', {'id':"dscr_KL"}), ',', UI.span('0', {'id':"dscr_KR"}),
                );
                
                i.append(
                    "Current graph is ", 
                    //UI.tag('label',{'for':'dscr_type'},{'innerHTML':'Current graph type: '}),
                    UI.span("unknown", {'id': "dscr_type"}),
                    '-like, size: ',
                    UI.span('0', {'id':"dscr_cols"}), 'x', UI.span('0', {'id':"dscr_rows"}),
                    'xK', sub,
                    UI.tag('br'),
                    'Number of nodes: ', UI.span('0', {'id':"dscr_nbNodes"}),
                    ', number of edges: ', UI.span('0', {'id':"dscr_nbEdges"})
                );

                return {
                    ui: i
                };
            }

            function ButtonPanel() {
                let btnDispMode, btnCellView, btnShowConsole, btnSaveTXT, btnClear;
                let btnPanel = UI.tag('div', {'id': 'panelBtns'});

                btnPanel.appendChild(
                        btnDispMode = UI.createTransparentBtn1('display mode', "cplDispModeButton", () => {
                            Graph.switchDisplayMode();
                        }));

                btnPanel.appendChild(
                        btnCellView = UI.createTransparentBtn1('cell view', "cplCellViewButton", () => {
                            sgv.dlgCellView.switchDialog();
                        }));

                btnPanel.appendChild(
                        btnShowConsole = UI.createTransparentBtn1('show console', "cplShowConsoleButton", () => {
                            sgv.dlgConsole.switchConsole();
                        }));

                btnPanel.appendChild(
                        btnSaveTXT = UI.createTransparentBtn1('save graph', "cplSaveButton", () => {
                            FileIO.onSaveButton()
                                    .then(result => console.log(result))
                                    .catch(error => console.log(error));
                        }));

                btnPanel.appendChild(
                        btnClear = UI.createTransparentBtn1('delete graph', "cplClearButton", () => {
                            Graph.remove();
                        }));
                        
                return {
                    ui: btnPanel
                };
            }

            var divDesc = UI.tag("div", {"class": "content", "id": "graphDescription"});

            divDesc.append(
                InfoBlock().ui,
                (scopePanel = new ScopePanel(true,'current scope: ')).ui,
                (slidersPanel = new SlidersPanel).ui,
                ButtonPanel().ui);

            divDesc.style.display = "none";
            return {
                ui: divDesc,
                addButton: (txt, id, onClick) => {
                    divDesc.appendChild(UI.createTransparentBtn1(txt, id, onClick));
                },
                updateInfo: () => {
                    ui.querySelector("#dscr_type").textContent = sgv.graf.type;
                    ui.querySelector("#dscr_cols").textContent = sgv.graf.cols;
                    ui.querySelector("#dscr_rows").textContent = sgv.graf.rows;
                    ui.querySelector("#dscr_KL").textContent = sgv.graf.KL;
                    ui.querySelector("#dscr_KR").textContent = sgv.graf.KR;
                    ui.querySelector("#dscr_nbNodes").textContent = Object.keys(sgv.graf.nodes).length;
                    ui.querySelector("#dscr_nbEdges").textContent = Object.keys(sgv.graf.edges).length;
                },
                show: ()=>{divDesc.style.display = "block";},
                hide: ()=>{divDesc.style.display = "none";}
            };
        }
        
        switchableContent = UI.tag('div', {});
        
        switchableContent.append(
                (selectionPanel = SelectionPanel()).ui,
                (descriptionPanel = DescriptionPanel()).ui
        );

        
        ui.appendChild(switchableContent);
        ui.appendChild( switchHandle = UI.tag( 'div', {'id': 'switch'}, {'innerHTML': '\u00B7 \u00B7 \u00B7'}, {'click': () => switchDialog()} ) );

        ui.style.display = 'block';

        return ui;
    }


    function showDialog() {
        switchableContent.style.display = "block";
    }


    function hideDialog() {
        switchableContent.style.display = "none";
    }


    function switchDialog() {
        (switchableContent.style.display === "none") ? showDialog() : hideDialog();
    }

    function setModeSelectionX() {
        selectionPanel.show();
        descriptionPanel.hide();
    }

    function setModeDescriptionX() {
        descriptionPanel.updateInfo();
        slidersPanel.refresh();
        scopePanel.refresh();

        selectionPanel.hide();
        descriptionPanel.show();
    }

    function refreshX() {
        slidersPanel.refresh();
        scopePanel.refresh();
    }
    
    return {
        showPanel: showDialog,
        hidePanel: hideDialog,
        switchPanel: switchDialog,
        setModeDescription: setModeDescriptionX,
        setModeSelection: setModeSelectionX,
        updateSliders: slidersPanel.refresh,
        addButton: descriptionPanel.addButton,
        //quickInfo: (s)=>(switchHandle.innerHTML=s),
        addScope: scopePanel.addScope,
        delScope: scopePanel.delScope,
        selScope: scopePanel.selScope,
        refresh: refreshX
    };
    
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
/* global scene, sgv, Chimera, Pegasus, UI, Graph */

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
                        //sgv.graf.addNode(id, val);
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
            if ((type!=='chimera')&&(type!=='pegasus')){
                return "unknown graph type, use: chimera or pegasus";
            }
            if (sgv.graf === null) {
                let gD = new GraphDescr();
                gD.setType(type);
                
                const sizesTXT = sizeTXT.split(",");

                if (sizesTXT.length>=5) {
                    gD.setSize(
                        parseInt(sizesTXT[0], 10),
                        parseInt(sizesTXT[1], 10),
                        parseInt(sizesTXT[2], 10),
                        parseInt(sizesTXT[3], 10),
                        parseInt(sizesTXT[4], 10));
                } else if ((sizesTXT.length===4)&&(type==='chimera')) {
                    gD.setSize(
                        parseInt(sizesTXT[0], 10),
                        parseInt(sizesTXT[1], 10),
                        1,
                        parseInt(sizesTXT[2], 10),
                        parseInt(sizesTXT[3], 10));
                } else {
                    return "bad arguments";
                }
                
                Graph.create(gD);

                return "graph created";
            } else {
                return "graf exists, type: clear <Enter> to delete it";
            }

        }

        function clear() {
            Graph.remove();
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
                            sgv.graf.addNode(id, val);
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
                //if ((command[1]==='classic')||(command[1]==='diamond')||(command[1]==='triangle')) {
                if (sgv.graf===null) {
                    result = "graph is not defined";
                }
                else if (Graph.displayModes.includes(command[1])) {
                    Graph.currentDisplayMode = command[1];
                    sgv.graf.setDisplayMode();
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

/* global sgv, UI, Edge, qD, QbDescr */

sgv.dlgCellView = new function () {
    var selectGraphCols, selectGraphRows, selectGraphLays, selectScope;
    var upButton, leftButton, rightButton, downButton;
    var svgView;
    var r, c, l;

    var prevFocused = null;

    const _width = 600;
    const _height = 600;
    const ctrX = _width / 2;
    const ctrY = _height / 2;

    var ui = createUI();

    ui.addEventListener('keydown', onKeyDownX);

    var xDown = null;                                                        
    var yDown = null;

    ui.addEventListener('touchstart', handleTouchStart, false);        
    ui.addEventListener('touchmove', handleTouchMove, false);

    window.addEventListener('load', () => {
        window.document.body.appendChild(ui);
    });

    function getTouches(evt) {
      return evt.touches ||             // browser API
             evt.originalEvent.touches; // jQuery
    }    

    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                

    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* right swipe */ 
                if (c < (sgv.graf.cols - 1)) {
                    drawModule(c + 1, r, l);
                }
            } else {
                /* left swipe */
                if (c > 0) {
                    drawModule(c - 1, r, l);
                }
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* down swipe */ 
                if (r > 0) {
                    drawModule(c, r - 1, l);
                }
            } else { 
                /* up swipe */
                if (r < (sgv.graf.rows - 1)) {
                    drawModule(c, r + 1, l);
                }
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };

    function onKeyDownX(event) {
        let key = event.key;
        //console.log(key);
        if (key === 'ArrowLeft') {
            if (c > 0) {
                drawModule(c - 1, r, l);
            }
        } else if (key === 'ArrowRight') {
            if (c < (sgv.graf.cols - 1)) {
                drawModule(c + 1, r, l);
            }
        } else if (key === 'ArrowUp') {
            if (r < (sgv.graf.rows - 1)) {
                drawModule(c, r + 1, l);
            }
        } else if (key === 'ArrowDown') {
            if (r > 0) {
                drawModule(c, r - 1, l);
            }
        } else if (key === 'PageUp') {
            if (l < (sgv.graf.layers - 1)) {
                drawModule(c, r, l + 1);
            }
        } else if (key === 'PageDown') {
            if (l > 0) {
                drawModule(c, r, l - 1);
            }
        } else if (key === 'Escape') {
            hideDialogX();
        }
    }

    function createUI() {
        r = c = l = 0;

        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvCellView", "Cell view", true);

        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialogX();
        });

        let content = UI.tag("div", {"class": "content", "id": "main"});


        let div = UI.tag('div',{'id':'svg'});

        svgView = SVG.createSVG2('svgView', _width, _height, (event) => {
            if (event.target.id === 'svgView') {
                sgv.dlgNodeProperties.hide();
                sgv.dlgEdgeProperties.hide();
            }
        });
        div.appendChild(svgView);
        content.appendChild(div);



        //content.appendChild(UI.tag('div', {'id': 'description'}));
        let g = UI.tag('div', {'class':'tools', 'id': 'cellViewTools'});

        g.style['text-align'] = 'center';

        selectGraphCols = UI.tag('select', {'id': 'graphCols'});
        selectGraphCols.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10));
        });

        g.appendChild(UI.tag('label', {'for': 'graphCols'}, {'innerHTML': ' column: '}));
        g.appendChild(selectGraphCols);

        selectGraphRows = UI.tag('select', {'id': 'graphRows'});
        selectGraphRows.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10));
        });

        g.appendChild(UI.tag('label', {'for': 'graphRows'}, {'innerHTML': ' row: '}));
        g.appendChild(selectGraphRows);

        selectGraphLays = UI.tag('select', {'id': 'graphLays'});
        selectGraphLays.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10));
        });

        g.appendChild(UI.tag('label', {'for': 'graphLays'}, {'innerHTML': ' layer: '}));
        g.appendChild(selectGraphLays);

        g.appendChild((selectScope = new ScopePanel()).ui);

        content.appendChild(g);
        
        content.appendChild(UI.createTransparentBtn1('CLOSE', 'CloseButton', ()=>{hideDialogX();}));

//        const tbl = document.createElement("table");
//        const tblBody = document.createElement("tbody");
//
//        let t = [];
//        
//        for (let i = 0; i < 3; i++) {
//            const row = document.createElement("tr");
//            row.style['padding']='0';
//            row.style['margin']='0';
//            t.push([]);
//            for (let j = 0; j < 3; j++) {
//                const cell = document.createElement("td");
//                //const cellText = document.createTextNode(`cell in row ${i}, column ${j}`);
//                //cell.appendChild(cellText);
//                row.appendChild(cell);
//                cell.style['padding']='0';
//                cell.style['margin']='0';
//                t[i][j] = cell;
//            }
//            tblBody.appendChild(row);
//        }
//
//        console.log(t);
//        tbl.appendChild(tblBody);
//        content.appendChild(tbl);
//        
//        tbl.setAttribute("border", "0");
//        tbl.setAttribute("bgcolor", "#ffffff");
//        tbl.setAttribute("cellpadding", "0");
//        tbl.setAttribute("cellspacing", "0");

//        upButton = UI.tag('button',{'class':''},{'innerHTML':'^'});
//        upButton.style['width'] = '400px';
//        upButton.style['height'] = '24px';
//        upButton.style['border'] = '0';
//        upButton.style['margin'] = '0';
//        upButton.style['padding'] = '0';
//        upButton.addEventListener('click', ()=>{
//           if (r<(sgv.graf.rows-1)) {
//               drawModule(c,r+1,l);
//           }
//        });
//        t[0][1].appendChild(upButton);

//        leftButton = UI.tag('button',{'class':''},{'innerHTML':'<'});
//        leftButton.style['height'] = '600px';
//        leftButton.style['width'] = '24px';
//        leftButton.style['border'] = '0';
//        leftButton.style['margin'] = '0';
//        leftButton.style['padding'] = '0';
//        leftButton.addEventListener('click', ()=>{
//           if (c>0) {
//               drawModule(c-1,r,l);
//           }
//        });
//        t[1][0].appendChild(leftButton);


//        t[1][1].appendChild(div);
//        rightButton = UI.tag('button',{'class':''},{'innerHTML':'>'});
//        rightButton.style['height'] = '600px';
//        rightButton.style['width'] = '24px';
//        rightButton.style['border'] = '0';
//        rightButton.style['margin'] = '0';
//        rightButton.style['padding'] = '0';
//        rightButton.addEventListener('click', ()=>{
//           if (c<(sgv.graf.cols-1)) {
//               drawModule(c+1,r,l);
//           }
//        });
//        t[1][2].appendChild(rightButton);

//        downButton = UI.tag('button',{'class':''},{'innerHTML':'v'});
//        downButton.style['width'] = '400px';
//        downButton.style['height'] = '24px';
//        downButton.style['border'] = '0';
//        downButton.style['margin'] = '0';
//        downButton.style['padding'] = '0';
//        downButton.addEventListener('click', ()=>{
//           if (r>0) {
//               drawModule(c,r-1,l);
//           }
//        });
//        t[2][1].appendChild(downButton);

        ui.appendChild(content);

        ui.style.display = "none";
//        ui.style['top'] = isMobile?winS*0.05:'10vh';
//        ui.style['left'] = isMobile?winS*0.05:'10vh';
        return ui;
    }
    

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

        console.log(x, y);
    }

    function pos(id, mode) {
        const pos = {
            'classic': [
                {x: -60, y: 150},
                {x: -90, y: 50},
                {x: -120, y: -50},
                {x: -150, y: -150},
                {x: 140, y: 200},
                {x: 110, y: 100},
                {x: 80, y: 0},
                {x: 50, y: -100}]
        };

        mode = 'classic'; //temporary

        return {
            x: ctrX + pos[mode][id].x,
            y: ctrY + pos[mode][id].y
        };
    }

    function onExternalNodeClick(event) {
        event.preventDefault();
        let sp = event.target.id.split('_');
        if (sp.length > 1)
            id = sp[1];
        else
            id = event.target.id;

        let q = QbDescr.fromNodeId(id, sgv.graf.rows, sgv.graf.cols);
        drawModule(q.x, q.y, q.z);
        
        let rect = event.target.getBoundingClientRect();
        sgv.dlgNodeProperties.show(id, rect.x, rect.y);
    }
    

    function onNodeClick(event) {
        event.preventDefault();
        let sp = event.target.id.split('_');
        let rect = event.target.getBoundingClientRect();
        if (sp.length > 1)
            sgv.dlgNodeProperties.show(sp[1], rect.x, rect.y);
        else
            sgv.dlgNodeProperties.show(event.target.id, rect.x, rect.y);
    }
    

    function onEdgeClick(event) {
        event.preventDefault();
        let sp = event.target.id.split('_');
        let rect = event.target.getBoundingClientRect();
        if (sp.length > 1)
            sgv.dlgEdgeProperties.show(sp[1], rect.x, rect.y);
        else
            sgv.dlgEdgeProperties.show(event.target.id, rect.x, rect.y);
    }
    

    function drawExtEdge(offset, ijk, e, endX, endY) {

        let b = offset + ijk;
        let eid = Edge.calcId(b, e);
        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 2 + 5 * valueToEdgeWidth(val);

            let eVal = sgv.graf.nodeValue(e);
            let eColor = valueToColor(eVal);

            SVG.drawSvgEdge(svgView, eid, pos(ijk).x, pos(ijk).y, endX, endY, color.toHexString(), wth, onEdgeClick);
            SVG.drawSvgText(svgView, e, endX, endY, e, 'yellow', eColor.toHexString(), onExternalNodeClick);
        }
    }

    function drawInternalEdge(offset, iB, iE) {
        let b = offset + iB;
        let e = offset + iE;

        let eid = Edge.calcId(b, e);
        //console.log('eid2: ', eid);

        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 2 + 5 * valueToEdgeWidth(val);

            SVG.drawSvgEdge(svgView, eid, pos(iB).x, pos(iB).y, pos(iE).x, pos(iE).y, color.toHexString(), wth, onEdgeClick);
        }
    }


    function drawNode(offset, id) {
        let nodeId = offset + id;
        if ((nodeId) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(nodeId);
            let color = valueToColor(val);

            SVG.drawSvgNode(svgView, nodeId, pos(id).x, pos(id).y, 20, color.toHexString(), onNodeClick);
            SVG.drawSvgText(svgView, nodeId, pos(id).x, pos(id).y, nodeId.toString(), 'yellow', '', onNodeClick);
        }
    }


    function calcOffset(col, row, layer) {
        let offset = layer * sgv.graf.cols * sgv.graf.rows;
        offset += row * sgv.graf.cols;
        offset += col;
        offset *= 8;

        offset += 1;

        return offset;
    }

    function drawModule(col, row, layer) {
        svgView.innerHTML = '';

        if (sgv.graf === null)
            return;

        if (typeof col === 'undefined')
            col = c;
        else if (col < sgv.graf.cols)
            c = col;
        else
            c = col = 0;

        if (typeof row === 'undefined')
            row = r;
        else if (row < sgv.graf.rows)
            r = row;
        else
            r = row = 0;

        if (typeof layer === 'undefined')
            layer = l;
        else if (layer < sgv.graf.layers)
            l = layer;
        else
            l = layer = 0;

        let firstRow = (row === 0);
        let lastRow = (row === (sgv.graf.rows - 1));
        let firstCol = (col === 0);
        let lastCol = (col === (sgv.graf.cols - 1));

//        upButton.disabled = lastRow?'disabled':'';
//        leftButton.disabled = firstCol?'disabled':'';
//        rightButton.disabled = lastCol?'disabled':'';
//        downButton.disabled = firstRow?'disabled':'';

        UI.selectByKey(selectGraphCols, col);
        UI.selectByKey(selectGraphRows, row);
        UI.selectByKey(selectGraphLays, layer);
        selectScope.selScope(sgv.graf.currentScope);
        //UI.selectByKey(selectScope, sgv.graf.currentScope);

        let offset = calcOffset(col, row, layer);

        let LT = 20;
        let RT = _width - 20;
        let TP = 20;
        let BT = _height - 20;

        let ltpos = [
            {x: LT + 95, y: -40},
            {x: LT + 55, y: -40},
            {x: LT + 25, y: -30},
            {x: LT + 25, y: -10},
            {x: LT + 25, y: 10},
            {x: LT + 25, y: 30},
            {x: LT + 55, y: 40},
            {x: LT + 95, y: 40}
        ];

        let rtpos = [
            {x: RT - 95, y: -40},
            {x: RT - 55, y: -40},
            {x: RT - 25, y: -30},
            {x: RT - 25, y: -10},
            {x: RT - 25, y: 10},
            {x: RT - 25, y: 30},
            {x: RT - 55, y: 40},
            {x: RT - 95, y: 40}
        ];

        let ready = {};
        for (let i = 0; i < 8; i++) {
            let connected = sgv.graf.findAllConnected(offset + i);

            for (let j of connected.internal) {
                let eid = Edge.calcId(offset + i, j);
                if (!(eid in ready)) {
                    drawInternalEdge(offset, i, (j - 1) % 8);
                    ready[eid] = 1;
                }
            }

            for (let j of connected.horizontal) {
                drawExtEdge(offset, i, j, (offset + i < j) ? RT : LT, pos(i).y);
            }

            for (let j of connected.vertical) {
                drawExtEdge(offset, i, j, pos(i).x, (offset + i < j) ? TP : BT);
            }


            let it = 0;
            if (i < 4) {
                for (let j of connected.up) {
                    drawExtEdge(offset, i, j, ltpos[it].x, pos(i).y + ltpos[it].y);
                    it++;
                }
                for (let j of connected.down) {
                    drawExtEdge(offset, i, j, ltpos[it].x, pos(i).y + ltpos[it].y);
                    it++;
                }
            } else {
                for (let j of connected.up) {
                    drawExtEdge(offset, i, j, rtpos[it].x, pos(i).y + rtpos[it].y);
                    it++;
                }
                for (let j of connected.down) {
                    drawExtEdge(offset, i, j, rtpos[it].x, pos(i).y + rtpos[it].y);
                    it++;
                }
            }

            drawNode(offset, i);
        }
    }
    


    function showDialogX() {
        UI.clearSelect(selectGraphCols, true);
        for (let i = 0; i < sgv.graf.cols; i++)
            selectGraphCols.appendChild(UI.option(i, i));
        selectGraphCols.selectedIndex = c;

        UI.clearSelect(selectGraphRows, true);
        for (let i = 0; i < sgv.graf.rows; i++)
            selectGraphRows.appendChild(UI.option(i, i));
        selectGraphRows.selectedIndex = r;

        UI.clearSelect(selectGraphLays, true);
        for (let i = 0; i < sgv.graf.layers; i++)
            selectGraphLays.appendChild(UI.option(i, i));
        selectGraphLays.selectedIndex = l;

        if (sgv.graf.layers === 1) {
            selectGraphLays.disabled = 'disabled';
        } else {
            selectGraphLays.disabled = '';
        }

        selectScope.refresh();
//        UI.clearSelect(selectScope, true);
//        for (let s in sgv.graf.scopeOfValues)
//            selectScope.appendChild(UI.option(sgv.graf.scopeOfValues[s], sgv.graf.scopeOfValues[s]));
//        UI.selectByKey(selectScope, sgv.graf.currentScope);

        drawModule();

        ui.style.display = "block";
        prevFocused = window.document.activeElement;
        ui.focus({focusVisible: false});
    }
    


    function hideDialogX() {
        if (prevFocused !== null)
            prevFocused.focus({focusVisible: false});
        ui.style.display = "none";
    }
    

    function switchDialogX() {
        if (ui.style.display === "none") {
            showDialogX();
        } else {
            hideDialogX();
        }
    }
    


    return {
        refresh: drawModule,
        switchDialog: switchDialogX,
        show: showDialogX,
        hide: hideDialogX
    };
};
/* global sgv, UI, Graph, TempGraphStructure */

sgv.dlgCreateGraph = new function() {
    var selectGraphType;
    var selectGraphCols, selectGraphRows, selectGraphLays;
    var selectGraphKL, selectGraphKR;
    
    var ui = createUI();

    var graphData;
    
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
        for (let i=1; i<17; i++ ) {
            selectGraphCols.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphCols, 4);

        g.appendChild(UI.tag('label',{'for':'graphCols'},{'innerHTML':' columns: '}));
        g.appendChild(selectGraphCols);

        selectGraphRows = UI.tag('select',{'id':'graphRows'});
        for (let i=1; i<17; i++ ) {
            selectGraphRows.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphRows, 4);
 
        g.appendChild(UI.tag('label',{'for':'graphRows'},{'innerHTML':' rows: '}));
        g.appendChild(selectGraphRows);

        selectGraphLays = UI.tag('select',{'id':'graphLays'});
        for (let i=1; i<6; i++ ) {
            selectGraphLays.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphLays, 1);
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

        let btns = UI.tag('div',{'id':'buttons'});

        let cancelButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCancelButton', 'name':'cancelButton', 'value':'Cancel'});
        cancelButton.addEventListener('click', ()=>{hideDialog();});
        btns.appendChild(cancelButton);
        
        let createButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCreateButton', 'name':'createButton', 'value':'Create'});
        createButton.addEventListener('click', ()=>{onCreateButton();});
        btns.appendChild(createButton);

        divSel.appendChild(btns);

        ui.appendChild(divSel);

        ui.style.display = "none";
        
        return ui;
    };
    
    function getGraphDescr() {
        let gD = new GraphDescr();
        gD.setType(selectGraphType.value);
        gD.setSize(
            parseInt(selectGraphCols.value, 10),
            parseInt(selectGraphRows.value, 10),
            parseInt(selectGraphLays.value, 10),
            parseInt(selectGraphKL.value, 10),
            parseInt(selectGraphKR.value, 10));
        
        return gD;
    };

    function sugestSize() {
        let maxNode = 0;
        graphData.nodes.forEach((n)=>{if (maxNode<n.id) maxNode=n.id;});
        maxNode--;
        
        let maxModule = maxNode>>3;
        if (maxNode%8) maxModule++;
        
        let gDesc = new GraphDescr();
        switch (maxModule) {
            case 4: gDesc.set('chimera',2,2,1,4,4); break;
            case 9: gDesc.set('chimera',3,3,1,4,4); break;
            case 16: gDesc.set('chimera',4,4,1,4,4); break;
            case 64: gDesc.set('chimera',8,8,1,4,4); break;
            case 144: gDesc.set('chimera',12,12,1,4,4); break;
            case 256: gDesc.set('chimera',16,16,1,4,4); break;
            
            case 12: gDesc.set('pegasus',2,2,3,4,4); break;
            case 27: gDesc.set('pegasus',3,3,3,4,4); break;
            case 48: gDesc.set('pegasus',4,4,3,4,4); break;
            case 192: gDesc.set('pegasus',8,8,3,4,4); break;
            case 432: gDesc.set('pegasus',12,12,3,4,4); break;
            case 768: gDesc.set('pegasus',16,16,3,4,4); break;
            
            default: gDesc.set('chimera',4,4,1,4,4); break;
        }
        
        UI.selectByKey(selectGraphType,gDesc.type);
        UI.selectByKey(selectGraphCols,gDesc.size.cols);
        UI.selectByKey(selectGraphRows,gDesc.size.rows);
        UI.selectByKey(selectGraphLays,gDesc.size.lays);
        UI.selectByKey(selectGraphKL,gDesc.size.KL);
        UI.selectByKey(selectGraphKR,gDesc.size.KR);
        if (gDesc.type==='chimera') selectGraphLays.disabled='disabled';
        else selectGraphLays.disabled='';
    }
    
    function onCreateButton() {
        let gDesc = getGraphDescr();
        
        showSplashAndRun(()=>{
                hideDialog();
                setTimeout(()=>{
                    Graph.create( gDesc, graphData );
                }, 100);
            },true);
    }
    
    function showDialog( type, struct ) {
        if (type==='load') {
            ui.querySelector('#cplCreateButton').value = 'Load';
            ui.querySelector('.titleText').textContent = 'Load graph';
        } else {
            ui.querySelector('#cplCreateButton').value = 'Create';
            ui.querySelector('.titleText').textContent = 'New graph';
        }

        ui.style.display = "block";

        if (struct instanceof TempGraphStructure){
            graphData = struct;
            sugestSize();
        } else {
            graphData = null;
        }

        ui.showModal();
    };

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
        
    return {
        d: graphData,
        show: showDialog,
        hide: hideDialog
    };
};




/* global sgv, UI, Dispatcher */

sgv.dlgEdgeProperties = new function() {
    var precontent, content, zeroInfo;
    var hidEdgeId;
    var selectEdgeId, selectScope;
    var checkValueE, editWagaE;
    var btnSetE, btnDeleteE;
    var prevFocused=null;

    var notShownBefore = true;

    var ui = createUI();
    
    ui.addEventListener('keydown', onKeyDownX );
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
        hideDialog();
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


        content.appendChild((selectScope = new ScopePanel(false, 'scope: ')).ui);

        var valueBlock = UI.tag("div", {'id':'ValueBlock'});
        checkValueE = UI.newInput("checkbox", "", "", "valueCheckE");
        checkValueE.addEventListener('click', function () {
            onValueEnableCheckbox();
        });
        valueBlock.appendChild(checkValueE);

        editWagaE = UI.newInput("number", "0", "", "wagaE");
        editWagaE.addEventListener('change', function () {
            onSetEdgeValueButton();
        });
        valueBlock.appendChild(editWagaE);

        btnSetE = UI.newInput("button", "set", "setvaluebutton", "setE");
        btnSetE.addEventListener('click', function () {
            onSetEdgeValueButton();
        });
        
        valueBlock.appendChild(btnSetE);
        content.appendChild(valueBlock);
        
        ui.appendChild(zeroInfo = UI.tag("div", {'class':'content'}, {'innerHTML': "Select an edge, please."}));
        
        ui.appendChild(UI.createTransparentBtn1('CLOSE', 'CloseButton', ()=>{hideDialog();}));
        ui.appendChild(UI.createTransparentBtn1('DELETE', 'DeleteButton', ()=>{onDeleteEdgeButton();}));
        
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

        selectScope.refresh();

        let currentValue = sgv.graf.edgeValue(edgeId);
        if ((currentValue===null)||isNaN(currentValue)) {
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

        if ((!isMobile) && notShownBefore){
            notShownBefore = false;
            if ((typeof x!=='undefined')&&(typeof y!=='undefined')) {
                let xOffset = sgv.canvas.clientLeft;
                ui.style.top = y + "px";
                ui.style.left = (xOffset + x) + "px";
            }
        }

        ui.style.display = "block";
        prevFocused = window.document.activeElement;
        ui.focus({focusVisible: false});
    };

    function onKeyDownX(event) {
//        if (!ui.contains(document.activeElement)) return;

        let key = event.key;
        
        if (key==='Escape') {
           hideDialog();
        }
    }

    function hideDialog() {
        if (prevFocused!==null) prevFocused.focus({focusVisible: false});
        if (ui!==null) ui.style.display = "none";
    };

    function selectedEdgeId() {
        showDialog(event.target.value);
    }

    function onDeleteEdgeButton() {
        hideDialog();
        sgv.graf.delEdge(hidEdgeId.value);
    };

    function onSetEdgeValueButton() {
        let val = parseFloat(editWagaE.value.replace(/,/g, '.'));
        let scope = selectScope.getScope();

        if ((val==="")||(isNaN(val))) {
            sgv.graf.delEdgeValue(hidEdgeId.value, scope);
        }
        else {
            sgv.graf.setEdgeValue(hidEdgeId.value, val, scope);
        }
        Dispatcher.graphChanged();
    };

    function onValueEnableCheckbox() {
        let isActive = checkValueE.checked;
        let scope = selectScope.getScope();
        
        if (isActive) {
            let val = parseFloat(editWagaE.value.replace(/,/g, '.'));
            if ((val==="")||(isNaN(val))) {
                val=0;
            }
            sgv.graf.setEdgeValue(hidEdgeId.value, val, scope);
        } else {
            sgv.graf.delEdgeValue(hidEdgeId.value, scope);
        }
        Dispatcher.graphChanged();
    };

    function refreshX() {
        if (ui.style.display === "block") showDialog();
    };

    return {
        show: showDialog,
        hide: hideDialog,
        refresh: refreshX,
        isVisible: () => {
            return (ui!==null)&&(ui.style.display === "block");
        }
    };
};

/* global UI, sgv, Edge, Dispatcher, SVG */

const ValuePanel = (function() {
    var btnSetN, checkValueN, editWagaN;
    var nodeId, scope;
    
    var valueBlock = UI.tag("div", {'id':'ValueBlock'});

    checkValueN = UI.newInput("checkbox", "", "", "valueCheckN");
    checkValueN.addEventListener('click', function (e) {
        activateN(e.target.checked);
    });
    valueBlock.appendChild(checkValueN);

    editWagaN = UI.newInput("number", "0", "", "wagaN");
    editWagaN.addEventListener('change', function () {
        edycjaN();
    });
    valueBlock.appendChild(editWagaN);

    btnSetN = UI.newInput("button", "set", "setvaluebutton", "setN");
    btnSetN.addEventListener('click', function () {
        edycjaN();
    });
    valueBlock.appendChild(btnSetN);

    function edycjaN() {
        let val = parseFloat(editWagaN.value.replace(/,/g, '.'));
        sgv.graf.setNodeValue(nodeId, val, scope);
        Dispatcher.graphChanged();
    };

    function activateN(isActive) {
        if (isActive) {
            editWagaN.disabled = "";
            btnSetN.disabled = "";
            let val = parseFloat(editWagaN.value.replace(/,/g, '.'));
            if (isNaN(val)) {
                val=0;
                editWagaN.value = val;
            }
            console.log(val);
            sgv.graf.setNodeValue(nodeId, val, scope);
        } else {
            editWagaN.disabled = "disabled";
            btnSetN.disabled = "disabled";
            sgv.graf.delNodeValue(nodeId, scope);
        }
        Dispatcher.graphChanged();
    };

    function showX() {
        let currentValue = sgv.graf.nodeValue(nodeId, scope);
        if ((currentValue===null)||isNaN(currentValue)) {
            checkValueN.checked = "";
            editWagaN.value = null;
            editWagaN.disabled = "disabled";
            btnSetN.disabled = "disabled";
        } else {
            checkValueN.checked = "checked";
            editWagaN.value = currentValue;
            editWagaN.disabled = "";
            btnSetN.disabled = "";
        }
    }
    
    function setNodeX(id) {
        nodeId = id;
        showX();
    }

    function setScopeX(sc) {
        scope = sc;
        showX();
    }

    function setX(id, sc) {
        nodeId = id;
        scope = sc;
        showX();
    }

    return {
        ui: valueBlock,
        setNode: setNodeX,
        setScope: setScopeX,
        show: setX
    };
});

sgv.dlgNodeProperties = new function() {
   
    var hidNodeId;
    var selectNodeId, selectScope;
    var btnConnectN, selectDestN, btnConnectSelectN;
    var checkLabelN, editLabelN;
    var valuePanel;
    var content, zeroInfo, svgView;
    var prevFocused=null;
    
    var _width = 250;
    var _height = 250;

    var notShownBefore = true;


    var ui = createUI();

    ui.addEventListener('keydown', onKeyDownX );
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
        hideDialog();
//        window.addEventListener('orientationchange', sgv.dlgNodeProperties.onOrientationChange );
        //new ResizeObserver(()=>console.log('resize')).observe(svgView);
    });

    function onOrientationChange() {
        console.log('onOrientationChange()');
    }

    function createUI() {
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvNodeProperties", "Node properties", true);

        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialog();
        });
        
        hidNodeId = UI.newInput('hidden', '0', '', 'nodeId');
        ui.appendChild(hidNodeId);

        var main = UI.tag("div", {'id':'main'});
        ui.appendChild(main);
        
        var precontent = UI.tag("div", {'id':'nodeid', 'class':'content'});

        selectNodeId = UI.tag('select',{'id':'selectNodeId'});
        selectNodeId.appendChild(UI.tag('option',{'value':0,'selected':true},{'innerHTML':'-- id --'}));
        selectNodeId.addEventListener('change', function () {
            selectedNodeId();
        });
        precontent.appendChild(UI.tag('label',{'for':'selectNodeId'},{'innerHTML':'Node: '}));
        precontent.appendChild(selectNodeId);

        main.appendChild(precontent);



        let div = UI.tag('div', {'id':'svg'});

        svgView = SVG.createSVG2('svgView', _width, _height, (event) => {
            if (event.target.id === 'svgView') {
                sgv.dlgEdgeProperties.hide();
            }
        });
        div.appendChild(svgView);
        main.appendChild(div);

        content = UI.tag("div", {'id':'tools', 'class':'content'});


        var labelBlock = UI.tag("div", {'id':'LabelBlock'});
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

        content.appendChild((selectScope = new ScopePanel(false, 'scope: ')).ui);
        content.appendChild((valuePanel = new ValuePanel()).ui);
        
        var connectBlock = UI.tag("div", {'id':'ConnectBlock'});
        
        btnConnectN = UI.newInput("button", "connect to...", "", "connectN");
        btnConnectN.addEventListener('click', function () {
            connectNodes();
        });
        connectBlock.appendChild(btnConnectN);

        selectDestN = UI.tag('select',{'id':'destN'});
        connectBlock.appendChild(selectDestN);

        btnConnectSelectN = UI.newInput("button", "^", "", "connectSelectN");
        btnConnectSelectN.addEventListener('click', function () {
            connectSelectN();
        });
        connectBlock.appendChild(btnConnectSelectN);

        content.appendChild(connectBlock);

        main.appendChild(content);

        zeroInfo = UI.tag("div", {'id':'zeroInfo', 'class':'content'}, {'innerHTML': "Select a node, please."});
        main.appendChild(zeroInfo);

        main.appendChild(UI.createTransparentBtn1('DELETE', 'DeleteButton', ()=>{
            usunN();
        }));
        
        main.appendChild(UI.createTransparentBtn1('CLOSE', 'CloseButton', ()=>{
            hideDialog();
        }));
        
        return ui;
    }

    function drawConnectedEdges(n1) {
        let connected = sgv.graf.findAllConnected(n1);
        
        let set = new Set();
        for (let j of connected.internal) set.add(j);
        for (let j of connected.horizontal) set.add(j);
        for (let j of connected.vertical) set.add(j);
        for (let j of connected.up) set.add(j);
        for (let j of connected.down) set.add(j);
        
        //let angle = 360.0/set.size;
        let angle = (2.0*Math.PI)/set.size;
        let currentAngle = angle;

        set.forEach((n2)=>{
            let x2 = 100.0*Math.sin(currentAngle);
            let y2 = 100.0*Math.cos(currentAngle);

            let eid = Edge.calcId(n1, n2);
            if (eid in sgv.graf.edges) {
                let val = sgv.graf.edgeValue(eid);
                let color = valueToColor(val);
                let wth = 2 + 5 * valueToEdgeWidth(val);

                let eVal = sgv.graf.nodeValue(n2);
                let eColor = valueToColor(eVal);

                SVG.drawSvgEdge(svgView, eid, 125, 125, 125+x2, 125+y2, color.toHexString(), wth, (event)=>{
                    let rect = event.target.getBoundingClientRect();
                    sgv.dlgEdgeProperties.show(eid, rect.x, rect.y);
                    sgv.dlgEdgeProperties.ui.style['z-index']=101;
                });
                SVG.drawSvgText(svgView, n2, 125+x2, 125+y2, n2, 'yellow', eColor.toHexString(), ()=>{
                    showDialog(n2);
                });
            }
            currentAngle += angle;
        });
    }

    function drawNode(nodeId) {
        if (typeof nodeId === 'undefined') {
            nodeId = hidNodeId.value;
        }
 
        selectScope.selScope(sgv.graf.currentScope);
        
        svgView.innerHTML = '';
        if ((nodeId) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(nodeId);
            let color = valueToColor(val);

            drawConnectedEdges(nodeId);
            
            SVG.drawSvgNode(svgView, nodeId, 125, 125, 25, color.toHexString(), ()=>{});
            SVG.drawSvgText(svgView, nodeId, 125, 125, nodeId.toString(), 'yellow', '', ()=>{});
        }
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
            svgView.innerHTML = '';
            return;
        } else {
            zeroInfo.style.display = 'none';
            content.style.display = 'block';
        }

        hidNodeId.value = nodeId;

        drawNode(nodeId);

        selectScope.refresh();
        valuePanel.show(nodeId, sgv.graf.currentScope);

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

        if ((!isMobile) && notShownBefore){
            notShownBefore = false;
            if ((typeof x!=='undefined')&&(typeof y!=='undefined')) {
                let xOffset = sgv.canvas.clientLeft;

                ui.style.top = y + "px";
                ui.style.left = (xOffset + x) + "px";
            }
        }

        ui.style.display = "block";
        prevFocused = window.document.activeElement;
        ui.focus({focusVisible: false});
    };
    
    
    function onKeyDownX(event) {
//        if (!ui.contains(document.activeElement)) return;

        let key = event.key;
        
        if (key==='Escape') {
           hideDialog();
        }
    }
    
    
    function hideDialog() {
        if (prevFocused!==null) prevFocused.focus({focusVisible: false});
        if (ui!==null) ui.style.display = "none";
    }
    
    
    function selectedNodeId() {
        showDialog(event.target.value);
    }
    

    function usunN() {
        let val = hidNodeId.value;
        hidNodeId.value = 0;
        sgv.graf.delNode(val);
        hideDialog();
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
            Dispatcher.graphChanged();
        }
    };
    
    function refreshX() {
        if (ui.style.display === "block") showDialog();
    };
    
    return {
        show: showDialog,
        hide: hideDialog,
        refresh: refreshX,
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
            }, 100);
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
