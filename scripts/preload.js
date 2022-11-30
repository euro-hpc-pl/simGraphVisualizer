const { contextBridge, ipcMain, ipcRenderer } = require('electron');
const indexBridge = require('./views/index_preload.js');

if (location.href.endsWith('index.html')) {
    Bridge = indexBridge;
}

contextBridge.exposeInMainWorld('Bridge', Bridge);
