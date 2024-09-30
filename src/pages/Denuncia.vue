<template>
  <q-page>
    <Titulo />
    <q-card class="q-mx-md">
      <q-card-section>
        <div
          class="row q-col-gutter-md"
          v-if="denuncia !==null"
        >
          <div class="col-12">
            <q-card
              flat
              bordered
            >
              <q-card-section>
                <q-page-sticky
                  style="z-index:999;"
                  position="top-right"
                  :offset="[18, 18]"
                >
                  <div class="q-gutter-sm">
                    <div>
                      <q-btn
                        size="lg"
                        round
                        color="primary"
                        icon="arrow_back"
                        @click="$router.go(-1)"
                      >
                        <q-tooltip
                          content-class="bg-primary text-body2"
                          anchor="center left"
                          self="center right"
                        >
                          Volver a la lista de denuncias
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <q-btn
                      size="lg"
                      round
                      color="primary"
                      icon="document_scanner"
                      @click="seguimientoDialog = true"
                    >
                      <q-tooltip
                        content-class="bg-primary text-body2"
                        anchor="center left"
                        self="center right"
                      >
                        Seguimiento al trabajo realizado
                      </q-tooltip>
                    </q-btn>
                    <div>
                      <q-btn
                        v-if="modificar && denuncia.estadoActual !=='CERRADO' && !denuncia.casoConcluido && (global.usuario.id === denuncia.idUsuarioAsignado || seguimientoHistorial)"
                        size="lg"
                        round
                        color="positive"
                        icon="save"
                        :loading="loading"
                        @click="$refs.guardar.$el.click()"
                      >
                        <q-tooltip
                          content-class="bg-positive text-body2"
                          anchor="center left"
                          self="center right"
                        >
                          Guardar datos
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div>
                      <q-btn
                        v-if="!modificar && denuncia.estadoActual !=='CERRADO' && !denuncia.casoConcluido && (global.usuario.id === denuncia.idUsuarioAsignado || seguimientoHistorial)"
                        size="lg"
                        round
                        color="warning"
                        icon="edit"
                        @click="habilitarModificacion"
                      >
                        <q-tooltip
                          content-class="bg-warning text-body2"
                          anchor="center left"
                          self="center right"
                        >
                          Editar datos
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div>
                      <ConcluirCaso
                        v-if="!denuncia.casoConcluido && global.usuario.id === denuncia.idUsuarioAsignado"
                        tipo="float"
                        :idDenuncia="denuncia.id"
                        :tipoProceso="denuncia.idTipoProceso"
                      />
                    </div>
                  </div>

                </q-page-sticky>
                <div class="row q-col-gutter-md">
                  <div class="col-xs-12 text-h5 text-weight-bolder q-my-sm">
                    <q-icon
                      name="gavel"
                      size="sm"
                    ></q-icon> Información Caso {{denuncia.codigoDenuncia}}
                  </div>
                  <div class="col-12 text-center">
                    <q-item dense>
                      <q-item-section>
                        <q-item-label
                          caption
                          class="text-primary"
                        >Tipo Proceso:</q-item-label>
                        <q-item-label>
                          <q-btn :label="obtenerNombreProceso(denuncia.idTipoProceso)" />
                        </q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label
                          caption
                          class="text-primary"
                        >Usuario Actual Asignado:</q-item-label>
                        <q-item-label>
                          <q-btn
                            color="primary"
                            dark
                            :label="nombreUsuarioAsignado"
                          />
                        </q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label
                          caption
                          class="text-primary"
                        >Estado Actual:</q-item-label>
                        <q-item-label>
                          <q-btn
                            color="primary"
                            dark
                            :label="denuncia.estadoActual"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <!-- <div class="col-xs-12 col-sm-4 col-md-3 text-center">
                    <q-item dense>
                      <q-item-section>
                        <q-item-label
                          caption
                          class="text-primary"
                        >Usuario Actual Asignado:</q-item-label>
                        <q-item-label>
                          <q-btn
                            color="primary"
                            dark
                            :label="nombreUsuarioAsignado"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div> -->
                  <!-- ROL ACTUAL PARA REASIGNAR -->
                  <!-- <div>
                    <q-btn
                      v-if="idRolPsicologia == global.rolactual.id"
                      rounded
                      color="positive"
                      icon="check"
                      label="Habilitar la edicion para 'Trabajo social' y 'Psicología' (boton de emergencia)"
                      @click="habilitarTrabajoSocial"
                      size="sm"
                    />
                  </div> -->
                  <!-- <div
                    class="col-xs-12 col-sm-8 col-md-6 text-center"
                    v-if="global.usuario.id === denuncia.idUsuarioAsignado"
                  >
                    <q-item dense>
                      <q-item-section>
                        <q-item-label
                          caption
                          class="text-grey text-center"
                        >Acciones:</q-item-label>
                        <q-item-label class="row q-col-gutter-md text-center">
                          <div class="col-xs-12 col-sm-6 text-center">
                            <q-btn
                              v-if="!modificar && denuncia.estadoActual !=='CERRADO' && !denuncia.casoConcluido"
                              rounded
                              color="orange"
                              icon="edit"
                              label="Editar"
                              @click="habilitarModificacion"
                              size="sm"
                            />
                            <q-btn
                              v-if="modificar && denuncia.estadoActual !=='CERRADO' && !denuncia.casoConcluido"
                              rounded
                              color="positive"
                              icon="check"
                              label="guardar"
                              :loading="loading"
                              @click="$refs.guardar.$el.click()"
                              size="sm"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 text-center">
                            <ConcluirCaso
                              v-if="!denuncia.casoConcluido"
                              :idDenuncia="denuncia.id"
                            />
                          </div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div> -->
                  <!-- <div class="col-xs-12 col-sm-4 col-md-3 text-center">
                    <q-toggle
                      v-if="global.permisos['marcar:prioritarios']"
                      :disable="disablePrioritario"
                      size="lg"
                      label="Prioritario"
                      class="text-bold q-mt-lg"
                      v-model="denuncia.prioritario"
                      checked-icon="check"
                      color="positive"
                      unchecked-icon="clear"
                      @input="guardarPrioritario"
                    >
                      <q-tooltip content-class="bg-info text-caption">
                        Marcar como caso prioritario para generar reportes.
                      </q-tooltip>
                    </q-toggle>
                  </div> -->
                </div>
              </q-card-section>
              <q-card-section style="max-height: 75vh">
                <q-scroll-area style="height: 70vh;">
                  <q-form
                    ref="denuncia"
                    @validation-error="mensajeErrorValidacion"
                    @submit="guardarEdicion($event)"
                    class="row q-col-gutter-sm"
                  >
                    <div class="col-xs-12">
                      <RenderForm
                        v-for="(formulario,index) in formularios"
                        :key="index"
                        :configuracion.sync="formularios[index].configuracion"
                      />
                    </div>
                    <div class="col-xs-12">
                      <h2 class="subtitle q-pl-md q-py-md">Datos para la busqueda</h2>
                    </div>
                    <q-select
                      filled
                      label="Etiquetas"
                      v-model="denuncia.etiquetas"
                      class="q-px-md q-pb-lg col-xs-12"
                      use-input
                      use-chips
                      multiple
                      input-debounce="0"
                      :readonly="!modificar"
                      @new-value="createValue"
                      :options="filterEtiquetas"
                      @filter="filterFn"
                      :hint="filterEtiquetas.length>0?'':'Presiona la tecla ENTER para guradar una nueva etiqueta'"
                    >
                      <template v-slot:before>
                        <q-icon
                          name="turned_in"
                          color="secondary"
                        />
                      </template>
                    </q-select>
                    <q-select
                      filled
                      label="GAMEA"
                      v-model="denuncia.entidades"
                      use-input
                      use-chips
                      option-value="id"
                      option-label="nombre"
                      class="q-px-md col-xs-12"
                      :options="filterEntidades"
                      @filter="filterFnEntidad"
                      :readonly="!modificar"
                      multiple
                    >
                      <template v-slot:before>
                        <q-icon
                          name="business"
                          color="secondary"
                        />
                      </template>
                    </q-select>
                    <q-btn
                      class="q-mt-sm"
                      v-if="modificar"
                      ref="guardar"
                      rounded
                      color="primary"
                      icon="check"
                      label="guardar"
                      type="submit"
                    />
                  </q-form>
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
          <q-dialog v-model="seguimientoDialog" persistent>
            <q-card
              flat
              bordered
              class="fit"
            >
              <q-card-section>
                <Seguimiento
                  class="fit"
                  :denuncia="denuncia"
                  :etapas="etapas"
                />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  icon="close"
                  color="primary"
                  label="Cerrar"
                  @click="seguimientoDialog = false"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>

