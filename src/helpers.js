/* global BABYLON, sgv */

const DEMO_MODE = false;

function getRandom(min, max) {
    return (min + (Math.random() * (max - min)));
};


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

var isMobile = false;

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


detectClient();

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
