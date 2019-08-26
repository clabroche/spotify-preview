const {ipcRenderer} = require('electron');
const wallpaper = require('./wallpaper')
const helpers = require('./helpers')

const subject = wallpaper.launch()
helpers.trigger()
subject.subscribe(helpers.trigger)



function enlarge() {
  ipcRenderer.send('fullscreen')
}
function openSettings() {
  ipcRenderer.send('openSettings')
}