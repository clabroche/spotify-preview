const electron = require('electron')

const fse = require('fs-extra')
const helpers = require('./src/helpers')
try { require('./config.json') }
catch (_) { fse.copyFileSync('./config.dist.json', 'config.json')}
const config = require('./config.json')

process.title = "wallpaper.js"
try {
  fse.mkdirSync(helpers.imgPath)
} catch (_) {}

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

async function createWindow() {
  var screenElectron = electron.screen;
  var mainScreen = screenElectron.getPrimaryDisplay();
  var screen = mainScreen.size;
  const sizePosition = {}
  if(!config.window.fullscreen) {
    sizePosition.width = config.window.width || 300
    sizePosition.height = config.window.height || 150
    sizePosition.x = screen.width - sizePosition.width;
    sizePosition.y = screen.height - sizePosition.height;
  } else {
    sizePosition.width = screen.width || 300
    sizePosition.height = screen.height || 150
    sizePosition.x = 0;
    sizePosition.y = 0;
  }
  mainWindow = new BrowserWindow({
    width: sizePosition.width ,
    height: sizePosition.height,
    x: sizePosition.x,
    y: sizePosition.y,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(`file://${__dirname}/src/index.html`)
  if(process.env.NODE_ENV) 
    mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  electron.ipcMain.on('fullscreen', (event, arg) => {
    const size = mainWindow.getSize();
    if (screen.width === size[0] + 1 && screen.height === size[1] + 1) {
      mainWindow.setSize(sizePosition.width, sizePosition.height);
      mainWindow.setPosition(sizePosition.x, sizePosition.y);
    } else {
      mainWindow.setPosition(0, 0);
      mainWindow.setSize(screen.width, screen.height);
    }
  })
  electron.ipcMain.on('openSettings', (event, arg) => {
    const settingWindow = new BrowserWindow({
      frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    })
    if (process.env.NODE_ENV)
      settingWindow.webContents.openDevTools()
    settingWindow.loadURL(`file://${__dirname}/src/settings.html`)
  })

  electron.ipcMain.on('reloadSize', (event, arg) => {
    const config = fse.readJSONSync(helpers.configPath)
    sizePosition.width = config.window.width || 300
    sizePosition.height = config.window.height || 150
    sizePosition.x = screen.width - sizePosition.width;
    sizePosition.y = screen.height - sizePosition.height;
    mainWindow.setSize(+sizePosition.width, +sizePosition.height);
  })
}

if (!config.window.hide) {
  app.on('ready', createWindow)
} else {
  const wallpaper = require('./src/wallpaper')
  wallpaper.launch()
}
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
