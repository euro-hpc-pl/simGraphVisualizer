"use strict";
/* global scene, graf */

var switchPanel = function() {
    var cpl = document.getElementById("sterowanie");
    if (cpl.style.display === "none") {
        cpl.style.display = "block";
    } else {
        cpl.style.display = "none";
    }
};

var setModeSelection = function() {
    document.getElementById("graphSelection").style.display = "block";
    document.getElementById("graphDescription").style.display = "none";
};

var setModeDescription = function() {
    document.getElementById("graphSelection").style.display = "none";
    document.getElementById("graphDescription").style.display = "block";
    
    updateDescription();
};

var updateDescription = function() {
    document.getElementById("dscr_type").textContent = graf.type;
    document.getElementById("dscr_cols").textContent = graf.cols;
    document.getElementById("dscr_rows").textContent = graf.rows;
    document.getElementById("dscr_KL").textContent = graf.KL;
    document.getElementById("dscr_KR").textContent = graf.KR;
    document.getElementById("dscr_nbNodes").textContent = Object.keys(graf.nodes).length;
    document.getElementById("dscr_nbEdges").textContent = Object.keys(graf.edges).length;
};

var createGraph = function() {
    if (graf!==null) {
        removeGraph();
    }

    let type = document.getElementById("graphType").value;

    switch (type) {
        case "chimera" :
            graf = new Chimera(scene);
            graf.setSizeFromWindow();
            graf.createNew();
            setModeDescription();
            break;
        case "pegasus" :
            graf = new Pegasus(scene);
            graf.setSizeFromWindow();
            graf.createNew();
            setModeDescription();
            break;
    }
};


var removeGraph = function() {
    if (graf!==null) {
        graf.dispose();
        //delete graf;
        graf = null;
    }
    
    delMissing();
    setModeSelection();
};


var loadGraph = function(file) {
    var fr = new FileReader(); 
    fr.onload = function(){
        if (graf!==null) {
            removeGraph();
        }

        fromTXT(fr.result);
        
        setModeDescription();
    }; 
    fr.readAsText(file); 
};
