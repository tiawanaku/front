<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  watch: {
    '$route' (to, from) {
      this.$store.commit('global/changeRoute', to.name)
      // if ((!this.$storage.exist('token') && !pageNoLogin.includes(to.name)) || to.name === 'login') {
      //   this.$axios.logout()
      // }
      // if (this.$storage.exist('token') && from.name === 'login') {
      //   this.$router.replace('/Dashboard')
      // }
    }
  }
}
</script>
