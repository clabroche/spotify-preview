<template>
  <div class="connector-chooser-card-root">
    <div class="wrapper" @click.stop="click">
      <div class="icon"><i :class="icon"></i></div>  
      <div class="text">{{text}}</div>  
    </div>
    <div class="oauth" v-if="oauthOpen" @click.stop="">
      <label for="">Client ID</label>
      <input type="text" v-model="client_id">
      <label for="">Client Secret</label>
      <input type="text" v-model="client_secret">
      <button @click="validateOauth" :disabled="!client_id || !client_secret">Validate</button>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    needOauth: {default: false, required: true},
    icon: {default: '', required: true},
    text: {default: '', required: true}
  },
  data() {
    return {
      oauthOpen: false,
      client_id: localStorage.getItem('client_id'),
      client_secret: localStorage.getItem('client_secret')
    }
  },
  mounted() {
  },
  methods: {
    validateOauth() {
      localStorage.setItem('client_id', this.client_id)
      localStorage.setItem('client_secret', this.client_secret)
      this.$emit('click')
    },
    click() {
      if(this.needOauth && (!this.client_id || !this.client_secret)) return this.oauthOpen = true
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.oauth {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
}
.wrapper {
  width: 100px;
  margin: 10px;
}
</style>