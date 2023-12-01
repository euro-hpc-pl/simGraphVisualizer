/**
 * Namespace object for cookie operations.
 * @namespace Cookie
 */
var Cookie = {};

/**
 * Sets a cookie with the specified name, value, and options.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} options - The options for the cookie.
 */
Cookie.set = (name, value, options) => {
    const opts = {
        path: "/",
        ...options
    };

    if (navigator.cookieEnabled) { //czy ciasteczka są włączone
        const cookieName = encodeURIComponent(name);
        const cookieVal = encodeURIComponent(value);
        let cookieText = cookieName + "=" + cookieVal;

        if (opts.days && typeof opts.days === "number") {
            const data = new Date();
            data.setTime(data.getTime() + (opts.days * 24*60*60*1000));
            cookieText += "; expires=" + data.toUTCString();
        }

        if (opts.path) {
            cookieText += "; path=" + opts.path;
        }
        if (opts.domain) {
            cookieText += "; domain=" + opts.domain;
        }
        if (opts.secure) {
            cookieText += "; secure";
        }

        window.document.cookie = cookieText;
    }
};


/**
 * Gets the value of a cookie with the specified name.
 * @param {string} name - The name of the cookie.
 * @returns {string|undefined} The value of the cookie, or `undefined` if not found.
 */
Cookie.get = (name) => {
    if (window.document.cookie !== "") {
        const cookies = window.document.cookie.split(/; */);

        for (let cookie of cookies) {
            const [ cookieName, cookieVal ] = cookie.split("=");
            if (cookieName === decodeURIComponent(name)) {
                return decodeURIComponent(cookieVal);
            }
        }
    }

    return undefined;
};

/**
 * Deletes a cookie with the specified name and options.
 * @param {string} name - The name of the cookie.
 * @param {Object} options - The options for the cookie.
 */
Cookie.delete = (name, options) => {
    const opts = {
        path: "/",
        ...options
    };

    const cookieName = encodeURIComponent(name);
    let cookieText = cookieName + "=";
    if (opts.path) {
        cookieText += "; path=" + opts.path;
    }
    cookieText += "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = cookieText;
};

/* global Cookie */

/**
 * Namespace object for application settings.
 * @namespace Settings
 */
var Settings = {};

if (typeof window.api==='undefined') {
    /**
     * Gets the value of a setting with the specified key using cookies.
     * @param {string} key - The key of the setting.
     * @returns {string|undefined} The value of the setting, or `undefined` if not found.
     */
    Settings.get = (key) => {
        return Cookie.get(key);
    };

    /**
     * Sets multiple settings using cookies.
     * @param {Object} pairs - The key-value pairs of settings to be set.
     */
    Settings.set = (pairs) => {
        for (let key in pairs) {
            Cookie.set(key, pairs[key]);
        }
    };
} else {
    console.log("Settings in desktopApp!");

    /**
     * Gets the value of a setting with the specified key using the desktop app API.
     * @param {string} key - The key of the setting.
     * @returns {Promise} A promise that resolves to the value of the setting.
     */
    Settings.get = (key) => {
        return window.api.invoke("getSetting",key);
    };

    /**
     * Sets multiple settings using the desktop app API.
     * @param {Object} pairs - The key-value pairs of settings to be set.
     */
    Settings.set = (pairs) => {
        window.api.invoke("setSettings", pairs);
    };
}

/* global BABYLON, sgv */

/**
 * This block of code includes utility functions to convert numerical values
 * into color values or edge widths for a graph. It also detects the type
 * of client (mobile or desktop) and dynamically loads the appropriate stylesheet
 * on window load.
 * The DEMO_MODE constant is used to switch between normal and demonstration modes. 
 */


/** Set a flag for demonstration mode.
 * @type Boolean
 */
const DEMO_MODE = false;

/**
 * Returns a random number between min and max values.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random number between min and max.
 */
function getRandom(min, max) {
    return (min + (Math.random() * (max - min)));
};


/**
 * Converts a given value into a color.
 * The colors are based on the current limits set on sgv.graf object.
 * @param {number} val - The value to convert into a color.
 * @returns {BABYLON.Color3} The color corresponding to the given value.
 */
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

/**
 * Converts a given value into a color. This is a backup version.
 * The colors are based on the current limits set on sgv.graf object.
 * @param {number} val - The value to convert into a color.
 * @returns {BABYLON.Color3} The color corresponding to the given value.
 */
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


/**
 * Converts a given value into an edge width.
 * The edge widths are based on the current limits set on sgv.graf object.
 * @param {number} val - The value to convert into an edge width.
 * @returns {number} The edge width corresponding to the given value.
 */
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

// Detect if the client is a mobile device. Default: false
var isMobile = false;

/**
 * Detects the client type and updates the global variable isMobile accordingly.
 */
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


// Detect the client type on load.
detectClient();

/**
 * On window load, create a new link element for the appropriate stylesheet (mobile or desktop),
 * and append it to the head of the document. Update CSS variables accordingly.
 */
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

/**
 * Namespace for SVG elements drawing.
 * @namespace SVG
 */
const SVG = {};

/**
 * SVG XML namespace.
 * @type {string}
 */
SVG.NS = "http://www.w3.org/2000/svg";

/**
 * Creates an SVG element with the specified ID, width, height, and click event handler.
 * @param {string} _id - The ID of the SVG element.
 * @param {number} _width - The width of the SVG element.
 * @param {number} _height - The height of the SVG element.
 * @param {Function} _onClick - The click event handler function.
 * @returns {SVGSVGElement} The created SVG element.
 */
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

/**
 * Creates an SVG element with the specified ID, viewBox, and click event handler.
 * @param {string} _id - The ID of the SVG element.
 * @param {number} _width - The width of the SVG element.
 * @param {number} _height - The height of the SVG element.
 * @param {Function} _onClick - The click event handler function.
 * @returns {SVGSVGElement} The created SVG element.
 */
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

/**
 * Draws a text element in the SVG with the specified attributes and click event handler.
 * @param {SVGSVGElement} svgView - The SVG element to draw the text in.
 * @param {string} id - The ID of the text element.
 * @param {number} x - The x-coordinate of the text element.
 * @param {number} y - The y-coordinate of the text element.
 * @param {string} txt - The text content.
 * @param {string} txtColor - The color of the text.
 * @param {string} bgColor - The background color of the text.
 * @param {Function} onClick - The click event handler function.
 */
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


/**
 * Draws a circle element in the SVG with the specified attributes and click event handler.
 * @param {SVGSVGElement} svgView - The SVG element to draw the circle in.
 * @param {string} nodeId - The ID of the circle element.
 * @param {number} x - The x-coordinate of the center of the circle.
 * @param {number} y - The y-coordinate of the center of the circle.
 * @param {number} r - The radius of the circle.
 * @param {string} color - The fill color of the circle.
 * @param {Function} onClick - The click event handler function.
 */
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


/**
 * Draws a line element in the SVG with the specified attributes and click event handler.
 * @param {SVGSVGElement} svgView - The SVG element to draw the line in.
 * @param {string} eid - The ID of the line element.
 * @param {number} bX - The x-coordinate of the starting point of the line.
 * @param {number} bY - The y-coordinate of the starting point of the line.
 * @param {number} eX - The x-coordinate of the ending point of the line.
 * @param {number} eY - The y-coordinate of the ending point of the line.
 * @param {string} color - The color of the line.
 * @param {number} wth - The width of the line.
 * @param {Function} onClick - The click event handler function.
 */
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

/**
 * @namespace
 * @description This object provides functionality related to dispatching events in the application.
 */
var Dispatcher = {};

/**
 * Triggers UI updates when the graph has been deleted.
 * 
 * @function
 */
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

/**
 * Triggers UI updates when the graph has been created.
 *
 * @function
 */
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

/**
 * Triggers UI updates when the graph has been changed.
 *
 * @function
 */
