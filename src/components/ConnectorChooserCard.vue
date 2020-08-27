<template>
  <div class="connector-chooser-card-root">
    <div class="icon"><i :class="icon"></i></div>  
    <div class="text">{{text}}</div>  
  </div>  
</template>

<script>
export default {
  props: {
    icon: {default: '', required: true},
    text: {default: '', required: true}
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.connector-chooser-card-root {
  width: 100px;
  margin: 10px;
}
</style>