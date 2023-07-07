/* 
 * Copyright 2022 pojdulos.
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


/* global UI */

/**
 * Represents a generic window UI component.
 * @class
 * @param {string} _id - The ID of the window.
 * @param {string} _title - The title of the window.
 * @param {Object} args - Additional arguments.
 */
const GenericWindow = /** @class */ (function (_id, _title, args) {
    var prevFocused = null;

    /**
     * The UI element of the window.
     * @type {HTMLElement}
     */
    this.ui = UI.tag("div", {'class': 'sgvUIwindow'});
    var movable = false;
    
    if ((typeof _id !== 'undefined') && (_id !== "")) {
        this.ui.setAttribute("id", _id);
    }

    /**
     * The title bar of the window.
     * @type {HTMLElement}
     */
    let titleBar = UI.tag( "div", { "class": "title" });
    titleBar.appendChild( UI.tag( "span", { "class": "titleText" }, {"textContent": _title}) );
    
    if (('closeButton' in args)&&(args['closeButton']===true)) {
        let closeButton = UI.tag( "input", {'type':'button', 'class':'hidebutton', 'value': '\u274C'});
        closeButton.addEventListener('click', ()=>this._hide());
        titleBar.appendChild(closeButton);
    }
    this.ui.appendChild(titleBar);

    if (('setMovable' in args)&&(args['setMovable']===true)) {
        setMovable(this.ui);
    }
    this.ui.setAttribute('tabindex', '0');

    window.addEventListener('load', () => window.document.body.appendChild(this.ui));
    
    /**
     * Sets the window as movable.
     * @param {HTMLElement} ui - The UI element of the window.
     */
    function setMovable(ui) {
        ui.offset = {x:0,y:0};
        ui.isDown = false;

        titleBar.addEventListener('mouseover', function() {
            titleBar.style.cursor='pointer';
            movable = true;
        });

        titleBar.addEventListener('mouseout', function() {
            movable = false;
        });

        titleBar.addEventListener('mousedown', function (e) {
            ui.isDown = movable;
            ui.offset = {
                x: ui.offsetLeft - e.clientX,
                y: ui.offsetTop - e.clientY
            };
        }, true);

        titleBar.addEventListener('mouseup', function () {
            ui.isDown = false;
        }, true);

        document.addEventListener('mousemove', function (event) {
            //event.preventDefault();
            if (ui.isDown) {
                let mousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };

                ui.style.left = (mousePosition.x + ui.offset.x) + 'px';
                ui.style.top = (mousePosition.y + ui.offset.y) + 'px';
            }
        }, true);
    }
    
    /**
     * Shows the window.
     */
    this._show = ()=>{
        prevFocused = window.document.activeElement;
        this.ui.style.display = "block";
        this.ui.focus({focusVisible: false});
    };
    
    /**
     * Hides the window.
     */
    this._hide = ()=>{
        this.ui.style.display = "none";
        if (prevFocused !== null) prevFocused.focus({focusVisible: false});
    };
    
    /**
     * Toggles the visibility of the window.
     */
    this._switch = ()=>{
        if (this.ui.style.display === "none") {
            this._show();
        } else {
            this._hide();
        }
    };
    
    /**
     * A test method.
     */
    this._test = function() { console.log('test 1a'); };
});

/**
 * Shows the window.
 */
GenericWindow.prototype.show = this._show;

/**
 * Hides the window.
 */
GenericWindow.prototype.hide = this._hide;

/**
 * Toggles the visibility of the window.
 */
GenericWindow.prototype.switch = this._switch;

/**
 * A test method.
 */
GenericWindow.prototype.test = ()=> { console.log('test 1'); };


/****************************************************************************/
/*   the following code is for testing purposes only                        */
/****************************************************************************/

function ExePanel() {
    function PathLine(id) {
        let content = UI.tag( "div" );
        content.append(
                UI.tag('input',{'type':'button','id':'btnDelPath'+id,'value':'\u2796'}),
                UI.tag('input',{'type':'text','id':'dispBtn'+id,'value':'Button text'}),
                UI.tag('input',{'type':'text','id':'editPath'+id,'value':'d:/any/path/to/prog.exe'}),
                UI.tag('input',{'type':'button','id':'btnPath'+id,'value':'...'})
        );
        return content;
    }

    let paths = [];
    paths.push(PathLine(1));
    paths.push(PathLine(2));
    paths.push(PathLine(3));

    let content = UI.tag( "div", { "class": "content", "id": "graphSelection" });

    paths.forEach((path)=>{
        content.appendChild(path);
    });
    
    content.appendChild(UI.tag('input',{'type':'button','id':'btnDelPath1','value':'\u2795'}));
    
    return {
        ui: content
    };
}

function KnownProgsPanel() {
    function PathLine(id) {
        let content = UI.tag( "div" );
        let edit;
        content.append(
                UI.tag('input',{'type':'checkbox','id':'chkPath'+id,'checked':'checked'}),
                UI.tag('label',{'for':'editPath'+id},{'innerHTML':' Path to prog.'+id+' '}),
                edit = UI.tag('input',{'type':'text','id':'editPath'+id,'value':'d:/any/path/to/prog.exe'}),
                UI.tag('input',{'type':'button','id':'btnPath'+id,'value':'...'},{},{
                    'click': ()=>{
                        let btnLoad1 = UI.tag('input',{'type':'file', 'id':'inputfile', 'display':'none'});

                        btnLoad1.addEventListener('change', ()=>{
                            if (typeof btnLoad1.files[0]!=='undefined') {
                                edit.value = btnLoad1.files[0].name;
                            }
                        });

                        btnLoad1.click();
                    }
                })
        );
        return content;
    }

    let paths = [];
    paths.push(PathLine(1));
    paths.push(PathLine(2));
    paths.push(PathLine(3));

    let content = UI.tag( "div", { "class": "content", "id": "graphSelection" });

    paths.forEach((path)=>{
        content.appendChild(path);
    });
    
    //content.appendChild(UI.tag('input',{'type':'button','id':'btnDelPath1','value':'\u2795'}));
    
    return {
        ui: content
    };
}

const DlgPreferences = (function(){
    GenericWindow.call(this, 'sgvPrefsDlg', 'Preferences', {closeButton: true, setMovable: true});
    
    var BtnsPanel = ()=>{
        let btns = UI.tag('div',{'id':'buttons'});

        btns.appendChild(UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCancelButton', 'name':'cancelButton', 'value':'Cancel'},{},{
            'click': this._hide
        }));

        let createButton = UI.tag('input',{'type':'button', 'class':'actionbutton', 'id':'cplCreateButton', 'name':'createButton', 'value':'OK'});
        //createButton.addEventListener('click', ()=>{onCreateButton();});
        btns.appendChild(createButton);

        return {
            ui: btns
        };
    };
    
    this.ui.appendChild(KnownProgsPanel().ui);
    this.ui.appendChild(BtnsPanel().ui);

//    this.test = () => {
//        console.log('test 0');
//        GenericWindow.prototype.test();
//        this._test();
//        console.log('test 2');
//    };
});

var parentPrototype = Object.create(GenericWindow.prototype);
parentPrototype.constructor = DlgPreferences;
DlgPreferences.prototype = parentPrototype;

//var test = new DlgPreferences();
//
//test.test();
//test._test();
