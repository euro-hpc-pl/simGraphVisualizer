/* global sgv, UI, Edge, qD, QbDescr */

sgv.dlgCellView = new function () {
    var selectGraphCols, selectGraphRows, selectGraphLays, selectScope;
    var upButton, leftButton, rightButton, downButton;
    var svgView;
    var r, c, l;

    var prevFocused = null;

    const _width = 600;
    const _height = 600;
    const ctrX = _width / 2;
    const ctrY = _height / 2;

    const svgns = "http://www.w3.org/2000/svg";

    var ui = createUI();

    ui.addEventListener('keydown', onKeyDownX);

    window.addEventListener('load', () => {
        window.document.body.appendChild(ui);
    });

    function onKeyDownX(event) {
        let key = event.key;
        //console.log(key);
        if (key === 'ArrowLeft') {
            if (c > 0) {
                drawModule(c - 1, r, l);
            }
        } else if (key === 'ArrowRight') {
            if (c < (sgv.graf.cols - 1)) {
                drawModule(c + 1, r, l);
            }
        } else if (key === 'ArrowUp') {
            if (r < (sgv.graf.rows - 1)) {
                drawModule(c, r + 1, l);
            }
        } else if (key === 'ArrowDown') {
            if (r > 0) {
                drawModule(c, r - 1, l);
            }
        } else if (key === 'PageUp') {
            if (l < (sgv.graf.layers - 1)) {
                drawModule(c, r, l + 1);
            }
        } else if (key === 'PageDown') {
            if (l > 0) {
                drawModule(c, r, l - 1);
            }
        } else if (key === 'Escape') {
            hideDialogX();
        }
    }

    function createUI() {
        r = c = l = 0;

        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvdlgCellView", "Cell view", true);

        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialogX();
        });

        let content = UI.tag("div", {"class": "content", "id": "graphSelection"});

        content.appendChild(UI.tag('div', {'id': 'description'}));
        let g = UI.tag('div', {'id': 'description'});

        g.style['text-align'] = 'center';

        selectGraphCols = UI.tag('select', {'id': 'graphCols'});
        selectGraphCols.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10));
        });

        g.appendChild(UI.tag('label', {'for': 'graphCols'}, {'innerHTML': ' column: '}));
        g.appendChild(selectGraphCols);

        selectGraphRows = UI.tag('select', {'id': 'graphRows'});
        selectGraphRows.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10));
        });

        g.appendChild(UI.tag('label', {'for': 'graphRows'}, {'innerHTML': ' row: '}));
        g.appendChild(selectGraphRows);

        selectGraphLays = UI.tag('select', {'id': 'graphLays'});
        selectGraphLays.addEventListener('change', () => {
            drawModule(
                    parseInt(selectGraphCols.value, 10),
                    parseInt(selectGraphRows.value, 10),
                    parseInt(selectGraphLays.value, 10));
        });

        g.appendChild(UI.tag('label', {'for': 'graphLays'}, {'innerHTML': ' layer: '}));
        g.appendChild(selectGraphLays);

        selectScope = UI.tag("select", {'id': "selectScope"});
        selectScope.addEventListener('change', () => {
            sgv.graf.displayValues(selectScope.value);
            sgv.dlgCPL.selScope(selectScope.value);
            sgv.dlgCPL.updateSliders();
            drawModule();
        });
        g.appendChild(UI.tag('label', {'for': 'selectScope'}, {'innerHTML': ' scope: '}));
        g.appendChild(selectScope);


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
        div.style.width = 'fit-content';
        div.style.height = 'fit-content';
        div.style.background = '#fff';
        div.style['border'] = '0';
        div.style['margin'] = '0';
        div.style['padding'] = '0';

        svgView = document.createElementNS(svgns, "svg");
        svgView.setAttributeNS(null, "id", 'svgView');
        svgView.setAttributeNS(null, "height", _height);
        svgView.setAttributeNS(null, "width", _width);
        svgView.addEventListener('click', (event) => {
            if (event.target.id === 'svgView') {
                sgv.dlgNodeProperties.hide();
                sgv.dlgEdgeProperties.hide();
            }
        });
        div.appendChild(svgView);
        content.appendChild(div);

