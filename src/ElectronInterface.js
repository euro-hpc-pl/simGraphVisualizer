
/* 
 * Copyright 2022 Dariusz Pojda.
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

if (typeof window.api!=='undefined') {
    console.log("desktopApp!");

    window.api.on( "showLoaderSplash", ()=>showSplash() );

    window.api.on( "hideLoaderSplash", ()=>hideSplash() );

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

    desktopInit = () => {
        setTimeout(function () {
            sgv.dlgCPL.hidePanel();
        }, 200);
    };

    enableMenu = (id, enabled) => {
        if (typeof enabled==='undefined')
        enabled=true;

        window.api.invoke('enableMenu', id, enabled);
    };

} else {
    desktopInit = ()=>{
    //        sgv.dlgCPL.addButton( "settings window", "cplElectronTestButton", ()=>{
    //            sgv.dlgEditSettings.show();
    //        } );
    };
    enableMenu = (id, enabled)=>{};
}
