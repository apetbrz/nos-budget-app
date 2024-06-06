<template>
  <div class="register main-element">
    <div class="form-element">
      <h1>New Account</h1>
    </div>
    <div class="form-element">
      <label for="username" class="form-label">Username</label>
      <input type="text" class="text-bar" id="username" v-model="username" placeholder="newuser" required/>
    </div>
    <div class="form-element">
      <label for="email" class="form-label">Email Address</label>
      <input type="email" class="text-bar" id="email" v-model="email" placeholder="name@example.com" required/>
    </div>
    <div class="form-element">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="text-bar" id="password" v-model="password" required/>
    </div>
    <div class="form-element form-button">
      <button class="btn" @click.prevent="onSubmit">Register</button>
    </div>
    <div class="form-element">
      <router-link to="/login">Already have an account?</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    let username = ref('');
    let email = ref('');
    let password = ref('');
    let store = useStore();
    let router = useRouter();

    function onSubmit(){
      store.dispatch('registerUser', {
        username: username.value,
        email: email.value,
        password: password.value
      }).then(res => {
        if(res.err){
          alert(res.err);
          return;
        }
        if(res.token){
          store.dispatch('updateUserDataFromToken', {token: res.token})
          .then((res) => {
            router.push('/home')
          });
        }
      });

    }

    return {
      username,
      email,
      password,
      onSubmit
    }
  }
}
</script>

<style scoped>
  .register {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 2rem;
    width: 100%;
  }


  .form-element {
    margin: 1rem;
    width: 32rem;
    align-self: center;
    color: var(--color-text);
  }
  
  .form-button {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>