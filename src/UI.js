/* global sgv */

/**
 * UI namespace for creating HTML elements and handling UI-related tasks.
 * @namespace
 */
var UI = (function () {});


/**
 * Creates an HTML element with the specified tag, attributes, properties, and event listeners.
 * @param {string} _tag - The HTML tag of the element.
 * @param {Object} _attrs - The attributes to set on the element.
 * @param {Object} _props - The properties to set on the element.
 * @param {Object} _evnts - The event listeners to add to the element.
 * @returns {HTMLElement} The created HTML element.
 */
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

/**
 * Creates a span element with the specified text content and attributes.
 * @param {string} _text - The text content of the span element.
 * @param {Object} _attrs - The attributes to set on the span element.
 * @returns {HTMLElement} The created span element.
 */
UI.span = function(_text, _attrs) {
    return UI.tag("span", _attrs, {'textContent': _text} );
};

/**
 * Sets the selected option of a select element based on the provided key.
 * @param {HTMLSelectElement} _select - The select element.
 * @param {number|string} _key - The key to select in the select element.
 * @returns {boolean} True if the option was found and selected, false otherwise.
 */
UI.selectByKey = function(_select, _key) {
    let i = UI.findOption(_select, _key.toString());
    if ( i>-1 ) {
        _select.selectedIndex = i;
        return true;
    }
    return false;
};

/**
 * Clears the options of a select element.
 * @param {HTMLSelectElement} _select - The select element.
 * @param {boolean} [_deleteFirst=true] - Indicates whether to delete the first option or not.
 */
UI.clearSelect = function(_select,_deleteFirst) {
    const first = _deleteFirst?0:1;
    for(var i=first; i<_select.options.length; i++) {
        _select.removeChild(_select.options[i]);
        i--; // options have now less element, then decrease i
    }
};

/**
 * Finds the index of an option with the specified value in a select element.
 * @param {HTMLSelectElement} _select - The select element.
 * @param {string} _value - The value of the option to find.
 * @returns {number} The index of the option if found, -1 otherwise.
 */
UI.findOption = function(_select,_value) {
    for (var i= 0; i<_select.options.length; i++) {
        if (_select.options[i].value===_value) {
            return i;
        }
    }
    return -1;
};

/**
 * Creates an option element with the specified value, text content, and selected state.
 * @param {string} _value - The value of the option.
 * @param {string} _text - The text content of the option.
 * @param {boolean} [_selected] - Indicates whether the option should be selected or not.
 * @returns {HTMLOptionElement} The created option element.
 */
UI.option = function(_value, _text, _selected) {
    var o = document.createElement("option");
    o.value = _value;
    o.text = _text;
    
    if (typeof _selected!=='undefined')
        o.selected = _selected?'selected':'';
    
    return o;
};

/**
 * Creates an input element with the specified properties.
 * @param {Object} _props - The properties to set on the input element.
 * @returns {HTMLInputElement} The created input element.
 */
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

/**
 * Creates a new input element with the specified type, value, class, and id.
 * @param {string} _type - The type of the input element.
 * @param {string} _value - The value of the input element.
 * @param {string} [_class] - The class attribute of the input element.
 * @param {string} [_id] - The id attribute of the input element.
 * @returns {HTMLInputElement} The created input element.
 */
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

/**
 * Creates a title bar element with the specified title and close button visibility.
 * @param {string} title - The title of the title bar.
 * @param {boolean} closebuttonVisible - Indicates whether the close button should be visible or not.
 * @returns {HTMLElement} The created title bar element.
 */
UI.createTitlebar = function (title, closebuttonVisible) {
    var t = UI.tag( "div", { "class": "title" });
    
    if (closebuttonVisible) {
        t.appendChild(
                UI.tag( "button", {
                        //"type": "button",
                        //"value": '\u274C',
                        "class": "hidebutton" },
                    {"innerHTML": '<span id="X">\u274C</span><span id="value"></span>'}) );
    }

    t.appendChild( UI.tag( "span", { "class": "titleText" }, {"textContent": title}) );

    return t;
};

/**
 * Creates an empty window element with the specified class, id, title, and close button visibility.
 * @param {string} [_class] - The class attribute of the window element.
 * @param {string} [_id] - The id attribute of the window element.
 * @param {string} [_title] - The title of the window element.
 * @param {boolean} [_closebuttonVisible] - Indicates whether the close button should be visible or not.
 * @returns {HTMLElement} The created window element.
 */
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



/**
 * Creates a transparent button element with the specified text, id, and onclick function.
 * @param {string} txt - The text content of the button.
 * @param {string} id - The id attribute of the button.
 * @param {Function} onclick - The function to be called when the button is clicked.
 * @returns {HTMLInputElement} The created button element.
 */
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

/**
 * Creates a transparent button element with the specified text, id, and onclick function.
 * @param {string} txt - The text content of the button.
 * @param {string} id - The id attribute of the button.
 * @param {Function} onclick - The function to be called when the button is clicked.
 * @returns {HTMLButtonElement} The created button element.
 */
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
