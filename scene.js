"use strict";

var myScene = (function () {
    var camera = null;
    var scene = null;
    
    return {
        instance: function() {
            return scene;
        },
        
        camera: function() {
            return camera;
        }
        
        
    };
});