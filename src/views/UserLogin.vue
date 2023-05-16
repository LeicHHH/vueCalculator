<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label>
        Username:
        <input type="text" v-model="user.username" required>
      </label>
      <label>
        Password:
        <input type="password" v-model="user.password" required>
      </label>
      <button type="submit">Login</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import axios from '@/axios.js';

export default {
  name: 'UserLogin',
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      message: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/login', this.user);
        this.message = response.data.message;
        const user = response.data.user;
        console.log(user)
        // Set the session ID received from the server
        const sessionId = response.headers['Set-Cookie'];
        document.cookie = sessionId;

        this.$store.dispatch('setUser', user);
        this.$router.push('/calculator');
      } catch (error) {
        if (error.response) {
          this.message = error.response.data.message;
          console.log(error.response.data.message)
        } else {
          this.message = 'An error occurred while logging in.';
        }
      }
    }
  }
};
</script>