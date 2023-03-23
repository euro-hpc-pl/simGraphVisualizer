const { contextBridge, ipcRenderer } = require('electron');

const api = {
    invoke: (channel,...args) => ipcRenderer.invoke(channel, ...args),
//        send: (channel, data) => {
//            // whitelist channels
//            let validChannels = ["toMain"];
//            if (validChannels.includes(channel)) {
//                ipcRenderer.send(channel, data);
//            }
//        },
    on: (channel, func) => {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event,...args) => func(...args));
//        },
//        receive: (channel, func) => {
//            let validChannels = ["fromMain"];
//            if (validChannels.includes(channel)) {
//                // Deliberately strip event as it includes `sender` 
//                ipcRenderer.on(channel, (event, ...args) => func(...args));
//            }
    }
};

contextBridge.exposeInMainWorld( "api", api );

//if (location.href.endsWith('index.html')) {
//Bridge = api;
//}
//contextBridge.exposeInMainWorld( "Bridge", Bridge );
