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


/* global UI, sgv, Dispatcher */

const ScopePanel = (function(addButtons,lbl) {
    let divNS, divDS;
    
    this.addScope = (scope, idx) => {
        selectScope.add(UI.option(scope, scope));
        selectScope.selectedIndex = idx;
    };
    
    this.delScope = (scope, idx2) => {
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.remove(i);
        }
        selectScope.selectedIndex = idx2;
    };

    this.selScope = (scope)=>{
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.selectedIndex = i;
        }
    };
    
    this.getScope = ()=> {
        return selectScope.value;
    };

    this.getScopeIndex = ()=> {
        return selectScope.selectedIndex;
    };
    
    this.refresh = () => {
        if (sgv.graf !== null) {
            UI.clearSelect(selectScope, true);
            for (const key in sgv.graf.scopeOfValues) {
                let scope = sgv.graf.scopeOfValues[key];
                let opt = UI.option(scope, scope);
                if (sgv.graf.currentScope === sgv.graf.scopeOfValues[key]) {
                    opt.selected = "selected";
                }
                selectScope.appendChild(opt);
            }
        }
    };
    
    
    function EditPanel(scopeToEdit) {
        let createNew = true;
        if ((typeof scopeToEdit === 'string')&&(scopeToEdit!=='')) createNew = false;
        
        let divNS = UI.tag("div", {'class': "sgvD1", 'id': "cplDivNS"}, {'textContent': isMobile?'':(createNew)?"add new scope: ":"edit scope: "});
        
        let editAddScope = UI.tag("input", {'type': "text", 'id': "cplAddScopeInput", 'value': (createNew)?"newScope":scopeToEdit});
        divNS.appendChild(editAddScope);

        let btnAcceptAddScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplAcceptAddScope", 'value': ''});
        btnAcceptAddScope.addEventListener('click', ()=>{
            if (createNew){
                let scope = editAddScope.value;
                let idx = sgv.graf.addScopeOfValues(scope);
                
                Dispatcher.graphChanged();
            }
            else {
                //edit existing
            }
            
            divNS.style.display = "none";
            divDS.style.display = "inline";
        });
        divNS.appendChild(btnAcceptAddScope);

        let btnSkipAddScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplSkipAddScope", 'value': ''});
        btnSkipAddScope.addEventListener('click', ()=>{
                    divNS.style.display = "none";
                    divDS.style.display = "block";
                });
        divNS.appendChild(btnSkipAddScope);


        divNS.style.display = "none";
        
        return {
            ui: divNS,
            show: ()=>(divNS.style.display = "block"),
            hide: ()=>(divNS.style.display = "none")
        };
    }
    
    if (typeof addButtons!=='boolean') addButtons = true;
    
    this.ui = UI.tag("div", {'class': "sgvSelectBox", 'id': "ScopePanel"});
    
    //divDS = UI.tag("div", {'class': "sgvD1", 'id': "cplDivDS"}, {'textContent': isMobile?'':"current scope: "});
    divDS = UI.tag("div", {'class': "sgvD1", 'id': "cplDivDS"});
    this.ui.appendChild(divDS);

    if (typeof lbl==='string') {
        divDS.appendChild(UI.tag("label", {'for': "cplDispValues"}, {'innerHTML':lbl}));
    }
    
    let selectScope = UI.tag("select", {'id': "cplDispValues"});
    selectScope.addEventListener('change', () => {
        sgv.graf.displayValues(selectScope.value);
    });
    divDS.appendChild(selectScope);

    if (addButtons) {
//        let btnEditScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplEditScope", 'value': ''});
//        btnEditScope.addEventListener('click',()=>{
//                });
//        divDS.appendChild(btnEditScope);


        let btnDelScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplDelScope", 'value': ''});
        btnDelScope.addEventListener('click',()=>{
            let idx = sgv.graf.delScopeOfValues(this.getScope());
            Dispatcher.graphChanged();
        });

        divDS.appendChild(btnDelScope);

        let btnAddScope = UI.tag("input", {'type': "button", 'class': "toolButton", 'id': "cplAddScope", 'value': ''});
        btnAddScope.addEventListener('click',()=>{
                    divNS.show();
                    divDS.style.display = "none";
                });
        divDS.appendChild(btnAddScope);

        this.ui.appendChild((divNS = EditPanel()).ui);
    }    


});



