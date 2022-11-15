/* global sgv, UI, Edge, qD */

sgv.dlgModuleView = new function() {
    var selectGraphCols, selectGraphRows, selectGraphLays, selectScope;
    var upButton, leftButton, rightButton, downButton;
    var svgView;
    var r,c,l;
    
    const svgns = "http://www.w3.org/2000/svg";


    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });

    function onKeyDownX(event) {
        let key = event.key;
        //console.log(key);
        if (key==='ArrowLeft') {
           if (c>0) {
               drawModule(c-1,r,l);
           }
        }
        else if (key==='ArrowRight') {
           if (c<(sgv.graf.cols-1)) {
               drawModule(c+1,r,l);
           }
        }
        else if (key==='ArrowUp') {
           if (r<(sgv.graf.rows-1)) {
               drawModule(c,r+1,l);
           }
        }
        else if (key==='ArrowDown') {
           if (r>0) {
               drawModule(c,r-1,l);
           }
        }
        else if (key==='PageUp') {
           if (l<(sgv.graf.layers-1)) {
               drawModule(c,r,l+1);
           }
        }
        else if (key==='PageDown') {
           if (l>0) {
               drawModule(c,r,l-1);
           }
        }
        else if (key==='Escape') {
           hideDialogX();
        }
        
    }
    
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

//        const tbl = document.createElement("table");
//        const tblBody = document.createElement("tbody");
//
//        let t = [];
//        
//        for (let i = 0; i < 3; i++) {
//            const row = document.createElement("tr");
//            row.style['padding']='0';
//            row.style['margin']='0';
//            t.push([]);
//            for (let j = 0; j < 3; j++) {
//                const cell = document.createElement("td");
//                //const cellText = document.createTextNode(`cell in row ${i}, column ${j}`);
//                //cell.appendChild(cellText);
//                row.appendChild(cell);
//                cell.style['padding']='0';
//                cell.style['margin']='0';
//                t[i][j] = cell;
//            }
//            tblBody.appendChild(row);
//        }
//
//        console.log(t);
//        tbl.appendChild(tblBody);
//        content.appendChild(tbl);
//        
//        tbl.setAttribute("border", "0");
//        tbl.setAttribute("bgcolor", "#ffffff");
//        tbl.setAttribute("cellpadding", "0");
//        tbl.setAttribute("cellspacing", "0");
        
//        upButton = UI.tag('button',{'class':''},{'innerHTML':'^'});
//        upButton.style['width'] = '400px';
//        upButton.style['height'] = '24px';
//        upButton.style['border'] = '0';
//        upButton.style['margin'] = '0';
//        upButton.style['padding'] = '0';
//        upButton.addEventListener('click', ()=>{
//           if (r<(sgv.graf.rows-1)) {
//               drawModule(c,r+1,l);
//           }
//        });
//        t[0][1].appendChild(upButton);

//        leftButton = UI.tag('button',{'class':''},{'innerHTML':'<'});
//        leftButton.style['height'] = '600px';
//        leftButton.style['width'] = '24px';
//        leftButton.style['border'] = '0';
//        leftButton.style['margin'] = '0';
//        leftButton.style['padding'] = '0';
//        leftButton.addEventListener('click', ()=>{
//           if (c>0) {
//               drawModule(c-1,r,l);
//           }
//        });
//        t[1][0].appendChild(leftButton);


        let div = UI.tag('div');
        div.style.width='fit-content';
        div.style.height='fit-content';
        div.style.background='#fff';
        div.style['border'] = '0';
        div.style['margin'] = '0';
        div.style['padding'] = '0';
        
        svgView = document.createElementNS(svgns, "svg");
        svgView.setAttributeNS(null, "id",'svgView');
        svgView.setAttributeNS(null, "height",600);
        svgView.setAttributeNS(null, "width",400);
        div.appendChild(svgView);
//        t[1][1].appendChild(div);
        content.appendChild(div);

//        rightButton = UI.tag('button',{'class':''},{'innerHTML':'>'});
//        rightButton.style['height'] = '600px';
//        rightButton.style['width'] = '24px';
//        rightButton.style['border'] = '0';
//        rightButton.style['margin'] = '0';
//        rightButton.style['padding'] = '0';
//        rightButton.addEventListener('click', ()=>{
//           if (c<(sgv.graf.cols-1)) {
//               drawModule(c+1,r,l);
//           }
//        });
//        t[1][2].appendChild(rightButton);

