<template>
  <div class="open-spotify-root">
    <button-cmp v-if="!error" @click="openSpotify"><i class="fas fa-external-link-alt" aria-hidden="true"></i></button-cmp>
    <div v-else class="error">{{error}}</div>
  </div>
</template>

<script>
import ButtonVue from './Button.vue'
import music from '../services/music'
import commandExists from 'command-exists';

export default {
  components: {
    buttonCmp: ButtonVue
  },
  data() {
    return {
      error: ''
    }
  },
  methods: {
    openSpotify() {
      const isCommandExists = commandExists.sync('wmctrl') 
      if(!isCommandExists) {
        this.error = 'Please install wmctrl'
        setTimeout(() => this.error = '', 1000);
        return 
      }
      music.openSpotify()
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.open-spotify-root {
  position: fixed;
  top: 30px;
  right: 30px;
  .error {
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>