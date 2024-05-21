import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import './assets/main.css'

import Menu from '@/components/Menu.vue'

createApp(App).use(store).use(router).mount('#app');
