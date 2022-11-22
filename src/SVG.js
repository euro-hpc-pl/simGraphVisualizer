/* 
 * Copyright 2022 darek.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const SVG = {};

SVG.NS = "http://www.w3.org/2000/svg";

SVG.createSVG = (_id, _width, _height, _onClick ) => {
    let svgView = document.createElementNS(SVG.NS, "svg");
    svgView.setAttributeNS(null, "id", _id);
    svgView.setAttributeNS(null, "height", _height);
    svgView.setAttributeNS(null, "width", _width);

    if (typeof _onClick === 'function') {
        svgView.addEventListener('click', _onClick);
    }

    svgView.style.display = 'block';
    return svgView;
};

SVG.drawSvgText = (svgView, id, x, y, txt, txtColor, bgColor, onClick) => {
    var text = document.createElementNS(SVG.NS, 'text');
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
        //let bbox = text.getBBox();
        //let bbox = text.getComputedTextLength();
        let w = 24; //bbox.width + 4;
        let h = 12; //bbox.height + 4;
        var rect = document.createElementNS(SVG.NS, 'rect');
        rect.setAttributeNS(null, 'id', 'textBG_' + id);
        rect.setAttributeNS(null, "x", x - w/2);
        rect.setAttributeNS(null, "y", y - (1 + h/2));
        rect.setAttributeNS(null, "width", w);
        rect.setAttributeNS(null, "height", h);
        rect.setAttributeNS(null, "fill", bgColor);
        svgView.insertBefore(rect, text);

        rect.addEventListener('click', onClick);
    }
};


SVG.drawSvgNode = (svgView, nodeId, x, y, r, color, onClick) => {
    var circle = document.createElementNS(SVG.NS, 'circle');
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
};


SVG.drawSvgEdge = (svgView, eid, bX, bY, eX, eY, color, wth, onClick) => {
    var newLine = document.createElementNS(SVG.NS, 'line');
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
};


