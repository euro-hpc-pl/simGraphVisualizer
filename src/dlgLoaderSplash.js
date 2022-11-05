/* global sgv, UI */

sgv.dlgLoaderSplash = new function() {
    var ui = null;

    function createDialog() {
        if (ui===null) {
            ui = UI.tag( "dialog", { "class": "sgvModalDialog", "id": "loaderSplash" });
        }
        
        ui.innerHTML = '<span>working hard for you</span><div class="loader"></div><span>... please wait ...</span>';

        ui.style.display = "none";
        window.document.body.appendChild(ui);
    };

    function showDialog() {
        if (ui===null) createDialog();
        if (ui.open) ui.close();
        
        ui.style.display = "block";
        ui.showModal();
    };

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };

    return {
        show: showDialog,
        hide: hideDialog
    };
};


