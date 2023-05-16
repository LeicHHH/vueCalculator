<!-- src/components/SignOut.vue -->
<template>
  <div>
    <button @click="signout">Sign Out</button>
  </div>
</template>

<script>
import axios from '@/axios.js';

export default {
  name: 'UserSignOut',
  methods: {
    async signout() {
      try {
        await axios.post('/logout');
        this.$store.dispatch('logout');
        this.$router.push('/');
        // TODO: Handle successful sign out
      } catch (error) {
        // TODO: Handle error
      }
    }
  }
}
</script>