Dispatcher.graphChanged = ()=>{
    sgv.dlgCPL.refresh();
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

/**
 * Triggers UI updates when the current scope has been changed.
 *
 * @function
 */
Dispatcher.currentScopeChanged = ()=>{
    sgv.dlgCPL.refresh();
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

/**
 * Triggers UI updates when the view mode has been changed.
 *
 * @function
 */
Dispatcher.viewModeChanged = ()=>{
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

/* global sgv, BABYLON, Edge */

/**
 * @class
 * @classdesc Solid Particle System module for creating and managing node and edge particles in a scene.
 * @memberof sgv
 * 
 * @constructor
 * @param {BABYLON.Scene} scene - The Babylon.js scene.
 * @returns {Object} An object with functions for initializing, updating, and managing node and edge particles.
 */
const SolidPS = (function(scene) {
    /**
     * Solid Particle System for nodes.
     * @type {BABYLON.SolidParticleSystem}
     */
    var NodeSPS = new BABYLON.SolidParticleSystem("NodeSPS", scene, { isPickable: true, expandable: true, enableDepthSort: true });

    /**
     * Solid Particle System for edges.
     * @type {BABYLON.SolidParticleSystem}
     */
    var EdgeSPS = new BABYLON.SolidParticleSystem("EdgeSPS", scene, { isPickable: true, expandable: true, enableDepthSort: true });

    /**
     * Mesh representing node particles.
     * @type {?BABYLON.Mesh}
     */
    var NodeSPSmesh = null;

    /**
     * Mesh representing edge particles.
     * @type {?BABYLON.Mesh}
     */
    var EdgeSPSmesh = null;
    
    /**
     * Counter for node particles.
     * @type {number}
     */
    var eCnt = 0;
    
    /**
     * Counter for edge particles.
     * @type {number}
     */
    var nCnt = 0;
    
    /**
     * Array to store indices of killed node particles.
     * @type {number[]}
     */
    var nKilled = [];

    /**
     * Array to store indices of killed edge particles.
     * @type {number[]}
     */
    var eKilled = [];
    
    /**
     * Default sphere mesh used for node particles.
     * @type {BABYLON.Mesh}
     */
    var defaultSphere = BABYLON.MeshBuilder.CreateSphere("defaultSphere", {diameter: 3, segments: 8, updatable: false});

    /**
     * Default cylinder mesh used for edge particles.
     * @type {BABYLON.Mesh}
     */
    var defaultCylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:1, diameter:1, tessellation:6, updatable: false});
    
    defaultSphere.setEnabled(false);
    defaultCylinder.setEnabled(false);
    
    /**
     * Initializes the solid particle systems with the specified number of nodes and edges.
     * @param {number} [nbN=100] - The initial number of node particles.
     * @param {number} [nbE=500] - The initial number of edge particles.
     */
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

    /**
     * Adds additional space for edge particles in the particle system.
     * @param {number} [nb=500] - The number of additional edge particles to add.
     */
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
        
    /**
     * Adds additional space for node particles in the particle system.
     * @param {number} [nb=100] - The number of additional node particles to add.
     */
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

    /**
     * Refreshes the state and visibility of node particles in the particle system.
     */
    function refreshNodesX() {
        NodeSPS.setParticles();
        NodeSPS.refreshVisibleSize();
    };

    /**
     * Refreshes the state and visibility of edge particles in the particle system.
     */
    function refreshEdgesX() {
        EdgeSPS.setParticles();
        EdgeSPS.refreshVisibleSize();
    };

    /**
     * Refreshes the state and visibility of both node and edge particles in the particle system.
     */
    function refreshX() {
        refreshNodesX();
        refreshEdgesX();
    };
    
    /**
     * Generates a unique ID for a node particle.
     * @private
     * @returns {number} The unique ID.
     */
    function _uniqueNodeId() {
//        if (nKilled.length>0) {
//            return nKilled.pop();
//        }

        let id = nCnt++;
        let size = NodeSPS.nbParticles;
        if (id>=size) addSpaceForNodesX(100);
        return id;
    };
    
    /**
     * Generates a unique ID for an edge particle.
     * @private
     * @returns {number} The unique ID.
     */
    function _uniqueEdgeId() {
//        if (eKilled.length>0) {
//            return eKilled.pop();
//        }

        let id = eCnt++;
        let size = EdgeSPS.nbParticles;
        if (id>=size) addSpaceForEdgesX(500);
        return id;
    };

    /**
     * Binds a node to a particle in the particle system.
     * @param {Object} node - The node object to bind.
     * @param {BABYLON.Vector3} position - The position of the node.
     * @param {BABYLON.Color3} color - The color of the node.
     * @returns {?BABYLON.SolidParticle} The bound particle, or null if not found.
     */
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

    /**
     * Updates the value (color) of a bound node particle.
     * @param {Object} node - The node object whose value to update.
     * @param {BABYLON.Color3} nodeColor - The new color value.
     */
    function updateNodeValueX(node, nodeColor) {
        let idx = node.meshId();
        let mesh = NodeSPS.particles[idx];
        
        mesh.color = nodeColor;
        mesh.isVisible = true;
    }

    /**
     * Unbinds a node from its associated particle.
     * @param {Object} node - The node object to unbind.
     */
    function unbindNodeX(node) {
        let idx = node.meshId();
        //console.log(node);
        //console.log(NodeSPS.particles[idx]);
        NodeSPS.particles[idx].isVisible = false;
        NodeSPS.particles[idx].nodeId = null;
        
        nKilled.push(idx);
    }

    /**
     * Sets the properties of an edge particle in the particle system.
     * @param {Object} edge - The edge object.
     * @param {BABYLON.Color3} edgeColor - The color of the edge.
     * @param {number} edgeWidth - The width of the edge.
     * @param {BABYLON.Vector3} b - The starting position of the edge.
     * @param {BABYLON.Vector3} e - The ending position of the edge.
     */
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

    /**
     * Updates the geometry (position and rotation) of a bound edge particle.
     * @param {Object} edge - The edge object.
     * @param {BABYLON.Vector3} b - The starting position of the edge.
     * @param {BABYLON.Vector3} e - The ending position of the edge.
     */
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

    /**
     * Updates the value (color and width) of a bound edge particle.
     * @param {Object} edge - The edge object.
     * @param {BABYLON.Color3} edgeColor - The new color value.
     * @param {number} edgeWidth - The new width value.
     */
    function updateEdgeValueX(edge, edgeColor, edgeWidth) {
        let idx = edge.meshId();
        let mesh = EdgeSPS.particles[idx];
        
        mesh.color = edgeColor;
        mesh.scaling.x = edgeWidth;
        mesh.scaling.z = edgeWidth;
        mesh.isVisible = true;
    }
    
    /**
     * Binds an edge to a particle in the particle system.
     * @param {Object} edge - The edge object to bind.
     * @returns {?BABYLON.SolidParticle} The bound particle, or null if not found.
     */
    function bindEdgeX(edge) {
        let id = _uniqueEdgeId();
        let m = EdgeSPS.particles[id];

        if (typeof m !== 'undefined') {
            m.edgeId = edge.id;
            return m;
        }
        
        return null;
    }
    
    /**
     * Unbinds an edge from its associated particle.
     * @param {Object} edge - The edge object to unbind.
     */
    function unbindEdgeX(edge) {
        let idx = edge.meshId();
        //console.log(edge);
        //console.log(EdgeSPS.particles[idx]);
        EdgeSPS.particles[idx].isVisible = false;
        EdgeSPS.particles[idx].edgeId = null;
        
        eKilled.push(idx);
    }
    
    /**
     * Handles the picking event on the particle systems and returns the type and ID of the picked element.
     * @param {Object} pickInfo - The pick information.
     * @returns {Object} An object with the type and ID of the picked element.
     */
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
    
    /**
     * Resets the particle system counters to their initial values.
     */
    function resetX() {
        nCnt = 0;
        eCnt = 0;
    }
    
    /**
     * public interface
     */
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

/**
 * @class
 * @classdesc Constructs a GraphSize object.
 * @constructor
 * @param {number} c - The number of columns.
 * @param {number} r - The number of rows.
 * @param {number} l - The number of layers.
 * @param {number} kl - The K left parameter.
 * @param {number} kr - The K right parameter.
 */
var GraphSize = (function(c, r, l, kl, kr) {
    this.cols = c;
    this.rows = r;
    this.lays = l;
    this.KL = kl;
    this.KR = kr;
});

/**
 * @class
 * @classdesc Constructs a GraphDescr object.
 * @constructor
 */
var GraphDescr = (function() {
    this.size = new GraphSize(0,0,0,0,0);

    /**
     * Sets the type and size of the graph.
     * @param {string} _t - The type of the graph.
     * @param {number} _c - The number of columns.
     * @param {number} _r - The number of rows.
     * @param {number} _l - The number of layers.
     * @param {number} _kl - The K left parameter.
     * @param {number} _kr - The K right parameter.
     */
    this.set = function(_t, _c, _r, _l, _kl, _kr) {
        this.setType(_t);
        this.setSize(_c, _r, _l, _kl, _kr);
    };
    
    /**
     * Sets the type of the graph.
     * @param {string} _t - The type of the graph.
     */
    this.setType = function(_t) {
        this.type = _t;
    };

    /**
     * Sets the size of the graph.
     * @param {number} _c - The number of columns.
     * @param {number} _r - The number of rows.
     * @param {number} _l - The number of layers.
     * @param {number} _kl - The K left parameter.
     * @param {number} _kr - The K right parameter.
     */
    this.setSize = function(_c, _r, _l, _kl, _kr) {
        this.size = new GraphSize( _c, _r, _l, _kl, _kr );
    };
});

/**
 * @class This class represents a temporary structure for storing graph data. It provides methods
 * for adding edges and nodes to the structure.
 */
var TempGraphStructure = (function() {

    /** @property {Array} nodes - An array for storing nodes. */
    this.nodes = [];

    /** @property {Array} edges - An array for storing edges. */
    this.edges = [];
    
    /**
     * Function to add an edge to the structure with a single value.
     *
     * @param {number} _n1 - The ID of the first node of the edge.
     * @param {number} _n2 - The ID of the second node of the edge.
     * @param {number} _value - The value of the edge.
     */
    this.addEdge1 = function(_n1, _n2, _value) {
        this.edges.push({
            n1: _n1,
            n2: _n2,
            values: {
                'default': _value
            }
        });
    };

    /**
     * Function to add an edge to the structure with multiple values.
     *
     * @param {number} _n1 - The ID of the first node of the edge.
     * @param {number} _n2 - The ID of the second node of the edge.
     * @param {Object} _values - The values of the edge.
     */
    this.addEdge2 = function(_n1, _n2, _values) {
        this.edges.push({
            n1: _n1,
            n2: _n2,
            values: _values
        });
    };
    
    /**
     * Function to add a node to the structure with a single value.
     *
     * @param {number} _id - The ID of the node.
     * @param {number} _value - The value of the node.
     * @param {?string} _label - The label of the node.
     */
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

    /**
     * Function to add a node to the structure with multiple values.
     *
     * @param {number} _id - The ID of the node.
     * @param {Object} _values - The values of the node.
     * @param {?string} _label - The label of the node.
     */
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

/* global BABYLON, sgv */

/**
 * @class
 * @classdesc Represents a label that can be displayed in a 3D scene. It's attached to a plane, with the plane being displayed at a certain position.
 * @memberOf sgv
 * @constructor
 * @param {number|string} labelId - Usually Node.id. 
 * @param {string} txt - The text to be displayed on the label.
 * @param {BABYLON.Vector3} position - The position over which the label is to be displayed.
 * @returns {Label} - The Label object.
 */
var Label = (function (labelId, txt, position) {

    /**
     * Creates the label at a given position.
     * @async
     * @param {BABYLON.Vector3} position - The position at which to create the label.
     * @param {boolean} enabled - Indicates whether the label is enabled.
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
     * Sets the text for the label.
     * @async
     * @param {string} txt - The text to set.
     * @param {boolean} enabled - Indicates whether the label is enabled.
     * @returns {undefined}
     */
    this.setText = async function(txt, enabled) {
        this.text = txt;
        
        if (this.plane!==null)
            this.plane.dispose();
        
        this.createMe(this.position, enabled);
    };
    
    this.setColors = function(_bgcolor, enabled) {
        if (this.text.charAt(0)==='&')
            this.bgcolor = _bgcolor;
        else
            this.bgcolor = this.defbgcolor;
        
        if (this.plane!==null)
            this.plane.dispose();
        
        this.createMe(this.position, enabled);
    };
    
    /**
     * Gets the text for the label.
     * @returns {string} - The text of the label.
     */
    this.getText = function() {
        return this.text;
    };
    
    /**
     * Sets the position for the label.
     * @param {BABYLON.Vector3} pos - The position to set.
     * @returns {undefined}
     */
    this.setPosition = function(pos) {
        this.position = pos;
        
        if (this.plane !==null)
            this.plane.position = pos.add(this.planeOffset);
    };

    /**
     * Creates the plane on which the label is displayed.
     * @returns {BABYLON.Plane} - The plane created.
     * @param bgcolor - should be object: { r:ubyte, g:ubyte, b:ubyte, a:float }
     */
    this.createPlane = function() {
        let txt = this.text;
        if (txt.charAt(0)==='&')
            txt = txt.substring(1);

        let font_size = 64;
        let font = "normal " + font_size + "px Arial,Helvetica,sans-serif";

        let str_bgcol = 'rgba('+String(this.bgcolor.r)+','+String(this.bgcolor.g)+','+String(this.bgcolor.b)+','+String(this.bgcolor.a)+')';
        
        let ratio = 0.05;

        let tmpTex = new BABYLON.DynamicTexture("DynamicTexture", 64, sgv.scene);
        let tmpCTX = tmpTex.getContext();

        tmpCTX.font = font;
        
        let DTWidth = tmpCTX.measureText(txt).width + 8;
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
        
        plane.material.diffuseTexture.drawText(txt, null, null, font, '#ffff00', str_bgcol, true);
        
        //plane.material.specularColor = new BABYLON.Color3(1, 1, 0);
        //plane.material.ambientColor = new BABYLON.Color3(1, 1, 0);
        plane.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        return plane;
    };

    /**
     * Sets whether the label is enabled.
     * @param {boolean} b - If true, the label is enabled. If false, it is not.
     * @returns {undefined}
     */
    this.setEnabled = function (b) {
        if (this.plane!==null)
            this.plane.setEnabled(b);
        else if (b) {
            this.createMe(this.position, true );
        }
    };

    this.defbgcolor = { r:40, g:40, b:40, a:0.5 };
    this.bgcolor = this.defbgcolor;
    this.text = txt;
    this.planeOffset = new BABYLON.Vector3(0.0, 5.0, 0.0);
    this.position = position;
    this.id = labelId;
    this.plane = null;
});


"use strict";
/* global BABYLON, greenMat, redMat, grayMat0, grayMat1, advancedTexture, sgv */

/**
 * Create a new label with given id at the specified position.
 * @param {number|string} id - The id of the label to be created.
 * @param {BABYLON.Vector3} position - The position where the label will be created.
 * @returns {Label} The created Label instance.
 */
const createLabel = function(id, position) {
    return new Label("q" + id, "q" + id, position);
};

/**
 * @class
 * @classdesc Represents a Node in the graph. Each Node has various properties including its id, position, label, etc.
 * @memberOf sgv.Graph
 * 
 * @constructor
 * @param {object} graf - The parent graph this node belongs to.
 * @param {number|string} id - The id of the node.
 * @param {number} x - The x-coordinate of the node's position.
 * @param {number} y - The y-coordinate of the node's position.
 * @param {number} z - The z-coordinate of the node's position.
 * @param {object} _values - The initial values of the node.
 */
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

    // Define the 'position' property to be able to get or set the position of the node.
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

    /**
     * Disposes the node by unbinding it and disposing its label.
     * @returns {undefined}
     */
    this.dispose = function() {
        sgv.SPS.unbindNode(this);
        
        if ((label!==null) && (label.plane!==null)) {
            label.plane.dispose();
        }
        delete label;
    };

    /**
     * Clears the node by calling dispose function.
     * @returns {undefined}
     */
    this.clear = function() {
        this.dispose();
    };

    /**
     * Shows or hides the label depending on the argument.
     * @param {boolean} b - If true, the label will be shown; if false, the label will be hidden.
     * @returns {undefined}
     */
    this.showLabel = function(b) {
        if (typeof b!== 'undefined') {
            this.labelIsVisible = b;
        }
        label.setEnabled(this.labelIsVisible && this.parentGraph.labelsVisible);
    };

    /**
     * Sets the label text and visibility status.
     * @param {string} t - The text to set for the label.
     * @param {boolean} b - The visibility status to set for the label.
     * @returns {undefined}
     */
    this.setLabel = function( t, b ) {
        if (typeof b!== 'undefined') {
            this.labelIsVisible = b;
        }
        label.setText(t, this.labelIsVisible && this.parentGraph.labelsVisible);
    };

    /**
     * Returns the visibility status of the label.
     * @returns {boolean} True if the label is visible, false otherwise.
     */
    this.isLabelVisible = function() {
        return this.labelIsVisible;
    };

    /**
     * Returns the text of the label.
     * @returns {string} The text of the label.
     */
    this.getLabel = function() {
        return label.getText();
    };

    /**
     * Moves the node by a given vector.
     * @param {BABYLON.Vector3} diff - The vector to add to the current position of the node.
     * @returns {undefined}
     */
    this.move = function(diff) {
        this.mesh.position.addInPlace(diff);
        //this.updateLabel();
    };

    /**
     * Increments the edge check count of the node.
     * @returns {undefined}
     */
    this.addCheck = function() {
        this._chckedEdges++;
        //mesh.material = sgv.grayMat1;
    };

    /**
     * Decrements the edge check count of the node.
     * @returns {undefined}
     */
    this.delCheck = function() {
        this._chckedEdges--;
        //if (this._chckedEdges === 0)
        //    mesh.material = sgv.grayMat0;
    };

    /**
     * Retrieves the value of the node in the specified scope.
     * @param {string} scope - The scope from which to get the value.
     * @returns {Number|NaN} - The value of the node in the specified scope. If no value is present, NaN is returned.
     */
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

    /**
     * Deletes the value of the node in the specified scope.
     * @param {string} scope - The scope from which to delete the value.
     * @returns {undefined}
     */
    this.delValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            delete this.values[scope];
        }
    };
    
    /**
     * Sets the value of the node in the specified scope.
     * @param {number} val - The value to set.
     * @param {string} scope - The scope in which to set the value.
     * @returns {undefined}
     */
    this.setValue = function(val, scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        this.values[scope] = val;
    };
    
    /**
     * Updates the color of the node based on the value in the specified scope.
     * @param {string} scope - The scope based on which the node color is updated.
     * @returns {undefined}
     */
    this.displayValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }

        let color = valueToColor( (scope in this.values)?this.values[scope]:Number.NaN );
        
        if (scope in this.values) {
            if (this.values[scope] < 0) {
                label.setColors({r:255,g:0,b:0,a:0.8}, this.isLabelVisible());
            }
            else if (this.values[scope] > 0) {
                label.setColors({r:0,g:128,b:0,a:0.8}, this.isLabelVisible());
            }
            else {
                label.setColors({r:0,g:0,b:255,a:0.8}, this.isLabelVisible());
            }
        }
        else {
            label.setColors({r:40,g:40,b:40,a:0.5}, this.isLabelVisible());    
        }
        
        
        sgv.SPS.updateNodeValue(this, color);
    };

    /**
     * Returns the color of the node based on the value in the specified scope.
     * @param {string} scope - The scope based on which the node color is returned.
     * @returns {BABYLON.Color4} - The color of the node based on the value in the specified scope.
     */
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

    /**
     * Returns the mesh ID of the node.
     * @returns {number} - The mesh ID of the node.
     */
    this.meshId = ()=>this.mesh.idx;

    this.mesh = sgv.SPS.bindNode(this, new BABYLON.Vector3( x, y, z ), this.currentColor());
    
    if (this.mesh===null) {
        console.error("Can't bind NodeSPS");
    }
    else {
        var label = createLabel(this.id, this.mesh.position);
    }

});

/**
 * Creates a Node from a QDescr.
 * @param {object} graf - The parent graph this node belongs to.
 * @param {object} qd - The QDescr to use when creating the Node.
 * @returns {Node} The created Node instance.
 */
Node.fromQDescr = (graf, qd)=>{
    let pos = graf.calcPosition2(qd.x, qd.y, qd.z, qd.n0());
    return new Node(graf, qd.toNodeId(graf.rows, graf.cols), pos.x, pos.y, pos.z );
};

/**
 * Creates a Node from XYZ and IJK.
 * @param {object} graf - The parent graph this node belongs to.
 * @param {number} x - The x-coordinate of the node's position.
 * @param {number} y - The y-coordinate of the node's position.
 * @param {number} z - The z-coordinate of the node's position.
 * @param {number} i - The i-coordinate of the node's position.
 * @param {number} j - The j-coordinate of the node's position.
 * @param {number} k - The k-coordinate of the node's position.
 * @returns {Node} The created Node instance.
 */
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

/**
 * @class
 * @classdesc Edge class representing an edge in a graph.
 * @memberOf sgv.Graph
 * 
 * @constructor
 * @param {object} graf - The parent graph object.
 * @param {number|string} b - The identifier of the beginning node of the edge.
 * @param {number|string} e - The identifier of the ending node of the edge.
 */
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

    /**
     * Retrieves the identifier of the mesh associated with the edge.
     * @returns {number} The mesh identifier.
     */
    this.meshId = ()=>mesh.idx;
    
    /**
     * Clears the edge by unbinding it from the scene particle system.
     */
    this.clear = function() {
        sgv.SPS.unbindEdge(this);
    };

    /**
     * Toggles the check flag of the edge.
     */
    this.switchCheckFlag = function () {
        this._checked = !this._checked;

        this.parentGraph.checkNode(this.begin, this._checked);
        this.parentGraph.checkNode(this.end, this._checked);

        //this.instance.material = this._checked ? sgv.grayMat1 : sgv.grayMat0;
    };

    /**
     * Deletes the value associated with a scope for the edge.
     * @param {string} [scope] - The scope for which to delete the value. If not provided, the current scope is used.
     */
    this.delValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            delete this.values[scope];
        }
    };

    /**
     * Retrieves the value associated with a scope for the edge.
     * @param {string} [scope] - The scope for which to retrieve the value. If not provided, the current scope is used.
     * @returns {number} The value associated with the scope.
     */
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

    /**
     * Sets the value associated with a scope for the edge.
     * @param {number} val - The value to set.
     * @param {string} [valId='default'] - The value identifier. Defaults to 'default'.
     */
    this.setValue = function (val, valId) {
        if (typeof valId === 'undefined') {
            valId = 'default';
        }
        
        //console.log(valId, val);

        this.values[valId] = val;

        this.displayValue(valId);
    };

    /**
     * Displays the value associated with a value identifier for the edge.
     * @param {string} [valId='default'] - The value identifier. Defaults to 'default'.
     */
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

    /**
     * Updates the edge by setting its color, width, and position based on the current value.
     */
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

// Static method

/**
 * Calculates the identifier for an edge based on the beginning and ending node identifiers.
 * @param {number|string} b - The identifier of the beginning node of the edge.
 * @param {number|string} e - The identifier of the ending node of the edge.
 * @returns {string} The calculated identifier.
 */
Edge.calcId = (b, e) => {
    if (typeof b==='string') b = parseInt(b,10); 
    if (typeof e==='string') e = parseInt(e,10); 

    if ((typeof b !== 'number')||(typeof e !== 'number')) {
        console.error("Edge begin and end must be a numbers");
    }
    
    return (b < e)?("" + b + "," + e):("" + e + "," + b);
};

"use strict";

/**
 * Constructs a QbDescr object and returns it.
 * @function
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} i - Either 0 or 1
 * @param {number} j - Either 0 or 1
 * @param {number} k - Either 0 or 1
 * @returns {QbDescr}
 */
const qD = function (x, y, z, i, j, k) {
    return new QbDescr(x, y, z, i, j, k);
};

/**
 * @class Represents the QbDescr.
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} i - Either 0 or 1
 * @param {number} j - Either 0 or 1
 * @param {number} k - Either 0 or 1
 */
const QbDescr = (function (x, y, z, i, j, k) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.i = i;
    this.j = j;
    this.k = k;

    /**
     * Returns the value for n0.
     * @returns {number}
     */
    this.n0 = function () {
        return (((this.i << 1) + this.j) << 1) + this.k;
    };

    /**
     * Returns the value for n1.
     * @returns {number}
     */
    this.n1 = function () {
        return (((this.i << 1) + this.j) << 1) + this.k + 1;
    };

    /**
     * Returns the node ID.
     * @param {number} rows - The number of rows.
     * @param {number} cols - The number of columns.
     * @returns {number}
     */
    this.toNodeId = function(rows, cols) {
        return 8 * (this.x + (this.y + this.z * rows) * cols) + this.n1();
    };

});

