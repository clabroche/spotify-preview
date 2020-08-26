<template>
  <div class="hello">
    <transition name="fade">
      <background-music :key="music.artUrl"/>
    </transition>
    <overlay-infos/>
  </div>
</template>

<script>
import music from '../services/music'
import BackgroundMusicVue from '../components/BackgroundMusic.vue';
import OverlayInfosVue from '../components/OverlayInfos.vue';
export default {
  name: 'Main',
  components: {
    backgroundMusic: BackgroundMusicVue,
    overlayInfos: OverlayInfosVue
  },
  data() {
    return {
      music,
      openOverlay: false
    }
  },
  mounted() {
    this.interval = setInterval(()=> {
      music.fetch()
      this.$forceUpdate()
    }, 1000);
  },
  unmounted() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
