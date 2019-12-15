const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const path = require('path');

require('dotenv').config();

// Enable logging for electron-updater
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "debug" // "info"

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800 * 2,
    height: 600 * 2,
    frame: false, // FALSE!
    webPreferences: {
      sandbox: true, // SECURITY - SHOULD BE TRUE!
      contextIsolation: false, // SECURITY - SHOULD BE TRUE!
      /**
       * TODO: ContextIsolation should be set to TRUE! However, there seem to be a bug in electron
       * that prevents the example in the docs from working (https://electronjs.org/docs/api/process#event-loaded)
       *
       * See the answer in this thread: https://stackoverflow.com/questions/57821060/electron-how-to-securely-inject-global-variable-into-browserwindow-browservie
       */
      nodeIntegration: false,
      webviewTag: false,
      preload: path.join(__dirname, './preload.js')
    }
  });

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open the DevTools.
  if (isDev) win.webContents.openDevTools();

  // Dummy test event
  // win.on('focus', () => {
  //   console.log('foo-cus!');
  //   win.webContents.send('foo');
  // });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  autoUpdater.checkForUpdates().catch(err => console.log(err));
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// Event for fetching version number (consumed in preload.js)
ipcMain.on('app_version', event => {
  event.sender.send('app_version', { version: app.getVersion() });
});

// Auto-Updating
autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});

// Quit and Install Update
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
