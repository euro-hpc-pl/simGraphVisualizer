/* global sgv, UI, Graph */

sgv.dlgCreateGraph = new function() {
    var selectGraphType;
    var selectGraphCols, selectGraphRows, selectGraphLays;
    var selectGraphKL, selectGraphKR;
    
    var ui = createUI();

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

        divSel.appendChild(UI.tag('div',{'id':'buttons'}));

        ui.appendChild(divSel);

        ui.style.display = "none";
        
        return ui;
    };
    
    function showDialog( type, graphData ) {
        if (type==='load') {
            ui.querySelector("#buttons").innerHTML = 
                '<input class="actionbutton" id="cplCancelButton" name="cancelButton" type="button" value="Cancel"> \
                 <input class="actionbutton" id="cplCreateButton" name="createButton" type="button" value="Load">';

            ui.querySelector(".titleText").textContent = "Load graph";

        } else {
            ui.querySelector("#buttons").innerHTML = 
                '<input class="actionbutton" id="cplCancelButton" name="cancelButton" type="button" value="Cancel"> \
                 <input class="actionbutton" id="cplCreateButton" name="createButton" type="button" value="Create">';

            ui.querySelector(".titleText").textContent = "New graph";
        }

        ui.style.display = "block";
        ui.querySelector("#cplCreateButton").addEventListener('click', ()=>{
            showSplashAndRun(()=>{
                hideDialog();
                setTimeout(()=>{
                    Graph.create( getGraphDescr(), graphData );
                }, 100);
            },true);
        } );

        ui.querySelector("#cplCancelButton").addEventListener('click', ()=>{
            hideDialog();
        } );

        ui.showModal();
    };

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };
    
    function getGraphDescr() {
        let gD = new GraphDescr();
        gD.setType(ui.querySelector("#graphType").value);
        gD.setSize(
            parseInt(ui.querySelector("#graphCols").value, 10),
            parseInt(ui.querySelector("#graphRows").value, 10),
            parseInt(ui.querySelector("#graphLays").value, 10),
            parseInt(ui.querySelector("#graphKL").value, 10),
            parseInt(ui.querySelector("#graphKR").value, 10));
        
        return gD;
    };
        
    return {
        show: showDialog,
        hide: hideDialog
    };
};


