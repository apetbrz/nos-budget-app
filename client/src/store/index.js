import { Store, createStore } from 'vuex'
import { postJson } from '../utils/http';
import { Budget } from '../utils/budget'; 

export default createStore({
  /**
   * state: locally stored data
   *   token: user authentication token
   *   user: user data as a json object (from data table of database)
   */
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
    },
    userjson(state) {
      return state.user === null ? null : JSON.parse(state.user).jsondata;
    }
  },
  mutations: {
    /**
     * setToken(): stores authentication token locally
     * @param { Store } state
     * @param { string } value auth token
     */
    setToken(state, value){
      localStorage.setItem('auth-token', value);
      state.token = value;
    },

    /**
     * setUserFromServerJsonData(): takes user data from database and loads it to storage
     * @param { Store } state 
     * @param { any } data json data
     */
    setUserFromServerJsonData(state, data){
      if(data.jsondata === '') data.jsondata = new Budget;
      let userString = JSON.stringify(data);
      localStorage.setItem('user-info', userString);
      state.user = userString;
    },

    /**
     * updateUserJsonData(): replaces user jsondata in local storage
     * @param { Store } state 
     * @param { any } data new json data
     */
    updateUserJsonData(state, data){
      let userData = state.getters.user;
      userData.jsondata = data;
      state.user = JSON.stringify(userData);
      localStorage.setItem('user-info', state.user);
    },

    /**
     * updateUserJsonDataValue(): updates a target value in user jsondata in local storage
     * @param { Store } state 
     * @param { string } key target key in json data
     * @param { any } value new value for target key
     */
    updateUserJsonDataValue(state, key, value){
      let userData = state.getters.user;
      userData.jsondata[`${key}`] = value;
      state.user = JSON.stringify(userData);
      localStorage.setItem('user-info', state.user);
    },

    /**
     * logOut(): clears local storage of user data and token
     * @param { Store } state 
     */
    logOut(state){
      state.token = null;
      state.user = null;
    }
  },
  actions: {
    /**
     * registerUser(): sends user registration data to server
     * @param { Store } context 
     * @param { {username: string, email: string, password: string} } data 
     * @returns
     */
    registerUser(context, data) {
      return postJson({
        url: '/register',
        data
      }).then(res => res.json()).then((obj) => {
        if(obj.token){
          context.commit('setToken', obj.token);
        }
        return obj;
      });
    },
    
    /**
     * loginUser(): sends user login data to server
     * @param { Store } context 
     * @param { {email: string, password: string} } data 
     * @returns
     */
    loginUser(context, data) {
      return postJson({
        url: '/login',
        data
      }).then(res => res.json()).then((obj) => {
        if(obj.token){
          context.commit('setToken', obj.token);
        }
        return obj;
      });
    },

    /**
     * updateUserDataFromToken(): grabs user from database on server and stores it locally
     * @param { Store } context 
     * @param { {token: string} } token auth token
     * @returns 
     */
    updateUserDataFromToken(context, data){
      return postJson({
        url: '/user-query',
        data
      }).then(res => res.json()).then((obj) => {
        if(obj.err){
          console.log(obj.err);
          return;
        }
        context.commit('setUserFromServerJsonData', obj);
      });
    },

    /**
     * logOut(): clears local storage and sets user state data to null
     * @param { Store } context 
     * @returns 
     */
    logOut(context) {
      return new Promise((resolve, reject) => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-info");
        context.commit('logOut');
        resolve();
      });
    },
    
    /**
     * runBudgetCommand(): runs a user command on locally stored data, and sends updated data to server
     * @param { Store } context
     * @param { string } command
     * @returns { string | Error }
     */
    runBudgetCommand(context, command){
      
    }
  },
  modules: {
  }
})
