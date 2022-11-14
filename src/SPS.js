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
