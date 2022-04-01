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
    this.panelSwitch.addEventListener('click', function () {
        sgv.controlPanel.switchPanel();
    });
    this.consoleSwitch = UI.createConsoleSwitch();
    this.consoleSwitch.addEventListener('click', function () {
        sgv.console.switchConsole();
    });
    this.dispModeSwitch = UI.createDispModeSwitch();
    this.dispModeSwitch.addEventListener('click', function () {
        sgv.switchDisplayMode();
    });

    this.nodeProperties = UI.createNodeProperties();
    this.nodeProperties.querySelector(".hidebutton").addEventListener('click', function () {
        sgv.cancelN();
    });
    this.nodeProperties.querySelector("#setN").addEventListener('click', function () {
        sgv.edycjaN();
    });
    this.nodeProperties.querySelector("#connectN").addEventListener('click', function () {
        sgv.connectNodes();
    });
    this.nodeProperties.querySelector("#connectSelectN").addEventListener('click', function () {
        sgv.connectSelectN();
    });
    this.nodeProperties.querySelector(".delbutton").addEventListener('click', function () {
        sgv.usunN();
    });


    this.edgeProperties = UI.createEdgeProperties();
    this.edgeProperties.querySelector(".hidebutton").addEventListener('click', function () {
        sgv.cancelE();
    });
    this.edgeProperties.querySelector("#setE").addEventListener('click', function () {
        sgv.edycjaE();
    });
    this.edgeProperties.querySelector(".delbutton").addEventListener('click', function () {
        sgv.usunE();
    });

    this.missingNodes = UI.createMissing('sgvMissingNodes');
    this.missingNodes.querySelector(".delbutton").addEventListener('click', function () {
        sgv.delMissing();
    });

    //this.wykresy = UI.createGraphs('wykresy');
});

UI.tag = function(_tag, _attrs, _props ) {
    var o = document.createElement(_tag);

    for (const key in _attrs) {
        o.setAttribute(key, _attrs[key]);
    }
    
    for (const key in _props) {
        o[key] = _props[key];
    }
    
    return o;
};

UI.span = function(_text, _attrs) {
    return UI.tag("span", _attrs, {'textContent': _text} );
};

UI.findOption = function(_select,_value) {
    for (var i= 0; i<_select.options.length; i++) {
        if (_select.options[i].value===_value) {
            return i;
        }
    }
    return -1;
};

UI.option = function(_value, _text) {
    var o = document.createElement("option");
    o.value = _value;
    o.text = _text;
    return o;
};

UI.input = function(_props) {
    var o = document.createElement("input");
    //o.setAttribute("type", _type);
    for (const key in _props) {
        //if (o.hasOwnProperty(key)) {
            o.setAttribute(key, _props[key]);
        //}
    }
    return o;
};

UI.newInput = function (_type, _value, _class, _id) {
    var o = document.createElement("input");
    o.setAttribute("type", _type);
    o.value = _value;
    if ((_class !== undefined) && (_class !== "")) {
        o.setAttribute("class", _class);
    }
    if ((_id !== undefined) && (_id !== "")) {
        o.setAttribute("id", _id);
    }
    return o;
};


UI.createTitlebar = function (title, closebuttonVisible) {
    var t = UI.tag( "div", { "class": "title" });
    
    if (closebuttonVisible) {
        t.appendChild(
                UI.tag( "input", {
                        "type": "button",
                        "value": "x",
                        "class": "hidebutton" } ) );
    }

    t.appendChild( UI.tag( "span", { "class": "titleText" }, {"textContent": title}) );

    return t;
};

UI.createEmptyWindow = function (_class, _id, _title, _closebuttonVisible ) {//, _createContentDIV, _hiddenInput) {
    var o = document.createElement("div");
    
    if ((_class !== undefined) && (_class !== "")) {
        o.setAttribute("class", _class);
    }
    if ((_id !== undefined) && (_id !== "")) {
        o.setAttribute("id", _id);
    }

    let t = UI.createTitlebar(_title, _closebuttonVisible);
    o.appendChild(t);
    
    return o;
};


UI.createNodeProperties = function () {
    var o = UI.createEmptyWindow("sgvUIwindow", "sgvNodeProperties", "Node: q1", true);

    o.appendChild(UI.newInput("hidden", "0", "", "nodeId"));

    var d = document.createElement("div");
    d.setAttribute("class", "content");

    d.appendChild(UI.newInput("number", "0", "", "wagaN"));
    d.appendChild(UI.newInput("button", "set", "setvaluebutton", "setN"));
    d.appendChild(document.createElement("br"));
    d.appendChild(UI.newInput("button", "connect to...", "", "connectN"));

    var s = document.createElement("select");
    s.setAttribute("id", "destN");

    d.appendChild(s);

    d.appendChild(UI.newInput("button", "^", "", "connectSelectN"));
    d.appendChild(document.createElement("br"));
    d.appendChild(UI.newInput("button", "delete", "delbutton", ""));

    o.appendChild(d);

    document.body.appendChild(o);
    return o;
};

UI.createEdgeProperties = function () {
    var o = UI.createEmptyWindow("sgvUIwindow", "sgvEdgeProperties", "Edge: q1 &lt;---&gt; q2", true);

    o.innerHTML += '<input id="edgeId" type="hidden" value="0"> \
        <div class="content"> \
            <input id="wagaE" type="number" value="0"><input class="setvaluebutton" id="setE" type="button" value="set"> \
            <br/><input class="delbutton" type="button" value="delete"> \
        </div>';
    document.body.appendChild(o);
    return o;
};

