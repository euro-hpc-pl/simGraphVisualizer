/* global BABYLON, greenMat, scene, redMat, grayMat0, grayMat1, advancedTexture, camera, graf */
const drawLabels = false;

class Node {
    constructor(id, x, y, z, val) {
        var name = "node:" + id;

        this.active = true;
        this._chckedEdges = 0;
        
        //this.mesh = BABYLON.MeshBuilder.CreateDisc(name, {radius: 2.5, tessellation: 8}, scene);
        //this.mesh.rotation = new BABYLON.Vector3(3.14/2, 0, 0);

        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, {diameter: 3, segments: 8, updatable: true}, scene);
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        
        this.setValue(val);

        if (drawLabels)
        {
            this.label = new BABYLON.GUI.TextBlock();
            this.label.text = "q" + (id + 1);
            this.label.color = "black";
            this.label.fontSize = 12;
        }
        //this.updateLabel();
    }

    set position(pos) {
        this.mesh.position = pos;
    }

    get position() {
        return this.mesh.position;
    }

    updateLabel() {
        var view = new BABYLON.Vector3(
                window.engine.getRenderWidth(),
                window.engine.getRenderHeight(), 0);

        var pt = BABYLON.Vector3.Project(
                this.mesh.position,
                BABYLON.Matrix.Identity(),
                scene.getTransformMatrix(),
                camera.viewport.toGlobal(view.x, view.y));

        //console.log(pt);

        if (drawLabels)
        {
            this.label.left = pt.x - (view.x / 2);
            this.label.top = pt.y - (view.y / 2);
            this.label.zIndex = pt.z;
            advancedTexture.addControl(this.label);
        }
    }

    move(diff) {
        this.mesh.position.addInPlace(diff);
        //this.updateText();
    }

    addCheck() {
        this._chckedEdges++;
        this.mesh.material = grayMat1;
    }

    delCheck() {
        this._chckedEdges--;
        if (this._chckedEdges === 0)
            this.mesh.material = grayMat0;
    }

    setValue(val) {
        this.value = val;

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveColor = valueToColor(val);

        this.mesh.material = mat;
    }
}

