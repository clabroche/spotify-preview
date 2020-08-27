// import Spotify from 'spotify-web-api-js'
// let spotify = new Spotify();

import Axios from 'axios'

/** @type {import('../Connector').ConnectorFunction} */
const SpotifyCloud = {
  async init() {
    console.log(window.location.href)
    const url = `http://localhost:5000/login?redirect_uri=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank')
    const token = await pollOauth()
    console.log(token)
  },
  // Getter 
  async getSeekPosition() { return 0},
  async getIsPlaying() { return false},
  async getVolume() { return 0},
  async getTrackId() { return ''},
  async getArtURL() {
    return ''
  },
  async getAlbum() { return ''},
  async getArtist() { return ''},
  async getTitle() { return ''},
  
  // Action
  async openSpotify() { },
  async backward() { },
  async forward() { },
  async pause() { },
  async play() { },
  
  // Execute once before getter functions
  async tick() { },
}

function pollOauth() {
  return new Promise((resolve) => {
    const interval = setInterval(async() => {
      const token = await Axios.get('http://localhost:5000/poll-token')
      if(token) {
        resolve(token)
      }
    }, 1000);
  })
}

export default SpotifyCloud