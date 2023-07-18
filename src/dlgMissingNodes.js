/* global sgv, UI */

/**
 * @class
 * @classdesc Represents the DlgMissingNodes class.
 * @memberof sgv
 */
class DlgMissingNodes {
    constructor() {
        /**
         * @property {HTMLElement} misN - Container for displaying missing nodes.
         * @property {HTMLElement} ui - The user interface element for the dialog.
         */
        //this.misN = null;
        this.ui = this.createUI('sgvMissingNodes');

        // Append UI to the body once the window has loaded.
        window.addEventListener('load',()=>{
            window.document.body.appendChild(this.ui);
        });
    }
    
    /**
     * Function to create user interface for the missing nodes dialog.
     * 
     * @param {string} id - The id for the UI element.
     * @returns {HTMLElement} - The created UI element.
     */
    createUI(id) {
        let o = UI.createEmptyWindow("sgvUIwindow", id, "removed nodes", true);

        var content = UI.tag("div", {'class':'content'});
        this.misN = UI.tag("div", {'id':'misN'});
        content.appendChild(this.misN);

        var del = UI.newInput("button", "clear history", "delbutton", "");
        del.addEventListener('click', () => {
            this.delAll();
        });
        content.appendChild(del);

        o.appendChild(content);
        return o;
    }

    /**
     * Function to add a missing node.
     * 
     * @param {string} nodeId - The id of the missing node.
     */
    addNode(nodeId) {
        let i = UI.newInput("button", " q" + nodeId + " ", "", "rest" + nodeId );

        i.addEventListener('click', () => {
            this.restoreNode(nodeId);
        });
        
        this.misN.appendChild(i);
        
        this.ui.style.display = "block";
    }
    
    /**
     * Function to restore a missing node.
     * 
     * @param {string} nodeId - The id of the node to restore.
     * @returns {boolean} - Returns true if node is restored, else false.
     */
    restoreNode(nodeId) {
        if (sgv.graf.restoreNode(nodeId)) {
            let but = this.ui.querySelector("#rest" + nodeId);
            but.parentNode.removeChild(but);
            
            return true;
        }
        return false;
    }
    
    /**
     * Function to delete all missing nodes.
     */
    delAll() {
        this.misN.innerHTML = "";

        if (sgv.graf !== null) {
            sgv.graf.missing = {};
        }

        this.hide();
    }

    
    show() {
        this.ui.style.display = "block";
    }
    
    hide() {
        this.ui.style.display = "none";
    }
    
}

/**
 * Represents the static instance of DlgMissingNodes in the sgv namespace.
 * @type {DlgMissingNodes}
 * @memberof sgv
 * @static
 */
sgv.dlgMissingNodes = new DlgMissingNodes;


///**
// * @description This object provides functionality related to the dialog for missing nodes.
// */
//sgv.dlgMissingNodes = new function() {
//    
//    /**
//     * @property {HTMLElement} misN - Container for displaying missing nodes.
//     * @property {HTMLElement} ui - The user interface element for the dialog.
//     */
//    var misN;
//    var ui = createUI('sgvMissingNodes');
//
//    // Append UI to the body once the window has loaded.
//    window.addEventListener('load',()=>{
//        window.document.body.appendChild(ui);
//    });
//
//
//    /**
//     * Function to create user interface for the missing nodes dialog.
//     * 
//     * @param {string} id - The id for the UI element.
//     * @returns {HTMLElement} - The created UI element.
//     */
//    function createUI(id) {
//        let o = UI.createEmptyWindow("sgvUIwindow", id, "removed nodes", true);
//
//        var content = UI.tag("div", {'class':'content'});
//        misN = UI.tag("div", {'id':'misN'});
//        content.appendChild(misN);
//
//        var del = UI.newInput("button", "clear history", "delbutton", "");
//        del.addEventListener('click', function () {
//            delMissingX();
//        });
//        content.appendChild(del);
//
//        o.appendChild(content);
//        return o;
//    };
//
//    /**
//     * Function to add a missing node.
//     * 
//     * @param {string} nodeId - The id of the missing node.
//     */
//    function addNodeX(nodeId) {
//        let i = UI.newInput("button", " q" + nodeId + " ", "", "rest" + nodeId );
//
//        i.addEventListener('click', function () {
//            restoreNodeX(nodeId);
//        });
//        
//        misN.appendChild(i);
//        
//        ui.style.display = "block";
//    };
//    
//    /**
//     * Function to restore a missing node.
//     * 
//     * @param {string} nodeId - The id of the node to restore.
//     * @returns {boolean} - Returns true if node is restored, else false.
//     */
//    function restoreNodeX(nodeId) {
//        if (sgv.graf.restoreNode(nodeId)) {
//            let but = ui.querySelector("#rest" + nodeId);
//            but.parentNode.removeChild(but);
//            
//            return true;
//        }
//        return false;
//    };
//    
//    /**
//     * Function to delete all missing nodes.
//     */
//    function delMissingX() {
//        misN.innerHTML = "";
//
//        if (sgv.graf !== null) {
//            sgv.graf.missing = {};
//        }
//
//        ui.style.display = "none";
//    };
//
//    
//    /**
//     * Returns an object containing methods for showing, hiding, adding, restoring, and deleting nodes.
//     */
//    return {
//        show: ()=>{ui.style.display = "block";},
//        hide: ()=>{ui.style.display = "none";},
//        addNode: addNodeX,
//        restoreNode: restoreNodeX,
//        delAll: delMissingX
//    };
//
//};
