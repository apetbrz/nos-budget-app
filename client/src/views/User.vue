<template>
    <div class="display main-element">
        <h2>Your Account</h2>
        <h3>Username: {{ $store.getters.username }}</h3>
        <button class="btn" @click.prevent="logOut">Log Out</button>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'

export default {
    name: 'User',
    setup() {
        let store = useStore();
        let router = useRouter();

        function logOut(){
            store.dispatch("logOut")
            .then(router.push("/"));
        }

        return{
            logOut
        }
    }
}
</script>

<style scoped>

.display{
    text-align: center;
}

</style>