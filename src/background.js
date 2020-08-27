'use strict'
process.title = "spotify-preview.js"
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const config = require('./config.json')
const path = require('path')
const { exec } = require('child_process')
const isDevelopment = process.env.NODE_ENV !== 'production'
const electron = require('electron')
require('./oauth/server')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let spotifyProcess
function createWindow() {
  // Create the browser window.
  const screenElectron = electron.screen;
  const mainScreen = screenElectron.getPrimaryDisplay();
  const screen = mainScreen.size;
  win = new BrowserWindow({
    width: config.window.width,
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

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (spotifyProcess) exec('pkill spotify')
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  if (!(await isSpotifyLaunched())) {
    spotifyProcess = exec('spotify', { killSignal: "SIGKILL" })
    setTimeout(createWindow, 1000)
  } else {
    createWindow()
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


async function isSpotifyLaunched() {
  return new Promise(resolve => {
    exec(
      `dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:'org.mpris.MediaPlayer2.Player' string:'PlaybackStatus'`,
      { timeout: 100 }
      , err => {
        if (err) return resolve(false)
        return resolve(true)
      }
    )
  });
}
