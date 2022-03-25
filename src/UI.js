/* 
 * Copyright 2022 Dariusz Pojda.
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

/* global sgv */

var UI = (function () {
    this.panelSwitch = UI.createPanelSwitch();
    this.panelSwitch.addEventListener('click', function() {
        sgv.controlPanel.switchPanel();
    });
    this.consoleSwitch = UI.createConsoleSwitch();
    this.consoleSwitch.addEventListener('click', function() {
        sgv.console.switchConsole();
    });
    this.dispModeSwitch = UI.createDispModeSwitch();
    this.dispModeSwitch.addEventListener('click', function() {
        sgv.switchDisplayMode();
    });

    this.nodeProperties = UI.createNodeProperties();
    this.nodeProperties.querySelector(".hidebutton").addEventListener('click', function() {
        sgv.cancelN();
    });
    this.nodeProperties.querySelector("#setN").addEventListener('click', function() {
        sgv.edycjaN();
    });
    this.nodeProperties.querySelector("#connectN").addEventListener('click', function() {
        sgv.connectNodes();
    });
    this.nodeProperties.querySelector("#connectSelectN").addEventListener('click', function() {
        sgv.connectSelectN();
    });
    this.nodeProperties.querySelector(".delbutton").addEventListener('click', function() {
        sgv.usunN();
    });


    this.edgeProperties = UI.createEdgeProperties();
    this.edgeProperties.querySelector(".hidebutton").addEventListener('click', function() {
        sgv.cancelE();
    });
    this.edgeProperties.querySelector("#setE").addEventListener('click', function() {
        sgv.edycjaE();
    });
    this.edgeProperties.querySelector(".delbutton").addEventListener('click', function() {
        sgv.usunE();
    });

    this.missingNodes = UI.createMissing('sgvMissingNodes');
    this.missingNodes.querySelector(".delbutton").addEventListener('click', function() {
        sgv.delMissing();
    });

    //this.wykresy = UI.createGraphs('wykresy');
});

UI.createTitlebar = function (title, closebuttonVisible) {
    var t = document.createElement("div");
    t.setAttribute("class", "title");
    if (closebuttonVisible) {
        let btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "hidebutton");
        btn.setAttribute("value", "x");
        t.appendChild(btn);
    }
    let span = document.createElement("span");
    span.setAttribute("class", "titleText");
    span.textContent = title;

    t.appendChild(span);

    return t;
};

UI.createEmptyWindow = function (id, title, closebuttonVisible, createContentDIV, hiddenInput) {
    var o = document.createElement("div");
    o.setAttribute("class", "sgvUIwindow");
    o.setAttribute("id", "sgvNodeProperties");
    let t = UI.createTitlebar(title, closebuttonVisible);
    o.appendChild(t);
};

UI.createNodeProperties = function () {
    var o = document.createElement("div");
    o.setAttribute("class", "sgvUIwindow");
    o.setAttribute("id", "sgvNodeProperties");
    let t = UI.createTitlebar('Node: q1', true);
    o.appendChild(t);
    o.innerHTML +=
            '<input id="nodeId" type="hidden" value="0"> \
        <div class="content"> \
            <input id="wagaN" type="number" value="0"><input class="setvaluebutton" id="setN" type="button" value="set"> \
            <br/><input id="connectN" type="button" value="connect to..."><select id="destN"></select><input id="connectSelectN" type="button" value="^"> \
            <br/><input class="delbutton" type="button" value="delete"> \
        </div>';
    document.body.appendChild(o);
    return o;
};

UI.createEdgeProperties = function () {
    var o = document.createElement("div");
    o.setAttribute("class", "sgvUIwindow");
    o.setAttribute("id", "sgvEdgeProperties");
    o.appendChild(UI.createTitlebar('Edge: q1 &lt;---&gt; q2', true));
    o.innerHTML += '<input id="edgeId" type="hidden" value="0"> \
        <div class="content"> \
            <input id="wagaE" type="number" value="0"><input class="setvaluebutton" id="setE" type="button" value="set"> \
            <br/><input class="delbutton" type="button" value="delete"> \
        </div>';
    document.body.appendChild(o);
    return o;
};

