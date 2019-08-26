const pathfs = require('path')
const config = require('../config.json')

const helpers = {
  trigger(infos) {
    if(!infos) return
    console.log(infos)
    const body = document.querySelector('body')
    const img = document.querySelector('img')
    img.classList.add('remove')
    
    const newImage = document.createElement("IMG");
    newImage.classList.add('insert')
    newImage.setAttribute('src', infos.artUrl)
    setTimeout(_ => img.remove(), config.interval)
    body.appendChild(newImage)

    setHtml('.title', infos.title)
    setHtml('.album', infos.album)
    setHtml('.artist', infos.artist)
  },
}

function setHtml(className, value) {
  const title = document.querySelector(className)
  title.innerHTML = ''
  const text = document.createElement("div");
  text.innerText = value
  title.appendChild(text)
}
module.exports = helpers