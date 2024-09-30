<template>
  <q-dialog
    :value="dialog"
    persistent
  >
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Reasignación de caso</div>
        <div class="text-h7">Se puede reasignar el caso indiferente del rol del usuario</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="col-xs-12">
          <span class="text-bold">Codigo: <span class="text-primary">{{ denuncia.codigoDenuncia }}</span></span>
        </div>
        <div class="col-xs-12">
          <span class="text-bold">Denominacion: </span>
        </div>
        <div class="col-xs-12">
          {{denuncia.denominacion}}
        </div>
      </q-card-section>
      <q-card-section class="row">
        <q-select
          v-model="asignacion.idUsuarioAsignado"
          :options="usuarios"
          label="Seleccione un usuario"
          filled
          class="col-md-12"
          emit-value
          map-options
          item
          option-label="usuario"
          option-value="id"
          @filter="filtrar"
          use-input
          options-selected-class="text-bold bg-grey-3"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label><span class="text-bold">{{ nombreCompleto(scope.opt) }} </span> <span> ({{ scope.opt.usuario }})</span></q-item-label>
                <q-item-label caption>{{ scope.opt.cargo }}</q-item-label>
                <q-item-label v-if="denuncia.slim">
                  <li v-for="(item, index) in scope.opt.slims" :key="index">
                    {{ item.nombre }}
                  </li>
                </q-item-label>
                <q-item-label v-if="denuncia.defensoria">
                  <li v-for="(item, index) in scope.opt.defensorias" :key="index">
                    {{ item.nombre }}
                  </li>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="negative"
          @click="$emit('cancelar')"
        />
        <q-btn
          label="Reasignar"
          color="primary"
          @click="reasignar"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>

import { mapState } from 'vuex'

export default {
  props: {
    dialog: {
      type: Boolean,
      default: true
    },
    denuncia: {
      type: Object,
      default: () => {
        return {
          id: -1,
          codigoDenuncia: 'COD-DEN-PRUEBA'
        }
      }
    }
  },
  data () {
    return {
      loading: false,
      usuarios: [],
      usuariosTemp: [],
      asignacion: {
        idDenuncia: this.denuncia.id
      }
    }
  },
  async mounted () {
    await this.getUsuarios()
  },
  methods: {
    async filtrar (val, update) {
      if (val === '') {
        await update(async () => {
          await this.getUsuarios()
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.usuarios = this.usuariosTemp.filter(v => this.nombreCompleto(v).toLowerCase().includes(needle) || v.cargo.toLowerCase().includes(needle))
      })
    },
    nombreCompleto (usuario) {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    },
    async getUsuarios () {
      const { rows } = await this.$axios.get(`system/usuarios?idProceso=${this.denuncia.idTipoProceso}`)
      this.usuarios = rows
      this.usuariosTemp = JSON.parse(JSON.stringify(rows))
    },
    async reasignar () {
      try {
        this.loading = true
        const envioData = { ...this.asignacion, rolActual: this.global.rolactual.id, idProceso: this.denuncia.idTipoProceso }
        const respuesta = await this.$axios.patch('denuncias/denuncia/reasignar', envioData)
        if (respuesta) {
          this.loading = false
          this.$emit('reasignado')
        }
      } catch (e) {
        this.loading = false
      }
    }
  },
  computed: {
    ...mapState(['global'])
  }
}
</script>
