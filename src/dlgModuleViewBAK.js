/* global sgv, UI */

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
        selectGraphCols.appendChild(UI.option('4','4',true));
        selectGraphCols.appendChild(UI.option('8','8'));
        selectGraphCols.appendChild(UI.option('12','12'));
        selectGraphCols.appendChild(UI.option('16','16'));

        g.appendChild(UI.tag('label',{'for':'graphCols'},{'innerHTML':' columns: '}));
        g.appendChild(selectGraphCols);

        selectGraphRows = UI.tag('select',{'id':'graphRows'});
        selectGraphRows.appendChild(UI.option('4','4',true));
        selectGraphRows.appendChild(UI.option('8','8'));
        selectGraphRows.appendChild(UI.option('12','12'));
        selectGraphRows.appendChild(UI.option('16','16'));

        g.appendChild(UI.tag('label',{'for':'graphRows'},{'innerHTML':' rows: '}));
        g.appendChild(selectGraphRows);

//        editGraphLays = UI.tag('input', {
//            'type':'number',
//            'id':'graphLays',
//            'value':1,
//            'min':'1',
//            'max':'9'
//        });
//        editGraphLays.style.width = '3em';

        selectGraphLays = UI.tag('select',{'id':'graphLays'});
        selectGraphLays.appendChild(UI.option('1','1',true));
        for (let i=2; i<10; i++ ) {
            selectGraphLays.appendChild(UI.option(i,i));
        }
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
    
    function showDialog( type, res ) {
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
                    sgv.createGraph( getGraphTypeAndSize(), res );
                }, 100);
            });
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
    
    function getGraphTypeAndSize() {
        return {
            type: ui.querySelector("#graphType").value,
            size: {
                cols: parseInt(ui.querySelector("#graphCols").value, 10),
                rows: parseInt(ui.querySelector("#graphRows").value, 10),
                lays: parseInt(ui.querySelector("#graphLays").value, 10),
                KL: parseInt(ui.querySelector("#graphKL").value, 10),
                KR: parseInt(ui.querySelector("#graphKR").value, 10)
            }
        };
    };
        
    return {
        show: showDialog,
        hide: hideDialog
    };
};


