<template>
  <div class="seek-root">
    <div class="seek-bar" :style="{width: percentage+ '%'}"></div>
  </div>
</template>

<script>
import Connector from '../services/Connector'
export default {
  data() {
    return {
      music: Connector.music
    }
  },
  computed: {
    percentage() {
      return this.music.seekPosition * 100 / this.music.duration
    }
  }
}
</script>

<style lang="scss" scoped>
.seek-root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  .seek-bar {
    background-color: rgba(0, 0, 0, 0.2);
    @supports (backdrop-filter: blur(2px)) {
      & {
        backdrop-filter: blur(2px);
      }
    }
    height: 100%;
    transition: 300ms;
  }
} 
</style>