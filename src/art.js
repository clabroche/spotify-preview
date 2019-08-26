const {execSync} = require('child_process')
const axios = require('axios').default
async function getInfos() {
  const res = execSync(`dbus-send                                                                   \
  --print-reply                                        \
  --dest=org.mpris.MediaPlayer2.spotify                                                 \
  /org/mpris/MediaPlayer2                                                                   \
  org.freedesktop.DBus.Properties.Get                                         \
  string:"org.mpris.MediaPlayer2.Player" string:'Metadata'                                         \
  `).toString('utf-8').replace('open.spotify.com', 'i.scdn.co')
  return formatDBUS(res)
}
module.exports = {
  getInfos
}

function formatDBUS(string) {
  const obj = {}
  string.split('dict entry(').filter(a => a.includes('mpris') || a.includes('xesam')).map(a => {
    const split = a.split('variant')
    const regexKey = new RegExp(/.*(mpris|xesam):(.*)"/).exec(split[0].trim())
    const regexValue = new RegExp(/.*(string|uint64|array) "(.*)"/).exec(split[1].trim())
    if(regexKey && regexKey[2] && regexValue && regexValue[2]) {
      const key = regexKey[2]
      const value = regexValue[2]
      obj[key] = value
    }
  })
  return obj
}

console.log(getInfos())