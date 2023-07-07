
"use strict";
/* global sgv, Chimera, Pegasus, UI, parserGEXF, dialog, FileIO, Graph */

/**
 * The sgv.dlgCPL object is responsible for handling the Control Panel (CPL) dialog functionalities.
 */
sgv.dlgCPL = new function () {
    var switchableContent; 
    var selectionPanel, descriptionPanel;
    var scopePanel, slidersPanel;
    var switchHandle;
    
    var ui = createDialog();

    /**
     * Add the created dialog to the DOM upon window load event.
     */
    window.addEventListener('load', () => {
        window.document.body.appendChild(ui);
    });

    /**
     * Creates the Control Panel dialog with multiple components.
     * @returns {HTMLElement} The created dialog element.
     */
    function createDialog() {
        let ui = UI.tag("div", {"class": "sgvUIwindow disable-select", "id": "sgvDlgCPL"});

        /**
         * Creates the Selection Panel component of the Control Panel dialog.
         * @returns {Object} The Selection Panel component along with show and hide functions.
         */
        function SelectionPanel() {
            let btnShowConsole2, btnCreate, btnLoad;
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

            return {
                ui: divSel,
                show: ()=>{divSel.style.display = "block";},
                hide: ()=>{divSel.style.display = "none";}
            };
        }

        /**
         * Creates the Description Panel component of the Control Panel dialog.
         * @returns {Object} The Description Panel component along with show, hide, and addButton functions.
         */
        function DescriptionPanel() {
            function InfoBlock() {
                let i = UI.tag("div", {});
                
                let sub = UI.tag('sub');
                sub.append(
                    UI.span('0', {'id':"dscr_KL"}), ',', UI.span('0', {'id':"dscr_KR"}),
                );
                
                i.append(
                    "Current graph is ", 
                    //UI.tag('label',{'for':'dscr_type'},{'innerHTML':'Current graph type: '}),
                    UI.span("unknown", {'id': "dscr_type"}),
                    '-like, size: ',
                    UI.span('0', {'id':"dscr_cols"}), 'x', UI.span('0', {'id':"dscr_rows"}),
                    'xK', sub,
                    UI.tag('br'),
                    'Number of nodes: ', UI.span('0', {'id':"dscr_nbNodes"}),
                    ', number of edges: ', UI.span('0', {'id':"dscr_nbEdges"})
                );

                return {
                    ui: i
                };
            }

            function ButtonPanel() {
                let btnDispMode, btnCellView, btnShowConsole, btnSaveTXT, btnClear;
                let btnPanel = UI.tag('div', {'id': 'panelBtns'});

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
                        
                return {
                    ui: btnPanel
                };
            }

            var divDesc = UI.tag("div", {"class": "content", "id": "graphDescription"});

            divDesc.append(
                InfoBlock().ui,
                (scopePanel = new ScopePanel(true,'current scope: ')).ui,
                (slidersPanel = new SlidersPanel).ui,
                ButtonPanel().ui);

            divDesc.style.display = "none";
            return {
                ui: divDesc,
                addButton: (txt, id, onClick) => {
                    divDesc.appendChild(UI.createTransparentBtn1(txt, id, onClick));
                },
                updateInfo: () => {
                    ui.querySelector("#dscr_type").textContent = sgv.graf.type;
                    ui.querySelector("#dscr_cols").textContent = sgv.graf.cols;
                    ui.querySelector("#dscr_rows").textContent = sgv.graf.rows;
                    ui.querySelector("#dscr_KL").textContent = sgv.graf.KL;
                    ui.querySelector("#dscr_KR").textContent = sgv.graf.KR;
                    ui.querySelector("#dscr_nbNodes").textContent = Object.keys(sgv.graf.nodes).length;
                    ui.querySelector("#dscr_nbEdges").textContent = Object.keys(sgv.graf.edges).length;
                },
                show: ()=>{divDesc.style.display = "block";},
                hide: ()=>{divDesc.style.display = "none";}
            };
        }
        
        switchableContent = UI.tag('div', {});
        
        switchableContent.append(
                (selectionPanel = SelectionPanel()).ui,
                (descriptionPanel = DescriptionPanel()).ui
        );

        
        ui.appendChild(switchableContent);
        ui.appendChild( switchHandle = UI.tag( 'div', {'id': 'switch'}, {'innerHTML': '\u00B7 \u00B7 \u00B7'}, {'click': () => switchDialog()} ) );

        ui.style.display = 'block';

        return ui;
    }


    /**
     * Show the switchable content of the Control Panel dialog.
     */
    function showDialog() {
        switchableContent.style.display = "block";
    }


    /**
     * Hide the switchable content of the Control Panel dialog.
     */
    function hideDialog() {
        switchableContent.style.display = "none";
    }


    /**
     * Switches the display of the switchable content of the Control Panel dialog between show and hide.
     */
    function switchDialog() {
        (switchableContent.style.display === "none") ? showDialog() : hideDialog();
    }

    /**
     * Switches to the Selection mode of the Control Panel dialog.
     */
    function setModeSelectionX() {
        selectionPanel.show();
        descriptionPanel.hide();
    }

    /**
     * Switches to the Description mode of the Control Panel dialog.
     */
    function setModeDescriptionX() {
        descriptionPanel.updateInfo();
        slidersPanel.refresh();
        scopePanel.refresh();

        selectionPanel.hide();
        descriptionPanel.show();
    }

    /**
     * Refreshes the sliders and scope panels of the Control Panel dialog.
     */
    function refreshX() {
        slidersPanel.refresh();
        scopePanel.refresh();
    }
    
    return {
        showPanel: showDialog,
        hidePanel: hideDialog,
        switchPanel: switchDialog,
        setModeDescription: setModeDescriptionX,
        setModeSelection: setModeSelectionX,
        updateSliders: slidersPanel.refresh,
        addButton: descriptionPanel.addButton,
        //quickInfo: (s)=>(switchHandle.innerHTML=s),
        addScope: scopePanel.addScope,
        delScope: scopePanel.delScope,
        selScope: scopePanel.selScope,
        refresh: refreshX
    };
    
};

