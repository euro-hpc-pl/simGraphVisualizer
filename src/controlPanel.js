"use strict";
/* global sgv, Chimera, Pegasus, UI */

sgv.controlPanel = new function() {
    var cpl = null;
    
    return {
        init: function(id) {
            cpl = UI.createControlPanel(id);
            
            cpl.querySelector("#cplCreateButton").addEventListener('click',
                function() {
                    sgv.controlPanel.createGraph();
                });

            cpl.querySelector("#cplDeleteButton").addEventListener('click',
                function() {
                    sgv.controlPanel.removeGraph();
                });

            cpl.querySelector("#cplSaveButton").addEventListener('click',
                function() {
                    sgv.toTXT();
                });

            cpl.querySelector('#inputfile').addEventListener('change',
                function () {
                    sgv.controlPanel.loadGraph(this.files[0]);
                });

            //console.log(cpl);
        },
        
        show: function(b) {
            cpl.style.display = (isUndefined(b)||(b!==0))?"block":"none";
        },

        hide: function(b) {
            cpl.style.display = (isUndefined(b)||(b!==0))?"none":"block";
        },

        switchPanel: function() {
            cpl.style.display = (cpl.style.display === "none")?"block":"none";
        },

        setModeSelection: function() {
            document.getElementById("graphSelection").style.display = "block";
            document.getElementById("graphDescription").style.display = "none";
        },
        
        setModeDescription: function() {
            document.getElementById("graphSelection").style.display = "none";
            document.getElementById("graphDescription").style.display = "block";

            this.updateDescription();
        },
        
        updateDescription: function() {
            document.getElementById("dscr_type").textContent = sgv.graf.type;
            document.getElementById("dscr_cols").textContent = sgv.graf.cols;
            document.getElementById("dscr_rows").textContent = sgv.graf.rows;
            document.getElementById("dscr_KL").textContent = sgv.graf.KL;
            document.getElementById("dscr_KR").textContent = sgv.graf.KR;
            document.getElementById("dscr_nbNodes").textContent = Object.keys(sgv.graf.nodes).length;
            document.getElementById("dscr_nbEdges").textContent = Object.keys(sgv.graf.edges).length;
        },
        
        getGraphTypeAndSize() {
            return {
                type: document.getElementById("graphType").value,
                size: {
                    cols: parseInt(document.getElementById("graphCols").value, 10),
                    rows: parseInt(document.getElementById("graphRows").value, 10),
                    KL: parseInt(document.getElementById("graphKL").value, 10),
                    KR: parseInt(document.getElementById("graphKR").value, 10)
                }
            };
        },
        
        createGraph: function() {
            if (sgv.graf!==null) {
                this.removeGraph();
            }

            let gDesc = this.getGraphTypeAndSize();

            switch ( gDesc.type ) {
                case "chimera" :
                    sgv.graf = Chimera.createNewGraph(gDesc.size);
                    this.setModeDescription();
                    break;
                case "pegasus" :
                    sgv.graf = Pegasus.createNewGraph(gDesc.size);
                    this.setModeDescription();
                    break;
            }
        },
        
        removeGraph: function() {
            if (sgv.graf!==null) {
                sgv.graf.dispose();
                //delete graf;
                sgv.graf = null;
            }

            sgv.delMissing();
            this.setModeSelection();
        },
        
        loadGraph: function(file) {
            var fr = new FileReader(); 
            fr.onload = function(){
                if (sgv.graf!==null) {
                    this.removeGraph();
                }

                sgv.fromTXT(fr.result);

                sgv.controlPanel.setModeDescription();
            }; 
            fr.readAsText(file); 
        }
    };
};
