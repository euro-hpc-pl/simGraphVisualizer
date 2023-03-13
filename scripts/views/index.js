/* global sgv, UI, FileIO, ParserGEXF, ParserTXT, Graph */

if (typeof window.indexBridge!=='undefined') {
    console.log("desktopApp!");


//================================================
//
// communication from main.js to sgv.js
// see events defined in index_preload.js
//
//================================================

window.indexBridge.onShowLoaderSplash( ()=>{
    showSplash();
});

window.indexBridge.onHideLoaderSplash( ()=>{
    hideSplash();
});


window.indexBridge.onRunMenuItem( (event,extInfo) => {
    console.log("index.js: window.indexBridge.onRunMenuItem()");
    runExternal(extInfo);
});

window.indexBridge.onSetDisplayMode( (event, mode) => {
    if (sgv.graf !== null) {
        Graph.currentDisplayMode = mode;
        sgv.graf.setDisplayMode();
    }
}); 


window.indexBridge.onExternalResult( (event, resultData) => {
    sgv.stringToScope(resultData, "result");
    hideSplash();
});

window.indexBridge.onClearGraph( () => {
    Graph.remove();
});

window.indexBridge.onShowAbout( ()=> {
   sgv.dlgAbout.show(); 
});

window.indexBridge.onShowSettings( (event, externalRun, extBinDir)=> {
   sgv.dlgEditSettings.show(externalRun, extBinDir); 
});

window.indexBridge.onCreateDefault( () => {
    sgv.dlgCreateGraph.show();
});

window.indexBridge.onSwitchConsole( () => {
    sgv.dlgConsole.switchConsole();
});

window.indexBridge.onSwitchCellView( () => {
    sgv.dlgCellView.switchDialog();
});

window.indexBridge.onLoadFile( (event,fileName,data) => {
    showSplashAndRun( ()=> {
        FileIO.loadGraph2(fileName,data);
    });
});

window.indexBridge.onClickSaveGraph( (event, fileName) => {
    showSplashAndRun( ()=> {
        var string = "";
        if (fileName.endsWith('txt')){
            string = ParserTXT.exportGraph(sgv.graf);
        } else if (fileName.endsWith('gexf')) {
            string = ParserGEXF.exportGraph(sgv.graf);
        }

        window.indexBridge.saveStringToFile(string, fileName);
    });
});

window.indexBridge.onSaveEnd( () => {
    hideSplash();
});

/*==========================================================================*/

const runExternal = (extInfo) => {
//    if (sgv.graf!==null) {
//        showSplash();
//        var data = ParserTXT.exportGraph(sgv.graf);
//        window.indexBridge.runExternal(data, extInfo);
//    }

    var data = (sgv.graf!==null) ? ParserTXT.exportGraph(sgv.graf) : null;
    
    window.indexBridge.runExternal(data, extInfo);
};


// redefinition:
desktopInit = () => {
    setTimeout(function () {
//        sgv.dlgCPL.addButton( "run external program", "cplElectronTestButton", ()=>{
//            runExternal('any');
//        } );

        sgv.dlgCPL.hidePanel();
    }, 200);
    
};

enableMenu = (id, enabled) => {
    if (typeof enabled==='undefined')
    enabled=true;

    window.indexBridge.enableMenu(id, enabled);
};

}

