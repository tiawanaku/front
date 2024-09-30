<template>
  <section>
    <q-dialog v-model="dialogComputed">
      <q-card>
        <q-card-section>
          <q-input
            label="Nombre "
            v-model="nombreComputed"
          ></q-input>
        </q-card-section>
        <q-card-actions>
          <q-btn
            label="Cerrar"
            @click="cerrarModal()"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>
<script>
import { createComputed } from '../../common/utils'

export default {
  props: {
    nombre: {
      type: String,
      default: 'Ivan'
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogComputed: createComputed('dialog'),
    nombreComputed: createComputed('nombre')
  },
  methods: {
    cerrarModal () {
      this.dialogComputed = false
    }
  },
  beforeMount () {
  },
  mounted () {
  },
  data () {
    return {
    }
  }
}
</script>
