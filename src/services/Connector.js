import { reactive } from 'vue'
import sdkConnector from './sdkConnector'

function Connector() {
  /** @type {ConnectorFunction} */
  this.instance = null
  /** @type {DbusMusicInfos} */
  this.music = reactive({
    seekPosition: 0,
    isPlaying: false,
    duration: -1,
    volume: -1,
    trackid: '',
    album: '',
    artUrl: '',
    artist: '',
    title: '',
    url: '',
  })
}

/** @param {ConnectorFunction} connector */
Connector.prototype.setConnector = async function(connector) {
  this.instance = connector
  await this.instance.init(window)
  sdkConnector.forceUpdate.subscribe(async () => {
    await this.update()
  })
  return this.update()
}
Connector.prototype.update = async function () {
  await this.instance.tick()

  this.music.seekPosition = await this.instance.getSeekPosition()
  this.music.duration = await this.instance.getDuration()
  this.music.volume = await this.instance.getVolume()
  this.music.trackid = await this.instance.getTrackId()
  this.music.album = await this.instance.getAlbum()
  this.music.artUrl = await this.instance.getArtURL()
  this.music.artist = await this.instance.getArtist()
  this.music.title = await this.instance.getTitle()

  this.music.isPlaying = await this.instance.getIsPlaying()
}

export default reactive(new Connector())


/**
 * @typedef {Object} DbusMusicInfos
 * @property {number} seekPosition
 * @property {number} duration
 * @property {number} volume
 * @property {string} albumArtist
 * @property {boolean} isPlaying
 * @property {string} trackid
 * @property {string} album
 * @property {string} artUrl
 * @property {string} artist
 * @property {string} title
 * @property {string} url
 */

/**
  * @typedef {Object} ConnectorFunction
  * @property {function(Window): Promise<void>} init
  * 
  * @property {function(): Promise<number>} getSeekPosition
  * @property {function(): Promise<boolean>} getIsPlaying
  * @property {function(): Promise<number>} getDuration
  * @property {function(): Promise<number>} getVolume
  * @property {function(): Promise<string>} getArtURL
  * @property {function(): Promise<string>} getTrackId
  * @property {function(): Promise<string>} getAlbum
  * @property {function(): Promise<string>} getArtist
  * @property {function(): Promise<string>} getTitle
  * 
  * @property {function(number): Promise<any>} setSeekPosition
  * @property {function(): Promise<any>} openSpotify
  * @property {function(): Promise<any>} backward
  * @property {function(): Promise<any>} forward
  * @property {function(): Promise<any>} pause
  * @property {function(): Promise<any>} play
  * @property {function(): Promise<any>} play
  * 
  * @property {function(): Promise<any>} tick
  */