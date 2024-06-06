<template class="homepage">
  <div class="homepage">
    <Menu />
    <div class="view main-element">
      <div class="display">
        <div class="display-element">
          <h4>Expected Budget:</h4>
          <h5>{{ $store.getters.userjson.expectedBudget }}</h5>
        </div>
        <div class="display-element">
          <h4>Expected Expenses:</h4>
          <h5>{{ $store.getters.userjson.expectedExpenses }}</h5>
        </div>
        <div class="display-element">
          <h4>Remaining Balance:</h4>
          <h5>{{ $store.getters.userjson.remainingBalance }}</h5>
        </div>
        <div class="display-element">
          <h4>Latest Paycheck:</h4>
          <h5>{{ $store.getters.username }}</h5>
        </div>
        <div class="display-element">
          <h4>Latest Expense:</h4>
          <h5>{{ $store.getters.username }}</h5>
        </div>
        <div class="display-element">
          <h4>Current Expense Savings:</h4>
          <h5>{{ $store.getters.username }}</h5>
        </div>
      </div>
      <div class="input">
        <input type="text" class="text-bar" v-model="command"></input>
        <button class="btn submit" @click.prevent="onSubmit">enter</button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from '@/components/Menu.vue'
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import budget from '../utils/budget';

export default {
  name: 'Home',
  setup() {
    onMounted(() => {
      console.log("homepage mounted");
    });
    
    let command = ref('');
    let store = useStore();

    function onSubmit(){

      store.dispatch('runBudgetCommand', command);

    }

    return {
      command,
      onSubmit,
      onMounted
    }
  },
  components: {
    Menu
  }
}
</script>

<style scoped>

.homepage {
  display: grid;
  grid-template-areas:
    'sidebar view';
  grid-template-rows: 100%;
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
}

Menu {
  grid-area: sidebar;
}

.view {
  grid-area: view;
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

.display-element {
  padding: 2rem;
  background-color: var(--color-border);
  border-radius: var(--corner-radius);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.display-element h4 {
  text-align: center;
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
  margin: 0;
}

</style>