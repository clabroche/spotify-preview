<template>
  <div class="overlay">
    <open-spotify></open-spotify>
    <play-actions></play-actions>
    <music-infos></music-infos>
    <seek></seek>
  </div>  
</template>

<script>
import connector from '../services/Connector'
import PlayActionsVue from './PlayActions.vue'
import OpenSpotifyVue from './OpenSpotify.vue'
import MusicInfosVue from './MusicInfos.vue'
import SeekVue from './Seek.vue'
export default {
  components: {
    playActions: PlayActionsVue,
    musicInfos: MusicInfosVue,
    openSpotify: OpenSpotifyVue,
    seek: SeekVue
  },
  data() {
    return {
      connector
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  transition: 300ms;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  &:hover {
    opacity: 1;
  }
  @supports (backdrop-filter: blur(10px)) {
    & {
      backdrop-filter: blur(10px);
    }
  }
}
</style>