<template>
  <header>
    <nav class="navbar">
      <div class="container">
        <router-link class="navbar-brand" to="/">nos-budget-app</router-link>
        <div class="nav">
          <router-link to="/home">Home</router-link>
          <router-link to="/about">About</router-link>
        </div>
        <div class="user"
          v-if="!$store.getters.token">
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
        </div>
        <div class="user"
          v-if="$store.getters.token">
          <a>{{$store.getters.username}}</a>
        </div>
      </div>
    </nav>
  </header>
  <menu>
    <Menu />
  </menu>
  <main>
    <router-view/>
  </main>
</template>

<script>
import Menu from '@/components/Menu.vue'
import store from './store'

if(store.getters.token && !store.getters.username){
  store.commit('setUserFromToken', store.getters.token);
}

export default {
  name: 'App',
  components: {
    Menu
  }
}
</script>

<style scoped>

.navbar .container {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  gap: 2rem;
}

.navbar-brand {
  color: var(--vt-c-white);
  font-size: 2rem;
  padding: 1rem;
}

.user {
  flex-grow: 8;
  display: flex;
  justify-content: flex-end;
  padding: 0 2rem;
}

nav {
  padding: 2rem;
}

nav a {
  font-weight: bold;
  color: var(--vt-c-text-dark-2);
}

nav a.router-link-exact-active {
  color: var(--vt-c-text-dark-1);
}
</style>