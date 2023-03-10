/* global sgv, UI */

sgv.dlgLoaderSplash = new function() {
    var ui = null;
    var info;
    
    function createDialog() {
        if (ui===null) {
            ui = UI.tag( "dialog", { "class": "sgvModalDialog", "id": "loaderSplash" });
        }
        
        ui.appendChild(UI.tag('span',{},{'textContent':'working hard for you'}));
        ui.appendChild(UI.tag('div',{'class':'loader'}));
        ui.appendChild(UI.tag('span',{},{'textContent':'... please wait ...'}));
        ui.appendChild(info = UI.tag('div',{'id':'infoBlock'}));

        ui.style.display = "none";
        window.document.body.appendChild(ui);
    };

    function showDialog() {
        if (ui===null) createDialog();
        if (ui.open) ui.close();
        info.innerHTML = "";
        ui.style.display = "block";
        ui.showModal();
    };

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };

    function setInfoX(text,action) {
        if (ui.open) ui.close();
            ui.style.display = "block";
        ui.showModal();
        info.innerHTML = text;
        if (typeof action==='function'){
            setTimeout( ()=>{
                action();
            }, 100);
        }
    };
    
    return {
        setInfo: setInfoX,
        show: showDialog,
        hide: hideDialog
    };
};


function  showSplash() {
    sgv.dlgLoaderSplash.show();
};

function hideSplash() {
    setTimeout(function () {
        sgv.dlgLoaderSplash.hide();
    }, 200);
};

function showSplashAndRun(f,noHide) {
    if (typeof noHide==='undefined')
        noHide = false;
    
    showSplash();
    setTimeout(()=>{
        f();
        if (!noHide) hideSplash();
    }, 100);
};
