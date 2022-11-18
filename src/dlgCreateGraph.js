/* global sgv, UI, Graph, TempGraphStructure */

sgv.dlgCreateGraph = new function() {
    var selectGraphType;
    var selectGraphCols, selectGraphRows, selectGraphLays;
    var selectGraphKL, selectGraphKR;
    
    var ui = createUI();

    var graphData;
    
    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function createUI() {
        let ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgCreateGraph" });

        let t = UI.createTitlebar("Create graph", false);
        ui.appendChild(t);

        let divSel = UI.tag( "div", { "class": "content", "id": "graphSelection" });

        divSel.appendChild(UI.tag('div',{'id':'description'}));
        let g = UI.tag('div',{'id':'description'});

        g.style['text-align']='center';

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

        g.appendChild(UI.tag('hr'));
        
        selectGraphCols = UI.tag('select',{'id':'graphCols'});
        for (let i=1; i<17; i++ ) {
            selectGraphCols.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphCols, 4);

        g.appendChild(UI.tag('label',{'for':'graphCols'},{'innerHTML':' columns: '}));
        g.appendChild(selectGraphCols);

        selectGraphRows = UI.tag('select',{'id':'graphRows'});
        for (let i=1; i<17; i++ ) {
            selectGraphRows.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphRows, 4);
 
        g.appendChild(UI.tag('label',{'for':'graphRows'},{'innerHTML':' rows: '}));
        g.appendChild(selectGraphRows);

        selectGraphLays = UI.tag('select',{'id':'graphLays'});
        for (let i=1; i<6; i++ ) {
            selectGraphLays.appendChild(UI.option(i,i));
        }
        UI.selectByKey(selectGraphLays, 1);
        selectGraphLays.disabled = 'disabled';
        g.appendChild(UI.tag('label',{'for':'graphLays'},{'innerHTML':' layers: '}));
        g.appendChild(selectGraphLays);

        g.appendChild(UI.tag('hr'));

        selectGraphKL = UI.tag('select',{'id':'graphKL'});
        selectGraphKL.appendChild(UI.option('1','1'));
        selectGraphKL.appendChild(UI.option('2','2'));
        selectGraphKL.appendChild(UI.option('3','3'));
        selectGraphKL.appendChild(UI.option('4','4',true));

        g.appendChild(UI.tag('label',{'for':'graphKL'},{'innerHTML':'module size: K = '}));
        g.appendChild(selectGraphKL);

        selectGraphKR = UI.tag('select',{'id':'graphKR'});
        selectGraphKR.appendChild(UI.option('1','1'));
        selectGraphKR.appendChild(UI.option('2','2'));
        selectGraphKR.appendChild(UI.option('3','3'));
        selectGraphKR.appendChild(UI.option('4','4',true));

        g.appendChild(UI.tag('label',{'for':'graphKR'},{'innerHTML':', '}));
        g.appendChild(selectGraphKR);

        divSel.appendChild(g);

        let btns = UI.tag('div',{'id':'buttons'});

        let cancelButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCancelButton', 'name':'cancelButton', 'value':'Cancel'});
        cancelButton.addEventListener('click', ()=>{hideDialog();});
        btns.appendChild(cancelButton);
        
        let createButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCreateButton', 'name':'createButton', 'value':'Create'});
        createButton.addEventListener('click', ()=>{onCreateButton();});
        btns.appendChild(createButton);

        divSel.appendChild(btns);

        ui.appendChild(divSel);

        ui.style.display = "none";
        
        return ui;
    };
    
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
    
    function onCreateButton() {
        let gDesc = getGraphDescr();
        
        showSplashAndRun(()=>{
                hideDialog();
                setTimeout(()=>{
                    Graph.create( gDesc, graphData );
                }, 100);
            },true);
    }
    
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

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
        
    return {
        d: graphData,
        show: showDialog,
        hide: hideDialog
    };
};


