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

/**
 * Namespace object for SVG operations.
 * @namespace SVG
 */
const SVG = {};

/**
 * SVG XML namespace.
 * @type {string}
 */
SVG.NS = "http://www.w3.org/2000/svg";

/**
 * Creates an SVG element with the specified ID, width, height, and click event handler.
 * @param {string} _id - The ID of the SVG element.
 * @param {number} _width - The width of the SVG element.
 * @param {number} _height - The height of the SVG element.
 * @param {Function} _onClick - The click event handler function.
 * @returns {SVGSVGElement} The created SVG element.
 */
SVG.createSVG = (_id, _width, _height, _onClick ) => {
    let svgView = document.createElementNS(SVG.NS, "svg");
    svgView.setAttributeNS(null, "id", _id);
    svgView.setAttributeNS(null, "height", _height);
    svgView.setAttributeNS(null, "width", _width);
    //svgView.setAttributeNS(null, "viewBox", "0 0 250 250");
    
    if (typeof _onClick === 'function') {
        svgView.addEventListener('click', _onClick);
    }

    svgView.style.display = 'block';
    return svgView;
};

/**
 * Creates an SVG element with the specified ID, viewBox, and click event handler.
 * @param {string} _id - The ID of the SVG element.
 * @param {number} _width - The width of the SVG element.
 * @param {number} _height - The height of the SVG element.
 * @param {Function} _onClick - The click event handler function.
 * @returns {SVGSVGElement} The created SVG element.
 */
SVG.createSVG2 = (_id, _width, _height, _onClick ) => {
    let svgView = document.createElementNS(SVG.NS, "svg");
    svgView.setAttributeNS(null, "id", _id);
    //svgView.setAttributeNS(null, "height", _height);
    //svgView.setAttributeNS(null, "width", _width);
    svgView.setAttributeNS(null, "viewBox", "0 0 "+_width+" "+_height);
    
    if (typeof _onClick === 'function') {
        svgView.addEventListener('click', _onClick);
    }

    svgView.style.display = 'block';
    return svgView;
};

/**
 * Draws a text element in the SVG with the specified attributes and click event handler.
 * @param {SVGSVGElement} svgView - The SVG element to draw the text in.
 * @param {string} id - The ID of the text element.
 * @param {number} x - The x-coordinate of the text element.
 * @param {number} y - The y-coordinate of the text element.
 * @param {string} txt - The text content.
 * @param {string} txtColor - The color of the text.
 * @param {string} bgColor - The background color of the text.
 * @param {Function} onClick - The click event handler function.
 */
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


/**
 * Draws a circle element in the SVG with the specified attributes and click event handler.
 * @param {SVGSVGElement} svgView - The SVG element to draw the circle in.
 * @param {string} nodeId - The ID of the circle element.
 * @param {number} x - The x-coordinate of the center of the circle.
 * @param {number} y - The y-coordinate of the center of the circle.
 * @param {number} r - The radius of the circle.
 * @param {string} color - The fill color of the circle.
 * @param {Function} onClick - The click event handler function.
 */
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


/**
 * Draws a line element in the SVG with the specified attributes and click event handler.
 * @param {SVGSVGElement} svgView - The SVG element to draw the line in.
 * @param {string} eid - The ID of the line element.
 * @param {number} bX - The x-coordinate of the starting point of the line.
 * @param {number} bY - The y-coordinate of the starting point of the line.
 * @param {number} eX - The x-coordinate of the ending point of the line.
 * @param {number} eY - The y-coordinate of the ending point of the line.
 * @param {string} color - The color of the line.
 * @param {number} wth - The width of the line.
 * @param {Function} onClick - The click event handler function.
 */
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


