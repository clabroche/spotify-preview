import Spotify from 'spotify-web-api-js'
import { execSync } from 'child_process'
let spotify = new Spotify();
import Axios from 'axios'
import sdkConnector from '../sdkConnector';
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
const SpotifyCloud = {
  async init(window) {
    const url = `http://localhost:5000/login?client_id=${localStorage.getItem('client_id')}&client_secret=${localStorage.getItem('client_secret')}`
    const windowopened = window.open(url, '_blank')
    await pollOauth()
    windowopened.close()

    const {devices} = await spotify.getMyDevices()
    if (devices[0]) {
      await spotify.transferMyPlayback([devices[0].id])
    }
  },
  // Getter 
  async getSeekPosition() { return infos.seekPosition},
  async getDuration() { return infos.duration },
  async getIsPlaying() { return infos.isPlaying},
  async getVolume() { return infos.volume},
  async getTrackId() { return infos.trackid},
  async getArtURL() { return infos.artUrl },
  async getAlbum() { return infos.album},
  async getArtist() { return infos.artist},
  async getTitle() { return infos.title},
  
  // Action
  async setSeekPosition(ms) {
    const seekPostion = Math.floor(ms)
    await spotify.seek(seekPostion)
    infos.seekPosition = seekPostion
    sdkConnector.forceUpdate.next()
  },
  async openSpotify() { execSync('wmctrl -x -a spotify.Spotify')},
  async backward() { return spotify.skipToPrevious()},
  async forward() { return spotify.skipToNext()},
  async pause() { 
    await spotify.pause()
  },
  async play() { 
    await spotify.play().catch(err => console.log(err.response))
  },
  
  // Execute once before getter functions
  async tick() {
    const track = await spotify.getMyCurrentPlayingTrack()
    if(track) {
      infos.album = track.item.album.name
      infos.artUrl = track.item.album.images[0].url
      infos.artist = track.item.artists[0].name
      infos.isPlaying = track.is_playing
      infos.seekPosition = track.progress_ms
      infos.title = track.item.name
      infos.duration = track.item.duration_ms
    }
  },
}

let interval
function pollOauth() {
  clearInterval(interval)
  return new Promise((resolve) => {
    interval = setInterval(async() => {
      const {data: tokenFromServer} = await Axios.get('http://localhost:5000/poll-token')
      if(tokenFromServer) {
        resolve(tokenFromServer)
        spotify.setAccessToken(tokenFromServer)
      }
    }, 1000);
  })
}

export default SpotifyCloud