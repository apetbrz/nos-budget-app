<template>
  <div class="login">
    <div class="form-element">
      <h1>Login</h1>
    </div>
    <div class="form-element">
      <label for="email" class="form-label">Email Address</label>
      <input type="email" class="form-control" id="email" v-model="email" placeholder="name@example.com"/>
    </div>
    <div class="form-element">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" v-model="password"/>
    </div>
    <div class="form-element form-button">
      <button class="btn" @click.prevent="onSubmit">Log in</button>
    </div>
    <div class="form-element">
      <router-link to="/register">Need an account?</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    let email = ref('');
    let password = ref('');
    let store = useStore();
    let router = useRouter();

    function onSubmit(){
      
      store.dispatch('loginUser', {
        email: email.value,
        password: password.value
      })
      .then(res => {
        if(res.err){
          alert(res.err);
          return;
        }
        if(res.token) router.push('/home');

      })

    }

    return {
      email,
      password,
      onSubmit
    }
  }
}
</script>

<style scoped>
  .login {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  }

  input {
    background-color: var(--color-background-soft);
    color: var(--color-text);
    outline: none;
    border: none;
  }
  input:focus {
    background-color: var(--color-background-mute);
    color: var(--color-text);
    outline: none;
    border: none;
    cursor: pointer;
  }

  button {
    background-color: var(--color-background-soft);
    color: var(--color-text);
  }

  .form-element {
    margin: 1rem 1rem 0rem 1rem;
    width: 32rem;
    align-self: center;
  }
  
  .form-button {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  ::placeholder {
    color: var(--color-text);
  }
</style>