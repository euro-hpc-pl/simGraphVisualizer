/* global BABYLON, greenMat, redMat, grayMat0, grayMat1 */

class Edge {
    constructor(graf, b, e, val) {
        this.parentGraph = graf;
        
        this.value = val;//(val!==null) ? val : 0.0;
        
        this.begin = b;
        this.end = e;

        this._checked = false;

        var options = {
            path: [
                graf.nodePosition( b ),
                graf.nodePosition( e )
            ],
            radius: valueToEdgeWidth(this.value),
            updatable: true
        };

        let name = "edge:" + b + "," + e;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, this.parentGraph.scene);

        var mat = new BABYLON.StandardMaterial("mat", this.parentGraph.scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveColor = valueToColor(val);

        this.instance.material = mat;        
    }

    update() {
        var options = {
            instance: this.instance,
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ]
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, this.parentGraph.scene);
    };

    switchCheckFlag() {
        this._checked = !this._checked;

        this.parentGraph.checkNode(this.begin, this._checked);
        this.parentGraph.checkNode(this.end, this._checked);

        this.instance.material = this._checked ? grayMat1 : grayMat0;
    };
    
    setValue (val) {
        this.value = val;

        var options = {
            instance: this.instance,
            path: [
                this.parentGraph.nodePosition(this.begin),
                this.parentGraph.nodePosition(this.end)
            ],
            radius: this.parentGraph.valueToEdgeWidth(val)
        };

        let name = "edge:" + this.begin + "," + this.end;
        this.instance = BABYLON.MeshBuilder.CreateTube(name, options, this.parentGraph.scene);

        this.instance.material.emissiveColor = this.parentGraph.valueToColor(val);
    }
};