import RenderForm from '@components/Form/RenderForm'
import MixinParametros from '@components/Denuncias/mixins/parametros'
import MixinFormulario from '@components/Denuncias/mixins/formularios'
import Seguimiento from 'src/components/Denuncias/Seguimiento.vue'
import ConcluirCaso from 'components/Denuncias/ConcluirCaso'
import { mapState } from 'vuex'
export default {
  components: {
    RenderForm,
    Seguimiento,
    ConcluirCaso
  },
  mixins: [
    MixinParametros,
    MixinFormulario
  ],
  data () {
    return {
      dialogCasoConcluido: false,
      id: this.$route.params.uuid,
      denuncia: null,
      formularios: [],
      etapas: [],
      columns: [
        {
          name: 'Acciones',
          required: true,
          label: 'Acciones',
          align: 'left',
          sortable: true
        },
        { name: 'Tipo', align: 'center', label: 'Tipo', field: 'idTipoParticipante', sortable: true },
        { name: 'TipoDocumento', label: 'Tipo Documento', field: 'idTipoDocumento', sortable: true },
        { name: 'Numero Documento', label: 'Numero Documento', field: 'numeroDocumento' },
        { name: 'Nombre Completo', label: 'Nombre Completo', field: 'nombreRazonSocial' }
      ],
      modificar: false,
      loading: false,
      etiquetas: [],
      filterEtiquetas: [],
      entidades: [],
      filterEntidades: [],
      disablePrioritario: false,
      idRolSocial: process.env.ID_ROL_SOCIAL,
      idRolPsicologia: process.env.ID_ROL_PSICOLOGIA,
      seguimientoDialog: false
    }
  },
  computed: {
    ...mapState(['global']),
    nombreUsuarioAsignado () {
      const usuario = this.denuncia.usuarioAsignado
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido ? usuario.segundoApellido : ''}`
    },
    seguimientoHistorial () {
      const index = this.denuncia.asignacionAnterior.findIndex(dat => { return dat === this.global.usuario.id })
      return index !== -1
    }
  },
  async mounted () {
    this.etiquetas = await this.getEtiquetas()
    this.entidades = await this.getEntidades()
    this.obtenerDatos()
  },
  methods: {
    async guardarPrioritario () {
      this.disablePrioritario = true
      try {
        await this.$axios.put('denuncias/denuncia', {
          id: this.denuncia.id,
          idTipoProceso: this.denuncia.idTipoProceso,
          prioritario: this.denuncia.prioritario
        })
        this.$alert.success('Cambio de prioridad realizado correctamente')
      } catch (error) {
        this.$alert.success('Ocurrio un error al intentar cambiar la prioridad')
      } finally {
        this.disablePrioritario = false
      }
    },
    mensajeErrorValidacion () {
      this.$alert.error('El formulario no esta correctamente llenado, verifique sus datos e intente nuevamente.')
    },
    openDialogCasoConcluido () {
      this.dialogCasoConcluido = true
    },
    async obtenerDatos () {
      const respuesta = await this.$axios.get(`denuncias/denuncia/${this.id}`)
      this.$store.commit('global/setIdTipoProceso', respuesta.idTipoProceso)
      this.denuncia = respuesta
      this.denuncia.etiquetas = this.denuncia.etiquetas ? this.denuncia.etiquetas.split(',') : []
      await this.getFormulario(this.denuncia.idTipoProceso)
    },
    async getFormulario (proceso, value) {
      this.formularios = []
      const rolActualId = (await this.$storage.get('rolactual')).id
      const datos = await this.$axios.get(`denuncias/proceso/${proceso}?idRol=${rolActualId}`)

      const forms = datos.formularios
      this.consultado = false
      if (forms.length > 0) {
        for (const form of forms) {
          try {
            for (const element of form.configuracion) {
              element.readonly = true
              if (this.denuncia[element.name]) {
                if (element.type === 'datagrid') {
                  element.value = JSON.stringify(this.denuncia[element.name])
                } else {
                  element.value = this.denuncia[element.name]
                }
              } else {
                element.value = null
              }
              if (element.url) {
                element.url = this.setValueDependencyUrl(element.url, element.dependency)
              } else if (element.options) {
                for (const option of element.options) {
                  if (option.url) {
                    option.url = this.setValueDependencyUrl(option.url, option.dependency)
                  }
                }
              }
            }
          } catch (error) {
            console.log(error)
          }
        }

        this.formularios = [...forms]
        const buscarEtapa = await datos.configuracion.filter(e => e.nombre === this.denuncia.estadoActual)
        if (buscarEtapa.length > 0) {
          this.etapas = buscarEtapa[0].etapas
        }
        this.consultado = true
      } else {
        this.$alert.error('El proceso  no tiene formulario')
      }
    },
    async habilitarTrabajoSocial () {
      this.$q.dialog({
        title: 'Atención',
        message: '¿Esta segur@ de querer editar este formulario?, quedará registro de que solicitó la edicion del formulario',
        ok: {
          color: 'primary',
          label: 'Aceptar'
        },
        cancel: {
          color: 'white',
          'text-color': 'secondary',
          label: 'Cancelar'
        },
        persistent: true
      }).onOk(async (data) => {
        await this.$axios.put(`denuncias/denuncia/${this.denuncia.id}/habilitar/trabajo/social`, {
          idUsuarioAsignado: this.global.usuario.id
        })
      }).onCancel(() => {})
    },
    habilitarModificacion () {
      for (const form of this.formularios) {
        for (const element of form.configuracion) {
          element.readonly = false
        }
      }
      this.modificar = true
    },
    async guardarEdicion (e) {
      this.loading = true
      const formData = new FormData(e.target)
      const datos = []
      for (const [name, value] of formData.entries()) {
        datos.push({
          name,
          value
        })
      }
      const form = {
        delitos: [],
        tipoVivienda: [],
        servicioBasico: [],
        violenciaFisica: [],
        violenciaPsicologica: [],
        violenciaSexual: [],
        delitoPenalSlim: []
      }
      try {
        for (const campo of datos) {
          if (campo.name === 'participantes') {
            form[campo.name] = campo.value ? JSON.parse(campo.value) : ''
          } else if (campo.name === 'delitos') {
            form.delitos.push(campo.value)
          } else if (campo.name === 'tipoVivienda') {
            form.tipoVivienda.push(campo.value)
          } else if (campo.name === 'servicioBasico') {
            form.servicioBasico.push(campo.value)
          } else if (campo.name === 'violenciaFisica') {
            form.violenciaFisica.push(campo.value)
          } else if (campo.name === 'violenciaPsicologica') {
            form.violenciaPsicologica.push(campo.value)
          } else if (campo.name === 'violenciaSexual') {
            form.violenciaSexual.push(campo.value)
          } else if (campo.name === 'delitoPenalSlim') {
            form.delitoPenalSlim.push(campo.value)
          } else if (campo.name === 'etiquetas') {
            form.etiquetas.push(campo.value)
          } else {
            form[campo.name] = campo.value
          }
        }
        form.id = this.denuncia.id
        form.idTipoProceso = this.denuncia.idTipoProceso
        form.entidades = this.denuncia.entidades.map(x => x.id || x) || []
        form.rolActual = (await this.$storage.get('rolactual')).id
        await this.$axios.put('denuncias/denuncia', form)
        for (const form of this.formularios) {
          for (const element of form.configuracion) {
            element.readonly = true
          }
        }
        this.modificar = false
        this.loading = false
        this.$alert.success('Registro guardado correctamente')
      } catch (error) {
        console.log(error)
        this.$alert.warning(error.message)
      } finally {
        this.loading = false
      }
    },
    cerrar () {
      this.$q.dialog({
        title: 'Atención',
        message: `¿Esta seguro de <strong>CERRAR</strong> la denuncia?. no se podran cargar mas registros <br>
        <strong class="text-negative">Esta acción no se puede revertir.</strong>
        `,
        html: true,
        ok: {
          color: 'primary',
          label: 'Aceptar'
        },
        cancel: {
          color: 'white',
          'text-color': 'secondary',
          label: 'Cancelar'
        },
        persistent: true
      }).onOk(async () => {
        await this.$axios.patch(`denuncias/denuncia/${this.denuncia.id}/cerrar`)
        this.denuncia.estadoActual = 'CERRADO'
      }).onCancel(() => {
      })
    },
    concluirCaso () {
      this.$q.dialog({
        title: 'Atención',
        message: '¿Esta seguro de <strong>CONCLUIR</strong> la denuncia?. Esta denuncia <strong class="text-negative">NO sera parte de los reportes ni los resultados de busqueda</strong>.<br>',
        html: true,
        prompt: {
          model: '',
          label: 'Justificacion',
          filled: true,
          isValid: val => val.length > 20 || 'La justificacion debe tener mas de 20 caracteres.',
          type: 'textarea'
        },
        ok: {
          icon: 'done_all',
          color: 'primary',
          label: 'Aceptar'
        },
        cancel: {
          icon: 'close',
          color: 'white',
          'text-color': 'secondary',
          label: 'Cancelar'
        },
        persistent: true
      }).onOk(async (data) => {
        await this.$axios.patch(`denuncias/denuncia/${this.denuncia.id}/concluir`)
        this.denuncia.casoConcluido = true
        this.denuncia.justificacionCasoConcluido = data
        location.reload()
      })
    },
    async getEtiquetas () {
      const { rows } = await this.$axios.get('system/parametros?grupo=ETIQUETA&limit=100000')
      return rows.map(e => e.nombre)
    },
    async getEntidades () {
      const { rows } = await this.$axios.get('system/entidades?limit=100000')
      this.filterEntidades = rows
      return rows
    },
    async createValue (val, done) {
      if (val.length > 2) {
        if (!this.etiquetas.includes(val.toUpperCase())) {
          const respuesta = await this.$axios.post('system/parametros', {
            nombre: val.toUpperCase(),
            codigo: `ET-${val.toUpperCase().charAt(0)}-${Math.floor(Date.now() / 1000)}`,
            grupo: 'ETIQUETA',
            descripcion: val.toUpperCase(),
            estado: 'ACTIVO'
          })
          this.etiquetas.push(respuesta.nombre)
          done(respuesta.nombre, 'add-unique')
        }
      }
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterEtiquetas = this.etiquetas
        } else {
          const needle = val.toLowerCase()
          this.filterEtiquetas = this.etiquetas.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    filterFnEntidad (val, update) {
      update(async () => {
        if (val === '') {
          this.filterEntidades = this.entidades
        } else {
          console.log(this.entidades)
          const needle = val.toLowerCase()
          this.filterEntidades = await this.entidades.filter(
            v => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    }
  }
}
</script>
