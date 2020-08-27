<template>
  <div class="play-actions">
    <button-cmp @click="backward"><i class="fas fa-backward" aria-hidden="true"></i></button-cmp>
    <button-cmp @click="pause" v-if="music.isPlaying"><i class="fas fa-pause" aria-hidden="true"></i></button-cmp>
    <button-cmp @click="play" v-else><i class="fas fa-play" aria-hidden="true"></i></button-cmp>
    <button-cmp @click="forward"><i class="fas fa-forward" aria-hidden="true"></i></button-cmp>
  </div>
</template>

<script>
import ButtonVue from './Button.vue'
import Connector from '../services/Connector'
export default {
  components: {
    buttonCmp: ButtonVue
  },
  data() {
    return {
      action: Connector.instance,
      music: Connector.music
    }
  },
  methods: {
    backward() {this.action.backward()},
    pause() {this.action.pause()},
    play() {this.action.play()},
    forward() {this.action.forward()},
  }
}
</script>

<style lang="scss" scoped>
.play-actions {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
}
</style>