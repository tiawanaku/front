<template>
  <section>
    <q-dialog
      v-model="dialog"
      @before-show="inicializarDatos"
    >
      <q-card style="width: 500px; max-width: 90vw;">
        <q-toolbar class="text-primary q-pa-md">
          <q-icon
            name="cancel"
            size="md"
          />
          <q-toolbar-title>
            <span> Concluir caso</span>
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="closeModal"
          />
        </q-toolbar>
        <q-card-section>
          <q-banner class="bg-amber-1 text-warning">
            <div class="row">
              <div class="col-xs-12 text-center">
                <q-icon
                  name="warning"
                  size="70px"
                  color="warning"
                />
              </div>
              <div class="col-xs-12 text-center">
                <p class="text-bold text-warning">¿Esta seguro de CONCLUIR la denuncia?. </p>
                <p class="text-bold  text-negative">Esta denuncia NO sera parte de los reportes ni los resultados de busqueda.</p>
              </div>
            </div>
          </q-banner>
        </q-card-section>
        <q-card-section>
          <q-form
            class="row  q-col-gutter-md"
            @submit="guardar"
          >
            <q-select
              :options="tiposConclusion"
              label="Tipo de conclusión"
              filled
              class="col-xs-12"
              v-model="datosCasoConcluido.idTipoConclusion"
              :rules="datosCasoConcluidoRules.idTipoConclusion"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="format_list_bulleted" />
              </template>
            </q-select>
            <q-select
              v-if="tiposConclusionHijos.length > 0"
              :options="tiposConclusionHijos"
              label="Tipo de conclusión otro"
              filled
              class="col-xs-12"
              v-model="datosCasoConcluido.idTipoConclusionHijo"
              :rules="datosCasoConcluidoRules.idTipoConclusionHijo"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="format_list_bulleted" />
              </template>
            </q-select>
            <q-input
              clearable
              type="textarea"
              class="col-xs-12"
              filled
              label="Justificación"
              v-model="datosCasoConcluido.justificacionCasoConcluido"
            >
              <template v-slot:prepend>
                <q-icon name="draw" />
              </template>
            </q-input>
            <div class="col-xs-12 q-gutter-xs text-right">
              <q-btn
                label="Cancelar"
                icon="cancel"
                @click="closeModal"
              />
              <q-btn
                type="submit"
                color="primary"
                label="Aceptar"
                icon="done_all"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-btn
      v-if="tipo === 'normal'"
      rounded
      color="negative"
      icon="block"
      label="Caso concluido"
      @click="openModal"
      size="sm"
    >
      <q-tooltip content-class="bg-negative text-caption">
        Marcar como caso concluido para no mostrarlo en reportes y listados.
      </q-tooltip>
    </q-btn>
    <q-btn
      v-if="tipo === 'float'"
      size="lg"
      round
      color="negative"
      icon="block"
      @click="openModal"
    >
      <q-tooltip
        content-class="bg-negative text-body2"
        anchor="center left"
        self="center right"
      >
        Concluir caso
      </q-tooltip>
    </q-btn>
  </section>
</template>
<script>
import { createComputed } from 'src/common/utils'
import validations from 'src/common/validations'

const datosCasoConcluidoRules = {
  idTipoConclusion: [validations.requerido]
  // idTipoConclusionHijo: [validations.requerido]
}

export default {
  props: {
    idDenuncia: { type: String, default: null },
    tipo: { type: String, default: 'normal' },
    tipoProceso: { type: String, default: '' }
  },
  data () {
    return {
      datosCasoConcluidoRules,
      tiposConclusion: [],
      tiposConclusionHijos: [],
      dialog: false,
      datosCasoConcluido: {
        idDenuncia: this.idDenuncia,
        idTipoConclusion: null,
        idTipoConclusionHijo: null,
        justificacionCasoConcluido: null
      }
    }
  },
  computed: {
    dialogModel: createComputed('dialog')
  },
  methods: {
    async inicializarDatos () {
      // const { rows } = await this.$axios.get('system/parametros?grupo=TIPO_CONCLUSION&idProceso=9b49b99c-01ea-47d7-bd8a-42d46d8dc530')
      const { rows } = await this.$axios.get(`system/parametros?grupo=TIPO_CONCLUSION&grupo=TIPO_CONCLUSION_SLIM&idProceso=${this.tipoProceso}`)
      this.tiposConclusion = rows
    },
    async habilitarOtroFormulario () {
      // const { rows } = await this.$axios.get('system/parametros?grupo=TIPO_CONCLUSION&idProceso=9b49b99c-01ea-47d7-bd8a-42d46d8dc530')
      const { rows } = await this.$axios.get(`system/parametros?grupo=TIPO_CONCLUSION_HIJO&&grupo=TIPO_CONCLUSION_HIJO_SLIM&idProceso=${this.tipoProceso}&idPadre=${this.datosCasoConcluido.idTipoConclusion}`)
      this.tiposConclusionHijos = rows
    },
    async guardar () {
      try {
        await this.$axios.put(`denuncias/denuncia/${this.idDenuncia}/concluir`, this.datosCasoConcluido)
        this.closeModal()
        this.$router.replace({ name: 'denuncias' })
      } catch (error) {

      }
    },
    limpiarFormulario () {
      this.datosCasoConcluido = {
        idDenuncia: this.idDenuncia,
        idTipoConclusion: null,
        idTipoConclusionHijo: null,
        justificacionCasoConcluido: null
      }
    },
    openModal () {
      this.dialog = true
    },
    closeModal () {
      this.dialog = false
      this.limpiarFormulario()
    }
  },
  watch: {
    'datosCasoConcluido.idTipoConclusion': {
      handler (nuevo) {
        if (!nuevo) {
          this.tiposConclusionHijos = []
          this.datosCasoConcluido.idTipoConclusionHijo = null
          return
        }
        this.habilitarOtroFormulario()
      },
      deep: true
    }
  }
}
</script>
