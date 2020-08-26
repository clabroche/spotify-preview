import {execSync} from 'child_process'
import {reactive} from 'vue'
function Music() {
  this.album = ''
  this.albumArtist = ''
  this.artUrl = ''
  this.artist = ''
  this.title = ''
  this.trackid = ''
  this.url = ''
  this.isPlaying = false
}

Music.prototype.fetch = function() {
  this.isPlaying = loadIsPlaying()
  Object.assign(this, getInfos())
  console.log(this.isPlaying)
}

Music.prototype.backward = function() {
  execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous')
}
Music.prototype.pause = function() {
  console.log('pause')
  execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause')
  this.isPlaying = false
}
Music.prototype.play = function() {
  console.log('play')
  execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause')
  this.isPlaying = true
}
Music.prototype.forward = function() {
  execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next')
}
Music.prototype.openSpotify = async function() {
  execSync('wmctrl -x -a spotify.Spotify')
}

function getInfos() {
  const res = execSync(`dbus-send                                                                   \
  --print-reply                                        \
  --dest=org.mpris.MediaPlayer2.spotify                                                 \
  /org/mpris/MediaPlayer2                                                                   \
  org.freedesktop.DBus.Properties.Get                                         \
  string:"org.mpris.MediaPlayer2.Player" string:'Metadata'                                         \
  `).toString('utf-8').replace('open.spotify.com', 'i.scdn.co')
  return formatDBUS(res)
}

function formatDBUS(string) {
  /** @type {DbusMusicInfos} */
  const obj = {}
  string.split('dict entry(').filter(a => a.includes('mpris') || a.includes('xesam')).map(a => {
    const split = a.split('variant')
    const regexKey = new RegExp(/.*(mpris|xesam):(.*)"/).exec(split[0].trim())
    const regexValue = new RegExp(/.*(string|uint64|array) "(.*)"/).exec(split[1].trim())
    if (regexKey && regexKey[2] && regexValue && regexValue[2]) {
      const key = regexKey[2]
      const value = regexValue[2]
      obj[key] = value
    }
  })
  return obj
}
function loadIsPlaying () {
  const status = execSync(`dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:'org.mpris.MediaPlayer2.Player' string:'PlaybackStatus'|egrep -A 1 "string"|cut -b 26-|cut -d '"' -f 1|egrep -v ^$`)
    .toString('utf-8')
    .trim()
  return status === 'Playing'
}

export default reactive(new Music())


/**
 * @typedef {Object} DbusMusicInfos
 * @property {string} album
 * @property {string} albumArtist
 * @property {string} artUrl
 * @property {string} artist
 * @property {string} title
 * @property {string} trackid
 * @property {string} url
 */