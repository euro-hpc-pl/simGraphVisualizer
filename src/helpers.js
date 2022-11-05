/* global BABYLON, sgv */

function valueToColor(val) {
    if ((typeof val ==='undefined')||(val === null)|| isNaN(val)) {
        return new BABYLON.Color3(0.2, 0.2, 0.2);
    };

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


function valueToEdgeWidth(val) {
    if ((typeof val ==='undefined')||(val === null)|| isNaN(val)) {
        return 0.1;
    };

    let max = Math.abs(sgv.graf.greenLimit);
    let min = Math.abs(sgv.graf.redLimit);

    max = (max>min)?max:min;
    
    val = Math.abs(val);
    
    if (val>max){
        return 0.6;
    }
    
    return 0.1 + ( val / (2.0*max) );
}

var Def2 = /*class*/( (_n1, _n2) => {
    this.n1 = _n1;
    this.n2 = _n2;
    this.values = {
            'default': NaN
        };
    this.label = {
            text: null,
            enabled: false
        };    
});
