<template>
  <div class="seek-root" @click.stop="seek" ref="seekRoot">
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
  },
  methods: {
    seek(ev) {
      console.log(ev)
      const offset = ev.offsetX
      const width = this.$refs.seekRoot.offsetWidth
      const percentage = offset * 100 / width
      const ms = percentage * this.music.duration / 100
      Connector.instance.setSeekPosition(ms)
    }
  }
}
</script>

<style lang="scss" scoped>
.seek-root {
  cursor: pointer;
  margin-top: 40px;
  width: 80%;
  height: 3px;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.4);
  transition: 100ms;
  &:hover {
    height: 10px;
  }
  .seek-bar {
    height: 100%;
    transition: 300ms;
    background-color: rgba(255,255,255,0.6);
    border-radius: 3px;
  }
} 
</style>