UI.createMissing = function (id) {
    var o = document.createElement("div");
    o.setAttribute("class", "sgvUIwindow");
    o.setAttribute("id", id);
    o.appendChild(UI.createTitlebar('removed nodes', false));

    o.innerHTML += '<div class="content"><div id="misN"></div> \
        <input class="delbutton" type="button" value="clear history"> \
        </div>';

    document.body.appendChild(o);
    return o;
};

UI.createGraphs = function (id) {
    var o = document.createElement("div");
    o.setAttribute("class", "sgvUIwindow");
    o.setAttribute("id", id);
    o.appendChild(UI.createTitlebar('graphs', false));

    o.innerHTML += '<div class="content"></div>';

    document.body.appendChild(o);
    return o;
};

UI.createConsole = function (id) {
    var o = document.createElement("div");
    o.setAttribute("class", "sgvUIwindow");
    o.setAttribute("id", id);
    o.appendChild(UI.createTitlebar('console', true));

    o.innerHTML += '<div class="content"> \
            <textarea id="consoleHistory" readonly></textarea> \
            <input type="text" id="commandline"> \
        </div> \
        <div style="background-color:blue;height:5px;width:15px;float:right"></div><div style="background-color:green;height:5px;width:15px;float:left"></div><div style="background-color:red;height:5px;width:auto"></div>';
    document.body.appendChild(o);
    return o;
};

UI.createControlPanel = function (id) {
    var o = document.createElement("div");
    o.setAttribute("class", "sgvUIwindow");
    o.setAttribute("id", id);
    o.appendChild(UI.createTitlebar('control panel', true));

    var divSel = document.createElement("div");
    divSel.setAttribute("class", "content");
    divSel.setAttribute("id", "graphSelection");
    divSel.style.display = "block";
    divSel.innerHTML = '<div>graph: <select id="graphType"><option value="chimera">chimera</option><option value="pegasus">pegasus</option></select> \
        size: <select id="graphCols"><option selected="selected" value="4">4</option><option value="8">8</option><option value="12">12</option><option value="16">16</option></select> \
        x <select id="graphRows"><option selected="selected" value="4">4</option><option value="8">8</option><option value="12">12</option><option value="16">16</option></select> \
        K <select id="graphKL"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="selected" value="4">4</option></select> \
        , <select id="graphKR"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="selected" value="4">4</option></select> \
        </div><div><input class="" id="cplCreateButton" name="createButton" type="button" value="Create default"></div> \
        <div>Read from .txt file: <input id="inputfile" type="file"></div>';

    var divDesc = document.createElement("div");
    divDesc.setAttribute("class", "content");
    divDesc.setAttribute("id", "graphDescription");
    divDesc.style.display = "none";
    divDesc.innerHTML = 'Current graph type: <span id="dscr_type">unknown</span>, \
        size: <span id="dscr_cols">0</span>x<span id="dscr_rows">0</span>xK<sub><span id="dscr_KL">0</span>,<span id="dscr_KR">0</span></sub><br/> \
            Number of nodes: <span id="dscr_nbNodes">0</span>, number of edges: <span id="dscr_nbEdges">0</span> \
            <div><input class="actionbutton" id="cplSaveButton" type="button" value="save to file"></div> \
            <div><input class="delbutton" id="cplDeleteButton" type="button" value="clear workspace"></div>';

    o.appendChild(divSel);
    o.appendChild(divDesc);

    document.body.appendChild(o);

    return o;
};

UI.createPanelSwitch = function () {
    let btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "sgvTransparentButton");
    btn.setAttribute("id", "sgvPanelSwitch");
    btn.setAttribute("value", "CPL");
    document.body.appendChild(btn);
    return btn;
};

UI.createConsoleSwitch = function () {
    let btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "sgvTransparentButton");
    btn.setAttribute("id", "sgvConsoleSwitch");
    btn.setAttribute("value", "CON");
    document.body.appendChild(btn);
    return btn;
};

UI.createDispModeSwitch = function () {
    let btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "sgvTransparentButton");
    btn.setAttribute("id", "sgvDispModeSwitch");
    btn.setAttribute("value", "DIS");
    document.body.appendChild(btn);
    return btn;
};

