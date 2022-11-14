/* global sgv, UI */

sgv.dlgModuleView = new function() {
    var selectGraphCols, selectGraphRows, selectGraphLays, selectScope;
    var svgView;
    var r,c,l;
    
    const svgns = "http://www.w3.org/2000/svg";


    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function createUI() {
        r = c = l = 0;
        
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvDlgModuleView", "Cell view", true);

        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialogX();
        });

        let content = UI.tag( "div", { "class": "content", "id": "graphSelection" });

        content.appendChild(UI.tag('div',{'id':'description'}));
        let g = UI.tag('div',{'id':'description'});

        g.style['text-align']='center';

        selectGraphCols = UI.tag('select',{'id':'graphCols'});
        selectGraphCols.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10)); 
            });

        g.appendChild(UI.tag('label',{'for':'graphCols'},{'innerHTML':' column: '}));
        g.appendChild(selectGraphCols);

        selectGraphRows = UI.tag('select',{'id':'graphRows'});
        selectGraphRows.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10)); 
            });

        g.appendChild(UI.tag('label',{'for':'graphRows'},{'innerHTML':' row: '}));
        g.appendChild(selectGraphRows);

        selectGraphLays = UI.tag('select',{'id':'graphLays'});
        selectGraphLays.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10)); 
            });

        g.appendChild(UI.tag('label',{'for':'graphLays'},{'innerHTML':' layer: '}));
        g.appendChild(selectGraphLays);

        selectScope = UI.tag( "select", {'id': "selectScope" } );
        selectScope.addEventListener('change', () => {
            sgv.graf.displayValues(selectScope.value);
            sgv.dlgCPL.selScope(selectScope.value);
            sgv.dlgCPL.updateSliders();
            drawModule();
        });
        g.appendChild(UI.tag('label',{'for':'selectScope'},{'innerHTML':' scope: '}));
        g.appendChild( selectScope );


        content.appendChild(g);

        let div = UI.tag('div');
        div.style.width='fit-content';
        div.style.height='fit-content';
        div.style.background='#fff';
        content.appendChild(div);

        svgView = document.createElementNS(svgns, "svg");
        svgView.setAttributeNS(null, "id",'svgView');
        svgView.setAttributeNS(null, "height",600);
        svgView.setAttributeNS(null, "width",400);
        div.appendChild(svgView);

        ui.appendChild(content);

        ui.style.display = "none";
        ui.style['top']='10vh';
        return ui;
    };

    function onClick(e) {
        var element = e.target;
        var offsetX = 0, offsetY = 0;

            if (element.offsetParent) {
          do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
          } while ((element = element.offsetParent));
        }

        x = e.pageX - offsetX;
        y = e.pageY - offsetY;
        
        console.log(x,y);
    }

    function pos(id, mode) {
        const pos = {
            'classic': [
                {x: -60, y: 150},
                {x: -90, y:  50},
                {x:-120, y: -50},
                {x:-150, y:-150},
                {x: 140, y: 200},
                {x: 110, y: 100},
                {x:  80, y:   0},
                {x:  50, y:-100}]
        };
        
        const ctrX = 200;
        const ctrY = 300;
        
        mode = 'classic'; //temporary
        
        return {
            x: ctrX+pos[mode][id].x,
            y: ctrY+pos[mode][id].y
        };
    }
    
    function drawInternalEdge(offset, iB, iE) {
        let b = offset + iB;
        let e = offset + iE;
        //let eid = (b < e)?("" + b + "," + e):("" + e + "," + b);
        let eid = Edge.calcId(b,e);
        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 5*valueToEdgeWidth(val);
            
           
            var newLine = document.createElementNS(svgns,'line');
            newLine.setAttributeNS(null, 'id',eid);
            newLine.setAttributeNS(null, 'x1',pos(iB).x);
            newLine.setAttributeNS(null, 'y1',pos(iB).y);
            newLine.setAttributeNS(null, 'x2',pos(iE).x);
            newLine.setAttributeNS(null, 'y2',pos(iE).y);
            newLine.setAttributeNS(null, 'style', 'stroke: '+color.toHexString()+'; stroke-width: '+wth+'px;' );
            svgView.appendChild(newLine);

            newLine.addEventListener('click',(e)=>{
                e.preventDefault();
                let rect = newLine.getBoundingClientRect();
                sgv.dlgEdgeProperties.show(newLine.id,rect.x,rect.y);
            });            
            
        }
    }
    

    function drawNode(offset, id) {
        if ((offset+id) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(offset+id);
            let color = valueToColor(val);

            x = pos(id).x;
            y = pos(id).y;

            var circle = document.createElementNS(svgns, 'circle');
            circle.setAttributeNS(null, 'id', offset+id);
            circle.setAttributeNS(null, 'cx', x);
            circle.setAttributeNS(null, 'cy', y);
            circle.setAttributeNS(null, 'r', 20);
            circle.setAttributeNS(null, 'style', 'fill: '+color.toHexString()+'; stroke: black; stroke-width: 1px;' );
            svgView.appendChild(circle);

            circle.addEventListener('click',(e)=>{
                e.preventDefault();
                let rect = circle.getBoundingClientRect();
                sgv.dlgNodeProperties.show(circle.id,rect.x,rect.y);
            });
        }
    }

    function drawExtEdge(offset, ijk, e, endX, endY) {
        let b = offset+ijk;
        //eid = (b < e)?("" + b + "," + e):("" + e + "," + b);
        let eid = Edge.calcId(b,e);
        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 5*valueToEdgeWidth(val);
            
            var newLine = document.createElementNS(svgns,'line');
            newLine.setAttributeNS(null, 'id',eid);
            newLine.setAttributeNS(null, 'x1',pos(ijk).x);
            newLine.setAttributeNS(null, 'y1',pos(ijk).y);
            newLine.setAttributeNS(null, 'x2',endX);
            newLine.setAttributeNS(null, 'y2',endY);
            newLine.setAttributeNS(null, 'style', 'stroke: '+color.toHexString()+'; stroke-width: '+wth+'px;' );
            svgView.appendChild(newLine);

            newLine.addEventListener('click',(e)=>{
                e.preventDefault();
                let rect = newLine.getBoundingClientRect();
                sgv.dlgEdgeProperties.show(newLine.id,rect.x,rect.y);
            });            
        }            
    }
    
    function calcOffset(col, row, layer) {
        let offset = layer*sgv.graf.cols*sgv.graf.rows;
        offset += row*sgv.graf.cols;
        offset += col;
        offset *= 8;

        offset += 1;
        
        return offset;
    }
    
    function drawModule(col, row, layer) {
        svgView.innerHTML = '';

        if (sgv.graf===null) return;

        if (typeof col==='undefined') col=c;
        else c=col;

        if (typeof row==='undefined') row=r;
        else r=row;

        if (typeof layer==='undefined') layer=l;
        else l=layer;
        
        UI.selectByKey(selectGraphCols, col);
        UI.selectByKey(selectGraphRows, row);
        UI.selectByKey(selectGraphLays, layer);
        
        if ((col>=sgv.graf.cols)||(row>=sgv.graf.rows)||(layer>=sgv.graf.layers)) return;

        let offset = calcOffset(col, row, layer);
        let offDown = calcOffset(col, row-1, layer);
        let offUp = calcOffset(col, row+1, layer);
        let offRight = calcOffset(col+1, row, layer);
        let offLeft = calcOffset(col-1, row, layer);

        for (i=0;i<4;i++){
            if(row<(sgv.graf.rows-1)) {
                drawExtEdge(offset, i, offUp+i, pos(i).x, 20);
            }

            if(row>0) {
                drawExtEdge(offset, i, offDown+i, pos(i).x, 580);
            }

            if(col<(sgv.graf.cols-1)) {
                drawExtEdge(offset, i+4, offRight+i+4, 380, pos(i+4).y);
            }
            
            if(col>0) {
                drawExtEdge(offset, i+4, offLeft+i+4, 20, pos(i+4).y);
            }
        }

        for (let iL=0;iL<4;iL++){
            for (let iR=4;iR<8;iR++){
                drawInternalEdge(offset, iL, iR);
            }
        }

        if (sgv.graf.type==='pegasus') {
            drawInternalEdge(offset, 0, 1);
            drawInternalEdge(offset, 2, 3);
            drawInternalEdge(offset, 4, 5);
            drawInternalEdge(offset, 6, 7);
            
            //if (layer===(sgv.graf.layers-1) {
            //    drawExtEdge(offset, i+4, offLeft+i+4, 20, pos(i+4).y);
        }
        
        for (let i=0;i<8;i++){
            drawNode(offset, i);
        }
        
    };
    
    
    function showDialogX() {
        UI.clearSelect(selectGraphCols,true);
        for (let i=0;i<sgv.graf.cols;i++)
            selectGraphCols.appendChild(UI.option(i,i));
        selectGraphCols.selectedIndex = c;

        UI.clearSelect(selectGraphRows,true);
        for (let i=0;i<sgv.graf.rows;i++)
            selectGraphRows.appendChild(UI.option(i,i));
        selectGraphRows.selectedIndex = r;

        UI.clearSelect(selectGraphLays,true);
        for (let i=0;i<sgv.graf.layers;i++)
            selectGraphLays.appendChild(UI.option(i,i));
        selectGraphLays.selectedIndex = l;

        if (sgv.graf.layers===1) {
            selectGraphLays.disabled = 'disabled';
        }
        else {
            selectGraphLays.disabled = '';
        }

        UI.clearSelect(selectScope,true);
        for (let s in sgv.graf.scopeOfValues)
            selectScope.appendChild(UI.option(sgv.graf.scopeOfValues[s],sgv.graf.scopeOfValues[s]));
        UI.selectByKey(selectScope,sgv.graf.currentScope);
        
        drawModule();
        
        ui.style.display = "block";
    };
    
    
    function hideDialogX() {
        ui.style.display = "none";
    };    

    function switchDialogX() {
        if (ui.style.display === "none") {
            showDialogX();
        }
        else {
            hideDialogX();
        }
    };    
    
    
    return {
        refresh: drawModule,
        switchDialog: switchDialogX,
        show: showDialogX,
        hide: hideDialogX
    };    
};