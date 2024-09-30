<template>
  <section>
    <q-dialog v-model="dialogComputed">
      <q-card style="width: 900px; max-width: 90vw;">
        <q-toolbar class="q-pa-md">
          <q-icon
            name="security"
            size="md"
          />
          <q-toolbar-title>
            Permisos del rol: {{ rol.nombre }}
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="dialogComputed = false"
          />
        </q-toolbar>
        <q-card-section
          class="row"
          v-if="permisos"
        >
          <div
            class="col-xs-12 col-sm-6 col-md-4"
            v-for="(permiso, index) of permisos"
            :key="index"
          >
            <q-toggle
              v-model="permiso.permitido"
              checked-icon="check"
              color="positive"
              unchecked-icon="clear"
              :label="permiso.nombre"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>
<script>
import { createComputed } from '@common/utils'

export default {
  props: {
    rol: {
      type: Object,
      default: () => ({})
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogComputed: createComputed('dialog')
  },
  data () {
    return {
      permisos: []
    }
  },
  async beforeUpdated () {
    await this.getPermisos()
  },
  methods: {
    async getPermisos () {
      this.permisos = null
      let url = 'system/roles/permisos'
      if (this.rol.id) {
        url += `?idRol=${this.rol.id}`
      }
      this.permisos = await this.$axios.get(url)
    }
  }
}
</script>
