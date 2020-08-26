<template>
  <div class="infos">
    <div class="title">{{music.title}}</div>
    <div class="album">{{music.album}}</div>
    <div class="artist">{{music.artist}}</div>
  </div>
</template>

<script>
import music from '../services/music'
export default {
  data() {
    return {
      music
    }
  }
}
</script>

<style lang="scss" scoped>
.infos {
  border-radius: 4px;
  padding: 10px;
  transition: 300ms;
  text-align: center;
  .title {
    font-weight: bold;
    padding-bottom: 10px;
    font-size: 1.2em;
  }
  .album {
    color: #BBBBBB;
    padding-bottom: 10px;
    font-size: 0.8em;;
  }
  .artist {
    color: #BBBBBB;
    font-weight: bold;
    font-size: 1em;
  }
}
</style>