/**
 * Static method to create a QbDescr object from a given node ID, rows and columns.
 * @function
 * @static
 * @param {number} nodeIdA - The node ID.
 * @param {number} rows - The number of rows.
 * @param {number} cols - The number of columns.
 * @returns {QbDescr}
 */
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

/**
 * @class
 * @classdesc Represents a graph with nodes and edges.
 * @memberOf sgv
 */
const Graph = /** @class */ (function () {
    /** Object that holds nodes of the graph. Keys are node IDs.
     * @type {Object}
     */
    this.nodes = {};
    /** Object that holds edges of the graph. Keys are edge IDs.
     * @type {Object}
     */
    this.edges = {};
    /** Object that holds nodes that have been deleted. Keys are node IDs.
     * @type {Object}
     */
    this.missing = {};

    /** Represents the type of graph. Default is 'generic'.
     * @type {string}
     */
    this.type = 'generic';
    /** Array of value scopes available for this graph. Default is ['default'].
     * @type {string[]}
     */
    this.scopeOfValues = ['default'];
    /** Current scope of values to be shown on the graph. Default is 'default'.
     * @type {string}
     */
    this.currentScope = 'default';
    /** Limit of green color representation for values on the graph. Default is 1.0.
     * @type {number}
     */
    this.greenLimit = 1.0;
    /** Limit of red color representation for values on the graph. Default is -1.0.
     * @type {number}
     */
    this.redLimit = -1.0;

    /** Indicates whether node labels are visible or not. Default is false.
     * @type {Bool}
     */
    this.labelsVisible = false;

    /**
     * Dispose of the graph by deleting all its edges and nodes.
     * Also triggers graphDeleted event.
     */
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

    /**
     * Alias for dispose function.
     */
    this.clear = function () {
        this.dispose();
    };

    /**
     * Returns the number of nodes in the graph.
     * @returns {number}
     */
    this.maxNodeId = function () {
        return Object.keys(this.nodes).length;
    };


    /**
     * Add a node to the graph with given nodeId and value.
     * @param {number} nodeId
     * @param {number} val - Initial value for the node.
     * @returns {Node}
     */
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

    /**
     * Given an object and a value, it returns the key corresponding to the value.
     * @param {Object} object
     * @param {number|string} value
     * @returns {Object.key}
     */
    this.getKeyByValue = function(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    };

    /**
     * Given a scope, it returns the index of the scope in the scopeOfValues array.
     * @param {string} scope
     * @returns {number}
     */
    this.getScopeIndex = function(scope) {
        return Object.keys(this.scopeOfValues).find(key => this.scopeOfValues[key] === scope);
    };
    
    /**
     * Add an edge to the graph between given nodes. 
     * If edge already exists, return the existing edge.
     * @param {Node} node1
     * @param {Node} node2
     * @returns {Edge}
     */
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

    /**
     * Delete an edge from the graph.
     * Also triggers graphChanged event.
     * @param {number} edgeId
     */
    this.delEdge = function (edgeId) {
        this.edges[edgeId].clear();
        delete this.edges[edgeId];
        
        Dispatcher.graphChanged();
    };

    /**
     * Returns all nodes connected to the given node.
     * @param {number} nodeId
     * @returns {object} - An object containing arrays of different types of connected nodes.
     */
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

    /**
     * Find and delete all edges connected to a node. Return removed edges.
     * @param {number} nodeId
     * @returns {object} - Removed edges.
     */
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

    /**
     * Delete a node from the graph.
     * Also triggers graphChanged event.
     * @param {number} nodeId
     */
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

    /**
     * Restore a deleted node back to the graph.
     * Also triggers graphChanged event.
     * @param {number} nodeId
     * @returns {boolean}
     */
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


    /**
     * Update all edges connected to a node.
     * @param {number} nodeId
     */
    this.findAndUpdateEdges = function (nodeId) {
        for (const key in this.edges) {
            if ((this.edges[key].begin.toString() === nodeId) || (this.edges[key].end.toString() === nodeId)) {
                this.edges[key].update();
            }
        }
    };

    /**
     * Converts a string representing graph structure into a structured object.
     * @param {string} string - String representation of the graph.
     * @returns {object|null}
     */
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

    /**
     * Load scope values into the graph. If the scope is new, add it to the scopeOfValues array.
     * @param {string} scope
     * @param {string} data - String representation of the graph structure.
     * @returns {object} - An object indicating whether the scope was new and its index in scopeOfValues array.
     */
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

    /**
     * Add a scope to the scopeOfValues array. Returns the index of the added scope.
     * @param {string} scope
     * @returns {number} - Index of the added scope.
     */
    this.addScopeOfValues = function(scope) {
        if ( (typeof scope !== 'undefined') && ! this.scopeOfValues.includes(scope) ) {
            this.scopeOfValues.push(scope);
            return this.scopeOfValues.indexOf(scope);
        }
        return -1;
    };

    /**
     * Delete a scope from the scopeOfValues array except 'default'. 
     * If the deleted scope was the currentScope, set the currentScope to 'default'.
     * Returns the index of the currentScope.
     * @param {string} scope
     * @returns {number} - Index of the current scope.
     */
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

    /**
     * Check if a scope exists in the scopeOfValues array.
     * @param {string} scope
     * @returns {boolean} - true if the scope exists, false otherwise.
     */
    this.hasScope = function (scope) {
        return (typeof scope !== 'undefined') && this.scopeOfValues.includes(scope);
    };
    
    /**
     * Display values of the given scope on the graph. If no scope is given, use currentScope.
     * @param {string} scope - optional
     * @returns {Promise<boolean>}
     */
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


    /**
     * returns the label visibility
     * @param {number} nodeId
     * @returns {boolean}
     */
    this.isNodeLabelVisible = function (nodeId) {
        return this.nodes[nodeId].isLabelVisible();
    };

    /**
     * Get the label of a node in the graph.
     * @param {number} nodeId
     * @returns {string}
     */
    this.nodeLabel = function (nodeId) {
        return this.nodes[nodeId].getLabel();
    };

    /**
     * Get the position of a node in the graph.
     * @param {number} nodeId
     * @returns {BABYLON.Vector3}
     */
    this.nodePosition = function (nodeId) {
        return this.nodes[nodeId].position;
    };

    /**
     * Add or remove check mark from a node.
     * @param {number} nodeId
     * @param {boolean} check - If true, add check mark, otherwise remove it.
     */
    this.checkNode = function (nodeId, check) {
        if (check) {
            this.nodes[nodeId].addCheck();
        } else {
            this.nodes[nodeId].delCheck();
        }
    };

    /**
     * Switch the check flag of an edge.
     * @param {number} id - ID of the edge.
     */
    this.edgeDoubleClicked = function (id) {
        this.edges[id].switchCheckFlag();
    };

    /**
     * Move a node by a given difference in position. Also updates all edges connected to the node.
     * @param {number} nodeId
     * @param {BABYLON.Vector3} diff - Difference in position.
     */
    this.moveNode = function (nodeId, diff) {
        this.nodes[nodeId].move(diff);
        this.findAndUpdateEdges(nodeId);
    };

    /**
     * Set the value of an edge for a given scope. Also updates the display.
     * @param {number} edgeId
     * @param {number} value
     * @param {string} scope
     */
    this.setEdgeValue = function (edgeId, value, scope) {
        this.edges[edgeId].setValue(value, scope);
        this.edges[edgeId].displayValue();
    };

    /**
     * Delete the value of an edge for a given scope. Also updates the display.
     * @param {number} edgeId
     * @param {string} scope
     */
    this.delEdgeValue = function (edgeId, scope) {
        this.edges[edgeId].delValue(scope);
        this.edges[edgeId].displayValue();
    };

    /**
     * Get the value of an edge for a given scope.
     * @param {number} edgeId
     * @param {string} scope
     * @returns {number}
     */
    this.edgeValue = function(edgeId, scope) {
        return this.edges[edgeId].getValue(scope);
    };

    /**
     * Set the value of a node for a given scope. Also updates the display.
     * @param {number} nodeId
     * @param {number} value
     * @param {string} scope
     */
    this.setNodeValue = function (nodeId, value, scope) {
        this.nodes[nodeId].setValue(value, scope);
        this.nodes[nodeId].displayValue();
    };

    /**
     * Delete the value of a node for a given scope. Also updates the display.
     * @param {number} nodeId
     * @param {string} scope
     */
    this.delNodeValue = function (nodeId, scope) {
        this.nodes[nodeId].delValue(scope);
        this.nodes[nodeId].displayValue();
    };

    /**
     * Get the value of a node for a given scope.
     * @param {number} nodeId
     * @param {string} scope
     * @returns {number}
     */
    this.nodeValue = function (nodeId,scope) {
        return this.nodes[nodeId].getValue(scope);
    };

    /**
     * Get the minimum and maximum edge value for a given scope. 
     * If no scope is given, use currentScope.
     * @param {string} scope - optional
     * @returns {object} - An object containing minimum and maximum edge value.
     */
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

    /**
     * Get the minimum and maximum node value for a given scope. 
     * If no scope is given, use currentScope.
     * @param {string} scope - optional
     * @returns {object} - An object containing minimum and maximum node value.
     */
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

    /**
     * Get the minimum and maximum value for a given scope from nodes and edges. 
     * If no scope is given, use currentScope.
     * @param {string} scope - optional
     * @returns {object} - An object containing minimum and maximum value.
     */
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


    /**
     * A placeholder function to calculate the position of a node in space for visualisation.
     * The actual implementation will be provided by the derived classes, as the position
     * depends on the type of graph and the display mode.
     * @param {number} nodeId - The id of the node for which the position needs to be calculated.
     * @returns {BABYLON.Vector3} - A new vector representing the position of the node.
     */
    this.calcPosition = /*virtual*/ (nodeId) => new BABYLON.Vector3();


    /**
     * Sets the display mode of the graph.
     * This function changes the position of all nodes and updates all edges according to the calculated positions.
     */
    this.setDisplayMode = function () {
        for (const key in this.nodes) {
            this.nodes[key].position = this.calcPosition(key);
        }

        for (const key in this.edges) {
            this.edges[key].update();
        }

        Dispatcher.viewModeChanged();
    };
    
    /**
     * Sets whether labels are visible on the nodes of the graph.
     * @param {boolean} b - If true, labels are shown. If false, they are hidden.
     */
    this.showLabels = function (b) {
        this.labelsVisible = b;
        for (const key in this.nodes) {
            this.nodes[key].showLabel();
        }
    };

    
    /**
     * Creates the structure of the graph from a temporary structure.
     * @param {object} struct - The temporary structure containing nodes and edges.
     * @returns {Promise<string>} - Resolves to 'ok' when the structure has been created.
     */
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
    
    /**
     * Given a value, a minimum, and a maximum, it returns a value between 0 and 1 proportionate to the position of the value between the min and max.
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    this.scale = function (value, min, max) {
        if (min === max) return 0.5;
        return (value - min) / (max - min);
    };

});

/**
 * Available display modes for the graph.
 * @type {string[]}
 * @memberOf sgv.Graph
 */
Graph.displayModes = [ 'classic', 'triangle', 'diamond' ];

/**
 * Current display mode for the graph.
 * @type {string}
 * @memberOf sgv.Graph
 */
Graph.currentDisplayMode = 'classic';

/**
 * Switch the display mode of the graph to the next available mode.
 * If the graph does not exist, a warning is logged and the function does nothing.
 * @function
 * @memberOf sgv.Graph
 */
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

/** An object mapping known graph types to their corresponding constructor functions.
 * 
 * @type Object
 * @memberOf sgv.Graph
 */
Graph.knownGraphTypes = {};

/**
 * Registers a new graph type.
 * @function
 * @param {string} txt - The name of the graph type.
 * @param {Function} Type - The constructor function of the graph type.
 * @memberOf sgv.Graph
 */
Graph.registerType = (txt,Type)=>{Graph.knownGraphTypes[txt] = Type;};

/**
 * Checks if a graph type is known.
 * @function
 * @param {string} txt - The name of the graph type.
 * @returns {boolean} - True if the graph type is known, false otherwise.
 * @memberOf sgv.Graph
 */
Graph.knowType = (txt)=>(txt in Graph.knownGraphTypes);


/**
 * Create a new graph from a GraphDescr and optionally a TempGraphStructure.
 * If a graph already exists, it is first removed.
 * If the graph type is not known or not a GraphDescr, an error is logged and the function does nothing.
 * @function
 * @param {GraphDescr} gDesc - The description of the graph structure.
 * @param {TempGraphStructure} struct - Optional. The graph data.
 * @memberOf sgv.Graph
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

/**
 * Removes the current graph if it exists.
 * @function
 * @memberOf sgv.Graph
 */
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

/**
 * @class
 * @classdesc Represents a Chimera graph structure.
 * @memberOf sgv
 * 
 * @extends Graph
 * @constructor
 * @param {GraphSize} gSize - The size of the graph.
 */
const Chimera = /** @class */ (function (gSize) {
    Graph.call(this);

    /**
     * The type of the graph.
     * @type {string}
     */
    this.type = 'chimera';

    /**
     * Sets the size of the graph.
     * @param {GraphSize} gSize - The size of the graph.
     */
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

    /**
     * Calculates the maximum node ID in the graph.
     * @returns {number} The maximum node ID.
     */
    this.maxNodeId = function () {
        return this.cols * this.rows * 8;
    };


    /**
     * Connects two nodes in the graph.
     * @param {QbDescr} qdA - The first node descriptor.
     * @param {QbDescr} qdB - The second node descriptor.
     * @param {number} value - The value to set for the edge (optional).
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

    /**
     * Connects the vertical edges between nodes in the graph.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     */
    this.connectVertical = function (x, y, z) {
        for (let j of [0,1]) {
            for (let k of [0,1]) {
                // eq3
                this.connect(new QbDescr(x, y, z, 0, j, k), new QbDescr(x, y + 1, z, 0, j, k));
            }
        }
    };

    /**
     * Connects the horizontal edges between nodes in the graph.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     */
    this.connectHorizontal = function (x, y, z) {
        for (let j of [0,1]) {
            for (let k of [0,1]) {
                // eq2
                this.connect(new QbDescr(x, y, z, 1, j, k), new QbDescr(x + 1, y, z, 1, j, k));
            }
        }
    };

    /**
     * Connects the internal Chimera edges between nodes in the graph.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     */
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

    /**
     * Calculates the position of a module in the graph.
     * @param {number} x - The x-coordinate of the module.
     * @param {number} y - The y-coordinate of the module.
     * @param {number} z - The z-coordinate of the module.
     * @returns {BABYLON.Vector3} The position of the module.
     */
    this.modulePosition = function( x, y, z ) {
        let d = 50.0;
        let mX = (d * ( ( this.cols - 1 ) / 2.0 ))-(d * y);
        let mY = (d * x) - (d * ( ( this.rows - 1 ) / 2.0 ));
        let mZ = ( d * z ) - (d*((this.layers - 1) / 2.0));
        return new BABYLON.Vector3(mX, mZ, mY);
    };
    
    /**
     * Calculates the position of a node in the graph.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     * @param {number} n0 - The n0 index of the node.
     * @returns {BABYLON.Vector3} The position of the node.
     */
    this.calcPosition2 = function (x, y, z, n0) {
        let newPos = this.modulePosition(x, y, z);
        newPos.addInPlace(this.getNodeOffset2(n0));
        return newPos;
    };

    /**
     * Calculates the position of a node in the graph.
     * @param {number} nodeId - The ID of the node.
     * @returns {BABYLON.Vector3} The position of the node.
     */
    this.calcPosition = function (nodeId) {
        let qd = QbDescr.fromNodeId(nodeId, this.rows, this.cols);
        return this.calcPosition2(qd.x, qd.y, qd.z, qd.n0());
    };


    /**
     * Adds a node to the graph based on the XYZIJK coordinates.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     * @param {number} i - The i index of the node.
     * @param {number} j - The j index of the node.
     * @param {number} k - The k index of the node.
     * @returns {number} The ID of the added node.
     */
    this.addNodeXYZIJK = function(x,y,z,i,j,k) {
        return this.addNode(qD(x,y,z,i,j,k).toNodeId(this.rows, this.cols));
    };

    /**
     * Adds a node to the graph based on the XYZn coordinates.
     * @param {number} x - The x-coordinate of the node.
     * @param {number} y - The y-coordinate of the node.
     * @param {number} z - The z-coordinate of the node.
     * @param {number} n - The n index of the node.
     * @returns {number} The ID of the added node.
     */
    this.addNodeXYZn = function(x,y,z,n) {
        return this.addNode(qD(x,y,z,(n>>2)&1,(n>>1)&1,n&1).toNodeId(this.rows, this.cols));
    };

    /**
     * Creates the nodes for a module in the graph.
     * @param {number} x - The x-coordinate of the module.
     * @param {number} y - The y-coordinate of the module.
     * @param {number} z - The z-coordinate of the module.
     */
    this.createModuleNodes = function (x, y, z) {
        for (let n = 0; n < this.KL; n++) {
            this.addNodeXYZn(x,y,z,n);
        }
        for (let n = 0; n < this.KR; n++) {
            this.addNodeXYZn(x,y,z,n+4);
        }
    };

    /**
     * Retrieves the offset position of a node based on its index.
     * @param {number} idx - The index of the node.
     * @returns {BABYLON.Vector3} The offset position of the node.
     */
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

    /**
     * Connects the vertical edges between modules in the graph.
     */
    this.verticalConnections = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < (this.rows - 1); y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.connectVertical(x, y, z);
                }
            }
        }
    };

    /**
     * Connects the horizontal edges between modules in the graph.
     */
    this.horizontalConnections = ()=>{
        for (let z = 0; z < this.layers; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < (this.cols - 1); x++) {
                    this.connectHorizontal(x, y, z);
                }
            }
        }
    };

    /**
     * Creates the modules and their connections in the graph.
     */
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

    /**
     * Creates the default Chimera graph structure.
     * @param {function} then - The callback function to be called after the structure is created.
     */
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

