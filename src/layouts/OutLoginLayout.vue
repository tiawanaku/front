<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'OutLoginLayout',
  data () {
    return {}
  },
  mounted () {
    document.addEventListener('contextmenu', event => event.preventDefault())
  }
}
</script>