//        downButton = UI.tag('button',{'class':''},{'innerHTML':'v'});
//        downButton.style['width'] = '400px';
//        downButton.style['height'] = '24px';
//        downButton.style['border'] = '0';
//        downButton.style['margin'] = '0';
//        downButton.style['padding'] = '0';
//        downButton.addEventListener('click', ()=>{
//           if (r>0) {
//               drawModule(c,r-1,l);
//           }
//        });
//        t[2][1].appendChild(downButton);

        ui.appendChild(content);

        ui.style.display = "none";
        ui.style['top']='10vh';
        ui.style['left']='10vh';
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
    
    function drawSvgEdge( eid, bX, bY, eX, eY, color, wth ) {
        var newLine = document.createElementNS(svgns,'line');
        newLine.setAttributeNS(null, 'id',eid);
        newLine.setAttributeNS(null, 'x1',bX);
        newLine.setAttributeNS(null, 'y1',bY);
        newLine.setAttributeNS(null, 'x2',eX);
        newLine.setAttributeNS(null, 'y2',eY);
        newLine.setAttributeNS(null, 'style', 'stroke: '+color+'; stroke-width: '+wth+'px;' );
        svgView.appendChild(newLine);

        newLine.addEventListener('click',(e)=>{
            e.preventDefault();
            let rect = newLine.getBoundingClientRect();
            sgv.dlgEdgeProperties.show(newLine.id,rect.x,rect.y);
        });            
    };
    
    function drawExtEdge(offset, ijk, e, endX, endY) {
        let b = offset+ijk;
        let eid = Edge.calcId(b,e);
        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 2+5*valueToEdgeWidth(val);
            
            drawSvgEdge(eid, pos(ijk).x, pos(ijk).y, endX, endY, color.toHexString(), wth );
        }            
    }
    
    function drawInternalEdge(offset, iB, iE) {
        let b = offset + iB;
        let e = offset + iE;

        let eid = Edge.calcId(b,e);
        console.log('eid2: ',eid);
                
        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 2+5*valueToEdgeWidth(val);
            
            drawSvgEdge(eid, pos(iB).x, pos(iB).y, pos(iE).x, pos(iE).y, color.toHexString(), wth );
        }
    }
    
    function drawPegasusEdges(offset, x, y, z) {
        for (let i of [0,2,4,6]) {
            drawInternalEdge(offset, i, i+1);
        }

        let cols = sgv.graf.cols;
        let rows = sgv.graf.rows;
        let layers = sgv.graf.layers;

        let firstColumn = (x===0);
        let lastColumn = (x===(cols-1));
        let firstRow = (y===0);
        let lastRow = (y===(rows-1));
        let lastLayer = (z===(layers-1));

        for (let kA of [0,1]) {
            for (let jB of [0,1]) {
                for (let kB of [0,1]) {
                    if (! lastLayer) {
                        let ijk = kA;
                        let q = qD(x, y, z + 1, 1, jB, kB);
                        let e = q.toNodeId(rows,cols);
                        //console.log('edge',offset+ijk,e);
                        drawExtEdge(offset, ijk, e, 20, pos(ijk).y-(10*(q.n1()-4)));
                        
                        ijk = 4+kA;
                        q = qD(x, y, z + 1, 0, jB, kB);
                        e = q.toNodeId(rows,cols);
                        //console.log('edge',offset+ijk,e);
                        drawExtEdge(offset, ijk, e, 380, pos(ijk).y+10*q.n1());

                        if (! firstColumn) {
                            ijk = 2+kA;
                            q = qD(x-1, y, z + 1, 1, jB, kB);
                            e = q.toNodeId(rows,cols);
                            //console.log('edge',offset+ijk,e);
                            drawExtEdge(offset, ijk, e, 20, pos(ijk).y-(10*(q.n1()-4)));
                            //this.connect(new QbDescr(x, y, z, 0, 1, kA), new QbDescr(x - 1, y, z + 1, 1, jB, kB), val);
                        }
                        if (! firstRow) {
                            ijk = 6+kA;
                            q = qD(x, y - 1, z + 1, 0, jB, kB);
                            e = q.toNodeId(rows,cols);
                            //console.log('edge',offset+ijk,e);
                            drawExtEdge(offset, ijk, e, 380, pos(ijk).y+(10*q.n1()));
                            //this.connect(new QbDescr(x, y, z, 1, 1, kA), new QbDescr(x, y - 1, z + 1, 0, jB, kB), val);
                        }
                    }
                    else {
                        if (! (lastColumn || lastRow) ) {
                            ijk = kA;
                            q = qD(x + 1, y + 1, 0, 1, jB, kB);
                            e = q.toNodeId(rows,cols);
                            //console.log('edge',offset+ijk,e);
                            drawExtEdge(offset, ijk, e, 20, pos(ijk).y-(10*q.n1()));
                            //this.connect(new QbDescr(x, y, z, 0, 0, kA), new QbDescr(x + 1, y + 1, 0, 1, jB, kB), val);

                            ijk = 4+kA;
                            q = qD(x, y - 1, z + 1, 0, jB, kB);
                            e = q.toNodeId(rows,cols);
                            //console.log('edge',offset+ijk,e);
                            drawExtEdge(offset, ijk, e, 380, pos(ijk).y+(10*q.n1()));
                            //this.connect(new QbDescr(x, y, z, 1, 0, kA), new QbDescr(x + 1, y + 1, 0, 0, jB, kB), val);
                        }
//
//                        if (! lastRow) {
//                            this.connect(new QbDescr(x, y, z, 0, 1, kA), new QbDescr(x, y + 1, 0, 1, jB, kB), val);
//                        }
//
//                        if (! lastColumn) {
//                            this.connect(new QbDescr(x, y, z, 1, 1, kA), new QbDescr(x + 1, y, 0, 0, jB, kB), val);
//                        }
                    }
                }
            }
        }
    }
    
    function drawSvgNode(nodeId, x, y, r, color, txt, txtColor ) {
        var circle = document.createElementNS(svgns, 'circle');
        circle.setAttributeNS(null, 'id', nodeId);
        circle.setAttributeNS(null, 'cx', x);
        circle.setAttributeNS(null, 'cy', y);
        circle.setAttributeNS(null, 'r', r);
        circle.setAttributeNS(null, 'style', 'fill: '+color+'; stroke: black; stroke-width: 1px;' );
        svgView.appendChild(circle);

        circle.addEventListener('click',(e)=>{
            e.preventDefault();
            let rect = circle.getBoundingClientRect();
            sgv.dlgNodeProperties.show(circle.id,rect.x,rect.y);
        });

        var text = document.createElementNS(svgns, 'text');
        text.setAttributeNS(null, 'x', x);
        text.setAttributeNS(null, 'y', y);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'alignment-baseline', 'middle');
        text.setAttributeNS(null, 'stroke', txtColor);
        text.setAttributeNS(null, 'stroke-width', '1px');
        //text.setAttributeNS(null, 'fill', 'red');
        //text.setAttributeNS(null, 'fill-opacity', '1');
        text.textContent = txt;
        svgView.appendChild(text);

        text.addEventListener('click',(e)=>{
            e.preventDefault();
            let rect = circle.getBoundingClientRect();
            sgv.dlgNodeProperties.show(circle.id,rect.x,rect.y);
        });
    }
    
    function drawNode(offset, id) {
        let nodeId = offset+id;
        if ((nodeId) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(nodeId);
            let color = valueToColor(val);

            drawSvgNode( nodeId, pos(id).x, pos(id).y, 20, color.toHexString(), nodeId, 'white' );
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

        if (typeof col==='undefined') col = c;
        else if (col<sgv.graf.cols) c = col;
        else c = col = 0;
        
        if (typeof row==='undefined') row = r;
        else if (row<sgv.graf.rows) r = row;
        else r = row = 0;
        
        if (typeof layer==='undefined') layer = l;
        else if (layer<sgv.graf.layers) l = layer;
        else l = layer = 0;

        //console.log(layer, 'of', sgv.graf.layers);
        
        let firstRow = (row===0);
        let lastRow = (row===(sgv.graf.rows-1));
        let firstCol = (col===0);
        let lastCol = (col===(sgv.graf.cols-1));
        
//        upButton.disabled = lastRow?'disabled':'';
//        leftButton.disabled = firstCol?'disabled':'';
//        rightButton.disabled = lastCol?'disabled':'';
//        downButton.disabled = firstRow?'disabled':'';
        
        UI.selectByKey(selectGraphCols, col);
        UI.selectByKey(selectGraphRows, row);
        UI.selectByKey(selectGraphLays, layer);
        UI.selectByKey(selectScope,sgv.graf.currentScope);

        let offset = calcOffset(col, row, layer);
        let offDown = calcOffset(col, row-1, layer);
        let offUp = calcOffset(col, row+1, layer);
        let offRight = calcOffset(col+1, row, layer);
        let offLeft = calcOffset(col-1, row, layer);

        let connected = [];
        for (let i=0; i<8; i++){
            connected[i] = sgv.graf.findAllConnected(offset+i);
        }
        console.log(connected);
        
        let ready = {};
        for (let i=0;i<8;i++){
            //console.log('eid: ',eid);
            for (let j of connected[i].internal){
                let eid = Edge.calcId(offset+i,j);
                //console.log('eid: ',eid);
                if (!(eid in ready)){
                    let j2 = j-1;
                    drawInternalEdge(offset, i, j2%8);
                    ready[eid]=1;
                    //console.log('drawing it');
                }
            }
        }
        
        for (let i=0;i<8;i++){
            //console.log('eid: ',eid);
            for (let j of connected[i].horizontal){
                if (offset+i<j){
                    drawExtEdge(offset, i, j, 380, pos(i).y);
                }
                else {
                    drawExtEdge(offset, i, j, 20, pos(i).y);
                }
            }

            for (let j of connected[i].vertical){
                if (offset+i<j){
                    drawExtEdge(offset, i, j, pos(i).x, 20);
                }
                else {
                    drawExtEdge(offset, i, j, pos(i).x, 580);
                }
            }
            
            let u = 1;
            for (let j of connected[i].up){
                if (i<4){
                    drawExtEdge(offset, i, j, 20, pos(i).y+10*u);
                }
                else {
                    drawExtEdge(offset, i, j, 380, pos(i).y+10*u);
                }
                u+=1;
            }

            let d = 1;
            for (let j of connected[i].down){
                if (i<4){
                    drawExtEdge(offset, i, j, 20, pos(i).y-10*d);
                }
                else {
                    drawExtEdge(offset, i, j, 380, pos(i).y-10*d);
                }
                d+=1;
            }
        }
        
        
//        for (let iL=0;iL<4;iL++){
//            let iR = iL+4;
//            //if(row<(sgv.graf.rows-1)) {
//            if(!lastRow) {
//                drawExtEdge(offset, iL, offUp+iL, pos(iL).x, 20);
//            }
//
//            //if(row>0) {
//            if(!firstRow) {
//                drawExtEdge(offset, iL, offDown+iL, pos(iL).x, 580);
//            }
//
//            //if(col<(sgv.graf.cols-1)) {
//            if(!lastCol) {    
//                drawExtEdge(offset, iR, offRight+iR, 380, pos(iR).y);
//            }
//            
//            //if(col>0) {
//            if(!firstCol) {
//                drawExtEdge(offset, iR, offLeft+iR, 20, pos(iR).y);
//            }
//        }

//        for (let iL=0;iL<4;iL++){
//            for (let iR=4;iR<8;iR++){
//                drawInternalEdge(offset, iL, iR);
//            }
//        }

//        if (sgv.graf.type==='pegasus') {
//            drawPegasusEdges(offset, col, row, layer);
//        }
        
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
        
        window.document.addEventListener('keydown', sgv.dlgModuleView.onKeyDown );
        ui.style.display = "block";
    };
    
    
    function hideDialogX() {
        window.document.removeEventListener('keydown', sgv.dlgModuleView.onKeyDown );
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
        onKeyDown: onKeyDownX,
        refresh: drawModule,
        switchDialog: switchDialogX,
        show: showDialogX,
        hide: hideDialogX
    };    
};