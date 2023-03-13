// Modules to control application life and create native browser window
const {app, BrowserWindow, session, Menu} = require("electron");
const path = require("path");
const {ipcMain} = require("electron");
const {net} = require("electron");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const axios = require("axios");
const got = (...args) => import("got").then(({ default: got }) => got(...args));
const {dialog} = require("electron");
const {shell} = require("electron");
var execFile = require('child_process').execFile;
const child_process = require('child_process');
const dataFile = require(path.join(app.getAppPath(), 'scripts/workers/dataFile.js'));
const settings = require(path.join(app.getAppPath(), 'scripts/workers/settings.js'));
const menu = require(path.join(app.getAppPath(), 'scripts/workers/mainMenu.js'));
const {MenuItem} = require("electron");
const fs = require('fs');
const os = require('os');

const isMac = process.platform === 'darwin';

//vvvvvv SETTINGS
var extBinDir;// = 'd:/test/';
var externalRun = [];
//^^^^^  SETTINGS

var mainWindow;
let icounter = 0;


var showSettingsDlg = function () {
    mainWindow.webContents.send('showSettings',externalRun,extBinDir);
};

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

function rebuildExtRunMenu() {
    let m = Menu.getApplicationMenu();
    if (typeof m !== 'undefined'){
        var rm = m.getMenuItemById('menuRun');
        rm.submenu.clear();
        
        for (const exr of externalRun) {
            let item = addMenuItem('menuRun', exr.label, () => {
                mainWindow.webContents.send('runExternal',exr);
            });
        }    
    }
}



function getDirectoryDialog() {
    let dir = dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] });
    //console.log(dir);
    dir = dir[0].replace(/\\/g, "/");
    if (!dir.endsWith("/")) dir += "/";
    return dir;
}



function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        icon: path.join(app.getAppPath(), "public_html/favicon.ico"),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(app.getAppPath(), "scripts/preload.js")
        }
    });


    Menu.setApplicationMenu(menu.create(mainWindow));

    addSeparator('menuView');
    addMenuItem('menuView', 'Settings window', showSettingsDlg);

    mainWindow.loadFile(path.join(app.getAppPath(), "public_html/index.html"));

    let wc = mainWindow.webContents;
    wc.openDevTools();

    readSettings();
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

ipcMain.handle("settingsEdited", (event, extInfo, workDir) => {
    externalRun = extInfo;

    if (fs.existsSync(workDir)) {
        extBinDir = workDir;
        if (!extBinDir.endsWith("/")) extBinDir += "/";
        saveSettings();
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
                    extBinDir = workDir;
                } else {
                    // 
                    // To DO (?)
                    // (show info and not change dir) OR (show Settings window again)
                    //
                }
            }

            if (!extBinDir.endsWith("/")) extBinDir += "/";
            saveSettings();
            rebuildExtRunMenu();
            
            // Reply to the render process
            //mainWindow.webContents.send('dialogResponse', result.response);
        });
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
                    let mydata = dataFile.load(extBinDir+"resultFile.txt");
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
    
    let outPath = extBinDir+"sentFile.txt";
    let resultPath = extBinDir+"resultFile.txt";
    
    if ( (data===null) && (-1 !== extInfo.params.indexOf("{graph}") ) ) {
        // ERROR
        
    } else {
        let params = extInfo.params.replace('{graph}', outPath).replace('{result}', resultPath);

        if (data!==null) {
            dataFile.save(outPath, data);
        }

        child_process.chdir = extBinDir;

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

function readSettings() {
    let temp = settings.get('settings', 'externalRun');
    
    if (temp!==null) {
        externalRun = temp;
    } else {
        externalRun = [
            { "label":"Demo","path":"python bin/externalProg.py","params":"-i {graph} -o {result}" }
        ];    
    }
    
    let temp2 = settings.get('settings', 'workingDir');
    if (temp2!==null) {
        extBinDir = temp2;
        if (! fs.existsSync(extBinDir)) {
            //extBinDir = app.getAppPath().replace(/\\/g, "/");
            extBinDir = os.tmpdir().replace(/\\/g, "/");
        }
    } else {
        //extBinDir = app.getAppPath().replace(/\\/g, "/");
        extBinDir = os.tmpdir().replace(/\\/g, "/");
    }
    
    if (!extBinDir.endsWith("/")) extBinDir += "/";
    saveSettings();
    rebuildExtRunMenu();
}

function saveSettings() {
    settings.set('settings', 'workingDir', extBinDir);
    settings.set('settings', 'externalRun', externalRun);
}


