const config = require('../config.json')
const Art = require('./art')
const { Subject } = require('rxjs')

const wallpaper = {}

wallpaper.launch = function() {
  const subject = new Subject()
  refresh()
  setInterval(_ => {
    refresh()
  }, config.interval);
  return subject
}
wallpaper.set = async function() {
  const art = await Art.getInfos()
  return art
}


let cache = ""
function refresh() {
  wallpaper.set().then(art => {
    if(cache !== art.trackid) {
      subject.next(art)
      cache = art.trackid
    }
  })
}
module.exports = wallpaper