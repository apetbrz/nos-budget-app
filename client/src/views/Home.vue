<template>
  <div class="view">
    <div class="home" style="text-align:center">
      <img alt="Vue logo" src="../assets/logo.png">
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.view {
  display: grid;

  background-color: var(--color-background-mute);
  border-radius: var(--corner-radius);
  padding: 2rem;
}
</style>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  components: {
  }
}
</script>