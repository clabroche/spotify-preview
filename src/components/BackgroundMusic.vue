<template>
  <div class="background-music-root">
    <img :src="music.artUrl" alt="" srcset="">
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
.background-music-root {
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  z-index: -1;
  transition: 0.5s;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>