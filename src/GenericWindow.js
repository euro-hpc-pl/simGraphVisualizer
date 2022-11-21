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

const GenericWindow = /** @class */ (function (_id, _title, args) {
    var prevFocused = null;

    this.ui = UI.tag("div", {'class': 'sgvUIwindow'});
    var movable = false;
    
    if ((typeof _id !== 'undefined') && (_id !== "")) {
        this.ui.setAttribute("id", _id);
    }

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
    
    this._show = ()=>{
        prevFocused = window.document.activeElement;
        this.ui.style.display = "block";
        this.ui.focus({focusVisible: false});
    };
    
    this._hide = ()=>{
        this.ui.style.display = "none";
        if (prevFocused !== null) prevFocused.focus({focusVisible: false});
    };
    
    this._switch = ()=>{
        if (this.ui.style.display === "none") {
            this._show();
        } else {
            this._hide();
        }
    };
    
    this._test = function() { console.log('test 1a'); };
    
});

GenericWindow.prototype.show = ()=>this._show();
GenericWindow.prototype.hide = ()=>this._hide();
GenericWindow.prototype.switch = ()=>this._switch();
GenericWindow.prototype.test = ()=> { console.log('test 1'); };
    

//const Test = (function(){
//    GenericWindow.call(this, 'test_id', 'Generic window test', {closeButton: true, setMovable: true});
//    
//    this.test = () => {
//        console.log('test 0');
//        GenericWindow.prototype.test();
//        this._test();
//        console.log('test 2');
//    };
//    
//    this.ui.appendChild(SVG.createSVG('svgView',300,150,()=>{}));
//});
//
//var parentPrototype = Object.create(GenericWindow.prototype);
//parentPrototype.constructor = Test;
//Test.prototype = parentPrototype;
//
//var test = new Test();
//
//test.test();
//test._test();
