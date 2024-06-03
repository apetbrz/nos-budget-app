<template>
  <div class="home" style="text-align:center">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<style scoped>
.home {
  background-color: var(--color-background-mute);
  border-radius: var(--corner-radius);
  padding: 2rem;
}
</style>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Welcome',
  components: {
    HelloWorld
  }
}
</script>