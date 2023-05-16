// store.js
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null,
      isLoggedIn: !!localStorage.getItem('user')
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    user: state => state.user
  }
});

export default store;