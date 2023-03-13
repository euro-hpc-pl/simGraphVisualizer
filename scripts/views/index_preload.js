const { contextBridge, ipcMain, ipcRenderer } = require('electron');

let indexBridge = {
    
    /* ======= WEB CONTENT => MAIN WORLD=====================================*/
    // keys are async functions that can be called from web content
    // they are handled with ipcMain.handle("event",...) defined in main.js

    getDirectoryDlg: async () => {
        const result = await ipcRenderer.invoke("getDirectoryDlg");
        
        return result;
    },
    
    settingsEdited: async (extInfo, workingDir) => {
        await ipcRenderer.invoke("settingsEdited", extInfo, workingDir);
    },
 
    runExternal: async (data, extInfo) => {
        await ipcRenderer.invoke("runExternal", data, extInfo);
    },
    
    saveStringToFile: async (string, fileName) => {
        await ipcRenderer.invoke("saveStringToFile", string, fileName);
    },

    enableMenu: async (id, enabled) => {
        if (typeof enabled==='undefined')
            enabled=true;
        
        await ipcRenderer.invoke('enableMenu', id, enabled);
    },
    
    /* ======== MAIN WORLD => WEB CONTENT ===================================*/
    // keys are window.indexBridge methods defined in index_preload.js
    // can be called from main.js with: mainWindow.webContents.send('event',..) 
    //
    
    onShowLoaderSplash: (callback) => ipcRenderer.on("showLoaderSplash", (callback)),
    onHideLoaderSplash: (callback) => ipcRenderer.on("hideLoaderSplash", (callback)),
    
    onCreateDefault: (callback) => ipcRenderer.on("createDefault", (callback)),
    onLoadFile: (callback) => ipcRenderer.on("loadFile", (callback)),
    onClickSaveGraph: (callback) => ipcRenderer.on("clickSaveGraph", (callback)),
    onSaveEnd: (callback) => ipcRenderer.on("saveEnd", (callback)),

    onClearGraph: (callback) => ipcRenderer.on("clearGraph", (callback)),

    onRunMenuItem: (callback) => ipcRenderer.on("runExternal", (callback)),
    onExternalResult: (callback) => ipcRenderer.on("externalResult", (callback)),
    
    onSetDisplayMode: (callback) => ipcRenderer.on("setDisplayMode", (callback)),
    onSwitchConsole: (callback) => ipcRenderer.on("switchConsole", (callback)),
    onSwitchCellView: (callback) => ipcRenderer.on("switchCellView", (callback)),

    onShowSettings: (callback) => ipcRenderer.on("showSettings", (callback)),
    onShowAbout: (callback) => ipcRenderer.on("showAbout", (callback))
};

contextBridge.exposeInMainWorld("indexBridge", indexBridge);
