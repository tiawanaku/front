<template>

  <router-view />

</template>

<script>
export default {
  name: 'OutLoginLayout',
  data () {
    return {
      left: false,
      right: false,
      tramite: {}
    }
  },
  mounted () {
    document.addEventListener('contextmenu', event => event.preventDefault())
  },
  methods: {
    guardar () {

    }
  }
}
</script>

<style lang="scss">
.footer-fixed {
  position: fixed;
  bottom: 5px;
  right: 15px;
  font-size: 0.7rem;
}
.layout-form-subtitulo {
  font-size: 0.7rem;
  margin-top: -5px;
}
</style>
