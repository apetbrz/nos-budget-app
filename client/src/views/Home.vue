<template>
  <main>
    <div class="home" style="text-align:center">
      <img alt="Vue logo" src="../assets/logo.png">
      <HelloWorld msg="HOMEPAGE!"/>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>