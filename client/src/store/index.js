import { createStore } from 'vuex'
import { postJson } from '../utils/http';

export default createStore({
  state: {
    token: localStorage.getItem('auth-token'),
    user: localStorage.getItem('user-info')
  },
  getters: {
    token(state){
      return state.token;
    },
    username(state) {
      return state.user === null ? null : JSON.parse(state.user).username;
    },
    user(state) {
      return state.user === null ? null : JSON.parse(state.user); 
    }
  },
  mutations: {
    setToken(state, value){
      localStorage.setItem('auth-token', value);
      state.token = value;
    },
    setUserFromToken(state, value){
      postJson({
        url: '/user-query',
        data: {token: value}
      }).then(res => res.json()).then((obj) => {
        if(obj.err) console.log(obj.err);
        else{
          localStorage.setItem('user-info', JSON.stringify(obj));
          state.user = localStorage.getItem('user-info');
        }
      })
    }
  },
  actions: {
    registerUser(context, data) {
      return postJson({
        url: '/register',
        data
      }).then(res => res.json()).then((obj) => {
        if(obj.token){
          context.commit('setToken', obj.token);
          context.commit('setUserFromToken', obj.token);
        }
        return obj;
      });
    },
    loginUser(context, data) {
      return postJson({
        url: '/login',
        data
      }).then(res => res.json()).then((obj) => {
        if(obj.token){
          context.commit('setToken', obj.token);
          context.commit('setUserFromToken', obj.token);
        }
        return obj;
      });
    }
  },
  modules: {
  }
})
