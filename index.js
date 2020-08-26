const electron = require('electron')
const {exec} = require('child_process')
const config = require('./config.json')
const path = require('path')
process.title = "spotify-preview.js"
let spotifyProcess

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

async function createWindow() {
  const screenElectron = electron.screen;
  const mainScreen = screenElectron.getPrimaryDisplay();
  const screen = mainScreen.size;
  
  mainWindow = new BrowserWindow({
    width: config.window.width ,
    height: config.window.height,
    x: screen.width,
    y: screen.height,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, 'build', 'icons', '256x256.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadURL(`file://${__dirname}/src/index.html`)
  mainWindow.on('closed', () => mainWindow = null)
  if(process.env.NODE_ENV === 'DEV') 
    mainWindow.webContents.openDevTools()
}




app.on('window-all-closed', function () {
  if(spotifyProcess) exec('pkill spotify')
  if (process.platform !== 'darwin') app.quit()
})

async function isSpotifyLaunched() {
  return new Promise(resolve => {
    exec(
      `dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:'org.mpris.MediaPlayer2.Player' string:'PlaybackStatus'`, 
      {timeout: 100}
      ,err => {
        if(err) return resolve(false)
        return resolve(true)
      }
    )
  });
}

(async _ => {
  if(!(await isSpotifyLaunched())) {
    spotifyProcess = exec('spotify', {killSignal: "SIGKILL"})
    setTimeout(createWindow, 1000)
  } else {
    app.on('ready', createWindow)
  }
})().catch(console.error)