/**
 * Registers the Chimera type in the Graph.
 * @param {string} 'chimera' - The type name of the graph.
 * @param {function} Chimera - The Chimera class.
 */
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

/* global sgv */

/**
 * UI namespace for creating HTML elements and handling UI-related tasks.
 * @namespace
 */
var UI = (function () {});


/**
 * Creates an HTML element with the specified tag, attributes, properties, and event listeners.
 * @param {string} _tag - The HTML tag of the element.
 * @param {Object} _attrs - The attributes to set on the element.
 * @param {Object} _props - The properties to set on the element.
 * @param {Object} _evnts - The event listeners to add to the element.
 * @returns {HTMLElement} The created HTML element.
 */
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

/**
 * Creates a span element with the specified text content and attributes.
 * @param {string} _text - The text content of the span element.
 * @param {Object} _attrs - The attributes to set on the span element.
 * @returns {HTMLElement} The created span element.
 */
UI.span = function(_text, _attrs) {
    return UI.tag("span", _attrs, {'textContent': _text} );
};

/**
 * Sets the selected option of a select element based on the provided key.
 * @param {HTMLSelectElement} _select - The select element.
 * @param {number|string} _key - The key to select in the select element.
 * @returns {boolean} True if the option was found and selected, false otherwise.
 */
UI.selectByKey = function(_select, _key) {
    let i = UI.findOption(_select, _key.toString());
    if ( i>-1 ) {
        _select.selectedIndex = i;
        return true;
    }
    return false;
};

/**
 * Clears the options of a select element.
 * @param {HTMLSelectElement} _select - The select element.
 * @param {boolean} [_deleteFirst=true] - Indicates whether to delete the first option or not.
 */
UI.clearSelect = function(_select,_deleteFirst) {
    const first = _deleteFirst?0:1;
    for(var i=first; i<_select.options.length; i++) {
        _select.removeChild(_select.options[i]);
        i--; // options have now less element, then decrease i
    }
};

/**
 * Finds the index of an option with the specified value in a select element.
 * @param {HTMLSelectElement} _select - The select element.
 * @param {string} _value - The value of the option to find.
 * @returns {number} The index of the option if found, -1 otherwise.
 */
UI.findOption = function(_select,_value) {
    for (var i= 0; i<_select.options.length; i++) {
        if (_select.options[i].value===_value) {
            return i;
        }
    }
    return -1;
};

/**
 * Creates an option element with the specified value, text content, and selected state.
 * @param {string} _value - The value of the option.
 * @param {string} _text - The text content of the option.
 * @param {boolean} [_selected] - Indicates whether the option should be selected or not.
 * @returns {HTMLOptionElement} The created option element.
 */
UI.option = function(_value, _text, _selected) {
    var o = document.createElement("option");
    o.value = _value;
    o.text = _text;
    
    if (typeof _selected!=='undefined')
        o.selected = _selected?'selected':'';
    
    return o;
};

/**
 * Creates an input element with the specified properties.
 * @param {Object} _props - The properties to set on the input element.
 * @returns {HTMLInputElement} The created input element.
 */
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

/**
 * Creates a new input element with the specified type, value, class, and id.
 * @param {string} _type - The type of the input element.
 * @param {string} _value - The value of the input element.
 * @param {string} [_class] - The class attribute of the input element.
 * @param {string} [_id] - The id attribute of the input element.
 * @returns {HTMLInputElement} The created input element.
 */
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

/**
 * Creates a title bar element with the specified title and close button visibility.
 * @param {string} title - The title of the title bar.
 * @param {boolean} closebuttonVisible - Indicates whether the close button should be visible or not.
 * @returns {HTMLElement} The created title bar element.
 */
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

/**
 * Creates an empty window element with the specified class, id, title, and close button visibility.
 * @param {string} [_class] - The class attribute of the window element.
 * @param {string} [_id] - The id attribute of the window element.
 * @param {string} [_title] - The title of the window element.
 * @param {boolean} [_closebuttonVisible] - Indicates whether the close button should be visible or not.
 * @returns {HTMLElement} The created window element.
 */
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



/**
 * Creates a transparent button element with the specified text, id, and onclick function.
 * @param {string} txt - The text content of the button.
 * @param {string} id - The id attribute of the button.
 * @param {Function} onclick - The function to be called when the button is clicked.
 * @returns {HTMLInputElement} The created button element.
 */
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

/**
 * Creates a transparent button element with the specified text, id, and onclick function.
 * @param {string} txt - The text content of the button.
 * @param {string} id - The id attribute of the button.
 * @param {Function} onclick - The function to be called when the button is clicked.
 * @returns {HTMLButtonElement} The created button element.
 */
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

/* global UI */

/**
 * @class
 * @classdesc Represents a generic window UI component.
 * @memberOf sgv
 * 
 * @constructor
 * @param {string} _id - The ID of the window.
 * @param {string} _title - The title of the window.
 * @param {Object} args - Additional arguments.
 */
const GenericWindow = /** @class */ (function (_id, _title, args) {
    var prevFocused = null;

    /**
     * The UI element of the window.
     * @type {HTMLElement}
     */
    this.ui = UI.tag("div", {'class': 'sgvUIwindow'});
    var movable = false;
    
    if ((typeof _id !== 'undefined') && (_id !== "")) {
        this.ui.setAttribute("id", _id);
    }

    /**
     * The title bar of the window.
     * @type {HTMLElement}
     */
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
    
    /**
     * Sets the window as movable.
     * @param {HTMLElement} ui - The UI element of the window.
     */
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
    
    /**
     * Shows the window.
     */
    this._show = ()=>{
        prevFocused = window.document.activeElement;
        this.ui.style.display = "block";
        this.ui.focus({focusVisible: false});
    };
    
    /**
     * Hides the window.
     */
    this._hide = ()=>{
        this.ui.style.display = "none";
        if (prevFocused !== null) prevFocused.focus({focusVisible: false});
    };
    
    /**
     * Toggles the visibility of the window.
     */
    this._switch = ()=>{
        if (this.ui.style.display === "none") {
            this._show();
        } else {
            this._hide();
        }
    };
    
    /**
     * A test method.
     */
    this._test = function() { console.log('test 1a'); };
});

/**
 * Shows the window.
 */
GenericWindow.prototype.show = this._show;

/**
 * Hides the window.
 */
GenericWindow.prototype.hide = this._hide;

/**
 * Toggles the visibility of the window.
 */
GenericWindow.prototype.switch = this._switch;

/**
 * A test method.
 */
GenericWindow.prototype.test = ()=> { console.log('test 1'); };


/****************************************************************************/
/*   the following code is for testing purposes only                        */
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

/**
 * Global namespace for SimGraphVisualizer.
 * @namespace
 */
var sgv = (typeof exports === "undefined") ? (function sgv() {}) : (exports);
if (typeof global !== "undefined") {
    global.sgv = sgv;
}

/**
 * Application build number
 * @type {string}
 * @memberof sgv
 */
sgv.version = "1.0.0";

/**
 * engine
 * @type {BABYLON.Engine}
 * @memberof sgv
 */
sgv.engine = null;

/**
 * scene
 * @type {BABYLON.Scene}
 * @memberof sgv
 */
sgv.scene = null;

/**
 * camera
 * @type {BABYLON.Camera}
 * @memberof sgv
 */
sgv.camera = null;

/**
 * current graph instance
 * @type {Graph|Chimera|Pegasus}
 * @memberof sgv
 */
sgv.graf = null;

/**
 * Creates a new scene, along with its camera and lights, and initializes a new Solid Particle System for nodes/edges visualisation.
 * @function
 */
sgv.createScene = function () {
    sgv.scene = new BABYLON.Scene(sgv.engine);

    createCamera();
    createLights();

//====================================================================
//
    /**
     * Solid Particle System for nodes/edges visualisation
     * @type {SolidPS}
     * @memberof sgv
     */
    sgv.SPS = new SolidPS(sgv.scene);
    sgv.SPS.init();
//
//====================================================================
    
    sgv.nodeToConnect = 0;

    sgv.addEventsListeners();
    
    sgv.scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.7);

    /**
     * create camera and set its properties
     */
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

    /**
     * create default lights
     */
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

/**
 * Adds event listeners to the scene for various pointer events, including tapping, double tapping, pressing down, releasing, and moving.
 * @function
 */
