<template>
  <header>
    <nav class="navbar bg-dark">
      <div class="container">
        <a class="navbar-brand">nos-budget-app</a>
        <div class="nav">
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
        </div>
        <div class="user"
          v-if="!$store.getters.isAuthenticated">
          <router-link to="/login">Login</router-link>
        </div>
        <div class="user"
          v-if="$store.getters.isAuthenticated">
          <a>TODO:STATE-USERNAME</a>
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