/* global UI, sgv, Dispatcher */

/**
 * @class ScopePanel module for managing scope-related operations in a user interface.
 * @param {boolean} [addButtons=true] - Flag indicating whether to add buttons to the panel.
 * @param {string} [lbl] - Label for the scope display.
 * @returns {Object} ScopePanel instance.
 */
const ScopePanel = (function(addButtons,lbl) {
    let divNS, divDS;

    /**
     * Adds a scope to the select element.
     * @param {string} scope - The scope to add.
     * @param {number} idx - The index of the added scope.
     */
    this.addScope = (scope, idx) => {
        selectScope.add(UI.option(scope, scope));
        selectScope.selectedIndex = idx;
    };
    
    /**
     * Deletes a scope from the select element.
     * @param {string} scope - The scope to delete.
     * @param {number} idx2 - The index of the selected scope.
     */
    this.delScope = (scope, idx2) => {
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.remove(i);
        }
        selectScope.selectedIndex = idx2;
    };

    /**
     * Selects a scope in the select element.
     * @param {string} scope - The scope to select.
     */
    this.selScope = (scope)=>{
        let i = UI.findOption(selectScope, scope);
        if (i > -1) {
            selectScope.selectedIndex = i;
        }
    };
    
    /**
     * Gets the value of the selected scope.
     * @returns {string} The value of the selected scope.
     */
    this.getScope = ()=> {
        return selectScope.value;
    };

    /**
     * Gets the index of the selected scope.
     * @returns {number} The index of the selected scope.
     */
    this.getScopeIndex = ()=> {
        return selectScope.selectedIndex;
    };
    
    /**
     * Refreshes the scope panel by updating the select element with available scopes.
     */
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
    
    
    /**
     * EditPanel constructor function for creating an edit panel for adding or editing a scope.
     * @param {string} [scopeToEdit] - The scope to edit. If provided, it's an edit operation; otherwise, it's an add operation.
     * @returns {Object} EditPanel instance.
     */
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
    
    /**
     * The UI element representing the ScopePanel.
     * @type {HTMLElement}
     */
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



