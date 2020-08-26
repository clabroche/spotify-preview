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
import music from '../services/music'
export default {
  components: {
    buttonCmp: ButtonVue
  },
  data() {
    return {
      music
    }
  },
  methods: {
    backward() {music.backward()},
    pause() {music.pause()},
    play() {music.play()},
    forward() {music.forward()},
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