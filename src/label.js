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
            this.plane.position = pos.add(new BABYLON.Vector3(0.0, 5.0, 0.0));
    };

    this.createPlane = function() {
        //Set font
        var font_size = 48;
        var font = "normal " + font_size + "px Arial";

        //Set height for plane
        var planeHeight = 4;

        //Set height for dynamic texture
        var DTHeight = 1.5 * font_size; //or set as wished

        //Calcultae ratio
        var ratio = planeHeight / DTHeight;

        //Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
        var temp = new BABYLON.DynamicTexture("DynamicTexture", 64, sgv.scene);
        var tmpctx = temp.getContext();
        tmpctx.font = font;

        //Set text
        var text = this.text;

        var DTWidth = tmpctx.measureText(text).width + 8;

        //Calculate width the plane has to be 
        var planeWidth = DTWidth * ratio;

        //Create dynamic texture and write the text
        var mat = new BABYLON.StandardMaterial("mat", sgv.scene);
        mat.diffuseTexture = new BABYLON.DynamicTexture("DynamicTexture", {width: DTWidth, height: DTHeight}, sgv.scene, false);
        mat.diffuseTexture.drawText(text, null, null, font, "#000000", "#ffff00", true);
        
        var plane = BABYLON.MeshBuilder.CreatePlane(this.id + "_plane", {width: planeWidth, height: planeHeight, updatable: true}, sgv.scene);
        plane.material = mat;

        return plane;
    };

    /**
     * @param {type} txt
     * @param {type} position
     * @returns {undefined}
     */
    this.createMe = async function (txt, position, enabled) {
        this.plane = this.createPlane();
        this.plane.position = position.add(new BABYLON.Vector3(0.0, 5.0, 0.0));
        this.plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        this.plane.setEnabled(enabled);
        this.plane.isPickable = false;
    };

    this.setEnabled = function (b) {
        if (this.plane!==null)
            this.plane.setEnabled(b);
    };

    this.text = txt;
    this.position = position;
    this.id = labelId;
    this.plane = null;
    this.createMe(txt, position, enabled);
});



var Label2 = /** @class */ (function (labelId, txt, position) {
    this.id = labelId;
    var text = txt;

    var lbLit = txt.length;

    var planeHeight = 48.0 / 15.0;
    var planeWidth = lbLit * 26.0 / 15.0;

    const mat = new BABYLON.StandardMaterial("mat");

//       mat.diffuseTexture = BABYLON.Texture.CreateFromBase64String("data:image/jpg;base64,/9j/4AAQgABAQAAAD/2wBDAAgGBgcGBQ...", "texture name", sgv.scene); 

    mat.diffuseTexture = new BABYLON.Texture("cyferki.png");
    mat.diffuseTexture.uScale = lbLit / 11.0;
    mat.diffuseTexture.vScale = 1.0;
    mat.diffuseTexture.uOffset = 1.0 / 11.0;
    mat.diffuseTexture.vOffset = 0.0;

    this.plane = BABYLON.MeshBuilder.CreatePlane(labelId + "_plane", {width: planeWidth, height: planeHeight, updatable: true}, sgv.scene);
    this.plane.material = mat;

    this.plane.position = position.add(new BABYLON.Vector3(0.0, 5.0, 0.0));

    this.plane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;

    this.plane.setEnabled(false);
    this.plane.isPickable = false;

    this.setEnabled = function (b) {
        this.plane.setEnabled(b);
    };

});
