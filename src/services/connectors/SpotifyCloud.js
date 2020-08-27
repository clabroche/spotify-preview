import Spotify from 'spotify-web-api-js'
import { execSync } from 'child_process'
let spotify = new Spotify();

import Axios from 'axios'
/** @type {import('../Connector').DbusMusicInfos} */
let infos = {
  seekPosition: 0,
  isPlaying: false,
  albumArtist: '',
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
    const token = await pollOauth()
    windowopened.close()
    spotify.setAccessToken(token)

    const {devices} = await spotify.getMyDevices()

    console.log(devices[0].id)
    await spotify.transferMyPlayback([devices[0].id]).catch(err => console.log(err.response))
  },
  // Getter 
  async getSeekPosition() { return infos.seekPosition},
  async getIsPlaying() { return infos.isPlaying},
  async getVolume() { return infos.volume},
  async getTrackId() { return infos.trackid},
  async getArtURL() { return infos.artUrl },
  async getAlbum() { return infos.album},
  async getArtist() { return infos.artist},
  async getTitle() { return infos.title},
  
  // Action
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
      console.log(infos.isPlaying)
    }
  },
}

function pollOauth() {
  return new Promise((resolve) => {
    const interval = setInterval(async() => {
      const {data: token} = await Axios.get('http://localhost:5000/poll-token')
      if(token) {
        resolve(token)
        clearInterval(interval)
      }
    }, 1000);
  })
}

export default SpotifyCloud