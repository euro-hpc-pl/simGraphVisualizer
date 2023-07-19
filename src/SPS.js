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
