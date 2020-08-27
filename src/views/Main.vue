<template>
  <div class="hello">
    <transition name="fade">
      <background-music :key="music.artUrl"/>
    </transition>
    <overlay-infos/>
  </div>
</template>

<script>
import BackgroundMusicVue from '../components/BackgroundMusic.vue';
import OverlayInfosVue from '../components/OverlayInfos.vue';
import Connector from '../services/Connector';
export default {
  name: 'Main',
  components: {
    backgroundMusic: BackgroundMusicVue,
    overlayInfos: OverlayInfosVue
  },
  data() {
    return {
      music: Connector.music,
      openOverlay: false
    }
  },
  mounted() {
    Connector.update()
    this.interval = setInterval(() => Connector.update(), 1000);
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
