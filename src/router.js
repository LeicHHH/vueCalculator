// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import store from './store/store';
import Login from './views/UserLogin.vue';
import Calculator from './views/UserCalculator.vue';


const routes = [
  {
    path: '/',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/calculator',
    component: Calculator,
    meta: {
      requiresAuth: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.isLoggedIn) {
      next({
        path: '/login',
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (store.state.isLoggedIn) {
      next({
        path: '/calculator',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