sgv.addEventsListeners = function () {
    var startingPoint;
    var currentMesh;
    var ground = null;//BABYLON.MeshBuilder.CreateGround("ground", {width:10*graf.N+20, height:10*graf.N+20}, scene, false);
    //ground.material = groundMaterial;

    /**
     * Retrieves the position of the ground based on pointer coordinates.
     * @returns {BABYLON.Vector3} The position of the ground.
     */
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

    /**
     * Handles the double tap event on a mesh.
     * @param {BABYLON.AbstractMesh} mesh - The picked mesh.
     */
    function pointerDblTap(mesh) {
        var n2 = mesh.name.split(":");
        if (n2[0] === "edge")
        {
            sgv.graf.edgeDoubleClicked(n2[1]);
        }
    };

    /**
     * Handles the pointer down event.
     * @param {BABYLON.PointerInfo} event - The pointer event info.
     */
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

    /**
     * Handles the pointer up event.
     */
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

    /**
     * Handles the pointer move event.
     */
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

    /**
     * Handles the pointer tap event.
     * @param {BABYLON.PointerInfo} pointerInfo - The pointer event info.
     */
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

    // Add event listeners to the scene
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

/**
 * Displays the scene and attaches it to a specified HTML element, or creates a new one if none is specified. It also creates and initializes a new engine, and sets up a render loop.
 * @function
 * @param {object} args - An object containing optional parameters, such as the target HTML element.
 */
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



/* global sgv, NaN, Graph */

/**
 * @fileoverview This script imports and exports graphs in TXT format.
 * 
 * @namespace ParserTXT
 */

"use strict";

/** TXT file parsing functionality
 * @namespace
 */
var ParserTXT = {};

/**
 * Function to import graph data from TXT format.
 * 
 * @function importGraph
 * @memberof ParserTXT
 * @param {string} string - Input graph data in TXT format
 * @returns {void}
 */
ParserTXT.importGraph = (string) => {
    var struct = new TempGraphStructure();

    var res = [];
    var lines = string.split("\n");

    let gDesc = new GraphDescr();
    
    /**
     * Parses comments from the TXT data.
     *
     * @param {string} string - String to parse comments from
     */
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

    /**
     * Parses graph data from the TXT data.
     *
     * @param {string} string - String to parse data from
     * @returns {?Object} - Returns an object containing the parsed data or null
     */
    var parseData = function (string) {
        var line = string.trim().split(/\s+/);
        if (line.length < 3) return null;
        
        let _n1 = parseInt(line[0], 10);
        let _n2 = parseInt(line[1], 10);
        let _val = parseFloat(line[2], 10);
        
        let _lbl = null;
        if (line.length > 3)
        {
            _lbl = line[3];
        }
            

        if (isNaN(_n1)||isNaN(_n2))
            return null;    
        else
            return { n1: _n1, n2: _n2, val: _val, lbl: _lbl };
    };

    // Process each line of the input string
    while (lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            let d = parseData(lines[0]);
            if (d !== null) {
                res.push(d);
                if (d.n1 === d.n2) {
                    if (d.lbl===null)
                        struct.addNode1(d.n1, d.val);
                    else
                        struct.addNode1(d.n1, d.val, d.lbl);
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

    // Create graph if type is defined, otherwise show graph creation dialog
    if (typeof gDesc.type==='undefined') {
        sgv.dlgCreateGraph.show('load', struct);
    } else {
        Graph.create( gDesc, struct );
    }
};

/**
 * Exports a graph to TXT format.
 * 
 * @function exportGraph
 * @memberof ParserTXT
 * @param {Graph} graph - The graph object to export
 * @returns {?string} - The exported graph in TXT format, or null if the graph is undefined or null
 */
ParserTXT.exportGraph = (graph) => {
    if ((typeof graph==='undefined')||(graph === null)) return null;

    // Generate TXT data
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

/**
 * @fileoverview This script imports and exports graphs in GEXF (Graph Exchange XML Format) format.
 * 
 * @namespace ParserGEXF
 */

"use strict";

/** GEXF file parsing functionality
 * @namespace
 */
var ParserGEXF = {};

/**
 * Function to import graph data from GEXF format.
 * 
 * @function importGraph
 * @memberof ParserGEXF
 * @param {string} string - Input graph data in GEXF format
 * @returns {boolean} - Returns true upon successful completion
 */
ParserGEXF.importGraph = (string) => {
    // Initialize data structures
    
    //var graphType = "unknown";
    //var graphSize = { cols:0, rows:0, lays:0, KL:0, KR:0 };
    var graphDescr = new GraphDescr();
    var nodeAttrs = {};
    var edgeAttrs = {};
    var struct = new TempGraphStructure();
    
    /**
     * Parses node elements from the GEXF XML data.
     *
     * @param {Element} parentNode - Parent XML node to parse nodes from
     */
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
    
    /**
     * Parses edge elements from the GEXF XML data.
     *
     * @param {Element} parentNode - Parent XML node to parse edges from
     */
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

    /**
     * Parses node attributes from the GEXF XML data.
     *
     * @param {Element} attributeNode - XML node to parse attributes from
     * @returns {Object} - Returns an object containing the parsed attribute data
     */
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
    

    /**
     * Parses edge attributes from the GEXF XML data.
     *
     * @param {Element} attributeNode - XML node to parse attributes from
     * @returns {Object} - Returns an object containing the parsed attribute data
     */
    function parseEdgeAttribute(attributeNode) {
        let id = attributeNode.getAttribute("id");
        let title = attributeNode.getAttribute("title");
        return {id,title};
    };


    /**
     * Parses attributes from the GEXF XML data.
     *
     * @param {Element} parentNode - Parent XML node to parse attributes from
     */
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
    
    
    // Parse the input string as XML
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
    
    // Parse the XML data
    parseAttributes(xmlDoc);
    parseNodes(xmlDoc);
    parseEdges(xmlDoc);
   
    // Create graph and return
    Graph.create(graphDescr, struct);
    
    for (const i in nodeAttrs) {
        if (!sgv.graf.scopeOfValues.includes(nodeAttrs[i]))
            sgv.graf.scopeOfValues.push(nodeAttrs[i]);
    }

    return true;
};

/**
 * Exports a graph to GEXF format.
 * 
 * @function exportGraph
 * @memberof ParserGEXF
 * @param {Graph} graph - The graph object to export
 * @returns {?string} - The exported graph in GEXF format, or null if the graph is undefined or null
 */
ParserGEXF.exportGraph = function(graph) {
    if ((typeof graph==='undefined')||(graph === null)) return null;
    
    /**
     * Converts a graph node to GEXF format.
     *
     * @param {Node} node - The node to export
     * @returns {string} - The node exported to GEXF format
     */
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

    /**
     * Converts a graph edge to GEXF format.
     *
     * @param {Edge} edge - The edge to export
     * @param {number} tmpId - The temporary ID for the edge
     * @returns {string} - The edge exported to GEXF format
     */
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

/**
 * FileIO namespace for file input/output operations.
 * @namespace
 */
var FileIO = {};

/**
 * Event handler for the load button.
 */
FileIO.onLoadButton = () => {
    let btnLoad1 = UI.tag('input',{
        'type':'file',
        'id':'inputfile',
        'display':'none'
    });
    // Add event listener to handle file selection
    btnLoad1.addEventListener('change', (e)=>{
        if (typeof btnLoad1.files[0]!=='undefined') {
            showSplashAndRun(()=>{
                FileIO.loadGraph(btnLoad1.files[0]);
                //btnLoad1.value = ""; //if I need to read the same file again
            });
        }
    });

    // Simulate a click event to trigger file selection dialog
    btnLoad1.click();
};

/**
 * Event handler for the save button.
 * @returns {Promise} A promise that resolves or rejects based on the save operation.
 */
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

/**
 * Downloads a file.
 * @param {string} text - The text content of the file.
 * @param {string} name - The name of the file.
 * @param {string} type - The MIME type of the file.
 */
FileIO.download = (text, name, type) => {
    let a = document.createElement("a");
    let fileAsBlob = new Blob([text], {type: type});
    
    a.download = name;
    a.innerHTML = "Download graph file";

    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        a.href = window.webkitURL.createObjectURL(fileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        a.href = window.URL.createObjectURL(fileAsBlob);
        a.onclick = function (event) {
            document.body.removeChild(event.target);
        };
        a.style.display = "none";
        document.body.appendChild(a);
    }
    
    a.click();
};

/**
 * Saves the graph with an alternate file name and extension.
 * @param {string} name - The name of the file.
 * @param {string} ext - The extension of the file.
 */
FileIO.alternateSave = (name, ext) => {
    if (ext === '.txt') {
        let string = ParserTXT.exportGraph(sgv.graf);
        FileIO.download(string, name+ext, 'text/plain');
    } else if (ext === '.gexf') {
        let string = ParserGEXF.exportGraph(sgv.graf);
        FileIO.download(string, name+ext, 'application/xml');
    }
};

/**
 * Converts a string representation of graph data to the specified scope.
 * @param {string} data - The string representation of the graph data.
 * @param {string} newScope - The new scope for the graph.
 */
sgv.stringToScope = (data,newScope) => {
    let r = sgv.graf.loadScopeValues(newScope,data);
            
    if (r.n) {
        sgv.dlgCPL.addScope(newScope);
    }
    sgv.dlgCPL.selScope(newScope);
};


/**
 * Loads a graph from a selected file.
 * @param {File} selectedFile - The selected file.
 */
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
        
/**
 * Loads a graph with the specified name and data.
 * @param {string} name - The name of the graph.
 * @param {string} data - The data of the graph.
 */
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

/* global UI, sgv, Dispatcher */

/**
 * @class ScopePanel module for managing scope-related operations in a user interface.
 * @param {boolean} [addButtons=true] - Flag indicating whether to add buttons to the panel.
 * @param {string} [lbl] - Label for the scope display.
 * @returns {Object} ScopePanel instance.
 * @memberof sgv
 */
const ScopePanel = (function(addButtons,lbl) {
    let divNS, divDS;

    /**
     * Adds a scope to the select element.
     * @param {string} scope - The scope to add.
     * @param {number} idx - The index of the added scope.
     */
    this.addScope = (scope, idx) => {
        selectScope.add(UI.option(scope, scope));
        selectScope.selectedIndex = idx;
    };
    
    /**
     * Deletes a scope from the select element.
     * @param {string} scope - The scope to delete.
     * @param {number} idx2 - The index of the selected scope.
     */
    this.delScope = (scope, idx2) => {
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.remove(i);
        }
        selectScope.selectedIndex = idx2;
    };

    /**
     * Selects a scope in the select element.
     * @param {string} scope - The scope to select.
     */
    this.selScope = (scope)=>{
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.selectedIndex = i;
        }
    };
    
    /**
     * Gets the value of the selected scope.
     * @returns {string} The value of the selected scope.
     */
    this.getScope = ()=> {
        return selectScope.value;
    };

    /**
     * Gets the index of the selected scope.
     * @returns {number} The index of the selected scope.
     */
    this.getScopeIndex = ()=> {
        return selectScope.selectedIndex;
    };
    
    /**
     * Refreshes the scope panel by updating the select element with available scopes.
     */
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
    
    
    /**
     * EditPanel constructor function for creating an edit panel for adding or editing a scope.
     * @param {string} [scopeToEdit] - The scope to edit. If provided, it's an edit operation; otherwise, it's an add operation.
     * @returns {Object} EditPanel instance.
     */
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
    
    /**
     * The UI element representing the ScopePanel.
     * @type {HTMLElement}
     */
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





/* global sgv, UI */

/**
 * @class
 * @classdesc Represents a panel for controlling sliders.
 * @memberof sgv.DlgCPL
 */
const SlidersPanel = (function() {
    /**  Represents the red limit slider. 
     * @type {HTMLElement}
     */
    var sliderRedLimit;

    /** Represents the green limit slider.
     *  @type {HTMLElement}
     */
    var sliderGreenLimit;

    /** Represents the display span for red limit.
     * @type {HTMLElement}
     */
    var spanRed;

    /** Represents the display span for green limit.
     * @type {HTMLElement}
     */
    var spanGreen;

    /**
     * The UI for the sliders panel.
     * @type {HTMLElement}
     */
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
    
    /**
     * Refreshes the sliders panel based on the current graph data.
     */
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

/**
 * @class
 * @classdesc Represents the DlgCPL class.
 * @memberof sgv
 */
const DlgCPL = (function () {
    var switchableContent; 
    var selectionPanel, descriptionPanel;
    var scopePanel, slidersPanel;
    var switchHandle;
    
    var ui = createDialog();

    /**
     * Add the created dialog to the DOM upon window load event.
     */
    window.addEventListener('load', () => {
        window.document.body.appendChild(ui);
    });

    /**
     * Creates the Control Panel dialog with multiple components.
     * @returns {HTMLElement} The created dialog element.
     */
    function createDialog() {
        let ui = UI.tag("div", {"class": "sgvUIwindow disable-select", "id": "sgvDlgCPL"});

        /**
         * Creates the Selection Panel component of the Control Panel dialog.
         * @returns {Object} The Selection Panel component along with show and hide functions.
         */
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

        /**
         * Creates the Description Panel component of the Control Panel dialog.
         * @returns {Object} The Description Panel component along with show, hide, and addButton functions.
         */
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


    /**
     * Show the switchable content of the Control Panel dialog.
     */
    function showDialog() {
        switchableContent.style.display = "block";
    }


    /**
     * Hide the switchable content of the Control Panel dialog.
     */
    function hideDialog() {
        switchableContent.style.display = "none";
    }


    /**
     * Switches the display of the switchable content of the Control Panel dialog between show and hide.
     */
    function switchDialog() {
        (switchableContent.style.display === "none") ? showDialog() : hideDialog();
    }

    /**
     * Switches to the Selection mode of the Control Panel dialog.
     */
    function setModeSelectionX() {
        selectionPanel.show();
        descriptionPanel.hide();
    }

    /**
     * Switches to the Description mode of the Control Panel dialog.
     */
    function setModeDescriptionX() {
        descriptionPanel.updateInfo();
        slidersPanel.refresh();
        scopePanel.refresh();

        selectionPanel.hide();
        descriptionPanel.show();
    }

    /**
     * Refreshes the sliders and scope panels of the Control Panel dialog.
     */
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
    
});

/**
 * Represents the static instance of control panel (DlgCPL) in the sgv namespace.
 * @type {DlgCPL}
 * @memberof sgv
 * @static
 */
sgv.dlgCPL = new DlgCPL();

"use strict";
/* global scene, sgv, Chimera, Pegasus, UI, Graph */


/**
 * @class
 * @classdesc Represents the DlgConsole class.
 * @memberof sgv
 */
class DlgConsole {
    constructor () {
        this.cmdHistory = [];
        this.cmdHistoryPtr = -1;
        this.movable = false;

        /**
        * User interface element representing the console.
        * @type {HTMLElement}
        */    
        this.ui = this.createUI("sgvConsole");

        /**
        * Initializes the console.
        */
        this.initConsole();

        window.addEventListener('load',()=>{
            window.document.body.appendChild(this.ui);
        });
    }

    /**
     * Initializes the console by setting up event listeners for the command line input field.
     * 
     * The function sets up listeners for "Enter", "Up", and "Down" key presses. 
     * "Enter" executes the command written in the input field. 
     * "Up" and "Down" navigate through the command history.
     */
    initConsole() {
        let domCmdline = this.ui.querySelector("#commandline");

        domCmdline.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                let txtarea = document.getElementById("consoleHistory");
                //txtarea.disabled = false;
                txtarea.textContent += "> " + domCmdline.value + "\n";

                txtarea.textContent += this.parseCommand(domCmdline.value) + "\n";

                txtarea.scrollTop = txtarea.scrollHeight;
                //txtarea.disabled = true;

                if (this.cmdHistory.length > 10)
                    this.cmdHistory.shift();
                this.cmdHistory.push(domCmdline.value);
                this.cmdHistoryPtr = this.cmdHistory.length;

                domCmdline.value = "";
            } else if (event.keyCode === 38) {
                if (this.cmdHistoryPtr > 0) {
                    this.cmdHistoryPtr--;
                    domCmdline.value = this.cmdHistory[this.cmdHistoryPtr];
                }
            } else if (event.keyCode === 40) {
                if (this.cmdHistoryPtr < this.cmdHistory.length) {
                    domCmdline.value = this.cmdHistory[this.cmdHistoryPtr];
                    this.cmdHistoryPtr++;
                } else {
                    domCmdline.value = "";
                }
            }
        });

        this.ui.querySelector(".hidebutton").addEventListener('click', () => { this.hideConsole(); });
    }

    /**
     * Creates a new UI window for a console with a specified ID.
     * 
     * @param {string} id - The ID to be assigned to the new window.
     * 
     * @returns {HTMLElement} The created UI window element. The window includes a read-only textarea for the console history and a text input field for the command line.
     */
    createUI(id) {
        var o = UI.createEmptyWindow("sgvUIwindow", id, "console", true);

        o.innerHTML += '<div class="content"> \
                <textarea id="consoleHistory" readonly></textarea> \
                <input type="text" id="commandline"> \
            </div>';
        return o;
    };

    /**
     * Parses and executes a command.
     * 
     * @param {string} line - The command to parse and execute. The command name and its arguments should be separated by whitespace characters.
     * 
     * @returns {string} A string message indicating the result of the operation. The exact message depends on the command and its arguments.
     */
    parseCommand(line) {

        /**
        * Sets the value of a specified node in the graph, if the node exists.
        * 
        * @param {string|number} node - The ID of the node to be modified, either as a string or a number.
        * @param {string|number} value - The new value to be set for the node, either as a string or a number.
        * 
        * @returns {string} A string message indicating the result of the operation. This can be one of the following:
        *    - "modified node q<id> = <value>": If the node value was successfully modified. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
        *    - "restored node q<id> = <value>": If the node was restored and its value was successfully modified. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
        *    - "not implemented yet": If the node does not exist in the graph and the node adding feature is not yet implemented.
        *    - "no graph defined": If there is no graph defined in the sgv.graf property.
        */
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

        /**
         * Deletes a node from the graph, if it exists. 
         * 
         * @param {string|number} node - The ID of the node to be deleted, either as a string or a number.
         * 
         * @returns {string} A string message indicating the result of the deletion operation. This can be one of the following:
         *    - "no graph defined": If there is no graph defined in the sgv.graf property.
         *    - "bad NodeId": If the provided node ID is not a valid integer or it is zero.
         *    - "deleted node q<id>": If the node was successfully deleted. The <id> placeholder is replaced with the ID of the deleted node.
         *    - "node q<id> not exists": If the node with the provided ID does not exist in the graph. The <id> placeholder is replaced with the non-existent node's ID.
         */
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

        /**
         * Performs a specified action on a scope of the graph.
         * 
         * @param {string} action - The action to be performed. This can be one of the following: 
         *    - "list": Lists all the scopes.
         *    - "add": Adds a new scope.
         *    - "delete": Deletes a specified scope.
         *    - "set": Sets the specified scope as the current scope.
         * @param {string} [scope] - The name of the scope on which the action is to be performed. 
         *    Required for "add", "delete", and "set" actions.
         * 
         * @returns {string} A string message indicating the result of the operation. The actual message depends on the action performed.
         */
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

        /**
         * Creates a new graph of a specified type and size.
         * 
         * @param {string} type - The type of the graph to be created. This should be either "chimera" or "pegasus".
         * @param {string} sizeTXT - A comma-separated string of numbers representing the size of the graph to be created.
         *    For a "chimera" graph, this should have four or five numbers.
         *    For a "pegasus" graph, this should have five numbers.
         * 
         * @returns {string} A string message indicating the result of the operation. This can be one of the following:
         *    - "unknown graph type, use: chimera or pegasus": If the provided type is not "chimera" or "pegasus".
         *    - "bad arguments": If the sizeTXT parameter does not have the correct number of numbers for the specified type.
         *    - "graph created": If the graph was successfully created.
         *    - "graf exists, type: clear <Enter> to delete it": If a graph already exists.
         */
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

        /**
        * Removes the graph.
        * 
        * @returns {string} A string message indicating that the graph was removed.
        */
        function clear() {
            Graph.remove();
            return "graph removed";
        }

        /**
         * Connects two nodes in the graph with a specified value, if both nodes exist.
         * 
         * @param {string|number} node1 - The ID of the first node to be connected, either as a string or a number.
         * @param {string|number} node2 - The ID of the second node to be connected, either as a string or a number.
         * @param {string|number} value - The value to be set for the edge connecting the nodes, either as a string or a number.
         * 
         * @returns {string} A string message indicating the result of the operation. This can be one of the following:
         *    - "no graph defined": If there is no graph defined in the sgv.graf property.
         *    - "bad node": If either of the provided node IDs are not valid integers or they are zero.
         *    - "bad value": If the provided value is not a valid number.
         *    - "added edge: q<id1> -> q<id2>": If the edge was successfully added. The <id1> and <id2> placeholders are replaced with the IDs of the connected nodes.
         *    - "node q<id> was probably deleted earlier": If the node with the provided ID does not exist in the graph. The <id> placeholder is replaced with the non-existent node's ID.
         */
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

        /**
         * Processes a command to set values of nodes or edges in the graph. The command syntax should follow either of the following formats:
         *    - 'q<nodeId>=<value>' to set the value of a node. 
         *    - 'q<nodeId1>+q<nodeId2>=<value>' to set the value of an edge. 
         * If a node or edge does not exist, it will be created. If the value is not a valid number, the function will attempt to delete the node or edge.
         *
         * @param {string} command - The command string to process.
         * 
         * @returns {string} A string message indicating the result of the operation. Possible results include:
         *    - "no graph defined": If no graph is currently defined.
         *    - "too few arguments": If the command does not contain enough arguments.
         *    - "bad arguments": If the command syntax does not match the expected formats.
         *    - Any of the return messages defined in the setN or setE functions.
         */
        function set2(command) {

            /**
             * Sets the value of a specified node in the graph, restores a missing node, adds a new node, or deletes a node, depending on the given parameters.
             * 
             * @param {Array} split2 - An array where the first element is a string representing the node. The node ID should be prefixed with 'q'.
             * @param {string|number} val - The value to be set for the node. If not a valid number, the function will attempt to delete the node.
             * 
             * @returns {string} A string message indicating the result of the operation. This can be one of the following:
             *    - "bad node Id": If the provided node ID is not a valid integer, it is zero, or it is greater than the maximum node ID in the graph.
             *    - "deleted node q<id>": If the node was successfully deleted. The <id> placeholder is replaced with the ID of the deleted node.
             *    - "node q<id> already deleted": If the node with the provided ID does not exist in the graph. The <id> placeholder is replaced with the non-existent node's ID.
             *    - "modified node q<id> = <value>": If the node value was successfully modified. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
             *    - "restored and modified node q<id> = <value>": If the node was restored from the missing nodes and its value was successfully modified. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
             *    - "added node q<id> = <value>": If a new node was successfully added with the specified value. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
             */
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

            /**
             * Sets the value of a specified edge in the graph, adds a new edge, or deletes an edge, depending on the given parameters.
             * 
             * @param {Array} split2 - An array where the first two elements are strings representing the nodes to be connected. The node IDs should be prefixed with 'q'.
             * @param {string|number} val - The value to be set for the edge. If not a valid number, the function will attempt to delete the edge.
             * 
             * @returns {string} A string message indicating the result of the operation. This can be one of the following:
             *    - "bad node Id: q<id>": If the provided node ID is not a valid integer or it is zero. The <id> placeholder is replaced with the incorrect node ID.
             *    - "deleted edge <id1>,<id2>": If the edge was successfully deleted. The <id1> and <id2> placeholders are replaced with the IDs of the connected nodes.
             *    - "edge <id1>,<id2> not exists": If the edge with the provided node IDs does not exist in the graph. The <id1> and <id2> placeholders are replaced with the non-existent edge's node IDs.
             *    - "modified edge <id1>,<id2>": If the edge value was successfully modified. The <id1> and <id2> placeholders are replaced with the IDs of the connected nodes.
             *    - "added edge <id1>,<id2>": If a new edge was successfully added with the specified value. The <id1> and <id2> placeholders are replaced with the IDs of the connected nodes.
             *    - "NOT DONE: both connected nodes must exist in the graph": If either of the nodes specified in the edge do not exist in the graph.
             */
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

        /**
         * Calls the `displayValues` function on the current graph and returns a message indicating the displayed value.
         * 
         * @param {string} valId - The identifier of the value to display. This is passed as an argument to the `displayValues` function of the current graph.
         * 
         * @returns {string} A message indicating the displayed value. If `displayValues` returns a value, the message is "displayed value: " followed by the returned value.
         */
        function display(valId) {
            return "displayed value: " + sgv.graf.displayValues(valId);
        }
        
        /**
         * Gets or sets the display limits of the current graph. The limits are the thresholds at which the display colors change.
         * 
         * @param {Array} cmds - An array of strings that represents the command and its arguments. 
         *                       - The first element should be the string "limits".
         *                       - The second element should be "set" if you want to set the limits, in which case the array should also contain the new min and max values as the third and fourth elements, respectively.
         * 
         * @returns {string} A string message indicating the result of the operation. This can be one of the following:
         *    - "no graph defined": If the current graph is null.
         *    - "Current display limits [red, green] are set to [<min>,<max>]": If no command other than "limits" is provided. The <min> and <max> placeholders are replaced with the current minimum and maximum display limits, respectively.
         *    - "too few arguments\nUse: limits set <min> <max>": If the "set" command is used but the new min and max values are not provided.
         *    - "Bad arguments: <min> and <max> should be numbers.": If the provided min or max value is not a number.
         *    - "Bad arguments: <min> cannot be greater than zero, <max> cannot be less than zero and both values cannot be zero at the same time.": If the provided min value is greater than zero, the max value is less than zero, or both values are zero.
         *    - "Display limits [red, green] are set to [<min>,<max>]": If the limits were successfully set. The <min> and <max> placeholders are replaced with the new minimum and maximum display limits, respectively.
         *    - "bad arguments": If an unrecognized command is used.
         */        
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
                default:
                    return "bad arguments";
            }
            
            sgv.graf.displayValues(sgv.graf.currentScope);
            return response;
        }
        
        /**
         * Provides help information for the specified command.
         * 
         * @param {string} command - The name of the command to provide help for. It should be one of the following: "set", "create", "clear", "display", "displaymode".
         * 
         * @returns {string} A string message containing help information for the specified command. If the command is not recognized, the message will contain help information for all commands.
         */        
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
            case "display":
                result = display(command[1]);
                break;
            case "displaymode":
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
    
    /**
     * 
     * @public
     * @return {none}
     */
    switchConsole() {
        if (this.ui.style.display !== "block") {
            this.ui.style.display = "block";
        } else {
            this.ui.style.display = "none";
        }
    }

    /**
     * Shows the console.
     * @public
     * @return {none}
     */
    showConsole() {
        this.ui.style.display = "block";
    }

    /**
     * Hides the console.
     * @public
     * @return {none}
     */
    hideConsole() {
        this.ui.style.display = "none";
    }
    
}

/**
 * Represents the static instance of DlgConsole in the sgv namespace.
 * @type {DlgConsole}
 * @memberof sgv
 * @static
 */
sgv.dlgConsole = new DlgConsole();

/* global sgv, UI, Edge, qD, QbDescr */

/**
 * @class
 * @classdesc Represents the DlgCellView class.
 * @memberof sgv
 */
const DlgCellView = (function () {
    /**
     * Select elements for choosing the column, row, and layer of the cell view.
     * @type {HTMLSelectElement}
     */
    var selectGraphCols, selectGraphRows, selectGraphLays, selectScope;

    /**
     * Buttons for navigating the cell view.
     * @type {HTMLButtonElement}
     */
    var upButton, leftButton, rightButton, downButton;

    /**
     * SVG element for rendering the graph visualization.
     * @type {SVGElement}
     */
    var svgView;

    /**
     * Variables to store the current row, column, and layer of the cell view.
     * @type {number}
     */
    var r, c, l;

    /**
     * Previously focused element.
     * @type {HTMLElement}
     */
    var prevFocused = null;

    /**
     * Width of the SVG view.
     * @type {number}
     * @constant
     */
    const _width = 600;

    /**
     * Height of the SVG view.
     * @type {number}
     * @constant
     */
    const _height = 600;

    /**
     * Center X coordinate of the SVG view.
     * @type {number}
     * @constant
     */
    const ctrX = _width / 2;

    /**
     * Center Y coordinate of the SVG view.
     * @type {number}
     * @constant
     */
    const ctrY = _height / 2;

    /**
     * User interface element for the cell view dialog.
     * @type {HTMLElement}
     */
    var ui = createUI();

    /**
     * Event listener for keydown events in the dialog.
     * @param {KeyboardEvent} event - The keydown event.
     */
    ui.addEventListener('keydown', onKeyDownX);

    /**
     * X coordinate of the initial touch.
     * @type {number}
     */
    var xDown = null;                                                        

    /**
     * Y coordinate of the initial touch.
     * @type {number}
     */
    var yDown = null;

    /**
     * Event listener for touchstart events in the dialog.
     * @param {TouchEvent} evt - The touchstart event.
     */
    ui.addEventListener('touchstart', handleTouchStart, false);        

    /**
     * Event listener for touchmove events in the dialog.
     * @param {TouchEvent} evt - The touchmove event.
     */
    ui.addEventListener('touchmove', handleTouchMove, false);

    /**
     * Event listener for the window load event.
     */
    window.addEventListener('load', () => {
        window.document.body.appendChild(ui);
    });

    /**
     * Get touches from the touch event.
     * @param {TouchEvent} evt - The touch event.
     * @returns {TouchList} The touches from the event.
     */
    function getTouches(evt) {
      return evt.touches ||             // browser API
             evt.originalEvent.touches; // jQuery
    }    

    /**
     * Event handler for touchstart events.
     * @param {TouchEvent} evt - The touchstart event.
     */
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                

    /**
     * Event handler for touchmove events.
     * @param {TouchEvent} evt - The touchmove event.
     */
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

    /**
     * Event handler for keydown events in the dialog.
     * @param {KeyboardEvent} event - The keydown event.
     */
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

    /**
     * Creates the user interface for the cell view dialog.
     * @returns {HTMLElement} The UI element.
     */
    function createUI() {
        // Initialize variables
        r = c = l = 0;

        // Create the main UI element
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvCellView", "Cell view", true);

        // Add event listener for the hide button
        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialogX();
        });

        // Create the content div
        let content = UI.tag("div", {"class": "content", "id": "main"});


        // Create the SVG view element
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

        // Select elements for choosing the column, row, and layer of the cell view
        
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

        // Append content to the UI element
        ui.appendChild(content);

        // Set initial display style to "none"
        ui.style.display = "none";

        // Return the UI element
        return ui;
    }
    

    /**
     * Event handler for click events on elements.
     * @param {MouseEvent} e - The click event.
     */
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

    /**
    * Calculates the position of a node based on its ID and mode.
    * @param {number} id - The ID of the node.
    * @param {string} mode - The mode of the position calculation.
    * @returns {Object} The x and y coordinates of the node.
    */
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

    /**
     * Event handler for click events on external nodes.
     * @param {MouseEvent} event - The click event.
     */
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
    
    /**
     * Event handler for click events on nodes.
     * @param {MouseEvent} event - The click event.
     */
    function onNodeClick(event) {
        event.preventDefault();
        let sp = event.target.id.split('_');
        let rect = event.target.getBoundingClientRect();
        if (sp.length > 1)
            sgv.dlgNodeProperties.show(sp[1], rect.x, rect.y);
        else
            sgv.dlgNodeProperties.show(event.target.id, rect.x, rect.y);
    }
    
    /**
     * Event handler for click events on edges.
     * @param {MouseEvent} event - The click event.
     */
    function onEdgeClick(event) {
        event.preventDefault();
        let sp = event.target.id.split('_');
        let rect = event.target.getBoundingClientRect();
        if (sp.length > 1)
            sgv.dlgEdgeProperties.show(sp[1], rect.x, rect.y);
        else
            sgv.dlgEdgeProperties.show(event.target.id, rect.x, rect.y);
    }
    
    /**
     * Draws an external edge.
     * @param {number} offset - The offset of the module.
     * @param {number} ijk - The index of the node.
     * @param {number} e - The index of the connected external node.
     * @param {number} endX - The x-coordinate of the end point of the edge.
     * @param {number} endY - The y-coordinate of the end point of the edge.
     */
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

    /**
     * Draws an internal edge.
     * @param {number} offset - The offset of the module.
     * @param {number} iB - The index of the starting node.
     * @param {number} iE - The index of the ending node.
     */
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

    /**
     * Draws a node.
     * @param {number} offset - The offset of the module.
     * @param {number} id - The ID of the node.
     */
    function drawNode(offset, id) {
        let nodeId = offset + id;
        if ((nodeId) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(nodeId);
            let color = valueToColor(val);

            SVG.drawSvgNode(svgView, nodeId, pos(id).x, pos(id).y, 20, color.toHexString(), onNodeClick);
            SVG.drawSvgText(svgView, nodeId, pos(id).x, pos(id).y, nodeId.toString(), 'yellow', '', onNodeClick);
        }
    }

    /**
     * Calculates the offset based on the column, row, and layer.
     * @param {number} col - The column index.
     * @param {number} row - The row index.
     * @param {number} layer - The layer index.
     * @returns {number} The calculated offset.
     */
    function calcOffset(col, row, layer) {
        let offset = layer * sgv.graf.cols * sgv.graf.rows;
        offset += row * sgv.graf.cols;
        offset += col;
        offset *= 8;

        offset += 1;

        return offset;
    }

    /**
     * Draws the module based on the column, row, and layer.
     * @param {number} col - The column index.
     * @param {number} row - The row index.
     * @param {number} layer - The layer index.
     */
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
    


    /**
     * Shows the cell view dialog.
     */
    function showDialogX() {
        // Clear and populate the select elements with options
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

        // Disable the layer select if there's only one layer
        if (sgv.graf.layers === 1) {
            selectGraphLays.disabled = 'disabled';
        } else {
            selectGraphLays.disabled = '';
        }

        // Refresh the selectScope element
        selectScope.refresh();

        // Draw the module based on the current column, row, and layer
        drawModule();

        // Show the dialog
        ui.style.display = "block";

        // Store the previously focused element and set focus to the UI element
        prevFocused = window.document.activeElement;
        ui.focus({focusVisible: false});
    }
    


    /**
     * Hides the cell view dialog.
     */
    function hideDialogX() {
        // Restore focus to the previously focused element
        if (prevFocused !== null)
            prevFocused.focus({focusVisible: false});
        // Hide the dialog
        ui.style.display = "none";
    }
    

    /**
     * Switches the visibility of the cell view dialog.
     */
    function switchDialogX() {
        if (ui.style.display === "none") {
            showDialogX();
        } else {
            hideDialogX();
        }
    }
    

    // Return public methods and properties
    return {
        refresh: drawModule,
        switchDialog: switchDialogX,
        show: showDialogX,
        hide: hideDialogX
    };
});


/**
 * Represents the static instance of DlgCellView in the sgv namespace.
 * @type {DlgCellView}
 * @memberof sgv
 * @static
 */
sgv.dlgCellView = new DlgCellView();

/* global sgv, UI, Graph, TempGraphStructure */

/**
 * @class
 * @classdesc Represents the DlgCreateGraph class. Handles the display and functionality of a dialog for creating a graph
 * @memberof sgv
 */
const DlgCreateGraph = (function() {
    var selectGraphType;
    var selectGraphCols, selectGraphRows, selectGraphLays;
    var selectGraphKL, selectGraphKR;
    
    var ui = createUI();

    var graphData;
    
    // Listen for the load event on the window object
    // This event is fired when the entire page has loaded, including all dependent resources such as stylesheets and images
    // When the load event is fired, append the ui element to the body of the window document
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    /**
     * Creates the UI for the graph creation dialog.
     * @returns {Object} The UI for the graph creation dialog.
     */
    function createUI() {
        // Create a dialog HTML element with the specified properties and assign it to "ui"
        let ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgCreateGraph" });

        // Create a title bar with the specified title and add it to the dialog
        let t = UI.createTitlebar("Create graph", false);
        ui.appendChild(t);

        // Create a content div for the graph selection and add it to the dialog
        let divSel = UI.tag( "div", { "class": "content", "id": "graphSelection" });

        // Append several child elements to the divSel element
        divSel.appendChild(UI.tag('div',{'id':'description'}));
        let g = UI.tag('div',{'id':'description'});

        // Center align the text in the "g" div
        g.style['text-align']='center';

        // Create a select element for the graph type and add it to the "g" div
        // Also add an event listener that disables the selectGraphLays element when the graph type is "chimera"
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

        // Add a horizontal line to the "g" div
        g.appendChild(UI.tag('hr'));
        
        // Create a select element for the graph columns and add it to the "g" div
        // The options for the select element are the numbers from 1 to 16
        selectGraphCols = UI.tag('select',{'id':'graphCols'});
        for (let i=1; i<17; i++ ) {
            selectGraphCols.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphCols, 4);

        g.appendChild(UI.tag('label',{'for':'graphCols'},{'innerHTML':' columns: '}));
        g.appendChild(selectGraphCols);

        // Create a select element for the graph rows and add it to the "g" div
        // The options for the select element are the numbers from 1 to 16
        selectGraphRows = UI.tag('select',{'id':'graphRows'});
        for (let i=1; i<17; i++ ) {
            selectGraphRows.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphRows, 4);
 
        g.appendChild(UI.tag('label',{'for':'graphRows'},{'innerHTML':' rows: '}));
        g.appendChild(selectGraphRows);

        // Create a select element for the graph layers and add it to the "g" div
        // The options for the select element are the numbers from 1 to 5
        // The select element is initially disabled
        selectGraphLays = UI.tag('select',{'id':'graphLays'});
        for (let i=1; i<6; i++ ) {
            selectGraphLays.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphLays, 1);
        selectGraphLays.disabled = 'disabled';
        g.appendChild(UI.tag('label',{'for':'graphLays'},{'innerHTML':' layers: '}));
        g.appendChild(selectGraphLays);

        // Add a horizontal line to the "g" div
        g.appendChild(UI.tag('hr'));

        // Create a select element for the graph module size KL and add it to the "g" div
        // The options for the select element are the numbers from 1 to 4
        selectGraphKL = UI.tag('select',{'id':'graphKL'});
        selectGraphKL.appendChild(UI.option('1','1'));
        selectGraphKL.appendChild(UI.option('2','2'));
        selectGraphKL.appendChild(UI.option('3','3'));
        selectGraphKL.appendChild(UI.option('4','4',true));

        g.appendChild(UI.tag('label',{'for':'graphKL'},{'innerHTML':'module size: K = '}));
        g.appendChild(selectGraphKL);

        // Create a select element for the graph module size KR and add it to the "g" div
        // The options for the select element are the numbers from 1 to 4
        selectGraphKR = UI.tag('select',{'id':'graphKR'});
        selectGraphKR.appendChild(UI.option('1','1'));
        selectGraphKR.appendChild(UI.option('2','2'));
        selectGraphKR.appendChild(UI.option('3','3'));
        selectGraphKR.appendChild(UI.option('4','4',true));

        g.appendChild(UI.tag('label',{'for':'graphKR'},{'innerHTML':', '}));
        g.appendChild(selectGraphKR);

        // Add the "g" div to the divSel element
        divSel.appendChild(g);

        // Create a div for the buttons and add it to the divSel element
        let btns = UI.tag('div',{'id':'buttons'});

        // Create a "Cancel" button and add it to the buttons div
        // Also add an event listener that hides the dialog when the button is clicked
        let cancelButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCancelButton', 'name':'cancelButton', 'value':'Cancel'});
        cancelButton.addEventListener('click', ()=>{hideDialog();});
        btns.appendChild(cancelButton);
        
        // Create a "Create" button and add it to the buttons div
        // Also add an event listener that calls the onCreateButton function when the button is clicked
        let createButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCreateButton', 'name':'createButton', 'value':'Create'});
        createButton.addEventListener('click', ()=>{onCreateButton();});
        btns.appendChild(createButton);

        // Add the buttons div to the divSel element
        divSel.appendChild(btns);

        // Append the divSel to the ui element
        ui.appendChild(divSel);

        // Initially, hide the ui element by setting its display to "none"
        ui.style.display = "none";
        
        // Return the created ui element
        return ui;
    };
    
    /**
     * Gets the graph description from the current values of the select elements.
     * @returns {GraphDescr} The graph description.
     */
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

    /**
     * Suggests graph size based on maximum node in the graph data.
     * @returns {undefined}
     */
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
    
    /**
     * Creates a graph with the selected description when "Create" button is clicked.
     * @returns {undefined}
     */
    function onCreateButton() {
        let gDesc = getGraphDescr();
        
        showSplashAndRun(()=>{
                hideDialog();
                setTimeout(()=>{
                    Graph.create( gDesc, graphData );
                }, 100);
            },true);
    }
    
    /**
     * Shows the dialog for creating a graph.
     * @param {string} type - Type of the graph.
     * @param {Object} struct - Temporary graph structure.
     * @returns {undefined}
     */
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

    /**
     * Hides the dialog for creating a graph.
     * @returns {undefined}
     */
    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
        
    // Return an object with references to the showDialog and hideDialog functions
    return {
        d: graphData,
        show: showDialog,
        hide: hideDialog
    };
});


/**
 * Represents the static instance of DlgCreateGraph in the sgv namespace.
 * @type {DlgCreateGraph}
 * @memberof sgv
 * @static
 */
sgv.dlgCreateGraph = new DlgCreateGraph();


/* global sgv, UI, Dispatcher */

/**
 * @class
 * @classdesc Represents the DlgEdgeProperties class.
 * @memberof sgv
 * @property {function} show - Function to show the dialog
 * @property {function} hide - Function to hide the dialog
 * @property {function} refresh - Function to refresh the dialog
 * @property {function} isVisible - Function to check if the dialog is visible
 */
const DlgEdgeProperties = (function() {
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

    /**
     * Function to create UI for the dialog.
     *
     * @returns {Object} - Returns the UI object for the dialog
     */
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

    /**
     * Function to show the dialog.
     *
     * @param {?string} edgeId - The ID of the edge
     * @param {?number} x - The x position to show the dialog
     * @param {?number} y - The y position to show the dialog
     */
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

    /**
     * Function to handle keydown events in the dialog.
     *
     * @param {Object} event - The keydown event
     */
    function onKeyDownX(event) {
//        if (!ui.contains(document.activeElement)) return;

        let key = event.key;
        
        if (key==='Escape') {
           hideDialog();
        }
    }

    /**
     * Function to hide the dialog.
     */
    function hideDialog() {
        if (prevFocused!==null) prevFocused.focus({focusVisible: false});
        if (ui!==null) ui.style.display = "none";
    };

    /**
     * Function to handle selection change in the edge ID dropdown.
     */
    function selectedEdgeId() {
        showDialog(event.target.value);
    }

    /**
     * Function to handle the Delete button click event.
     */
    function onDeleteEdgeButton() {
        hideDialog();
        sgv.graf.delEdge(hidEdgeId.value);
    };

    /**
     * Function to handle the Set button click event.
     */
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

    /**
     * Function to handle the value enable checkbox click event.
     */
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

    /**
     * Function to refresh the dialog.
     */
    function refreshX() {
        if (ui.style.display === "block") showDialog();
    };

    // The API exposed by this module
    return {
        show: showDialog,
        hide: hideDialog,
        refresh: refreshX,
        isVisible: () => {
            return (ui!==null)&&(ui.style.display === "block");
        }
    };
});

/**
 * Represents the static instance of DlgEdgeProperties in the sgv namespace.
 * @type {DlgEdgeProperties}
 * @memberof sgv
 * @static
 */
sgv.dlgEdgeProperties = new DlgEdgeProperties();

/* global UI, sgv, Edge, Dispatcher, SVG */

/**
 * @class Represents an object with properties and methods related to the value panel component.
 * @memberof sgv.DlgNodeProperties
 */
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

    /**
     * Updates the value of a node in the graph based on the input from the user.
     * @returns None
     */
    function edycjaN() {
        let val = parseFloat(editWagaN.value.replace(/,/g, '.'));
        sgv.graf.setNodeValue(nodeId, val, scope);
        Dispatcher.graphChanged();
    };

    /**
     * Activates or deactivates a feature based on the given isActive parameter.
     * @param {boolean} isActive - Indicates whether the feature should be activated or deactivated.
     * @returns None
     */
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

    /**
     * Updates the UI to show the current value of a node.
     * If the current value is null or NaN, the checkbox is unchecked and the input field and button are disabled.
     * If the current value is not null or NaN, the checkbox is checked and the input field and button are enabled.
     * @returns None
     */
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
    
    /**
     * Sets the value of the nodeId variable to the given id and calls the showX function.
     * @param {any} id - The id to set the nodeId variable to.
     * @returns None
     */
    function setNodeX(id) {
        nodeId = id;
        showX();
    }

    /**
     * Sets the scope to the given value and calls the showX() function.
     * @param {any} sc - The scope.
     * @returns None
     */
    function setScopeX(sc) {
        scope = sc;
        showX();
    }

    /**
     * Sets the value of the nodeId in scope and calls the showX function.
     * @param {any} id - The value to assign to the nodeId variable.
     * @param {any} sc - The scope.
     * @returns None
     */
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

/**
 * @class
 * @classdesc Represents a dialog for displaying and editing properties of a node in a graph.
 * @memberof sgv
 */
const DlgNodeProperties = (function() {
   
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

    /**
     * Creates the user interface for the application.
     * @returns None
     */
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

    /**
     * Draws connected edges for a given node.
     * @param {Node} n1 - The node for which to draw connected edges.
     * @returns None
     */
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

    /**
     * Draws a node with the specified ID.
     * @param {string} nodeId - The ID of the node to draw.
     * @returns None
     */
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

    /**
     * Displays a dialog box at the specified coordinates.
     * @param {string} nodeId - The ID of the node to display the dialog box on.
     * @param {number} x - The x-coordinate of the dialog box.
     * @param {number} y - The y-coordinate of the dialog box.
     * @returns None
     */
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

        checkLabelN.checked = ""; 
        editLabelN.value = sgv.graf.nodeLabel(nodeId);
        if (sgv.graf.isNodeLabelVisible(nodeId))
        {
            checkLabelN.checked = "checked";
            editLabelN.disabled = "";
        }
        else
        {
            editLabelN.disabled = "disabled";
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
    
});

/**
 * Represents the static instance of DlgNodeProperties in the sgv namespace.
 * @type {DlgNodeProperties}
 * @memberof sgv
 * @static
 */
sgv.dlgNodeProperties = new DlgNodeProperties();
/* global sgv, UI, FileIO */


/**
 * @class
 * @classdesc Represents the DlgAbout class. This class provides functionality related to handling the alternative save file dialog if the browser does not allow to open the system window for selecting a file to save.
 * @memberof sgv
 */
const DlgAlternateFileSave = (function() {
    var selectType, selectName, spanExt;
    var btnCancel, btnSave;
    
    /**
     * @type {HTMLElement}
     * @description User interface element for the dialog
     */
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    /**
     * @function
     * @description Creates the user interface for the dialog.
     * @returns {HTMLElement} The created user interface
     */
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
    
    /**
     * @function
     * @description Hides the dialog.
     */
    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
    /**
     * @function
     * @description Shows the dialog.
     */
    function showDialog() {
        ui.style.display = "block";
        ui.showModal();
    };
    
    // Public interface
    return {
        show: showDialog,
        hide: hideDialog
    };
});


/**
 * Represents the static instance of DlgAlternateFileSave in the sgv namespace.
 * @type {DlgAlternateFileSave}
 * @memberof sgv
 * @static
 */
sgv.dlgAlternateFileSave = new DlgAlternateFileSave();
/* global sgv, UI */

/**
 * @class
 * @classdesc Represents the DlgMissingNodes class.
 * @memberof sgv
 */
class DlgMissingNodes {
    constructor() {
        /**
         * @property {HTMLElement} misN - Container for displaying missing nodes.
         * @property {HTMLElement} ui - The user interface element for the dialog.
         */
        //this.misN = null;
        this.ui = this.createUI('sgvMissingNodes');

        // Append UI to the body once the window has loaded.
        window.addEventListener('load',()=>{
            window.document.body.appendChild(this.ui);
        });
    }
    
    /**
     * Function to create user interface for the missing nodes dialog.
     * 
     * @param {string} id - The id for the UI element.
     * @returns {HTMLElement} - The created UI element.
     */
    createUI(id) {
        let o = UI.createEmptyWindow("sgvUIwindow", id, "removed nodes", true);

        var content = UI.tag("div", {'class':'content'});
        this.misN = UI.tag("div", {'id':'misN'});
        content.appendChild(this.misN);

        var del = UI.newInput("button", "clear history", "delbutton", "");
        del.addEventListener('click', () => {
            this.delAll();
        });
        content.appendChild(del);

        o.appendChild(content);
        return o;
    }

    /**
     * Function to add a missing node.
     * 
     * @param {string} nodeId - The id of the missing node.
     */
    addNode(nodeId) {
        let i = UI.newInput("button", " q" + nodeId + " ", "", "rest" + nodeId );

        i.addEventListener('click', () => {
            this.restoreNode(nodeId);
        });
        
        this.misN.appendChild(i);
        
        this.ui.style.display = "block";
    }
    
    /**
     * Function to restore a missing node.
     * 
     * @param {string} nodeId - The id of the node to restore.
     * @returns {boolean} - Returns true if node is restored, else false.
     */
    restoreNode(nodeId) {
        if (sgv.graf.restoreNode(nodeId)) {
            let but = this.ui.querySelector("#rest" + nodeId);
            but.parentNode.removeChild(but);
            
            return true;
        }
        return false;
    }
    
    /**
     * Function to delete all missing nodes.
     */
    delAll() {
        this.misN.innerHTML = "";

        if (sgv.graf !== null) {
            sgv.graf.missing = {};
        }

        this.hide();
    }

    
    show() {
        this.ui.style.display = "block";
    }
    
    hide() {
        this.ui.style.display = "none";
    }
    
}

/**
 * Represents the static instance of DlgMissingNodes in the sgv namespace.
 * @type {DlgMissingNodes}
 * @memberof sgv
 * @static
 */
sgv.dlgMissingNodes = new DlgMissingNodes;


///**
// * @description This object provides functionality related to the dialog for missing nodes.
// */
//sgv.dlgMissingNodes = new function() {
//    
//    /**
//     * @property {HTMLElement} misN - Container for displaying missing nodes.
//     * @property {HTMLElement} ui - The user interface element for the dialog.
//     */
//    var misN;
//    var ui = createUI('sgvMissingNodes');
//
//    // Append UI to the body once the window has loaded.
//    window.addEventListener('load',()=>{
//        window.document.body.appendChild(ui);
//    });
//
//
//    /**
//     * Function to create user interface for the missing nodes dialog.
//     * 
//     * @param {string} id - The id for the UI element.
//     * @returns {HTMLElement} - The created UI element.
//     */
//    function createUI(id) {
//        let o = UI.createEmptyWindow("sgvUIwindow", id, "removed nodes", true);
//
//        var content = UI.tag("div", {'class':'content'});
//        misN = UI.tag("div", {'id':'misN'});
//        content.appendChild(misN);
//
//        var del = UI.newInput("button", "clear history", "delbutton", "");
//        del.addEventListener('click', function () {
//            delMissingX();
//        });
//        content.appendChild(del);
//
//        o.appendChild(content);
//        return o;
//    };
//
//    /**
//     * Function to add a missing node.
//     * 
//     * @param {string} nodeId - The id of the missing node.
//     */
//    function addNodeX(nodeId) {
//        let i = UI.newInput("button", " q" + nodeId + " ", "", "rest" + nodeId );
//
//        i.addEventListener('click', function () {
//            restoreNodeX(nodeId);
//        });
//        
//        misN.appendChild(i);
//        
//        ui.style.display = "block";
//    };
//    
//    /**
//     * Function to restore a missing node.
//     * 
//     * @param {string} nodeId - The id of the node to restore.
//     * @returns {boolean} - Returns true if node is restored, else false.
//     */
//    function restoreNodeX(nodeId) {
//        if (sgv.graf.restoreNode(nodeId)) {
//            let but = ui.querySelector("#rest" + nodeId);
//            but.parentNode.removeChild(but);
//            
//            return true;
//        }
//        return false;
//    };
//    
//    /**
//     * Function to delete all missing nodes.
//     */
//    function delMissingX() {
//        misN.innerHTML = "";
//
//        if (sgv.graf !== null) {
//            sgv.graf.missing = {};
//        }
//
//        ui.style.display = "none";
//    };
//
//    
//    /**
//     * Returns an object containing methods for showing, hiding, adding, restoring, and deleting nodes.
//     */
//    return {
//        show: ()=>{ui.style.display = "block";},
//        hide: ()=>{ui.style.display = "none";},
//        addNode: addNodeX,
//        restoreNode: restoreNodeX,
//        delAll: delMissingX
//    };
//
//};

/* global UI, sgv */

/**
 * @class
 * @classdesc Represents the DlgAbout class.
 * @memberof sgv
 */
class DlgAbout {
    constructor() {
        this.ui = null;
        
    }

    /**
     * Creates the About Dialog if it hasn't been created yet.
     * Adds the necessary elements and styles to the dialog.
     * @public
     */
    create() {
        if (this.ui===null) {
            // Create the UI element for the dialog.
            this.ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgAbout" });
        }
        
        // Create a div to contain the content.
        var content = UI.tag( "div", { "class": "content" });

        // Apply styles to the content.
        content.style['text-align'] = 'center';
        content.style.width = 'fit-content';

        // Add HTML content to the div.
        content.innerHTML += '<div><img src="pics/EuroHPC.jpg"></div>';
        content.innerHTML += '<div>Narodowa Infrastruktura Superkomputerowa dla EuroHPC - EuroHPC PL</div>';
        content.innerHTML += '<div class="info">simGraphVisualizer v.1.0</div>';
        content.innerHTML += '<div><img src="pics/Flagi.jpg"></div>';

        // Create and append the close button.
        let btn = UI.tag( "input", {
            'type':     "button",
            'value':    "Close",
            'class':    "actionbutton",
            'id':       "closeButton",
            'name':     "closeButton"
        });
        content.appendChild(btn);

        // Add event listener to close the dialog when the button is clicked.
        btn.addEventListener('click', () => {
            this.hide();
        });

        // Create and append the title bar.
        let t = UI.createTitlebar("About", false);
        this.ui.appendChild(t);

        // Append the content to the UI element.
        this.ui.appendChild(content);

        // Initially hide the dialog.
        this.ui.style.display = "none";

        // Append the dialog to the body of the document.
        window.document.body.appendChild(this.ui);
    }

    /**
     * Shows the About Dialog.
     * Creates it first if it hasn't been created yet.
     * @public
     */
    show() {
        if (this.ui===null) {
            this.create();
        }
        this.ui.style.display = "block";

        // Show the dialog.
        this.ui.showModal();
    }

    /**
     * Hides the About Dialog.
     * @public
     */
    hide() {
        // Close the dialog and hide it.
        this.ui.close();
        this.ui.style.display = "none";
    }
}

/**
 * Represents the static instance of DlgAbout in the sgv namespace.
 * @type {DlgAbout}
 * @memberof sgv
 * @static
 */
sgv.dlgAbout = new DlgAbout();


/* global sgv, UI */

/**
 * @class
 * @classdesc Represents the DlgLoaderSplash class.
 * @memberof sgv
 */
class DlgLoaderSplash {
    constructor() {
        // UI element that will contain the splash screen
        this.ui = null;
        // Information element that will display messages on the splash screen
        this.info;
    }

    /**
     * Creates the splash screen dialog.
     * @returns {undefined}
     */
    createDialog() {
        // If the ui element is not already created
        if (this.ui===null) {
            // Create a new "dialog" HTML element with the specified properties and assign it to "ui"
            this.ui = UI.tag( "dialog", { "class": "sgvModalDialog", "id": "loaderSplash" });
        }

        // Append several child elements to the ui element
        this.ui.appendChild(UI.tag('span',{},{'textContent':'working hard for you'}));
        this.ui.appendChild(UI.tag('div',{'class':'loader'}));
        this.ui.appendChild(UI.tag('span',{},{'textContent':'... please wait ...'}));
        
        // Append child element and assign the 'info' variable to a new 'div' HTML element with the specified properties
        this.ui.appendChild(this.info = UI.tag('div',{'id':'infoBlock'}));

        // Set the display property of the ui element to "none"
        this.ui.style.display = "none";
        // Append the ui element to the body of the window document
        window.document.body.appendChild(this.ui);
    }

    /**
     * Displays the splash screen dialog.
     * @returns {undefined}
     */
    show() {
        if (this.ui===null) this.createDialog();
        if (this.ui.open) this.ui.close();
        this.info.innerHTML = "";
        this.ui.style.display = "block";
        this.ui.showModal();
    }

    /**
     * Hides the splash screen dialog.
     * @returns {undefined}
     */
    hide() {
        this.ui.close();
        this.ui.style.display = "none";
    }

    /**
     * Sets information text to display in the splash screen and optionally runs a function.
     * @param {string} text - The information text to display.
     * @param {Function} action - The function to run after setting the information text.
     * @returns {undefined}
     */
    setInfo(text,action) {
        if (this.ui.open) this.ui.close();
            this.ui.style.display = "block";
        this.ui.showModal();
        this.info.innerHTML = text;
        // If the action parameter is a function
        if (typeof action==='function'){
            // Set a timeout to run the function after a delay of 100 milliseconds
            setTimeout( ()=>{
                action();
            }, 100);
        }
    };
}

/**
 * Represents the static instance of DlgLoaderSplash in the sgv namespace.
 * @type {DlgLoaderSplash}
 * @memberof sgv
 * @static
 */
sgv.dlgLoaderSplash = new DlgLoaderSplash();


/**
 * Shows the splash screen.
 * @returns {undefined}
 */
function  showSplash() {
    sgv.dlgLoaderSplash.show();
};

/**
 * Hides the splash screen after a delay of 200 milliseconds.
 * @returns {undefined}
 */
function hideSplash() {
    setTimeout(function () {
        sgv.dlgLoaderSplash.hide();
    }, 200);
};

/**
 * Shows the splash screen, runs a specified function after a delay of 100 milliseconds, and optionally hides the splash screen.
 * @param {Function} f - The function to run.
 * @param {boolean} [noHide=false] - Whether to not hide the splash screen after running the function.
 * @returns {undefined}
 */
function showSplashAndRun(f,noHide) {
    if (typeof noHide==='undefined')
        noHide = false;
    
    showSplash();
    setTimeout(()=>{
        f();
        if (!noHide) hideSplash();
    }, 100);
};

/* global sgv, UI, Graph, TempGraphStructure, Settings */

/**
 * @class
 * @classdesc Creates a new instance of the SingleFilePanel.
 * @memberof sgv.DlgEditSettings
 * @constructor
 * @param {number} _id - The unique ID of the panel.
 * @param {string} _label - The displayable name of the external file.
 * @param {string} _path - The external file path.
 * @param {string} _params - The parameters of file execute.
 */
const SingleFilePanel = (function(_id,_label,_path,_params) {
    var myId = _id;
    var myUI = UI.tag("div", {'class':'singleFilePanel'});

    myUI.style.padding = '2px';
    myUI.style['margin'] = '2px';
    //myUI.style['background-color'] = '#00f';

    var myLabel = UI.newInput("text", _label, "label", "");
    myUI.appendChild(myLabel);
    
    var myPath = UI.newInput("text", _path, "path", "");
    myUI.appendChild(myPath);
    
    var myParams = UI.newInput("text", _params, "params", "");
    myUI.appendChild(myParams);

    let btnDelScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'value': 'x'});
    btnDelScope.addEventListener('click',(e)=>{
        SingleFilePanel.removeByUi(e.target.parentNode);
    });

    myUI.appendChild(btnDelScope);

    return {
        id: myId,
        ui: myUI,
        label: myLabel,
        path: myPath,
        params: myParams,
        close: () => { SingleFilePanel.removeByUi(myUI); }
    };
});

/**
 * Array of SingleFilePanel instances.
 * @type {SingleFilePanel[]}
 */
SingleFilePanel.panels = [];

/**
 * Removes a panel by its UI element.
 * @param {HTMLElement} tmpUI - The UI element of the panel to be removed.
 */
SingleFilePanel.removeByUi = function(tmpUI) {
    tmpUI.parentNode.removeChild(tmpUI);

    for( var i = 0; i < SingleFilePanel.panels.length; i++){ 
        if ( SingleFilePanel.panels[i].ui === tmpUI) { 
            SingleFilePanel.panels.splice(i, 1); 
        }
    }
};

/**
 * Removes all panels.
 */
SingleFilePanel.removeAll = function() {
    for( var i = SingleFilePanel.panels.length-1; i >=0; i--){
        let tmpUI = SingleFilePanel.panels[i].ui;
        tmpUI.parentNode.removeChild(tmpUI);
        SingleFilePanel.panels.splice(i, 1); 
    }
};

/**
 * Creates a new SingleFilePanel and appends its UI to the files container.
 * @param {number} _id - The ID of the panel.
 * @param {string} _label - The label of the panel.
 * @param {string} _path - The path
 * @param {string} _params - The parameters of the panel.
 * @returns {HTMLElement} The UI element of the created panel.
 */
SingleFilePanel.create = function(_id,_label,_path,_params){
    return (SingleFilePanel.panels[SingleFilePanel.panels.length] = new SingleFilePanel(_id,_label,_path,_params)).ui;
};

/**
 * @class
 * @classdesc Represents the DlgEditSettings class.
 * @memberof sgv
 */
const DlgEditSettings = (function() {
    var files;
    var workingDir;
    
    /**
     * User interface element representing the edit settings dialog.
     * @type {HTMLElement}
     */    
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    /**
     * Creates the user interface for the edit settings dialog.
     * @returns {HTMLElement} The user interface element for the edit settings dialog.
     */
    function createUI() {
        let ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgEditSettings" });

        let t = UI.createTitlebar("Edit settings", false);
        ui.appendChild(t);

        let switches = UI.tag('div',{'id':'switches'});
        let externalProgramsSwitch = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'addPanelButton', 'name':'addPanelButton', 'value':'External programs'});
        externalProgramsSwitch.style['border-bottom'] = '0';
        externalProgramsSwitch.style['background-color'] = 'rgba(0,0,0,1.0)';
        externalProgramsSwitch.style['position'] = 'relative';
        externalProgramsSwitch.style['top'] = '2px';
        externalProgramsSwitch.style['border-bottom-left-radius'] = '0';
        externalProgramsSwitch.style['border-bottom-right-radius'] = '0';
        switches.appendChild(externalProgramsSwitch);
        ui.appendChild(switches);
        
        let content = UI.tag('div',{'id':'switch_content'});
        content.style.border = '1px solid #888';
        content.style['background-color'] = '#000';
        
        files = UI.tag('div',{'id':'files'});
        
        files.style['min-width'] = '630px';
        files.style.padding = '2px';
        
        content.appendChild(files);

        let addPanelButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'addPanelButton', 'name':'addPanelButton', 'value':'add new'});
        addPanelButton.addEventListener('click', ()=>{
            if (SingleFilePanel.panels.length===0){
                files.appendChild(SingleFilePanel.create(0, "label_0","path_0","params_0"));
            } else {
                let idx = SingleFilePanel.panels[SingleFilePanel.panels.length-1].id + 1;
                files.appendChild(SingleFilePanel.create(idx, "label_"+idx,"path_"+idx,"params_"+idx));
            }
        });
        content.appendChild(addPanelButton);
        
      
        ui.appendChild(content);

        let wd = UI.tag('div',{'id':'wd'});
        wd.style['color'] = '#ddd';
        wd.style['padding-top'] = '15px';
        wd.style['text-align'] = 'center';
        wd.appendChild(UI.span("Temporary directory: ", {'id': "wDirLabel"}));
        let wdButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'wdButton', 'name':'wdButton', 'value':'...'});
        wdButton.style['width'] = 'auto';
        wdButton.addEventListener('click', ()=>{
            if (typeof window.api!=='undefined') {
                window.api.invoke("getDirectoryDlg").then((result)=>{
                    workingDir.value = result;
                });
            }
        });
        wd.appendChild(wdButton);
        workingDir = UI.newInput("text", "", "", "workingDir");
        wd.appendChild(workingDir);

        ui.appendChild(wd);

        let btns = UI.tag('div',{'id':'buttons'});

        let cancelButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cancelButton', 'name':'cancelButton', 'value':'Cancel'});
        cancelButton.addEventListener('click', ()=>{
            hideDialog();
        });
        btns.appendChild(cancelButton);
        
        let saveButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'saveButton', 'name':'saveButton', 'value':'Save settings'});
        saveButton.addEventListener('click', ()=>{
            onSaveButton();
        });
        btns.appendChild(saveButton);

        ui.appendChild(btns);

        return ui;
    };
    
    /**
     * Handles the save button click event.
     */
    function onSaveButton() {
        let pairs = {
            "workingDir": workingDir.value,
            "externApps": []
        };
        
        for (const panel of SingleFilePanel.panels) {
            pairs["externApps"].push({
                label: panel.label.value,
                path: panel.path.value,
                params: panel.params.value
            });
        }
        
        Settings.set(pairs);
        
        hideDialog();
    }
    
    /**
     * Shows the edit settings dialog.
     * @param {Object[]} _externApps - Array of external applications.
     * @param {string} _workingDir - The working directory.
     */
    function showDialog(_externApps, _workingDir) {
        ui.close();
        
        SingleFilePanel.removeAll();
        
        let idx = 0;
        for (const exr of _externApps) {
            files.appendChild(SingleFilePanel.create(idx, exr.label, exr.path, exr.params));
            idx++;
        }
        
        workingDir.value = _workingDir;
        
        ui.showModal();
    };

    /**
     * Hides the edit settings dialog.
     */
    function hideDialog() {
        ui.close();
    };
    
    /**
     * Public interface for the dlgEditSettings module.
     */
    return {
        /**
         * Shows the edit settings dialog.
         * @memberof DlgEditSettings
         * @param {Object[]} _externApps - Array of external applications.
         * @param {string} _workingDir - The working directory.
         */
        show: showDialog,
        
        /**
         * Hides the edit settings dialog.
         * @memberof DlgEditSettings
         */        
        hide: hideDialog
    };
});

