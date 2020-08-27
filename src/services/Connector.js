import { reactive } from 'vue'
import sdkConnector from './sdkConnector'

function Connector() {
  /** @type {ConnectorFunction} */
  this.instance = null
  /** @type {DbusMusicInfos} */
  this.music = reactive({
    seekPosition: 0,
    isPlaying: false,
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
  await this.instance.init()
  sdkConnector.forceUpdate.subscribe(async () => {
    await this.update()
  })
  return this.update()
}
Connector.prototype.update = async function () {
  await this.instance.tick()

  this.music.seekPosition = await this.instance.getSeekPosition()
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
  * @property {function(): Promise<void>} init
  * 
  * @property {function(): Promise<number>} getSeekPosition
  * @property {function(): Promise<boolean>} getIsPlaying
  * @property {function(): Promise<number>} getVolume
  * @property {function(): Promise<string>} getArtURL
  * @property {function(): Promise<string>} getTrackId
  * @property {function(): Promise<string>} getAlbum
  * @property {function(): Promise<string>} getArtist
  * @property {function(): Promise<string>} getTitle
  * 
  * @property {function(): Promise<void>} openSpotify
  * @property {function(): Promise<void>} backward
  * @property {function(): Promise<void>} forward
  * @property {function(): Promise<void>} pause
  * @property {function(): Promise<void>} play
  * @property {function(): Promise<void>} play
  * 
  * @property {function(): Promise<void>} tick
  */