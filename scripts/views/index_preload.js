const { contextBridge, ipcMain, ipcRenderer } = require('electron');

let indexBridge = {
    
    /* ========== OUT ====================================================*/
 
    runExternal: async (data) => {
        await ipcRenderer.invoke("runExternal", data);
    },
    
    saveStringToFile: async (string, fileName) => {
        await ipcRenderer.invoke("saveStringToFile", string, fileName);
    },

    enableMenu: async (id, enabled) => {
        if (typeof enabled==='undefined')
            enabled=true;
        
        await ipcRenderer.invoke('enableMenu', id, enabled);
    },
    /* ========== IN =====================================================*/
    
    onShowLoaderSplash: (callback) => ipcRenderer.on("showLoaderSplash", (callback)),
    onHideLoaderSplash: (callback) => ipcRenderer.on("hideLoaderSplash", (callback)),
    
    onCreateDefault: (callback) => ipcRenderer.on("createDefault", (callback)),
    onLoadFile: (callback) => ipcRenderer.on("loadFile", (callback)),
    onClickSaveGraph: (callback) => ipcRenderer.on("clickSaveGraph", (callback)),
    onSaveEnd: (callback) => ipcRenderer.on("saveEnd", (callback)),

    onClearGraph: (callback) => ipcRenderer.on("clearGraph", (callback)),

    onRunExternal: (callback) => ipcRenderer.on("runExternal", (callback)),
    onExternalResult: (callback) => ipcRenderer.on("externalResult", (callback)),
    
    onSetDisplayMode: (callback) => ipcRenderer.on("setDisplayMode", (callback)),
    onSwitchConsole: (callback) => ipcRenderer.on("switchConsole", (callback)),
    onSwitchCellView: (callback) => ipcRenderer.on("switchCellView", (callback)),

    onShowAbout: (callback) => ipcRenderer.on("showAbout", (callback)),
};

contextBridge.exposeInMainWorld("indexBridge", indexBridge);
