<template>
  <div class="home" style="text-align:center">
    <img alt="Logo" src="../assets/logo.png">
    <h1>The Simple, Command-Based Budgeting Solution</h1>
    <div>
      <h3>Created by Arthur Petroff</h3>
    </div>
  </div>
</template>

<style scoped>
.home {
  background-color: var(--color-background-mute);
  border-radius: var(--corner-radius);
  padding: 3rem;
}

h1 {
  margin: 2rem;
}

h3 {
  margin: 2rem;
}
</style>

<script>
// @ is an alias to /src
export default {
  name: 'Welcome',
  components: {
  }
}
</script>