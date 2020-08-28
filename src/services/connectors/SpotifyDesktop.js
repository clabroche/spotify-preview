import {execSync} from 'child_process'
import sdk from '../sdkConnector'

/** @type {import('../Connector').DbusMusicInfos} */
let infos = {
  seekPosition: 0,
  isPlaying: false,
  albumArtist: '',
  duration: -1,
  volume: -1,
  trackid: '',
  album: '',
  artUrl: '',
  artist: '',
  title: '',
  url: '',
}

/** @type {import('../Connector').ConnectorFunction} */
const SpotifyDesktop = {
  async init() { },
  // Getter
  async getSeekPosition() { return infos.seekPosition },
  async getIsPlaying() { 
    const status = execSync(`dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:'org.mpris.MediaPlayer2.Player' string:'PlaybackStatus'|egrep -A 1 "string"|cut -b 26-|cut -d '"' -f 1|egrep -v ^$`)
      .toString('utf-8')
      .trim()
    return status === 'Playing' 
  },
  async getDuration() { return infos.duration },
  async getVolume() { return infos.volume },
  async getTrackId() { return infos.trackid },
  async getArtURL() { return infos.artUrl },
  async getAlbum() { return infos.album },
  async getArtist() { return infos.artist },
  async getTitle() { return infos.title },

  // Actions
  async setSeekPosition(ms) {
    return ms
  },
  async backward () {
    execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous')
  },
  async pause() {
    execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause')
    infos.isPlaying = false
    sdk.forceUpdate.next()
  },
  async play() {
    execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause')
    infos.isPlaying = true
    sdk.forceUpdate.next()
  },
  async forward() {
    execSync('dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next')
  },
  async openSpotify() {
    execSync('wmctrl -x -a spotify.Spotify')
  },
  
  // Execute once before getter functions
  async tick() {
    infos = getInfos()
  }
}

export default SpotifyDesktop



function getInfos() {
  const res = execSync(`dbus-send \
  --print-reply \
  --dest=org.mpris.MediaPlayer2.spotify \
  /org/mpris/MediaPlayer2 \
  org.freedesktop.DBus.Properties.Get \
  string:"org.mpris.MediaPlayer2.Player" string:'Metadata' \
  `).toString('utf-8').replace('open.spotify.com', 'i.scdn.co')
  return formatDBUS(res)
}

function formatDBUS(string) {
  /** @type {import('../Connector').DbusMusicInfos} */
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
  obj.volume = +obj.volume
  obj.seekPosition = +obj.seekPosition
  return obj
}



