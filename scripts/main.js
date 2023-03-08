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
const menu = require(path.join(app.getAppPath(), 'scripts/workers/mainMenu.js'));

const isMac = process.platform === 'darwin';

const extBinDir = 'd:\\test\\';

var mainWindow;
let icounter = 0;
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

    mainWindow.loadFile(path.join(app.getAppPath(), "public_html/index.html"));

    let wc = mainWindow.webContents;
    //wc.openDevTools();


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


ipcMain.handle("runExternal", (event, data) => {
    dataFile.save(extBinDir+"sentFile.txt", data);

    child_process.chdir = extBinDir;
    run_script("python", ["bin/externalProg.py", "-i "+extBinDir+"sentFile.txt", "-o "+extBinDir+"resultFile.txt"], null);
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


function run_script(command, args, callback) {
    var child = child_process.spawn(command, args, {
        encoding: 'utf8',
        shell: true
    });
    // You can also use a variable to save the output for when the script closes later
    child.on('error', (error) => {
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


