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

"use strict";
/* global sgv, Chimera, Pegasus, UI, parserGEXF */

sgv.controlPanel = new function() {
    var cpl = null;
    
    return {
        init: function(id) {
            cpl = UI.createControlPanel(id);

            cpl.querySelector("#cplElectronTestButton").addEventListener('click',
                function() {
                    //console.info("KONTROLA");
                    let tekst = sgv.graf.exportTXT();
                    //console.log(tekst);
                    electronTestButtonClicked(tekst);
                });
            
            cpl.querySelector("#cplCreateButton").addEventListener('click',
                function() {
                    sgv.controlPanel.createGraph();
                });

            cpl.querySelector("#cplDeleteButton").addEventListener('click',
                function() {
                    sgv.controlPanel.removeGraph();
                });

            cpl.querySelector("#cplDispValues").addEventListener('change',
                function() {
                    sgv.graf.displayValues(this.value);
                });

            cpl.querySelector("#cplSkipAddScope").addEventListener('click',
                function() {
                    cpl.querySelector("#cplDivNS").style.display = "none";
                    cpl.querySelector("#cplDivDS").style.display = "block";
                });

            cpl.querySelector("#cplAcceptAddScope").addEventListener('click',
                function() {
                    let scope = cpl.querySelector("#cplAddScopeInput").value;
                    let idx = sgv.graf.addScopeOfValues(scope);
                    
                    if (idx>=0) {
                        cpl.querySelector("#cplDispValues").add(UI.option(scope,scope));
                        cpl.querySelector("#cplDispValues").selectedIndex = idx;
                        sgv.graf.displayValues(scope);
                    }
                    
                    cpl.querySelector("#cplDivNS").style.display = "none";
                    cpl.querySelector("#cplDivDS").style.display = "inline";
                });

            cpl.querySelector("#cplAddScope").addEventListener('click',
                function() {
                    cpl.querySelector("#cplDivNS").style.display = "inline";
                    cpl.querySelector("#cplDivDS").style.display = "none";
                });

            cpl.querySelector("#cplDelScope").addEventListener('click',
                function() {
                    const select = cpl.querySelector("#cplDispValues"); 

                    let idx = sgv.graf.delScopeOfValues(select.value);
                    
                    if (  idx >= 0 ) {
                        select.remove(select.selectedIndex);
                        select.selectedIndex = idx;
                    }
                });

            cpl.querySelector("#cplSaveButton").addEventListener('click',
                function() {
                    sgv.toTXT();
                });

            cpl.querySelector("#cplSaveGEXFButton").addEventListener('click',
                function() {
                    sgv.toGEXF();
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

        ui: function() {
            return cpl;
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
            showSplash();
            
            if (sgv.graf!==null) {
                this.removeGraph();
            }

            let gDesc = this.getGraphTypeAndSize();

            switch ( gDesc.type ) {
                case "chimera" :
                    sgv.graf = Chimera.createNewGraph(gDesc.size);
                    sgv.graf.createDefaultStructure();
                    this.setModeDescription();
                    break;
                case "pegasus" :
                    sgv.graf = Pegasus.createNewGraph(gDesc.size);
                    sgv.graf.createDefaultStructure();
                    this.setModeDescription();
                    break;
            }
            
            hideSplash();
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
        
//        loadGraph1: function(file) {
//            var fr = new FileReader(); 
//            fr.addEventListener('error', () => {
//                console.error(`Error occurred reading file: ${file.name}`);
//            });
//            fr.onload = function(){
//                if (sgv.graf!==null) {
//                    this.removeGraph();
//                }
//
//                sgv.fromTXT(fr.result);
//
//                sgv.controlPanel.setModeDescription();
//            }; 
//            fr.readAsText(file); 
//        },
        
        
        loadGraph: function(selectedFile) {
            const name = selectedFile.name;
            const reader = new FileReader();
            if (selectedFile) {
                reader.addEventListener('error', () => {
                    console.error(`Error occurred reading file: ${selectedFile.name}`);
                });

                reader.addEventListener('load', () => {
                    console.info(`File: ${selectedFile.name} read successfully`);
                    //let name = selectedFile.name;
                    if (name.endsWith("txt")) {
                        if (sgv.graf!==null) {
                            this.removeGraph();
                        }

                        sgv.fromTXT(reader.result);
        
                        console.log(sgv.graf);

                        sgv.controlPanel.setModeDescription();
                    } else if(name.endsWith("gexf")) {
                        if (parseGEXF(reader.result)){
                            sgv.controlPanel.setModeDescription();
                        }
                    } else {
                        console.error(`Incorrect file format...`);
                    }
                });
                
                if ( name.endsWith("txt") || name.endsWith("gexf") ) {
                    reader.readAsText(selectedFile); 
                //reader.readAsDataURL(selectedFile);
                } else {
                    console.error(`Incorrect file extension...`);
                }
            }                    
        },
        
        loadGraph2: function(name,data) {
            if (name.endsWith("txt")) {
                if (sgv.graf!==null) {
                    this.removeGraph();
                }
                sgv.fromTXT(data);
                sgv.controlPanel.setModeDescription();
            } else if(name.endsWith("gexf")) {
                if (sgv.graf!==null) {
                    this.removeGraph();
                }
                if (parseGEXF(data)){
                    sgv.controlPanel.setModeDescription();
                }
            };
        }
    };
};
