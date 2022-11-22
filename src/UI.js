
/* global sgv */

var UI = (function () {});


UI.tag = function(_tag, _attrs, _props, _evnts ) {
    var o = document.createElement(_tag);

    for (const key in _attrs) {
        o.setAttribute(key, _attrs[key]);
    }
    
    for (const key in _props) {
        o[key] = _props[key];
    }

    for (const key in _evnts) {
        if ((typeof key==='string')&&(typeof _evnts[key]==='function')) {
            o.addEventListener(key, _evnts[key]);
        }
    }
    
    return o;
};

UI.span = function(_text, _attrs) {
    return UI.tag("span", _attrs, {'textContent': _text} );
};

UI.selectByKey = function(_select, _key) {
    let i = UI.findOption(_select, _key.toString());
    if ( i>-1 ) {
        _select.selectedIndex = i;
        return true;
    }
    return false;
};

UI.clearSelect = function(_select,_deleteFirst) {
    const first = _deleteFirst?0:1;
    for(var i=first; i<_select.options.length; i++) {
        _select.removeChild(_select.options[i]);
        i--; // options have now less element, then decrease i
    }
};

UI.findOption = function(_select,_value) {
    for (var i= 0; i<_select.options.length; i++) {
        if (_select.options[i].value===_value) {
            return i;
        }
    }
    return -1;
};

UI.option = function(_value, _text, _selected) {
    var o = document.createElement("option");
    o.value = _value;
    o.text = _text;
    
    if (typeof _selected!=='undefined')
        o.selected = _selected?'selected':'';
    
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
    if ((typeof _class !== 'undefined') && (_class !== "")) {
        o.setAttribute("class", _class);
    }
    if ((typeof _id !== 'undefined') && (_id !== "")) {
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
                        "value": '\u274C',
                        "class": "hidebutton" } ) );
    }

    t.appendChild( UI.tag( "span", { "class": "titleText" }, {"textContent": title}) );

    return t;
};

UI.createEmptyWindow = function (_class, _id, _title, _closebuttonVisible ) {//, _createContentDIV, _hiddenInput) {
    var o = document.createElement("div");
    
    if ((typeof _class !== 'undefined') && (_class !== "")) {
        o.setAttribute("class", _class);
    }
    if ((typeof _id !== 'undefined') && (_id !== "")) {
        o.setAttribute("id", _id);
    }

    let t = UI.createTitlebar(_title, _closebuttonVisible);

    
    o.offset = {x:0,y:0};
    o.isDown = false;
    
    t.addEventListener('mouseover', function() {
        t.style.cursor='pointer';
        movable = true;
    });

    t.addEventListener('mouseout', function() {
        movable = false;
    });

    t.addEventListener('mousedown', function (e) {
        o.isDown = movable;
        o.offset = {
            x: o.offsetLeft - e.clientX,
            y: o.offsetTop - e.clientY
        };
    }, true);

    t.addEventListener('mouseup', function () {
        o.isDown = false;
    }, true);

    document.addEventListener('mousemove', function (event) {
        //event.preventDefault();
        if (o.isDown) {
            let mousePosition = {
                x: event.clientX,
                y: event.clientY
            };

            o.style.left = (mousePosition.x + o.offset.x) + 'px';
            o.style.top = (mousePosition.y + o.offset.y) + 'px';
        }
    }, true);
    
    o.appendChild(t);
    
    o.setAttribute('tabindex', '0');
    return o;
};




UI.createTransparentBtn = function (txt, id, onclick) {
    let btn = UI.tag( "input", {
                'type':     "button",
                'value':    txt,
                'class':    "sgvTransparentButton1",
                'id':       id
            });
    //document.body.appendChild(btn);

    if (typeof onclick === 'function'){
        btn.addEventListener('click', function () {
            onclick();
        });
    }

    return btn;
};

UI.createTransparentBtn1 = function (txt, id, onclick) {
    let btn = UI.tag( "button", {
                'class':    "sgvTransparentButton1",
                'id':       id
            });

    btn.appendChild(UI.tag('span',{},{
        'innerHTML' : txt
    }));
    
    if (typeof onclick === 'function'){
        btn.addEventListener('click', function () {
            onclick();
        });
    }

    return btn;
};
