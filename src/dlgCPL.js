
"use strict";
/* global sgv, Chimera, Pegasus, UI, parserGEXF, dialog, FileIO, Graph */


sgv.dlgCPL = new function () {
    var switchableContent; 
    var selectionPanel, descriptionPanel;
    var selectScope;
    var sliderRedLimit, sliderGreenLimit;
    var spanRed, spanGreen;
    var btnDispMode, btnCellView, btnShowConsole, btnSaveTXT, btnClear;
    var scopePanel, btnPanel;
    var btnShowConsole2, btnCreate, btnLoad;

    var ui = createDialog();

    window.addEventListener('load', () => {
        window.document.body.appendChild(ui);
    });

    function createDialog() {
        let ui = UI.tag("dialog", {"class": "sgvUIwindow disable-select", "id": "sgvDlgCPL"});

        function createSelectionPanel() {
            var divSel = UI.tag("div", {"class": "content", "id": "graphSelection"});

            divSel.appendChild(
                    btnShowConsole2 = UI.createTransparentBtn1('show console', "cplShowConsoleButton", () => {
                        sgv.dlgConsole.switchConsole();
                    }));

            divSel.appendChild(
                    btnCreate = UI.createTransparentBtn1('create graph', "cplCreateButton", () => {
                        sgv.dlgCreateGraph.show();
                    }));

            divSel.appendChild(
                    btnLoad = UI.createTransparentBtn1('load graph', 'cplLoadButton', () => {
                        FileIO.onLoadButton();
                    }));

            divSel.style.display = "block";

            return divSel;
        }



        function createDescriptionPanel() {
            function createInfoBlock() {
                let i = UI.tag("div", {});

                i.innerHTML = "Current graph type: ";
                i.appendChild(UI.span("unknown", {'id': "dscr_type"}));

                i.innerHTML += ', size: <span id="dscr_cols">0</span>x<span id="dscr_rows">0</span>xK<sub><span id="dscr_KL">0</span>,<span id="dscr_KR">0</span></sub><br/> \
                        Number of nodes: <span id="dscr_nbNodes">0</span>, number of edges: <span id="dscr_nbEdges">0</span>';

                return i;
            }

            function createLimitSlidersPanel() {
                let sldPanel = UI.tag('div', {'id': 'panelLimitSliders'});

                sldPanel.appendChild(spanRed = UI.tag("span", {'id': 'spanRed'}, {'textContent': '-1.0'}));

                sliderRedLimit = UI.tag('input', {
                    'type': 'range',
                    'class': 'graphLimit',
                    'id': 'redLimit',
                    'value': '-1.0',
                    'min': '-1.0',
                    'max': '0.0',
                    'step': '0.01'
                });
                sliderRedLimit.addEventListener('input', async (e) => {
                    if (sgv.graf !== null) {
                        sgv.graf.redLimit = e.target.value;

                        spanRed.textContent = '' + sgv.graf.redLimit + ' ';

                        sgv.graf.displayValues();
                    }
                });

                sldPanel.appendChild(sliderRedLimit);

                sldPanel.appendChild(UI.tag("span", {'id': 'spanZero'}, {'textContent': ' 0 '}));

                sliderGreenLimit = UI.tag('input', {
                    'type': 'range',
                    'class': 'graphLimit',
                    'id': 'greenLimit',
                    'value': '1.0',
                    'min': '0.0',
                    'max': '1.0',
                    'step': '0.01'
                });
                sliderGreenLimit.addEventListener('input', async (e) => {
                    if (sgv.graf !== null) {
                        sgv.graf.greenLimit = e.target.value;

                        spanGreen.textContent = ' ' + sgv.graf.greenLimit;

                        sgv.graf.displayValues();

                    }
                });

                sldPanel.appendChild(sliderGreenLimit);

                sldPanel.appendChild(spanGreen = UI.tag("span", {'id': 'spanGreen'}, {'textContent': '1.0'}));

                return sldPanel;
            }

            function createScopePanel() {
                let divNS = UI.tag("div", {'class': "sgvD1", 'id': "cplDivNS"}, {'textContent': "add new scope: "});
                let divDS = UI.tag("div", {'class': "sgvD1", 'id': "cplDivDS"}, {'textContent': "current scope: "});
                
                let btnSkipAddScope = UI.tag("input", {'type': "button", 'class': "sgvC", 'id': "cplSkipAddScope", 'value': '\u2717'});
                btnSkipAddScope.style.color="#f00";
                btnSkipAddScope.addEventListener('click',
                        function () {
                            divNS.style.display = "none";
                            divDS.style.display = "block";
                        });
                divNS.appendChild(btnSkipAddScope);

                let editAddScope = UI.tag("input", {'type': "text", 'id': "cplAddScopeInput", 'value': "newScope"});
                divNS.appendChild(editAddScope);
                
                let btnAcceptAddScope = UI.tag("input", {'type': "button", 'class': "sgvC", 'id': "cplAcceptAddScope", 'value': '\u2713'});
                btnAcceptAddScope.style.color="#0f0";
                btnAcceptAddScope.addEventListener('click',
                        function () {
                            let scope = editAddScope.value;
                            let idx = sgv.graf.addScopeOfValues(scope);

                            if (idx >= 0) {
                                selectScope.add(UI.option(scope, scope));
                                selectScope.selectedIndex = idx;
                                sgv.graf.displayValues(scope);
                            }

                            divNS.style.display = "none";
                            divDS.style.display = "inline";
                        });
                divNS.appendChild(btnAcceptAddScope);

                divNS.style.display = "none";


                selectScope = UI.tag("select", {'id': "cplDispValues"});
                selectScope.addEventListener('change', () => {
                    sgv.graf.displayValues(selectScope.value);
                    updateSlidersX();
                });
                divDS.appendChild(selectScope);

                let btnAddScope = UI.tag("input", {'type': "button", 'class': "sgvC", 'id': "cplAddScope", 'value': "+"});
                btnAddScope.addEventListener('click',
                        function () {
                            divNS.style.display = "inline";
                            divDS.style.display = "none";
                        });
                divDS.appendChild(btnAddScope);


                let btnDelScope = UI.tag("input", {'type': "button", 'class': "sgvC", 'id': "cplDelScope", 'value': "-"});
                btnDelScope.addEventListener('click',
                        function () {
                            let idx = sgv.graf.delScopeOfValues(selectScope.value);

                            if (idx >= 0) {
                                selectScope.remove(selectScope.selectedIndex);
                                selectScope.selectedIndex = idx;
                            }
                        });
                divDS.appendChild(btnDelScope);

                let scope = UI.tag("div", {'class': "sgvSelectBox", 'id': "cplScope"});
                scope.appendChild(divNS);
                scope.appendChild(divDS);
                return scope;
            }

            var divDesc = UI.tag("div", {"class": "content", "id": "graphDescription"});
            divDesc.appendChild(createInfoBlock());
            divDesc.appendChild(scopePanel = createScopePanel());
            divDesc.appendChild(createLimitSlidersPanel());

            btnPanel = UI.tag('div', {'id': 'panelBtns'});

            btnPanel.appendChild(
                    btnDispMode = UI.createTransparentBtn1('display mode', "cplDispModeButton", () => {
                        Graph.switchDisplayMode();
                    }));

            btnPanel.appendChild(
                    btnCellView = UI.createTransparentBtn1('cell view', "cplCellViewButton", () => {
                        sgv.dlgCellView.switchDialog();
                    }));

            btnPanel.appendChild(
                    btnShowConsole = UI.createTransparentBtn1('show console', "cplShowConsoleButton", () => {
                        sgv.dlgConsole.switchConsole();
                    }));

            btnPanel.appendChild(
                    btnSaveTXT = UI.createTransparentBtn1('save graph', "cplSaveButton", () => {
                        FileIO.onSaveButton()
                                .then(result => console.log(result))
                                .catch(error => console.log(error));
                    }));

            btnPanel.appendChild(
                    btnClear = UI.createTransparentBtn1('delete graph', "cplClearButton", () => {
                        Graph.remove();
                    }));

            divDesc.appendChild(btnPanel);

            divDesc.style.display = "none";
            return divDesc;
        }
        
        selectionPanel = createSelectionPanel();
        descriptionPanel = createDescriptionPanel();

        switchableContent = UI.tag('div', {});
        switchableContent.style.display = 'block';

        switchableContent.appendChild(selectionPanel);
        switchableContent.appendChild(descriptionPanel);

        ui.appendChild(switchableContent);

        var swt = UI.tag('div', {'id': 'switch'});

        swt.addEventListener('click', () => {
            switchDialog();
        });

        swt.innerHTML = '. . .';
        ui.appendChild(swt);

        ui.style.display = 'block';

        return ui;
    }


    function showDialog() {
        switchableContent.style.display = "block";
    }


    function hideDialog() {
        switchableContent.style.display = "none";
    }


    function switchDialog() {
        (switchableContent.style.display === "none") ? showDialog() : hideDialog();
    }


    function addScopeX(scope, idx) {
        selectScope.add(UI.option(scope, scope));
        selectScope.selectedIndex = idx;
    }

    function delScopeX(scope, idx2) {
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.remove(i);
        }
        selectScope.selectedIndex = idx2;
    }

    function selScopeX(scope) {
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.selectedIndex = i;
        }
    }

    function setModeSelectionX() {
        selectionPanel.style.display = "block";
        descriptionPanel.style.display = "none";
    }


    function updateSlidersX() {
        if (sgv.graf === null)
            return;

        let r = sgv.graf.getMinMaxVal();

        // min should to bee negative or :
        if (r.min > 0)
            r.min = Number.NaN;

        // max should to bee positive:
        if (r.max < 0)
            r.max = Number.NaN;


        updateRed(r.min);
        updateGreen(r.max);

        function updateRed(min) {
            if (isNaN(min)) {
                sliderRedLimit.disabled = 'disabled';
                spanRed.textContent = 'NaN';
            } else {
                min = Math.floor(min * 100) / 100;

                if (sgv.graf.redLimit < min) {
                    sgv.graf.redLimit = min;
                }

                sliderRedLimit.min = min;
                sliderRedLimit.value = sgv.graf.redLimit;

                spanRed.textContent = sgv.graf.redLimit + ' ';
                sliderRedLimit.disabled = '';
            }
        }

        function updateGreen(max) {
            if (isNaN(max)) {
                sliderGreenLimit.disabled = 'disabled';
                spanGreen.textContent = 'NaN';
            } else {
                max = Math.ceil(max * 100) / 100;

                if (sgv.graf.greenLimit > max) {
                    sgv.graf.greenLimit = max;
                }

                sliderGreenLimit.max = max;
                sliderGreenLimit.value = sgv.graf.greenLimit;

                spanGreen.textContent = ' ' + sgv.graf.greenLimit;
                sliderGreenLimit.disabled = '';
            }
        }

    }

    function addButtonX(txt, id, onClick) {
        descriptionPanel.appendChild(UI.createTransparentBtn1(txt, id, onClick));
    }

    function setModeDescriptionX() {
        function refreshScopes() {
            if (sgv.graf !== null) {
                UI.clearSelect(selectScope, true);
                for (const key in sgv.graf.scopeOfValues) {
                    let scope = sgv.graf.scopeOfValues[key];
                    let opt = UI.option(scope, scope);
                    if (sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
                        opt.selected = "selected";
                    }
                    selectScope.appendChild(opt);
                }
            }
        }


        function updateInfoBlock() {
            ui.querySelector("#dscr_type").textContent = sgv.graf.type;
            ui.querySelector("#dscr_cols").textContent = sgv.graf.cols;
            ui.querySelector("#dscr_rows").textContent = sgv.graf.rows;
            ui.querySelector("#dscr_KL").textContent = sgv.graf.KL;
            ui.querySelector("#dscr_KR").textContent = sgv.graf.KR;
            ui.querySelector("#dscr_nbNodes").textContent = Object.keys(sgv.graf.nodes).length;
            ui.querySelector("#dscr_nbEdges").textContent = Object.keys(sgv.graf.edges).length;
        }


        updateSlidersX();
        updateInfoBlock();
        refreshScopes();

        selectionPanel.style.display = "none";
        descriptionPanel.style.display = "block";
    }



    return {
        showPanel: showDialog,
        hidePanel: hideDialog,
        switchPanel: switchDialog,
        setModeDescription: setModeDescriptionX,
        setModeSelection: setModeSelectionX,
        updateSliders: updateSlidersX,
        addButton: addButtonX,
        addScope: addScopeX,
        delScope: delScopeX,
        selScope: selScopeX
    };
};

