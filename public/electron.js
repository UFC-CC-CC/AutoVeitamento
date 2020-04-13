const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const os = require('os');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 600, height: 500, minHeight: 100, minWidth: 100, title: "Carregando...", icon: path.join(__dirname,"icons/icone.png")});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.maximize();
}




app.on('ready', ()=>{
  // EXTENSÕES: ATIVAR APENAS NO MEU NOTEBOOK LINUX (que este descanse em paz :( )
 
  createWindow();
  /*
  try{
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
    );
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.5.0_0')
    );
  }
  catch (e){
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '/.config/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.4.0_0')
    );
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '/.config/chromium/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
    );
  }*/

} );

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


