//================================================
// Short description of communication:
// 
// window.api.on() functions are handlers for events send from main.js
// to web part of application with mainWindow.webContents.send()
// 
// Handlers can do actions in browser window document, but can't return results
// so they need to call window.api.invoke() and send response in message.
// 
// ElectronJS part of application can read it by ipcMain.handle() in main.js,
// optionaly ipcMain.handle() may return any result that can be read in 
// window.api.invoke() as Promise, so we can to use window.api.invoke().then()
//
//================================================

/* global sgv, UI, FileIO, ParserGEXF, ParserTXT, Graph */

//var userAgent = navigator.userAgent.toLowerCase();
//console.log(userAgent);
//if (userAgent.indexOf(' electron/') > -1) {
   // Electron-specific code
//}

/**
 * Check if running inside Electron environment
 */
if (typeof window.api!=='undefined') {
    console.log("desktopApp!");

    /**
     * Event listener to show loader splash
     */
    window.api.on( "showLoaderSplash", ()=>showSplash() );

    /**
     * Event listener to hide loader splash
     */
    window.api.on( "hideLoaderSplash", ()=>hideSplash() );

    /**
     * Event listener to set display mode of the graph
     */
    window.api.on( "setDisplayMode", (mode) => {
        if (sgv.graf !== null) {
            Graph.currentDisplayMode = mode;
            sgv.graf.setDisplayMode();
        }
    }); 

    window.api.on( "externalResult", (resultData) => {
        sgv.stringToScope(resultData, "result");
        hideSplash();
    });

    /**
     * Event listener to clear the graph
     */
    window.api.on( "clearGraph", ()=>Graph.remove() );

    window.api.on( "showAbout", ()=>sgv.dlgAbout.show() );

    window.api.on( "showSettings", (externApps, extBinDir)=>sgv.dlgEditSettings.show(externApps, extBinDir) );

    window.api.on( "createDefault", ()=>sgv.dlgCreateGraph.show() );

    window.api.on( "switchConsole", ()=>sgv.dlgConsole.switchConsole() );

    window.api.on( "switchCellView", ()=>sgv.dlgCellView.switchDialog() );

    window.api.on( "loadFile", (fileName,data) => {
        showSplashAndRun( ()=> {
            FileIO.loadGraph2(fileName,data);
        });
    });

    window.api.on( "clickSaveGraph", (fileName) => {
        showSplashAndRun( ()=> {
            var string = "";
            if (fileName.endsWith('txt')){
                string = ParserTXT.exportGraph(sgv.graf);
            } else if (fileName.endsWith('gexf')) {
                string = ParserGEXF.exportGraph(sgv.graf);
            }

            window.api.invoke("saveStringToFile", string, fileName);
        });
    });

    window.api.on( "saveEnd", ()=>hideSplash() );

    // reading data from graph and sending it as response to main world
    window.api.on( "m2w_getScopeAsTXT_request", (responseChannel, ...args) => {
        console.log("2. (index.js) window.api.on(\"m2w_getScopeAsTXT_request\")");

        //read text data from graph
        let data = (sgv.graf!==null) ? ParserTXT.exportGraph(sgv.graf) : null;

        //send response and get result
        window.api.invoke(responseChannel, data, ...args).then((result)=>{
            console.log("4. (index.js) window.api.invoke("+responseChannel+").then()");
            console.log("result = ",result);
        });
    });



    /*==========================================================================*/

    /**
     * Initialization for desktop mode
     * @function
     */
    desktopInit = () => {
        setTimeout(function () {
            sgv.dlgCPL.hidePanel();
        }, 200);
    };

    /**
     * Enable menu item
     * @function
     * @param {string} id - The id of the menu item to enable or disable
     * @param {boolean} [enabled=true] - The new state of the menu item
     */
    enableMenu = (id, enabled) => {
        if (typeof enabled==='undefined')
        enabled=true;

        window.api.invoke('enableMenu', id, enabled);
    };

} else {
    /**
     * Initialization for web mode
     * @function
     */
    desktopInit = ()=>{};

    /**
     * Stub for enableMenu when not in Electron environment
     * @function
     * @param {string} id - The id of the menu item to enable or disable
     * @param {boolean} [enabled=true] - The new state of the menu item
     */
    enableMenu = (id, enabled)=>{};
}
