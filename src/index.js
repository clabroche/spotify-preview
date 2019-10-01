const {ipcRenderer} = require('electron');
const wallpaper = require('./wallpaper')
const helpers = require('./helpers')
const {execSync} = require('child_process')
const subject = wallpaper.launch()
helpers.trigger()
subject.subscribe(helpers.trigger)

function setCorrectStatus() {
  const res = execSync(`dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:'org.mpris.MediaPlayer2.Player' string:'PlaybackStatus'|egrep -A 1 "string"|cut -b 26-|cut -d '"' -f 1|egrep -v ^$`).toString('utf-8').trim()
  const button = document.querySelector('#playPause i')
  if(res == 'Playing') {
    button.classList.replace('fa-play', 'fa-pause')
  } else {
    button.classList.replace('fa-pause', 'fa-play')
  }
}
setCorrectStatus()
function enlarge() {
  ipcRenderer.send('fullscreen')
}
function openSettings() {
  ipcRenderer.send('openSettings')
}

function openSpotify() {
  execSync('wmctrl -x -a spotify.Spotify')
}
function playPause() {
  execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause')
  setTimeout(_ => {
    setCorrectStatus()
  },50)
}

function previous() {
  execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous')
}

function next() {
  execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next')
}