//        t[1][1].appendChild(div);
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
        ui.style['top'] = '10vh';
        ui.style['left'] = '10vh';
        return ui;
    }
    ;

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

        console.log(x, y);
    }

    function pos(id, mode) {
        const pos = {
            'classic': [
                {x: -60, y: 150},
                {x: -90, y: 50},
                {x: -120, y: -50},
                {x: -150, y: -150},
                {x: 140, y: 200},
                {x: 110, y: 100},
                {x: 80, y: 0},
                {x: 50, y: -100}]
        };

        mode = 'classic'; //temporary

        return {
            x: ctrX + pos[mode][id].x,
            y: ctrY + pos[mode][id].y
        };
    }

    function onExternalNodeClick(event) {
        event.preventDefault();
        let sp = event.target.id.split('_');
        if (sp.length > 1)
            id = sp[1];
        else
            id = event.target.id;

        let q = QbDescr.fromNodeId(id, sgv.graf.rows, sgv.graf.cols);
        drawModule(q.x, q.y, q.z);
    }
    ;

    function onNodeClick(event) {
        event.preventDefault();
        let sp = event.target.id.split('_');
        let rect = event.target.getBoundingClientRect();
        if (sp.length > 1)
            sgv.dlgNodeProperties.show(sp[1], rect.x, rect.y);
        else
            sgv.dlgNodeProperties.show(event.target.id, rect.x, rect.y);
    }
    ;

    function onEdgeClick(event) {
        event.preventDefault();
        let sp = event.target.id.split('_');
        let rect = event.target.getBoundingClientRect();
        if (sp.length > 1)
            sgv.dlgEdgeProperties.show(sp[1], rect.x, rect.y);
        else
            sgv.dlgEdgeProperties.show(event.target.id, rect.x, rect.y);
    }
    ;

    function drawSvgText(id, x, y, txt, txtColor, bgColor, onClick) {

        var text = document.createElementNS(svgns, 'text');
        text.setAttributeNS(null, 'id', 'text_' + id);
        text.setAttributeNS(null, 'x', x);
        text.setAttributeNS(null, 'y', y);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'alignment-baseline', 'middle');
        //text.setAttributeNS(null, 'stroke', txtColor);
        //text.setAttributeNS(null, 'stroke-width', '0');
        text.setAttributeNS(null, 'font-size', '12px');
        text.setAttributeNS(null, 'font-family', 'Arial, Helvetica, sans-serif');
        text.setAttributeNS(null, 'fill', txtColor);
        //text.setAttributeNS(null, 'fill-opacity', '1');
        text.textContent = txt;
        svgView.appendChild(text);

        text.addEventListener('click', onClick);

        if (bgColor !== '') {
            var rect = document.createElementNS(svgns, 'rect');
            rect.setAttributeNS(null, 'id', 'textBG_' + id);
            rect.setAttributeNS(null, "x", x - 12);
            rect.setAttributeNS(null, "y", y - 8);
            rect.setAttributeNS(null, "width", 24);
            rect.setAttributeNS(null, "height", 14);
            rect.setAttributeNS(null, "fill", bgColor);
            svgView.insertBefore(rect, text);

            rect.addEventListener('click', onClick);
        }
    }
    ;

    function drawSvgEdge(eid, bX, bY, eX, eY, color, wth, onClick) {
        var newLine = document.createElementNS(svgns, 'line');
        newLine.setAttributeNS(null, 'id', 'edge_' + eid);
        newLine.setAttributeNS(null, 'x1', bX);
        newLine.setAttributeNS(null, 'y1', bY);
        newLine.setAttributeNS(null, 'x2', eX);
        newLine.setAttributeNS(null, 'y2', eY);
        //newLine.setAttributeNS(null, 'style', 'stroke: ' + color + '; stroke-width: ' + wth + 'px;');
        newLine.setAttributeNS(null, 'stroke', color);
        newLine.setAttributeNS(null, 'stroke-width', wth);
        svgView.appendChild(newLine);

        newLine.addEventListener('click', onClick);
    }
    ;

    function drawExtEdge(offset, ijk, e, endX, endY) {

        let b = offset + ijk;
        let eid = Edge.calcId(b, e);
        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 2 + 5 * valueToEdgeWidth(val);

            let eVal = sgv.graf.nodeValue(e);
            let eColor = valueToColor(eVal);

            drawSvgEdge(eid, pos(ijk).x, pos(ijk).y, endX, endY, color.toHexString(), wth, onEdgeClick);
            drawSvgText(e, endX, endY, e, 'yellow', eColor.toHexString(), onExternalNodeClick);
        }
    }

    function drawInternalEdge(offset, iB, iE) {
        let b = offset + iB;
        let e = offset + iE;

        let eid = Edge.calcId(b, e);
        console.log('eid2: ', eid);

        if (eid in sgv.graf.edges) {
            let val = sgv.graf.edgeValue(eid);
            let color = valueToColor(val);
            let wth = 2 + 5 * valueToEdgeWidth(val);

            drawSvgEdge(eid, pos(iB).x, pos(iB).y, pos(iE).x, pos(iE).y, color.toHexString(), wth, onEdgeClick);
        }
    }


    function drawSvgNode(nodeId, x, y, r, color, onClick) {
        var circle = document.createElementNS(svgns, 'circle');
        circle.setAttributeNS(null, 'id', 'node_' + nodeId);
        circle.setAttributeNS(null, 'cx', x);
        circle.setAttributeNS(null, 'cy', y);
        circle.setAttributeNS(null, 'r', r);
        //circle.setAttributeNS(null, 'style', 'fill: ' + color + '; stroke: black; stroke-width: 1px;');
        circle.setAttributeNS(null, 'fill', color);
        circle.setAttributeNS(null, 'stroke', 'black');
        circle.setAttributeNS(null, 'stroke-width', '1');
        svgView.appendChild(circle);

        circle.addEventListener('click', onClick);
    }

    function drawNode(offset, id) {
        let nodeId = offset + id;
        if ((nodeId) in sgv.graf.nodes) {
            let val = sgv.graf.nodeValue(nodeId);
            let color = valueToColor(val);

            drawSvgNode(nodeId, pos(id).x, pos(id).y, 20, color.toHexString(), onNodeClick);
            drawSvgText(nodeId, pos(id).x, pos(id).y, nodeId.toString(), 'yellow', '', onNodeClick);
        }
    }


    function calcOffset(col, row, layer) {
        let offset = layer * sgv.graf.cols * sgv.graf.rows;
        offset += row * sgv.graf.cols;
        offset += col;
        offset *= 8;

        offset += 1;

        return offset;
    }

    function drawModule(col, row, layer) {
        svgView.innerHTML = '';

        if (sgv.graf === null)
            return;

        if (typeof col === 'undefined')
            col = c;
        else if (col < sgv.graf.cols)
            c = col;
        else
            c = col = 0;

        if (typeof row === 'undefined')
            row = r;
        else if (row < sgv.graf.rows)
            r = row;
        else
            r = row = 0;

        if (typeof layer === 'undefined')
            layer = l;
        else if (layer < sgv.graf.layers)
            l = layer;
        else
            l = layer = 0;

        let firstRow = (row === 0);
        let lastRow = (row === (sgv.graf.rows - 1));
        let firstCol = (col === 0);
        let lastCol = (col === (sgv.graf.cols - 1));

//        upButton.disabled = lastRow?'disabled':'';
//        leftButton.disabled = firstCol?'disabled':'';
//        rightButton.disabled = lastCol?'disabled':'';
//        downButton.disabled = firstRow?'disabled':'';

        UI.selectByKey(selectGraphCols, col);
        UI.selectByKey(selectGraphRows, row);
        UI.selectByKey(selectGraphLays, layer);
        UI.selectByKey(selectScope, sgv.graf.currentScope);

        let offset = calcOffset(col, row, layer);

        let LT = 20;
        let RT = _width - 20;
        let TP = 20;
        let BT = _height - 20;

        let ltpos = [
            {x: LT + 95, y: -40},
            {x: LT + 55, y: -40},
            {x: LT + 25, y: -30},
            {x: LT + 25, y: -10},
            {x: LT + 25, y: 10},
            {x: LT + 25, y: 30},
            {x: LT + 55, y: 40},
            {x: LT + 95, y: 40}
        ];

        let rtpos = [
            {x: RT - 95, y: -40},
            {x: RT - 55, y: -40},
            {x: RT - 25, y: -30},
            {x: RT - 25, y: -10},
            {x: RT - 25, y: 10},
            {x: RT - 25, y: 30},
            {x: RT - 55, y: 40},
            {x: RT - 95, y: 40}
        ];

        let ready = {};
        for (let i = 0; i < 8; i++) {
            let connected = sgv.graf.findAllConnected(offset + i);

            for (let j of connected.internal) {
                let eid = Edge.calcId(offset + i, j);
                if (!(eid in ready)) {
                    drawInternalEdge(offset, i, (j - 1) % 8);
                    ready[eid] = 1;
                }
            }

            for (let j of connected.horizontal) {
                drawExtEdge(offset, i, j, (offset + i < j) ? RT : LT, pos(i).y);
            }

            for (let j of connected.vertical) {
                drawExtEdge(offset, i, j, pos(i).x, (offset + i < j) ? TP : BT);
            }


            let it = 0;
            if (i < 4) {
                for (let j of connected.up) {
                    drawExtEdge(offset, i, j, ltpos[it].x, pos(i).y + ltpos[it].y);
                    it++;
                }
                for (let j of connected.down) {
                    drawExtEdge(offset, i, j, ltpos[it].x, pos(i).y + ltpos[it].y);
                    it++;
                }
            } else {
                for (let j of connected.up) {
                    drawExtEdge(offset, i, j, rtpos[it].x, pos(i).y + rtpos[it].y);
                    it++;
                }
                for (let j of connected.down) {
                    drawExtEdge(offset, i, j, rtpos[it].x, pos(i).y + rtpos[it].y);
                    it++;
                }
            }

            drawNode(offset, i);
        }
    }
    ;


    function showDialogX() {
        UI.clearSelect(selectGraphCols, true);
        for (let i = 0; i < sgv.graf.cols; i++)
            selectGraphCols.appendChild(UI.option(i, i));
        selectGraphCols.selectedIndex = c;

        UI.clearSelect(selectGraphRows, true);
        for (let i = 0; i < sgv.graf.rows; i++)
            selectGraphRows.appendChild(UI.option(i, i));
        selectGraphRows.selectedIndex = r;

        UI.clearSelect(selectGraphLays, true);
        for (let i = 0; i < sgv.graf.layers; i++)
            selectGraphLays.appendChild(UI.option(i, i));
        selectGraphLays.selectedIndex = l;

        if (sgv.graf.layers === 1) {
            selectGraphLays.disabled = 'disabled';
        } else {
            selectGraphLays.disabled = '';
        }

        UI.clearSelect(selectScope, true);
        for (let s in sgv.graf.scopeOfValues)
            selectScope.appendChild(UI.option(sgv.graf.scopeOfValues[s], sgv.graf.scopeOfValues[s]));
        UI.selectByKey(selectScope, sgv.graf.currentScope);

        drawModule();

        ui.style.display = "block";
        prevFocused = window.document.activeElement;
        ui.focus({focusVisible: false});
    }
    ;


    function hideDialogX() {
        if (prevFocused !== null)
            prevFocused.focus({focusVisible: false});
        ui.style.display = "none";
    }
    ;

    function switchDialogX() {
        if (ui.style.display === "none") {
            showDialogX();
        } else {
            hideDialogX();
        }
    }
    ;


    return {
        refresh: drawModule,
        switchDialog: switchDialogX,
        show: showDialogX,
        hide: hideDialogX
    };
};