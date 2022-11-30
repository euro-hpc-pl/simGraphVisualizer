const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");
const dataFile = require(path.join(app.getAppPath(),'scripts/workers/dataFile.js'));

const isMac = process.platform === 'darwin';

var template = (mainWindow) => {
    return [
        {
            label: 'Graph',
            submenu: [
                {
                    label: 'Create new',
                    id: 'menuGraphCreate',
                    click: function() {
                        mainWindow.webContents.send('createDefault');
                    }
                },
                {
                    label: 'Load from...',
                    id: 'menuGraphLoad',
                    click: function() {
                        let paths = dialog.showOpenDialogSync({
                            filters: [
                                { name: 'All supported files', extensions: ['txt', 'gexf'] },
                                { name: 'Text files', extensions: ['txt'] },
                                { name: 'GEXF files', extensions: ['gexf'] }],
                            properties: ['openFile'] });
                        if (typeof paths!=='undefined') {
                            let mydata = dataFile.load(paths[0]);
                            mainWindow.webContents.send('loadFile',paths[0],mydata);
                        }
                    }
                },
                {
                    label: 'Save to...',
                    id: 'menuGraphSave',
                    enabled: false,
                    click: function() {
                        let path = dialog.showSaveDialogSync({
                            filters: [
                                { name: 'All supported files', extensions: ['txt', 'gexf'] },
                                { name: 'Text files', extensions: ['txt'] },
                                { name: 'GEXF files', extensions: ['gexf'] }],
                            properties: ['saveFile'] });
                        if (typeof path!=='undefined') {
                            //console.log(paths);
                            mainWindow.webContents.send('clickSaveGraph',path);
                        }                        
                       
                    }
                },
                {
                    label: 'Clear',
                    id: 'menuGraphClear',
                    enabled: false,
                    click: function() {
                        mainWindow.webContents.send('clearGraph');
                    }
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
                
            ]
        },
        {
            label: 'Run',
            submenu: [
                {
                    label: 'Test program',
                    click: function() {
                        mainWindow.webContents.send('runExternal','any');
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Graph display mode',
                    id: 'menuViewDisplayMode',
                    enabled: false,
                    submenu: [
                        {
                            label: 'Classic',
                            click: function() {
                                mainWindow.webContents.send('setDisplayMode', 'classic');
                            }
                        },
                        {
                            label: 'Diamond',
                            click: function() {
                                mainWindow.webContents.send('setDisplayMode', 'diamond');
                            }
                        },
                        {
                            label: 'Triangle',
                            click: function() {
                                mainWindow.webContents.send('setDisplayMode', 'triangle');
                            }
                        }
                    ]
                },
                {
                    label: 'Switch Cell view dialog',
                    id: 'menuViewCellView',
                    enabled: false,
                    click: function() {
                        mainWindow.webContents.send('switchCellView');
                    }
                },
                {
                    label: 'Switch console',
                    click: function() {
                        mainWindow.webContents.send('switchConsole');
                    }
                },
                 { type: 'separator' },
                {
                    label: 'Splash test',
                    click: function() {
                        mainWindow.webContents.send('showLoaderSplash');
                        setTimeout(function () {
                            mainWindow.webContents.send('hideLoaderSplash');
                        }, 5000);
                    }
                },
                {
                    label: 'Show second window',
                    click: function() {
                        var splash = new BrowserWindow({
                            width: 400, 
                            height: 400, 
                            //transparent: true, 
                            //frame: false, 
                            alwaysOnTop: true 
                        });
                        splash.loadFile('views/home/splash.html');
                        splash.center();
                        //splash.show();
                        //mainWindow.setMenuBarVisibility(false);
                        setTimeout(function () {
                            splash.close();
                            //mainWindow.setMenuBarVisibility(true);
                        }, 5000);
                    }
                }
                
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About...',
                    click: function() {
                        mainWindow.webContents.send('showAbout');
                    }
                }
            ]
        }
    ];
};

var create = (mainWindow) => {
    return Menu.buildFromTemplate(template(mainWindow));
};

const menu = {
    template: template,
    create: create
};

module.exports = menu;
