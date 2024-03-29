
/* global sgv, UI, Graph, TempGraphStructure */

/**
 * @class
 * @classdesc Represents the DlgCreateGraph class. Handles the display and functionality of a dialog for creating a graph
 * @memberof sgv
 */
const DlgCreateGraph = (function() {
    var selectGraphType;
    var selectGraphCols, selectGraphRows, selectGraphLays;
    var selectGraphKL, selectGraphKR;
    
    var ui = createUI();

    var graphData;
    
    // Listen for the load event on the window object
    // This event is fired when the entire page has loaded, including all dependent resources such as stylesheets and images
    // When the load event is fired, append the ui element to the body of the window document
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    /**
     * Creates the UI for the graph creation dialog.
     * @returns {Object} The UI for the graph creation dialog.
     */
    function createUI() {
        // Create a dialog HTML element with the specified properties and assign it to "ui"
        let ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgCreateGraph" });

        // Create a title bar with the specified title and add it to the dialog
        let t = UI.createTitlebar("Create graph", false);
        ui.appendChild(t);

        // Create a content div for the graph selection and add it to the dialog
        let divSel = UI.tag( "div", { "class": "content", "id": "graphSelection" });

        // Append several child elements to the divSel element
        divSel.appendChild(UI.tag('div',{'id':'description'}));
        let g = UI.tag('div',{'id':'description'});

        // Center align the text in the "g" div
        g.style['text-align']='center';

        // Create a select element for the graph type and add it to the "g" div
        // Also add an event listener that disables the selectGraphLays element when the graph type is "chimera"
        selectGraphType = UI.tag('select',{'id':'graphType'});
        selectGraphType.appendChild(UI.option('chimera','chimera'));
        selectGraphType.appendChild(UI.option('pegasus','pegasus'));

        selectGraphType.addEventListener('change', (e)=>{
            if (e.target.value === 'chimera') {
                selectGraphLays.selectedIndex = 0;
                selectGraphLays.disabled = 'disabled';
            } else {
                selectGraphLays.disabled = '';
            }
        });
        g.appendChild(UI.tag('label',{'for':'graphType'},{'innerHTML':'graph type: '}));
        g.appendChild(selectGraphType);

        // Add a horizontal line to the "g" div
        g.appendChild(UI.tag('hr'));
        
        // Create a select element for the graph columns and add it to the "g" div
        // The options for the select element are the numbers from 1 to 16
        selectGraphCols = UI.tag('select',{'id':'graphCols'});
        for (let i=1; i<17; i++ ) {
            selectGraphCols.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphCols, 4);

        g.appendChild(UI.tag('label',{'for':'graphCols'},{'innerHTML':' columns: '}));
        g.appendChild(selectGraphCols);

        // Create a select element for the graph rows and add it to the "g" div
        // The options for the select element are the numbers from 1 to 16
        selectGraphRows = UI.tag('select',{'id':'graphRows'});
        for (let i=1; i<17; i++ ) {
            selectGraphRows.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphRows, 4);
 
        g.appendChild(UI.tag('label',{'for':'graphRows'},{'innerHTML':' rows: '}));
        g.appendChild(selectGraphRows);

        // Create a select element for the graph layers and add it to the "g" div
        // The options for the select element are the numbers from 1 to 5
        // The select element is initially disabled
        selectGraphLays = UI.tag('select',{'id':'graphLays'});
        for (let i=1; i<6; i++ ) {
            selectGraphLays.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphLays, 1);
        selectGraphLays.disabled = 'disabled';
        g.appendChild(UI.tag('label',{'for':'graphLays'},{'innerHTML':' layers: '}));
        g.appendChild(selectGraphLays);

        // Add a horizontal line to the "g" div
        g.appendChild(UI.tag('hr'));

        // Create a select element for the graph module size KL and add it to the "g" div
        // The options for the select element are the numbers from 1 to 4
        selectGraphKL = UI.tag('select',{'id':'graphKL'});
        selectGraphKL.appendChild(UI.option('1','1'));
        selectGraphKL.appendChild(UI.option('2','2'));
        selectGraphKL.appendChild(UI.option('3','3'));
        selectGraphKL.appendChild(UI.option('4','4',true));

        g.appendChild(UI.tag('label',{'for':'graphKL'},{'innerHTML':'module size: K = '}));
        g.appendChild(selectGraphKL);

        // Create a select element for the graph module size KR and add it to the "g" div
        // The options for the select element are the numbers from 1 to 4
        selectGraphKR = UI.tag('select',{'id':'graphKR'});
        selectGraphKR.appendChild(UI.option('1','1'));
        selectGraphKR.appendChild(UI.option('2','2'));
        selectGraphKR.appendChild(UI.option('3','3'));
        selectGraphKR.appendChild(UI.option('4','4',true));

        g.appendChild(UI.tag('label',{'for':'graphKR'},{'innerHTML':', '}));
        g.appendChild(selectGraphKR);

        // Add the "g" div to the divSel element
        divSel.appendChild(g);

        // Create a div for the buttons and add it to the divSel element
        let btns = UI.tag('div',{'id':'buttons'});

        // Create a "Cancel" button and add it to the buttons div
        // Also add an event listener that hides the dialog when the button is clicked
        let cancelButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCancelButton', 'name':'cancelButton', 'value':'Cancel'});
        cancelButton.addEventListener('click', ()=>{hideDialog();});
        btns.appendChild(cancelButton);
        
        // Create a "Create" button and add it to the buttons div
        // Also add an event listener that calls the onCreateButton function when the button is clicked
        let createButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCreateButton', 'name':'createButton', 'value':'Create'});
        createButton.addEventListener('click', ()=>{onCreateButton();});
        btns.appendChild(createButton);

        // Add the buttons div to the divSel element
        divSel.appendChild(btns);

        // Append the divSel to the ui element
        ui.appendChild(divSel);

        // Initially, hide the ui element by setting its display to "none"
        ui.style.display = "none";
        
        // Return the created ui element
        return ui;
    };
    
    /**
     * Gets the graph description from the current values of the select elements.
     * @returns {GraphDescr} The graph description.
     */
    function getGraphDescr() {
        let gD = new GraphDescr();
        gD.setType(selectGraphType.value);
        gD.setSize(
            parseInt(selectGraphCols.value, 10),
            parseInt(selectGraphRows.value, 10),
            parseInt(selectGraphLays.value, 10),
            parseInt(selectGraphKL.value, 10),
            parseInt(selectGraphKR.value, 10));
        
        return gD;
    };

    /**
     * Suggests graph size based on maximum node in the graph data.
     * @returns {undefined}
     */
    function sugestSize() {
        let maxNode = 0;
        graphData.nodes.forEach((n)=>{if (maxNode<n.id) maxNode=n.id;});
        maxNode--;
        
        let maxModule = maxNode>>3;
        if (maxNode%8) maxModule++;
        
        let gDesc = new GraphDescr();
        switch (maxModule) {
            case 4: gDesc.set('chimera',2,2,1,4,4); break;
            case 9: gDesc.set('chimera',3,3,1,4,4); break;
            case 16: gDesc.set('chimera',4,4,1,4,4); break;
            case 64: gDesc.set('chimera',8,8,1,4,4); break;
            case 144: gDesc.set('chimera',12,12,1,4,4); break;
            case 256: gDesc.set('chimera',16,16,1,4,4); break;
            
            case 12: gDesc.set('pegasus',2,2,3,4,4); break;
            case 27: gDesc.set('pegasus',3,3,3,4,4); break;
            case 48: gDesc.set('pegasus',4,4,3,4,4); break;
            case 192: gDesc.set('pegasus',8,8,3,4,4); break;
            case 432: gDesc.set('pegasus',12,12,3,4,4); break;
            case 768: gDesc.set('pegasus',16,16,3,4,4); break;
            
            default: gDesc.set('chimera',4,4,1,4,4); break;
        }
        
        UI.selectByKey(selectGraphType,gDesc.type);
        UI.selectByKey(selectGraphCols,gDesc.size.cols);
        UI.selectByKey(selectGraphRows,gDesc.size.rows);
        UI.selectByKey(selectGraphLays,gDesc.size.lays);
        UI.selectByKey(selectGraphKL,gDesc.size.KL);
        UI.selectByKey(selectGraphKR,gDesc.size.KR);
        if (gDesc.type==='chimera') selectGraphLays.disabled='disabled';
        else selectGraphLays.disabled='';
    }
    
    /**
     * Creates a graph with the selected description when "Create" button is clicked.
     * @returns {undefined}
     */
    function onCreateButton() {
        let gDesc = getGraphDescr();
        
        showSplashAndRun(()=>{
                hideDialog();
                setTimeout(()=>{
                    Graph.create( gDesc, graphData );
                }, 100);
            },true);
    }
    
    /**
     * Shows the dialog for creating a graph.
     * @param {string} type - Type of the graph.
     * @param {Object} struct - Temporary graph structure.
     * @returns {undefined}
     */
    function showDialog( type, struct ) {
        if (type==='load') {
            ui.querySelector('#cplCreateButton').value = 'Load';
            ui.querySelector('.titleText').textContent = 'Load graph';
        } else {
            ui.querySelector('#cplCreateButton').value = 'Create';
            ui.querySelector('.titleText').textContent = 'New graph';
        }

        ui.style.display = "block";

        if (struct instanceof TempGraphStructure){
            graphData = struct;
            sugestSize();
        } else {
            graphData = null;
        }

        ui.showModal();
    };

    /**
     * Hides the dialog for creating a graph.
     * @returns {undefined}
     */
    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
        
    // Return an object with references to the showDialog and hideDialog functions
    return {
        d: graphData,
        show: showDialog,
        hide: hideDialog
    };
});


/**
 * Represents the static instance of DlgCreateGraph in the sgv namespace.
 * @type {DlgCreateGraph}
 * @memberof sgv
 * @static
 */
sgv.dlgCreateGraph = new DlgCreateGraph();
