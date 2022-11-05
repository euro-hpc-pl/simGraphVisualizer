"use strict";
/* global sgv, Chimera, Pegasus, UI, parserGEXF */


sgv.dlgCPL = new function() {
    var com, sel, des;
    var selectScope;
    
    var elm = createDialog();
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(elm);
    });

    function createDialog() {
        let elm = UI.tag( "dialog", { "class": "sgvUIwindow", "id": "sgvDlgCPL" });
        
        function divSel() {
            var divSel = UI.tag( "div", { "class": "content", "id": "graphSelection" });
            divSel.style.display = "block";
            
//            crB = UI.createTransparentBtn('CREATE','sgvGraphCreateBtn',()=>{
//                sgv.dlgCreateGraph.show();
//            });
//
//            divSel.appendChild(crB);
            
            divSel.innerHTML += '<div><div><input class="" id="cplCreateButton" name="createButton" type="button" value="Create default"></div> \
                <div>Read from .txt file: <input id="inputfile" type="file"></div>';
            return divSel;
        };

        
        function divDesc() {
            function createInfoBlock() {
                var i = UI.tag("div", {});

                i.innerHTML = "Current graph type: ";
                i.appendChild( UI.span("unknown", {'id':"dscr_type"}) );

                i.innerHTML += ', size: <span id="dscr_cols">0</span>x<span id="dscr_rows">0</span>xK<sub><span id="dscr_KL">0</span>,<span id="dscr_KR">0</span></sub><br/> \
                        Number of nodes: <span id="dscr_nbNodes">0</span>, number of edges: <span id="dscr_nbEdges">0</span>';

                return i;
            }

            var divDesc = UI.tag("div", {"class": "content", "id": "graphDescription"});

            divDesc.appendChild(createInfoBlock());

            let divNS = UI.tag( "div", {'class': "sgvD1", 'id': "cplDivNS" }, {'textContent': "add new scope: "} );
            divNS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplSkipAddScope", 'value': "<" } ) );
            divNS.appendChild( UI.tag("input", { 'type': "text", 'id': "cplAddScopeInput", 'value': "newScope" } ) );
            divNS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplAcceptAddScope",'value': "+" } ) );
            divNS.style.display = "none";

            let divDS = UI.tag( "div", {'class': "sgvD1", 'id': "cplDivDS" }, {'textContent': "current scope: "} );
            
            selectScope = UI.tag( "select", {'id': "cplDispValues" } );
            selectScope.addEventListener('change', () => {
                sgv.graf.displayValues(selectScope.value);
            });
            divDS.appendChild( selectScope );

            divDS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplAddScope", 'value': "+" } ) );
            divDS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplDelScope", 'value': "-" } ) );

            
            let scope = UI.tag( "div", {'class': "sgvSelectBox", 'id': "cplScope" } );
            scope.appendChild(divNS);
            scope.appendChild(divDS);
            divDesc.appendChild(scope);


            divDesc.appendChild( UI.tag("input", { 'class': "actionbutton", 'id': "cplSaveButton", 'type': "button", 'value': "save to TXT" } ) );
            divDesc.appendChild( UI.tag("input", { 'class': "actionbutton", 'id': "cplSaveGEXFButton", 'type': "button", 'value': "save to GEXF" } ) );
            divDesc.appendChild( UI.tag("input", { 'class': "delbutton", 'id': "cplDeleteButton", 'type': "button", 'value': "clear workspace" } ) );

            divDesc.style.display = "none";
            return divDesc;
        };

        sel = divSel();
        des = divDesc();
        
        com = UI.tag('div', {});
        com.style.display = 'block';
        
        com.appendChild(sel);
        com.appendChild(des);
        
        elm.appendChild(com);

        elm.querySelector("#cplCreateButton").addEventListener('click',
            function() {
                sgv.dlgCreateGraph.show();
            });

        elm.querySelector("#cplDeleteButton").addEventListener('click',
            function() {
                sgv.removeGraph();
            });


        elm.querySelector("#cplSkipAddScope").addEventListener('click',
            function() {
                elm.querySelector("#cplDivNS").style.display = "none";
                elm.querySelector("#cplDivDS").style.display = "block";
            });

        elm.querySelector("#cplAcceptAddScope").addEventListener('click',
            function() {
                let scope = elm.querySelector("#cplAddScopeInput").value;
                let idx = sgv.graf.addScopeOfValues(scope);

                if (idx>=0) {
                    elm.querySelector("#cplDispValues").add(UI.option(scope,scope));
                    elm.querySelector("#cplDispValues").selectedIndex = idx;
                    sgv.graf.displayValues(scope);
                }

                elm.querySelector("#cplDivNS").style.display = "none";
                elm.querySelector("#cplDivDS").style.display = "inline";
            });

        elm.querySelector("#cplAddScope").addEventListener('click',
            function() {
                elm.querySelector("#cplDivNS").style.display = "inline";
                elm.querySelector("#cplDivDS").style.display = "none";
            });

        elm.querySelector("#cplDelScope").addEventListener('click',
            function() {
                const select = elm.querySelector("#cplDispValues"); 

                let idx = sgv.graf.delScopeOfValues(select.value);

                if (  idx >= 0 ) {
                    select.remove(select.selectedIndex);
                    select.selectedIndex = idx;
                }
            });

        elm.querySelector("#cplSaveButton").addEventListener('click',
            function() {
                sgv.toTXT();
            });

        elm.querySelector("#cplSaveGEXFButton").addEventListener('click',
            function() {
                sgv.toGEXF();
            });

        elm.querySelector('#inputfile').addEventListener('change',
            function () {
                showSplashAndRun(()=>{
                    sgv.loadGraph(this.files[0]);
                });
            });

        var swt = UI.tag('div', {'id':'switch'});
        
        swt.addEventListener('click',() => {
           switchDialog(); 
        });
        
        swt.innerHTML = '. . .';
        elm.appendChild(swt);
        
        elm.style.display = 'block';
        
        return elm;
    };
    
    function showDialog() {
        com.style.display = "block";
    };
    
    function hideDialog() {
        com.style.display = "none";
    };
    
    function switchDialog() {
        com.style.display = (com.style.display === "none")?"block":"none";
    };
    
    function addScopeX(scope,idx) {
        selectScope.add(UI.option(scope,scope));
        selectScope.selectedIndex = idx;
    }
    
    function delScopeX(scope,idx2) {
        let i = UI.findOption(selectScope, scope);
        if ( i>-1 ) {
            selectScope.remove(i);
        }
        selectScope.selectedIndex = idx2;
    }
    
    function selScopeX(scope) {
        let i = UI.findOption(selectScope, scope);
        if ( i>-1 ) {
            selectScope.selectedIndex = i;
        }
    }
    
    function setModeSelectionX() {
        sel.style.display = "block";
        des.style.display = "none";
    };


    function setModeDescriptionX() {
        function refreshScopes() {
            if (sgv.graf!==null){
                UI.clearSelect(selectScope, true);
                for (const key in sgv.graf.scopeOfValues) {
                    let scope = sgv.graf.scopeOfValues[key];
                    let opt = UI.option(scope, scope);
                    if ( sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
                        opt.selected = "selected";
                    }
                    selectScope.appendChild(opt);
                }
            }
        }

        function updateInfoBlock() {
            elm.querySelector("#dscr_type").textContent = sgv.graf.type;
            elm.querySelector("#dscr_cols").textContent = sgv.graf.cols;
            elm.querySelector("#dscr_rows").textContent = sgv.graf.rows;
            elm.querySelector("#dscr_KL").textContent = sgv.graf.KL;
            elm.querySelector("#dscr_KR").textContent = sgv.graf.KR;
            elm.querySelector("#dscr_nbNodes").textContent = Object.keys(sgv.graf.nodes).length;
            elm.querySelector("#dscr_nbEdges").textContent = Object.keys(sgv.graf.edges).length;
        };

        updateInfoBlock();
        refreshScopes();

        sel.style.display = "none";
        des.style.display = "block";
    };


    return {
        ui:  function() {
            return elm;
        },
        show: showDialog,
        hide: hideDialog,
        switchPanel: switchDialog,
        setModeDescription: setModeDescriptionX,
        setModeSelection: setModeSelectionX,
        addScope: addScopeX,
        delScope: delScopeX,
        selScope: selScopeX
    };
};

sgv.setModeSelection = sgv.dlgCPL.setModeSelection;
sgv.setModeDescription = sgv.dlgCPL.setModeDescription;

sgv.removeGraph = function() {
    if (sgv.graf!==null) {
        sgv.graf.dispose();
        //delete graf;
        sgv.graf = null;
    }

    sgv.dlgMissingNodes.delAll();
    sgv.setModeSelection();
};

sgv.createGraph = function(gDesc, res) {
    if (sgv.graf!==null) {
        sgv.removeGraph();
    }

    switch ( gDesc.type ) {
        case "chimera" :
            sgv.graf = Chimera.createNewGraph(gDesc.size);
            break;
        case "pegasus" :
            sgv.graf = Pegasus.createNewGraph(gDesc.size);
            break;
        default:
            return;
    }

    if (typeof res === 'undefined')
        sgv.graf.createDefaultStructure();
    else
        sgv.graf.createStructureFromDef(res);
    
    sgv.setModeDescription();
};