/**
 * Represents the static instance of DlgEditSettings in the sgv namespace.
 * @type {DlgEditSettings}
 * @memberof sgv
 * @static
 */
sgv.dlgEditSettings = new DlgEditSettings();

//================================================
// Short description of communication:
// 
// window.api.on() functions are handlers for events send from main.js
// to web part of application with mainWindow.webContents.send()
// 
// Handlers can do actions in browser window document, but can't return results
// so they need to call window.api.invoke() and send response in message.
// 
// ElectronJS part of application can read it by ipcMain.handle() in main.js,
// optionaly ipcMain.handle() may return any result that can be read in 
// window.api.invoke() as Promise, so we can to use window.api.invoke().then()
//
//================================================

/* global sgv, UI, FileIO, ParserGEXF, ParserTXT, Graph */

//var userAgent = navigator.userAgent.toLowerCase();
//console.log(userAgent);
//if (userAgent.indexOf(' electron/') > -1) {
   // Electron-specific code
//}

/**
 * Check if running inside Electron environment
 */
if (typeof window.api!=='undefined') {
    console.log("desktopApp!");

    /**
     * Event listener to show loader splash
     */
    window.api.on( "showLoaderSplash", ()=>showSplash() );

    /**
     * Event listener to hide loader splash
     */
    window.api.on( "hideLoaderSplash", ()=>hideSplash() );

    /**
     * Event listener to set display mode of the graph
     */
    window.api.on( "setDisplayMode", (mode) => {
        if (sgv.graf !== null) {
            Graph.currentDisplayMode = mode;
            sgv.graf.setDisplayMode();
        }
    }); 

    window.api.on( "externalResult", (resultData) => {
        sgv.stringToScope(resultData, "result");
        hideSplash();
    });

    /**
     * Event listener to clear the graph
     */
    window.api.on( "clearGraph", ()=>Graph.remove() );

    window.api.on( "showAbout", ()=>sgv.dlgAbout.show() );

    window.api.on( "showSettings", (externApps, extBinDir)=>sgv.dlgEditSettings.show(externApps, extBinDir) );

    window.api.on( "createDefault", ()=>sgv.dlgCreateGraph.show() );

    window.api.on( "switchConsole", ()=>sgv.dlgConsole.switchConsole() );

    window.api.on( "switchCellView", ()=>sgv.dlgCellView.switchDialog() );

    window.api.on( "loadFile", (fileName,data) => {
        showSplashAndRun( ()=> {
            FileIO.loadGraph2(fileName,data);
        });
    });

    window.api.on( "clickSaveGraph", (fileName) => {
        showSplashAndRun( ()=> {
            var string = "";
            if (fileName.endsWith('txt')){
                string = ParserTXT.exportGraph(sgv.graf);
            } else if (fileName.endsWith('gexf')) {
                string = ParserGEXF.exportGraph(sgv.graf);
            }

            window.api.invoke("saveStringToFile", string, fileName);
        });
    });

    window.api.on( "saveEnd", ()=>hideSplash() );

    // reading data from graph and sending it as response to main world
    window.api.on( "m2w_getScopeAsTXT_request", (responseChannel, ...args) => {
        console.log("2. (index.js) window.api.on(\"m2w_getScopeAsTXT_request\")");

        //read text data from graph
        let data = (sgv.graf!==null) ? ParserTXT.exportGraph(sgv.graf) : null;

        //send response and get result
        window.api.invoke(responseChannel, data, ...args).then((result)=>{
            console.log("4. (index.js) window.api.invoke("+responseChannel+").then()");
            console.log("result = ",result);
        });
    });



    /*==========================================================================*/

    /**
     * Initialization for desktop mode
     * @function
     */
    desktopInit = () => {
        setTimeout(function () {
            sgv.dlgCPL.hidePanel();
        }, 200);
    };

    /**
     * Enable menu item
     * @function
     * @param {string} id - The id of the menu item to enable or disable
     * @param {boolean} [enabled=true] - The new state of the menu item
     */
    enableMenu = (id, enabled) => {
        if (typeof enabled==='undefined')
        enabled=true;

        window.api.invoke('enableMenu', id, enabled);
    };

} else {
    /**
     * Initialization for web mode
     * @function
     */
    desktopInit = ()=>{};

    /**
     * Stub for enableMenu when not in Electron environment
     * @function
     * @param {string} id - The id of the menu item to enable or disable
     * @param {boolean} [enabled=true] - The new state of the menu item
     */
    enableMenu = (id, enabled)=>{};
}
