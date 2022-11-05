/* global sgv, UI */

sgv.dlgMissingNodes = new function() {
    
    var misN;
    var ui = createUI('sgvMissingNodes');

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
    });


    function createUI(id) {
        let o = UI.createEmptyWindow("sgvUIwindow", id, "removed nodes", true);

        var content = UI.tag("div", {'class':'content'});
        misN = UI.tag("div", {'id':'misN'});
        content.appendChild(misN);

        var del = UI.newInput("button", "clear history", "delbutton", "");
        del.addEventListener('click', function () {
            delMissingX();
        });
        content.appendChild(del);

        o.appendChild(content);
        return o;
    };

    function addNodeX(nodeId) {
        let i = UI.newInput("button", " q" + nodeId + " ", "", "rest" + nodeId );

        i.addEventListener('click', function () {
            restoreNode(nodeId);
        });
        
        misN.appendChild(i);
        
        ui.style.display = "block";
    };
    
    function restoreNode(nodeId) {
        var but = ui.querySelector("#rest" + nodeId);
        but.parentNode.removeChild(but);

        sgv.graf.restoreNode(nodeId);
    };
    
    function delMissingX() {
        misN.innerHTML = "";

        if (sgv.graf !== null) {
            sgv.graf.missing = {};
        }

        ui.style.display = "none";
    };

    
    return {
        show: ()=>{ui.style.display = "block";},
        hide: ()=>{ui.style.display = "none";},
        addNode: addNodeX,
        delAll: delMissingX
    };

};
