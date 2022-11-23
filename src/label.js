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
