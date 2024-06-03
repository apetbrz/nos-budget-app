<template>
  <div class="view main-element">
    <div class="display">
      <div>Current Balance: {{ $store.getters.username }}</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
    </div>
    <div class="input">
      <input type="text" class="text-bar"></input>
      <button class="submit">enter</button>
    </div>
    </div>
</template>

<style scoped>

.view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.display {
  display: grid;
  grid-template: repeat(2, 1fr)/ repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem;
}

.display div {
  padding: 2rem;
  background-color: var(--color-border);
  border-radius: var(--corner-radius);
}

.input {
  display: flex;
  justify-content: space-between;
  width: 60%;
}

.text-bar {
  width: 100%;
  border-radius: var(--corner-radius) 0 0 var(--corner-radius);
  border-width: 2px 0 2px 2px;
}

.submit {
  width: 15%;
  border-radius: 0 var(--corner-radius) var(--corner-radius) 0;
  border-width: 2px 2px 2px 0;
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