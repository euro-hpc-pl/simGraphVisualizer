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
     * Sets whether the label is enabled.
     * @param {boolean} b - If true, the label is enabled. If false, it is not.
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
