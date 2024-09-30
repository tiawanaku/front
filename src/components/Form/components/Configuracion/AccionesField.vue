<template>
  <div
    class="form-group col-12"
    role="group"
    @click="$store.commit('global/setSeleccionado', posicion)"
  >
    <div class="row justify-center">
      <div class="col-xs-12 text-center">
        <q-btn
          icon="edit"
          color="secondary"
          round
          flat
        />
        <q-btn
          icon="delete"
          color="negative"
          round
          flat
        />
      </div>
    </div>
  </div>

</template>
<script>
export default {
  props: {
    posicion: { type: Object, default: () => ({}) }
  },
  data () {
    return {

    }
  }
}
</script>
