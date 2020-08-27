<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Connector from './services/Connector'

export default {
  mounted() {
    if(!Connector.instance) this.$router.push({name: 'connector-chooser'})
    else this.$router.push({name: 'main'})
  }
}
</script>

<style>
@import url('~@fortawesome/fontawesome-free/css/all.min.css');

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
