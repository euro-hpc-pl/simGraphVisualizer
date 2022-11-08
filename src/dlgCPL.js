"use strict";
/* global sgv, Chimera, Pegasus, UI, parserGEXF, dialog, FileIO */


sgv.dlgCPL = new function() {
    var com, sel, des;
    var selectScope;
    var sliderRedLimit, sliderGreenLimit;
    var spanRed, spanGreen;
    var btnDispMode, btnShowConsole, btnSaveTXT, btnSaveGEXF, btnClear;

    var btnShowConsole2, btnCreate, btnLoad;
    
    var elm = createDialog();
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(elm);
    });

    function createDialog() {
        let elm = UI.tag( "dialog", { "class": "sgvUIwindow", "id": "sgvDlgCPL" });
        
        function divSel() {
            var divSel = UI.tag( "div", { "class": "content", "id": "graphSelection" });
            
            divSel.appendChild(
                    btnShowConsole2 = UI.createTransparentBtn1('show console',"cplShowConsoleButton",()=>{
                        sgv.dlgConsole.switchConsole();
                    }));

            divSel.appendChild(
                    btnCreate = UI.createTransparentBtn1('create graph',"cplCreateButton",()=>{
                        sgv.dlgCreateGraph.show();
                    }));

            divSel.appendChild(
                    btnLoad = UI.createTransparentBtn1('load graph', 'cplLoadButton', ()=>{
                        FileIO.onLoadButton();
            }));

            divSel.style.display = "block";
            
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

            divDesc.appendChild( spanRed=UI.tag("span",{'id':'spanRed'},{'textContent':'-1.0'}) );
            spanRed.style.display='inline-block';
            spanRed.style.width = '3em';
            sliderRedLimit = UI.tag('input',{
                'type':'range',
                'id':'redLimit',
                'value':'-1.0',
                'min':'-1.0',
                'max':'0.0',
                'step':'0.01'
            });
            sliderRedLimit.addEventListener('input', (e)=>{
                if (sgv.graf !== null) {
                    sgv.graf.redLimit = e.target.value;
                    sgv.graf.displayValues();
                    
                    spanRed.textContent = ''+sgv.graf.redLimit+' ';
                }
            });
            //sliderRedLimit.style.appearance = 'slider-vertical';
            divDesc.appendChild(sliderRedLimit);

            divDesc.appendChild( UI.tag("span",{'id':'spanZero'},{'textContent':' 0 '}) );

            sliderGreenLimit = UI.tag('input',{
                'type':'range',
                'id':'greenLimit',
                'value':'1.0',
                'min':'0.0',
                'max':'1.0',
                'step':'0.01'
            });
            sliderGreenLimit.addEventListener('input', (e)=>{
                if (sgv.graf !== null) {
                    sgv.graf.greenLimit = e.target.value;
                    sgv.graf.displayValues();
                    
                    spanGreen.textContent = ' '+sgv.graf.greenLimit;
                }
            });
            //sliderGreenLimit.style.appearance = 'slider-vertical';

            divDesc.appendChild(sliderGreenLimit);

            divDesc.appendChild( spanGreen=UI.tag("span",{'id':'spanGreen'},{'textContent':'1.0'}) );
            spanGreen.style.display='inline-block';
            spanGreen.style.width = '3em';

            let btnPanel = UI.tag('div',{
                'id':'panelBtns'
            });
            btnPanel.style['border-top']='1px solid #000';
            
            btnPanel.appendChild(
                    btnDispMode = UI.createTransparentBtn1('display mode',"cplDispModeButton",()=>{
                        sgv.switchDisplayMode();
                    }));

            btnPanel.appendChild(
                    btnShowConsole = UI.createTransparentBtn1('show console',"cplShowConsoleButton",()=>{
                        sgv.dlgConsole.switchConsole();
                    }));

            btnPanel.appendChild(
                    btnSaveTXT = UI.createTransparentBtn1('save graph',"cplSaveButton", ()=>{
                        FileIO.onSaveButton()
                            .then( result => console.log( result ) )
                            .catch( error => console.log( error ) );
                    }));

            btnPanel.appendChild(
                    btnClear = UI.createTransparentBtn1('delete graph',"cplClearButton",()=>{
                        sgv.removeGraph();
                    }));

            divDesc.appendChild(btnPanel);
            
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
        
        enableMenu('menuGraphSave', false);
        enableMenu('menuGraphClear', false);
        enableMenu('menuViewDisplayMode', false);
        
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
            
            
            nMinMax = sgv.graf.getMinMaxNodeVal();
            eMinMax = sgv.graf.getMinMaxEdgeVal();
            
            //console.log(nMinMax,eMinMax);
            
            let min, max;
            
            if (nMinMax.min!==NaN) {
                min = nMinMax.min;
                if (eMinMax.min!==NaN) {
                    min = (min<eMinMax.min)?min:eMinMax.min;
                }
            } else {
                min = eMinMax.min;
            }
            
            if (nMinMax.max!==NaN) {
                max = nMinMax.max;
                if (eMinMax.max!==NaN) {
                    max = (max>eMinMax.max)?max:eMinMax.max;
                }
            } else {
                max = eMinMax.max;
            }
            
            if ((min!==NaN)&&(min>=0)) min = NaN;
            if ((max!==NaN)&&(max<=0)) max = NaN;

            //console.log(min,max);

            if (min!==NaN) {
                if (sgv.graf.redLimit<min){
                    sgv.graf.redLimit=min;
                }
                sliderRedLimit.min = Math.round(min * 100) / 100;
                sliderRedLimit.value = sgv.graf.redLimit;
                spanRed.textContent = ''+sgv.graf.redLimit+' ';
                sliderRedLimit.disabled = '';
            } else {
                sliderRedLimit.disabled = 'disabled';
            }

            if (max!==NaN) {
                if (sgv.graf.greenLimit>max){
                    sgv.graf.greenLimit=max;
                }
                sliderGreenLimit.max = Math.round(max * 100) / 100;;
                sliderGreenLimit.value = sgv.graf.greenLimit;
                spanGreen.textContent = ' '+sgv.graf.greenLimit;
                sliderGreenLimit.disabled = '';
            } else {
                sliderGreenLimit.disabled = 'disabled';
            }
        };

        updateInfoBlock();
        refreshScopes();

        enableMenu('menuGraphSave', true);
        enableMenu('menuGraphClear', true);
        enableMenu('menuViewDisplayMode', true);

        sel.style.display = "none";
        des.style.display = "block";
    };


    return {
        desc: des,
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
