<template>
  <q-layout class="q-pa-md error_404 column justify-center">
    <div class="row">
      <div class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-xs-12 text-center">
        <p class="no_encontrado">404</p>
        <p class="text-faded text-h4 text-white">Lo sentimos, no se encontro ese sitio...</p>
        <q-btn
          size="lg"
          color="white"
          outline
          style="width:300px;"
          @click="$router.go(-1)"
        >Go back</q-btn>
      </div>
    </div>
  </q-layout>
</template>

<script>
export default {
  name: 'Error404',
  mounted () {
    // this.$axios.logout()
  }
}
</script>
<style lang="scss">
.error_404 {
  background: $primary;
  background-size: cover;
  overflow-y: visible !important;
}
.no_encontrado {
  color: white;
  font-size: 180px;
  font-weight: bold;
  border: solid white;
}
</style>