UI.createMissing = function (id) {
    var o = UI.createEmptyWindow("sgvUIwindow", id, "removed nodes", false);

    o.innerHTML += '<div class="content"><div id="misN"></div> \
        <input class="delbutton" type="button" value="clear history"> \
        </div>';

    document.body.appendChild(o);
    return o;
};

UI.createGraphs = function (id) {
    var o = UI.createEmptyWindow("sgvUIwindow", id, "graphs", false);

    o.innerHTML += '<div class="content"></div>';

    document.body.appendChild(o);
    return o;
};

UI.createConsole = function (id) {
    var o = UI.createEmptyWindow("sgvUIwindow", id, "console", true);

    o.innerHTML += '<div class="content"> \
            <textarea id="consoleHistory" readonly></textarea> \
            <input type="text" id="commandline"> \
        </div> \
        <div style="background-color:blue;height:5px;width:15px;float:right"></div><div style="background-color:green;height:5px;width:15px;float:left"></div><div style="background-color:red;height:5px;width:auto"></div>';
    document.body.appendChild(o);
    return o;
};

UI.createControlPanel = function (id) {
    divSel = function () {
        var divSel = UI.tag( "div", { "class": "content", "id": "graphSelection" });
        divSel.style.display = "block";
        divSel.innerHTML = '<div>graph: <select id="graphType"><option value="chimera">chimera</option><option value="pegasus">pegasus</option></select> \
            size: <select id="graphCols"><option selected="selected" value="4">4</option><option value="8">8</option><option value="12">12</option><option value="16">16</option></select> \
            x <select id="graphRows"><option selected="selected" value="4">4</option><option value="8">8</option><option value="12">12</option><option value="16">16</option></select> \
            K <select id="graphKL"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="selected" value="4">4</option></select> \
            , <select id="graphKR"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="selected" value="4">4</option></select> \
            </div><div><input class="" id="cplCreateButton" name="createButton" type="button" value="Create default"></div> \
            <div>Read from .txt file: <input id="inputfile" type="file"></div>';
        return divSel;
    };

    divDesc = function () {
        var divDesc = UI.tag("div", {"class": "content", "id": "graphDescription"});
 
        divDesc.innerHTML = "Current graph type: ";
        divDesc.appendChild( UI.span("unknown", {'id':"dscr_type"}) );

        divDesc.innerHTML += ', size: <span id="dscr_cols">0</span>x<span id="dscr_rows">0</span>xK<sub><span id="dscr_KL">0</span>,<span id="dscr_KR">0</span></sub><br/> \
                Number of nodes: <span id="dscr_nbNodes">0</span>, number of edges: <span id="dscr_nbEdges">0</span>';
      
        
        let divNS = UI.tag( "div", {'class': "sgvD1", 'id': "cplDivNS" }, {'textContent': "add new scope: "} );
        divNS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplSkipAddScope", 'value': "<" } ) );
        divNS.appendChild( UI.tag("input", { 'type': "text", 'id': "cplAddScopeInput", 'value': "newScope" } ) );
        divNS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplAcceptAddScope",'value': "+" } ) );
        divNS.style.display = "none";
        
        let scopeSelect = UI.tag( "select", {'id': "cplDispValues" } );
        scopeSelect.add( UI.option( "default", "default" ) );
        scopeSelect.add( UI.option( "losowe", "losowe" ) );
        scopeSelect.add( UI.option( "losowe2", "losowe2" ) );

        let divDS = UI.tag( "div", {'class': "sgvD1", 'id': "cplDivDS" }, {'textContent': "current scope: "} );
        divDS.appendChild(scopeSelect);
        divDS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplAddScope", 'value': "+" } ) );
        divDS.appendChild( UI.tag("input", { 'type': "button", 'class': "sgvC", 'id': "cplDelScope", 'value': "-" } ) );

        let scope = UI.tag( "div", {'class': "sgvSelectBox", 'id': "cplScope" } );
        scope.appendChild(divNS);
        scope.appendChild(divDS);
        
        divDesc.appendChild(scope);
        
        divDesc.appendChild( UI.tag("input", { 'class': "actionbutton", 'id': "cplSaveButton", 'type': "button", 'value': "save to file" } ) );
        divDesc.appendChild( UI.tag("input", { 'class': "delbutton", 'id': "cplDeleteButton", 'type': "button", 'value': "clear workspace" } ) );

        divDesc.style.display = "none";
        return divDesc;
    };

    var o = UI.createEmptyWindow("sgvUIwindow", id, "control panel", true);

    o.appendChild(divSel());
    o.appendChild(divDesc());

    document.body.appendChild(o);

    return o;
};

UI.createPanelSwitch = function () {
    let btn = UI.newInput("button", "CPL", "sgvTransparentButton", "sgvPanelSwitch");
    document.body.appendChild(btn);
    return btn;
};

UI.createConsoleSwitch = function () {
    let btn = UI.newInput("button", "CON", "sgvTransparentButton", "sgvConsoleSwitch");
    document.body.appendChild(btn);
    return btn;
};

UI.createDispModeSwitch = function () {
    let btn = UI.tag( "input", {
                'type':     "button",
                'value':    "DIS",
                'class':    "sgvTransparentButton",
                'id':       "sgvDispModeSwitch"
            });
    document.body.appendChild(btn);
    return btn;
};

