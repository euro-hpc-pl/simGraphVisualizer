/**
 * The entry point of the Electron application.
 * 
 * The application is designed to provide a user interface for visualizing and
 * manipulating graph structures, and relies on external scripts for data processing.
 * 
 * Some functionality, such as reading and writing files, launching external scripts, 
 * and configuring the application, is provided by the Electron main process.
 * 
 * The application uses the Inter-Process Communication (IPC) to communicate between 
 * the main process and renderer process (web page). 
 * 
 * @module main
 */

// Import required modules
const {app, dialog, shell, BrowserWindow, ipcMain, net, session, Menu, MenuItem} = require("electron");
const path = require("path");
const axios = require("axios");
const fs = require('fs');
const os = require('os');

const process = require('process');
const child_process = require('child_process');

const dataFile = require(path.join(app.getAppPath(), 'scripts/workers/dataFile.js'));
const settings = require(path.join(app.getAppPath(), 'scripts/workers/settings.js'));
const menu = require(path.join(app.getAppPath(), 'scripts/workers/mainMenu.js'));

// Determine the operating system
const isMac = process.platform === 'darwin';

// Specify whether the application is in development mode
const DEVELOPEMENT_MODE = false;

// Settings object for storing external application configurations and working directory
var appSettings = {
    workingDir: "",
    externApps: [],
    // Read settings from the settings file
    read: () => {
        let temp = settings.get('settings', 'externApps');
        if (temp!==null) {
            appSettings.externApps = temp;
        } else {
            appSettings.externApps = [
                { "label":"Demo","path":"python bin/externalProg.py","params":"-i {graph} -o {result}" }
            ];    
        }

        let temp2 = settings.get('settings', 'workingDir');

        if (temp2!==null) {
            appSettings.workingDir = temp2;
            if (! fs.existsSync(appSettings.workingDir)) {
                appSettings.workingDir = os.tmpdir().replace(/\\/g, "/");
            }
        } else {
            appSettings.workingDir = os.tmpdir().replace(/\\/g, "/");
        }

        if (!appSettings.workingDir.endsWith("/")) appSettings.workingDir += "/";
        appSettings.save();
        rebuildExtRunMenu();
    },
    // Save the settings into the settings file
    save: () => {
        settings.set('settings', 'workingDir', appSettings.workingDir);
        settings.set('settings', 'externApps', appSettings.externApps);
    }
};

var mainWindow;
let icounter = 0;


var showSettingsDlg = function () {
    mainWindow.webContents.send('showSettings',appSettings.externApps,appSettings.workingDir);
};

// Function to add a menu item
function addMenuItem(_parentID, _label, _callback) {
    let m = Menu.getApplicationMenu();
    if (typeof m !== 'undefined'){
        var rm = m.getMenuItemById(_parentID).submenu;
        if (typeof rm !== 'undefined'){
            var item = new MenuItem({
                label:_label,
                click: _callback
              });
            rm.append(item);
            
            return item;
        }
    }
    return null;
}

// Function to add a separator
function addSeparator(_parentID) {
    let m = Menu.getApplicationMenu();
    if (typeof m !== 'undefined'){
        var rm = m.getMenuItemById(_parentID).submenu;
        if (typeof rm !== 'undefined'){
            var item = new MenuItem({
                type: 'separator'
              });
            rm.append(item);
            
            return item;
        }
    }
    return null;
}

// Function to rebuild external run menu
function rebuildExtRunMenu() {
    let m = Menu.getApplicationMenu();
    if (typeof m !== 'undefined'){
        var rm = m.getMenuItemById('menuRun');
        rm.submenu.clear();
        
        for (const exr of appSettings.externApps) {
            let item = addMenuItem('menuRun', exr.label, () => {
                
                //mainWindow.webContents.send('runExternal',exr);
                mainWindow.webContents.send("m2w_getScopeAsTXT_request",'runExternal',exr);
            });
        }    
    }
}


// Function to open a directory dialog and return the selected directory
function getDirectoryDialog() {
    let dir = dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] });
    //console.log(dir);
    dir = dir[0].replace(/\\/g, "/");
    if (!dir.endsWith("/")) dir += "/";
    return dir;
}

// Function to create the main window
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        icon: path.join(app.getAppPath(), "public_html/favicon.ico"),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false,
            preload: path.join(app.getAppPath(), "scripts/preload.js")
        }
    });

    Menu.setApplicationMenu(menu.create(mainWindow));

    addSeparator('menuView');
    addMenuItem('menuView', 'Settings window', showSettingsDlg);
   
    addSeparator('menuView');
    addMenuItem('menuView', 'TEST IPC', ()=>{
        ipcMain.handle("w2m_getScopeAsTXT_response", (event, data) => {
            console.log("3. (main.js) ipcMain.handle()");
            //DO SOMETHING
            return "OK";
        });

        console.log("1. (main.js) TEST_IPC menu");
        mainWindow.webContents.send("m2w_getScopeAsTXT_request","w2m_getScopeAsTXT_response");
    });

    mainWindow.loadFile(path.join(app.getAppPath(), "public_html/index.html"));

    let wc = mainWindow.webContents;
    if (DEVELOPEMENT_MODE) wc.openDevTools();

    appSettings.read();
    
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    mainWindow.maximize();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        app.quit();
});




/*****************************************************************************
 * 
 * Handlers for messages sent from web part of application
 * 
 ****************************************************************************/

ipcMain.handle("getSetting", (event, key) => {
    return settings.get("settings", key);
});

ipcMain.handle("setSettings", (event, pairs) => {
    if (pairs["externApps"] !== undefined){
        appSettings.externApps = pairs["externApps"];
    }
    
    if (pairs["workingDir"] !== undefined){
        let workDir = pairs["workingDir"];
        if (fs.existsSync(workDir)) {
            appSettings.workingDir = workDir;
            if (!appSettings.workingDir.endsWith("/")) appSettings.workingDir += "/";
            appSettings.save();
            rebuildExtRunMenu();
        } else {
            dialog.showMessageBox(mainWindow, {
                'type': 'question',
                'title': 'Confirmation',
                'message': 'Poroposed Working Dir not exists. Should I to create it?',
                'buttons': [ 'Yes', 'No' ]
            }).then((result) => {
                if (result.response === 0) {
                    fs.mkdirSync(workDir, { recursive: true });
                    if (fs.existsSync(workDir)) {
                        appSettings.workingDir = workDir;
                    } else {
                        // 
                        // To DO (?)
                        // (show info and not change dir) OR (show Settings window again)
                        //
                    }
                }

                if (!appSettings.workingDir.endsWith("/")) appSettings.workingDir += "/";
                appSettings.save();
                rebuildExtRunMenu();

                // Reply to the render process
                //mainWindow.webContents.send('dialogResponse', result.response);
            });
        }
    }
});

ipcMain.handle("runExternal", (event, data, extInfo) => {
    function run_script(command, args, callback) {
        mainWindow.webContents.send("showLoaderSplash");

        var child = child_process.spawn(command, args, {
            encoding: 'utf8',
            shell: true
        });
        
        // You can also use a variable to save the output for when the script closes later
        child.on('error', (error) => {
            mainWindow.webContents.send("hideLoaderSplash");
            dialog.showMessageBox({
                title: 'Title',
                type: 'warning',
                message: 'Error occured.\r\n' + error
            });
        });

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (data) => {
            // Return some data to the renderer process with the mainprocess-response ID
            //mainWindow.webContents.send('mainprocess-response', 'testData');

            //Here is the output
            data = data.toString();
            console.log("received:");
            console.log(data);
        });

        child.stderr.setEncoding('utf8');
        child.stderr.on('data', (data) => {
            //Here is the output from the command
            console.log("StdErr returned: ", data);
        });

        child.on('close', (code) => {
            //Here you can get the exit code of the script  
            switch (code) {
                case 0:
                    console.log("end of process!");
                    let mydata = dataFile.load(appSettings.workingDir+"resultFile.txt");
                    mainWindow.webContents.send('externalResult', mydata);
                    //              dialog.showMessageBox({
                    //                  title: 'Title',
                    //                  type: 'info',
                    //                  message: 'End process.\r\n'
                    //              });
                    break;
            }

        });
        if (typeof callback === 'function')
            callback();
    }
    
    let outPath = appSettings.workingDir+"sentFile.txt";
    let resultPath = appSettings.workingDir+"resultFile.txt";
    
    if ( (data===null) && (-1 !== extInfo.params.indexOf("{graph}") ) ) {
        // ERROR
        
    } else {
        let params = extInfo.params.replace('{graph}', outPath).replace('{result}', resultPath);

        if (data!==null) {
            dataFile.save(outPath, data);
        }

        child_process.chdir = appSettings.workingDir;

        run_script(extInfo.path, [params], null);
    }
});

ipcMain.handle("saveStringToFile", (event, string, fileName) => {
    if (dataFile.save(fileName, string)){
        //saved correctly
    }
    mainWindow.webContents.send('saveEnd');
});

ipcMain.handle('enableMenu', (event, id,enabled) => {
    if (typeof enabled==='undefined')
        enabled=true;
    
    let m = Menu.getApplicationMenu();
    if (typeof m !== 'undefined')
        m.getMenuItemById(id).enabled = enabled;
});

ipcMain.handle('addExtProgram', (event, _label,_path,_params) => {
    addExtProgram(_label,_path,_params);
});

ipcMain.handle('getDirectoryDlg', (event) => {
    return getDirectoryDialog();
});
