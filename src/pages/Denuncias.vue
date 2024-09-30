<template>
  <q-page>
    <Titulo
      icono="ballot"
      titulo="Casos"
    ></Titulo>
    <q-dialog v-model="dialogPdf">
      <q-card style="width: 1200px; max-width: 90vw;">
        <q-toolbar class="text-secondary q-pa-md">
          <q-icon
            name="picture_as_pdf"
            size="md"
          />
          <q-toolbar-title>
            <span> Reporte de la denuncia</span>
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="dialogPdf = false"
          />
        </q-toolbar>
        <q-card-section
          class="no-padding"
          style="height:70vh"
        >
          <iframe
            :src="`data:application/pdf;base64,${pdfDenuncia}`"
            height="100%"
            width="100%"
          ></iframe>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            icon="close"
            color="positive"
            label="Cerrar"
            @click="dialogPdf = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-tabs
      v-model="tab"
      class="q-mx-md"
      active-color="white"
      active-bg-color="accent"
      indicator-color="white"
      switch-indicator
      align="left"
    >
      <q-tab
        :name="proceso.id"
        :label="proceso.nombre"
        v-for="proceso in tiposProcesoHabilitados"
        :key="proceso.key+1"
      />
    </q-tabs>
    <CrudTable
      v-if="tab !== null && global.permisos['denuncia:listar']"
      titulo="Usuarios"
      :url="url"
      :filters="filters"
      :columns="getColumns"
      order="_created_at"
      ref="crudTable"
      :dialog.sync="dialog"
      :filtrosAvanzados="filtroAvanzado"
      :wrap="true"
    >
      <template v-slot:filtros>
        <div class="col-xs-12">
          <q-input
            class="full-width"
            v-model="search"
            filled
            label="Texto Buscar"
            stack-label
            placeholder="Ingrese una palabra o frase"
            :readonly="filtroConsultado"
            @keypress.enter="aplicarBusquedaAvanzada"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template
              v-slot:after
            >
              <q-btn
                v-if="!filtroConsultado"
                color="primary"
                icon="search"
                label="buscar"
                @click="aplicarBusquedaAvanzada"
              />
              <q-btn
                v-else
                color="negative"
                icon="close"
                label="Limpiar"
                @click="limpiarBusqueda"
              />
            </template>
          </q-input>
        </div>
      </template>
      <template slot="buttons-end">
        <q-btn
          v-if="!incluirCasosConcluidos"
          color="info"
          icon="done_all"
          label="Casos Concluidos o Ceses"
          @click="adicionarCasosConcluidos"
        />
        <q-btn
          v-if="incluirCasosConcluidos"
          outline
          color="info"
          icon="close"
          label="NO incluir casos concluidos o Ceses"
          @click="removerCasosConcluidos"
        />
      </template>
      <template slot="buttons-end">
        <q-btn
          v-if="!soloMisCasos"
          color="info"
          icon="done_all"
          label="Mis casos asignados"
          @click="adicionarMisCasos"
        />
        <q-btn
          v-if="soloMisCasos"
          outline
          color="info"
          icon="close"
          label="Dejar de ver mis casos"
          @click="removerMisCasos"
        />
      </template>
      <template slot="buttons">
        <q-btn
          v-if="global.permisos['denuncia:crear'] && formularios.length>0"
          icon="add"
          color="secondary"
          @click="crear()"
        > AGREGAR
        </q-btn>
        <q-btn
          v-if="reporte && global.permisos['denuncia:reporte:concluidos']"
          color="negative"
          icon="insert_chart_outlined"
          label="quitar filtro reporte"
          @click="limpiarReporte"
        />
      </template>
      <template v-slot:form>
         <!-- <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          style="width: 1300px; max-width: 90vw;"
          animated
        >
          <q-step
            :name="0"
            title="Código SAJ"
            icon="settings"
            :done="step > 1"
          >
            <q-form ref="formDenuncia">
              <div class="row justify-center" >
                <div class="col-xs-12 col-md-10 text-center">
                  ¿Cuenta con código generado por la Red SAJ?
                </div>
                <q-field
                  v-model="denuncia.conCodigoSaj"
                  borderless
                  class="col-xs-12 col-md-10"
                  style="width:; height:60px"
                  readonly
                >
                  <template v-slot:control>
                    <div class="col-xs-12 text-center">
                      <q-option-group
                        v-model="denuncia.conCodigoSaj"
                        :options="[{label:'SI',value:true},{label:'NO',value:false}]"
                        color="primary"
                        inline
                      />
                    </div>
                  </template>
                </q-field>
                <q-input
                  v-if="denuncia.conCodigoSaj"
                  v-model="denuncia.codigoSaj"
                  type="text"
                  label="Codigo SAJ"
                  outlined
                  class="col-xs-12 col-md-5"
                  placeholder="Ingrese el codigo generado por la red SAJ"
                  stack-label
                  color="secondary"
                  :rules="[ val => val && val.length > 0 || 'Ingrese algún código por favor']"
                  @keypress.enter.prevent="getCasoSaj"
                >
                  <template v-slot:before>
                    <q-icon name="gavel" />
                  </template>
                </q-input>
                <div class="col-xs-12 col-md-10" v-if="denuncia.conCodigoSaj && denunciaSaj.reasignacion">
                  <div class="alert alert--warning">
                    <q-icon size="md" name="warning" dark /><div> La entidad asignada por la Gestora SAJ es ({{denunciaSaj.entidad.nombre}}) diferente a tu entidad, en caso de continuar debes seleccionar información de tu sucursal y justificar la recepción</div>
                  </div>
                </div>

                <div class="col-xs-12 col-md-8" v-if="denuncia.conCodigoSaj && denunciaSaj.idSucursal">
                  <div class="col-xs-12 col-md-10" v-if="denunciaSaj.reasignacion">
                    <q-select
                      v-if="denunciaSaj.reasignacion"
                      v-model="denunciaSaj.idSucursal"
                      :options="sucursales"
                      :label="denunciaSaj.sucursal?'Nombre Sucursal':'Selecciona una sucursal'"
                      filled
                      map-options
                      emit-value
                      option-label="nombre"
                      option-value="id"
                      class="required q-mx-md q-pt-md"
                    />
                    <q-input
                      v-if="denunciaSaj.reasignacion"
                      v-model="denunciaSaj.justificacionRecepcion"
                      type="textarea"
                      label="Justificación"
                      class="required q-mx-md q-pt-md"
                      filled
                      autogrow
                      :rows="1"
                      :rules="[ val => val && val.length > 0 || 'Ingrese alguna justificación']"
                    />
                  </div>

                  <div class="col-xs-12 col-md-10" v-if="denuncia.conCodigoSaj">
                    <q-item>
                      <q-item-section>
                        <q-item-label caption lines="2" class="text-secondary text-bold">Servicio</q-item-label>
                        <q-item-label>{{ denunciaSaj.servicio }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption lines="2" class="text-secondary text-bold">Materia</q-item-label>
                        <q-item-label>{{ denunciaSaj.materia }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption lines="2" class="text-secondary text-bold">Reseña Caso</q-item-label>
                        <q-item-label>{{ denunciaSaj.descripcionHecho }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </div>
            </q-form>
          </q-step>
          <q-step
            :name="0"
            title="Formulario GAMEA"
            icon="settings"
            :done="step > 1"
          >
            <q-card style="width: 1200px; max-width: 90vw;">
              <q-toolbar class="q-pa-md">
                <q-icon
                  name="gavel"
                  size="md"
                />
                <q-toolbar-title>
                  <span v-if="!denuncia.id">  {{nombreProceso}}</span>
                </q-toolbar-title>
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  @click="cancelar()"
                />
              </q-toolbar>
              <q-card-section>
                <q-form
                  ref="usuario"
                  @validation-error="mensajeErrorValidacion"
                  @submit="save($event)"
                  class="row q-col-gutter-md"
                >
                  <div
                    v-if="consultado"
                    class="col-xs-12"
                  >
                    <RenderForm
                      v-for="formulario in formularios"
                      :key="formulario.id"
                      :configuracion="formulario.configuracion"
                    />
                    <h2 class="subtitle q-pl-md q-py-md">Datos para la busqueda</h2>
                    <q-select
                      filled
                      label="Etiquetas"
                      v-model="denuncia.etiquetas"
                      class="q-px-md q-pb-lg"
                      use-input
                      use-chips
                      multiple
                      input-debounce="0"
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
                      v-model="denuncia.idEntidad"
                      use-input
                      use-chips
                      map-options
                      emit-value
                      option-value="id"
                      option-label="nombre"
                      class="q-px-md"
                      :options="filterEntidades"
                      @filter="filterFnEntidad"
                    >
                      <template v-slot:before>
                        <q-icon
                          name="business"
                          color="secondary"
                        />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-xs-12 text-right q-gutter-sm">
                    <q-btn
                      icon="check"
                      color="primary"
                      label="Guardar"
                      type="submit"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-step>
          <template v-slot:navigation>
            <q-separator></q-separator>
            <q-stepper-navigation style="padding-top:12px;padding-bottom:12px;" class="text-right">
              <q-btn flat color="negative" icon="close" label="Cancelar" @click="cancelar()" v-close-popup></q-btn>
              <q-btn v-if="step > 0" @click="$refs.stepper.previous()" label="Anterior" class="q-ml-sm" icon="arrow_back_ios" />
              <q-btn @click="pasoSiguiente()" color="primary" label="Siguiente" class="q-ml-sm" v-if="step < 1"  icon-right="arrow_forward_ios"/>
            </q-stepper-navigation>
          </template>
        </q-stepper> -->

        <q-card style="width: 1200px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="gavel"
              size="md"
            />
            <q-toolbar-title>
              <span v-if="!denuncia.id">  {{nombreProceso}}</span>
            </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="cancelar()"
              v-close-popup
            />
          </q-toolbar>
          <q-card-section>
            <q-form
              ref="usuario"
              @validation-error="mensajeErrorValidacion"
              @submit="save($event)"
              class="row q-col-gutter-md"
            >
              <div
                v-if="consultado"
                class="col-xs-12"
              >
                <RenderForm
                  v-for="formulario in formularios"
                  :key="formulario.id"
                  :configuracion="formulario.configuracion"
                />
                <h2 class="subtitle q-pl-md q-py-md">Datos para la busqueda</h2>
                <q-select
                  filled
                  label="Etiquetas"
                  v-model="denuncia.etiquetas"
                  class="q-px-md q-pb-lg"
                  use-input
                  use-chips
                  multiple
                  input-debounce="0"
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
                  v-model="denuncia.idEntidad"
                  use-input
                  use-chips
                  map-options
                  emit-value
                  option-value="id"
                  option-label="nombre"
                  class="q-px-md"
                  :options="filterEntidades"
                  @filter="filterFnEntidad"
                >
                  <template v-slot:before>
                    <q-icon
                      name="business"
                      color="secondary"
                    />
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 text-right q-gutter-sm">
                <q-btn
                  icon="close"
                  color="warning"
                  label="Cancelar"
                  @click="cancelar"
                  v-close-popup
                />
                <q-btn
                  icon="check"
                  color="primary"
                  label="Guardar"
                  type="submit"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="props">
        <q-tr>
          <q-td>
            <q-btn
              v-if="global.permisos['denuncia:ver']"
              class="q-pa-xs"
              flat
              round
              icon="visibility"
              @click="ver(props,props.row)"
            />
            <q-btn
              v-if="global.permisos['denuncia:pdf'] && (seguimientoHistorial(props.row.asignacionAnterior) || props.row.idUsuarioAsignado === global.usuario.id)"
              class="q-pa-xs"
              flat
              round
              color="red"
              icon="picture_as_pdf"
              @click="reporteDenuncia(props.row.id, props.row.participantes, props.row)"
            />
            <q-btn
              v-if="global.permisos['denuncia:reasignar'] && props.row.estadoActual != 'CERRADO' && props.row.opcionReasignacion"
              class="q-pa-xs"
              flat
              round
              color="secondary"
              icon="call_split"
              @click="reasignar(props,props.row)"
            />
          </q-td>
          <q-td class="text-center">{{ props.row.defensoria?props.row.defensoria.nombre:'' }}</q-td>
          <q-td class="text-center">{{ props.row.slim?props.row.slim.nombre:'' }}</q-td>
          <q-td>
            <q-chip
              square
              :color="props.row.color"
              text-color="white"
              label="ESTADO DEL CASO"
            />
          </q-td>
          <q-td>{{ props.row.codigoDenuncia }}</q-td>
          <q-td>{{ props.row.correlativoGamea }}</q-td>
          <q-td class="text-center">{{ formatDate(props.row.fechaDenuncia) }}</q-td>
          <q-td class="text-center">{{ props.row.zona && props.row.zona.nombre ? props.row.zona.nombre : null }}</q-td>
          <q-td class="text-left">
            <div>
              <div
                v-for="(grupo, index) of getParticipantesAgrupados(props.row.participantes)"
                :key="index"
              >
                <div v-if="grupo.participantes.length > 0">
                  <span class="text-bold text-caption">{{ grupo.tipo }}(S)</span>
                  <li
                    v-for="(participante, index2) of grupo.participantes"
                    :key="index2"
                    class="text-caption q-pl-md"
                  >
                    {{ participante.nombreCompleto }} - {{ participante.numero_documento }}
                  </li>
                  <br>
                </div>
              </div>
            </div>
          </q-td>
          <q-td class="text-center">{{props.row.estadoActual}}</q-td>
          <q-td class="text-center">
            <q-chip
              v-if="props.row.casoConcluido"
              square
              color="negative"
              text-color="white"
              label="CONCLUIDO"
            />
            <q-chip
              v-if="!props.row.casoConcluido"
              square
              color="positive"
              text-color="white"
              label="ABIERTO"
            />
          </q-td>
          <q-td>
            <div v-if="props.row.tipoConclusion">
              <span class="text-bold">{{ props.row.tipoConclusion.nombre }}</span>
            </div>
          </q-td>
          <q-td>
            <div v-if="props.row.tipoConclusionHijo">
              <span class="text-bold">{{ props.row.tipoConclusionHijo.nombre }}</span>
            </div>
          </q-td>
          <q-td
            class="text-center"
            v-if="global.permisos['denuncia:listar:todo']"
          >
            {{ props.row.usuarioAsignado.usuario }}
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
    <Reasigancion
      v-if="dialogReasignacion && global.permisos['denuncia:reasignar']"
      :dialog="dialogReasignacion"
      :denuncia="denuncia"
      @reasignado="reasignado"
      @cancelar="dialogReasignacion=false"
    />
  </q-page>
</template>

<script>

import CrudTable from '@components/CrudTable/CrudTable'
import CrudTableMixin from '@components/CrudTable/mixins/crud-table'
import Titulo from '@components/common/Titulo'
import parametros from '@common/Mixins/parametros'
import RenderForm from 'src/components/Form/RenderForm.vue'
import Reasigancion from 'src/components/Denuncias/Reasigancion.vue'
import { mapState, mapGetters } from 'vuex'
import { date } from 'quasar'
import FormularioMixin from '@common/Mixins/Formulario'
const url = 'denuncias/denuncia'
export default {
  mixins: [parametros, CrudTableMixin, FormularioMixin],
  components: {
    CrudTable,
    Titulo,
    RenderForm,
    Reasigancion
  },
  data () {
    return {
      filtroConsultado: false,
      filtroAvanzado: {},
      search: '',
      dialogPdf: false,
      pdfDenuncia: '',
      tab: null,
      tiposProcesoHabilitados: [],
      formularios: [],
      consultado: false,
      url,
      dialog: false,
      incluirCasosConcluidos: false,
      soloMisCasos: false,
      denuncia: {
        estado: 'ACTIVO',
        etiquetas: [],
        idEntidad: this.$store.state.global.usuario.entidad.id
      },
      denunciaSaj: {
        idSucursal: null,
        reasignacion: null,
        sucursal: null,
        entidad: null,
        justificacionRecepcion: null
      },
      filters: [],
      filtros: [
        'codigoDenuncia',
        'lugarHecho',
        'relacionHecho',
        'numeroFiscalia',
        'etapaActual',
        'entidad',
        'denominacion',
        'codigoSaj',
        'correlativoGamea',
        'nombreVictima',
        'documentoVictima',
        'nombreDenunciante',
        'documentoDenunciante',
        'nombreDenunciado',
        'documentoDenunciado'
      ],
      getColumns: [
        {
          name: 'acciones',
          label: 'Acciones',
          sortable: false
        },
        {
          name: 'idDefensoria',
          label: 'Defensoria',
          sortable: true
        },
        {
          name: 'idSlim',
          label: 'Slim',
          sortable: true
        },
        {
          name: 'color',
          label: 'Estado de la Atención al Actuado',
          sortable: false
        },
        {
          name: 'codigoDenuncia',
          label: 'Código Denuncia Fiscalía',
          sortable: true,
          align: 'left'
        },
        {
          name: 'correlativoGamea',
          label: 'Código GAMEA',
          sortable: true,
          align: 'left'
        },
        {
          name: 'fechaDenuncia',
          label: 'Fecha Denuncia',
          sortable: true
        },
        {
          name: 'zona',
          label: 'Zona o Urbanización',
          sortable: true
        },
        {
          name: 'participantes',
          label: 'Participantes',
          sortable: false
        },
        {
          name: 'estadoActual',
          label: 'Estado Actual',
          sortable: true
        },
        {
          name: 'casoConcluido',
          label: 'Caso concluido',
          sortable: true
        },
        {
          name: 'idTipoConclusion',
          label: 'Tipo de conclusión',
          sortable: true
        },
        {
          name: 'idTipoConclusionHijo',
          label: 'Subconclusión',
          sortable: true
        }
      ],
      dialogReasignacion: false,
      reporte: false,
      tiposParticipante: {},
      etiquetas: [],
      filterEtiquetas: [],
      entidades: [],
      entidad: null,
      filterEntidades: [],
      formularioIds: {},
      urlSaj: process.env.SAJ_URL,
      codeSaj: null,
      tokenSaj: process.env.STATIC_TOKEN_SAJ,
      idRolSocial: process.env.ID_ROL_SOCIAL,
      idRolPsicologia: process.env.ID_ROL_PSICOLOGIA,
      idRolVentanilla: process.env.ID_ROL_VENTANILLA,
      idParticipanteVictima: process.env.ID_PARTICIPANTE_VICTIMA,
      idParticipanteDenunciante: process.env.ID_PARTICIPANTE_DENUNCIANTE,
      idParticipanteVictimaSlim: process.env.ID_PARTICIPANTE_VICTIMA_SLIM,
      idParticipanteDenuncianteSlim: process.env.ID_PARTICIPANTE_DENUNCIANTE_SLIM,
      step: 0,
      sucursales: [],
      dataSaj: null,
      defensorias: [],
      slims: []
    }
  },
  computed: {
    ...mapState(['global']),
    nombreProceso () {
      let nombre = ''
      const filtro = this.tiposProcesoHabilitados.filter(obj => obj.id === this.tab)
      if (filtro.length > 0) {
        nombre = filtro[0].nombre
      }
      return nombre
    }
  },
  watch: {
    tab: {
      async handler (newValue, oldValue) {
        this.$store.commit('global/setIdTipoProceso', newValue)
        this.tiposParticipante = await this.getTipoParticipante()
        if (this.reporte) {
          this.limpiarReporte()
        }
        // &idRol=${}
        this.defensorias = await this.$axios.get(`/system/parametros?grupo=DEFENSORIA&idProceso=${newValue}`).then(({ rows }) => rows)
        this.slims = await this.$axios.get(`/system/parametros?grupo=SLIM&idProceso=${newValue}`).then(({ rows }) => rows)
        this.url = `${url}?idTipoProceso=${newValue}`
        await this.getFormulario()
        setTimeout(async () => {
          await this.aplicarBusquedaAvanzada()
        }, 100)
      }
    }
  },
  async mounted () {
    this.etiquetas = await this.getEtiquetas()
    this.entidades = await this.getEntidades()
    if (this.global.permisos['denuncia:listar:todo']) {
      this.getColumns.push(
        {
          name: 'usuarioAsignado',
          label: 'Usuario Asignado',
          sortable: true
        }
      )
    }
    const { etapaActual, idTipoProceso, lugarHecho } = this.$route.query
    this.$router.replace({ query: null })
    this.tiposProcesoHabilitados = await this.getProcesosUsuario()
    // this.url = `${url}?idRol=${this.global.rolactual.id}`
    if (idTipoProceso) {
      // this.url = `${url}?idTipoProceso=${idTipoProceso}&idRol=${this.global.rolactual.id}`
      this.url = `${url}?idTipoProceso=${idTipoProceso}`
      this.tab = idTipoProceso
      if (etapaActual) {
        setTimeout(async () => {
          this.$refs.crudTable.search.etapaActual = etapaActual
          this.$refs.crudTable.search.lugarHecho = lugarHecho
          await this.$refs.crudTable.updateList()
          this.reporte = true
        }, 100)
      }
    } else {
      if (this.tiposProcesoHabilitados.length > 0) {
        const valorInicial = this.tiposProcesoHabilitados[0].id
        // this.url = `${url}?idTipoProceso=${valorInicial}&idRol=${this.global.rolactual.id}`
        this.url = `${url}?idTipoProceso=${valorInicial}`
        this.tab = valorInicial
      }
    }
    this.defensorias = await this.$axios.get(`/system/parametros?grupo=DEFENSORIA&idProceso=${this.tab}`).then(({ rows }) => rows)
    this.slims = await this.$axios.get(`/system/parametros?grupo=SLIM&idProceso=${this.tab}`).then(({ rows }) => rows)
    // sucursales del codigo SAJ
    /* const sucursales = await this.$axios.get('denuncias/denuncia/sucursales/saj')
    this.sucursales = sucursales */
  },
  methods: {
    seguimientoHistorial (asignacionAnterior) {
      const index = asignacionAnterior.findIndex(dat => { return dat === this.global.usuario.id })
      return index !== -1
    },
    async getCasoSaj () {
      // this.$alert.error('Error en la petición')
      const self = this
      try {
        const data = await this.$axios.get(`denuncias/denuncia/datos/saj/${this.denuncia.codigoSaj}`)
        if (data.datos.reasignacion) {
          this.denunciaSaj.idSucursal = data.datos.idSucursal
        } else {
          this.denunciaSaj.idSucursal = ' '
        }
        this.denunciaSaj.reasignacion = data.datos.reasignacion
        this.denunciaSaj.servicio = data.datos.servicio.servicio.nombre
        this.denunciaSaj.materia = data.datos.servicio.materia
        this.denunciaSaj.descripcionHecho = data.datos.descripcionHecho
        this.denunciaSaj.entidad = data.datos.entidad
        this.dataSaj = data
      } catch (error) {
        self.mensajeErrorCodigoSaj(error.response.data.mensaje)
      }
      return true
    },
    /* rescatarSaj () {
      this.consultado = false
      const self = this
      this.$q.dialog({
        title: 'SISTEMA DE ACCESO A LA JUSTICIA',
        message: '¿Cuenta con código generado por la red SAJ?',
        ok: {
          color: 'primary',
          label: 'Aceptar'
        },
        cancel: {
          color: 'white',
          'text-color': 'secondary',
          label: 'Cancelar'
        },
        prompt: {
          model: '',
          type: 'text',
          label: 'Inserte el código SAJ'
        },
        persistent: true
      }).onOk(async (code) => {
        self.codeSaj = code
        try {
          const { data } = await axios({
            url: `${self.urlSaj}${code}`,
            method: 'GET',
            headers: { Authorization: `Bearer ${self.tokenSaj}` }
          })
          await self.insertarRegistrosSaj(data)
          this.consultado = true
        } catch (error) {
          self.mensajeErrorCodigoSaj(null)
        }
      }).onCancel(async () => {
        this.consultado = true
      })
    }, */
    async insertarRegistrosSaj (data) {
      const resp = data.datos
      const f1Index = this.formularios.findIndex(dat => { return dat.id === process.env.ID_FORMULARIO_APERTURA })
      if (f1Index === -1) throw new Error('No se encontro el formulario')
      const f2Index = this.formularios.findIndex(dat => { return dat.id === process.env.ID_FORMULARIO_VICTIMA })
      if (f2Index === -1) throw new Error('No se encontro el formulario')
      let index = this.formularios[f1Index].configuracion.findIndex(dat => { return dat.name === 'codigoSaj' })
      this.formularios[f1Index].configuracion[index].value = this.denuncia.codigoSaj
      index = this.formularios[f2Index].configuracion.findIndex(dat => { return dat.name === 'participantes' })
      const { rows: documento } = await this.$axios.get(`system/parametros?grupo=TIPO_DOCUMENTO&idProceso=${this.tab}`)
      const indexDocumento = documento.findIndex(dat => { return dat.nombre === 'CEDULA DE IDENTIDAD' })
      const { rows: participante } = await this.$axios.get(`system/parametros?grupo=TIPO_PARTICIPANTE&idProceso=${this.tab}`)
      const indexParticipante = participante.findIndex(dat => { return dat.nombre === 'VICTIMA' })
      const { rows: genero } = await this.$axios.get(`system/parametros?grupo=GENERO&idProceso=${this.tab}`)
      let indexGenero
      if (resp.solicitante.genero === 'MASCULINO') indexGenero = genero.findIndex(dat => { return dat.nombre === 'MASCULINO' })
      else indexGenero = genero.findIndex(dat => { return dat.nombre === 'FEMENINO' })
      const { rows: lgtbi } = await this.$axios.get(`system/parametros?grupo=PERTENECE_LGBTI&idProceso=${this.tab}`)
      let indexLgtbi
      if (resp.lgtbi) indexLgtbi = lgtbi.findIndex(dat => { return dat.nombre === 'SI' })
      else indexLgtbi = lgtbi.findIndex(dat => { return dat.nombre === 'NO' })
      const nro = resp.solicitante.complementoDocumento ? `${resp.solicitante.numeroDocumento}-${resp.solicitante.complementoDocumento}` : `${resp.solicitante.numeroDocumento}`
      // const idCedula = resp.persona.numeroDocumento
      this.formularios[f2Index].configuracion[index].value = `[{
        "idTipoParticipante": "${participante[indexParticipante].id}",
        "idTipoDocumento": "${documento[indexDocumento].id}",
        "numeroDocumento": "${nro}",
        "nombreCompleto": "${resp.solicitante.nombres} ${resp.solicitante.primerApellido ? resp.solicitante.primerApellido : ''} ${resp.solicitante.segundoApellido ? resp.solicitante.segundoApellido : ''}",
        "idComunidad": "${lgtbi[indexLgtbi].id}",
        "direccion": "${resp.domicilio.direccion}",
        "telefono": "${resp.solicitante.celular}",
        "idGenero": "${genero[indexGenero].id}",
        "personaContacto": "${resp.contactos.length > 0 ? resp.contactos[0].nombre : ''}",
        "telefonoContacto": "${resp.contactos.length > 0 ? resp.contactos[0].numero : ''}"
      }]`
    },
    mensajeErrorCodigoSaj (mensaje) {
      if (mensaje) this.$alert.error(mensaje)
      else this.$alert.error('Error en la lectura de datos')
    },
    mensajeErrorValidacion () {
      this.$alert.error('El formulario no esta correctamente llenado, verifique sus datos e intente nuevamente.')
    },
    /* async misCasos () {
      this.url = `${url}?idTipoProceso=${this.tab}&casoConcluido=TRUE`
    }, */
    adicionarCasosConcluidos () {
      this.incluirCasosConcluidos = true
      if (this.soloMisCasos) this.url = `${url}?idTipoProceso=${this.tab}&casoConcluido=TRUE&misCasos=${this.global.usuario.id}`
      else this.url = `${url}?idTipoProceso=${this.tab}&casoConcluido=TRUE`
    },
    removerCasosConcluidos () {
      this.incluirCasosConcluidos = false
      if (this.soloMisCasos) this.url = `${url}?idTipoProceso=${this.tab}&misCasos=${this.global.usuario.id}`
      else this.url = `${url}?idTipoProceso=${this.tab}`
    },
    adicionarMisCasos () {
      this.soloMisCasos = true
      if (this.incluirCasosConcluidos) this.url = `${url}?idTipoProceso=${this.tab}&casoConcluido=TRUE&misCasos=${this.global.usuario.id}`
      else this.url = `${url}?idTipoProceso=${this.tab}&misCasos=${this.global.usuario.id}`
    },
    removerMisCasos () {
      this.soloMisCasos = false
      if (this.incluirCasosConcluidos) this.url = `${url}?idTipoProceso=${this.tab}&casoConcluido=TRUE`
      else this.url = `${url}?idTipoProceso=${this.tab}`
    },
    async getTipoParticipante () {
      const { rows } = await this.$axios.get(`system/parametros?grupo=TIPO_PARTICIPANTE&grupo=TIPO_PARTICIPANTE_SLIM&idProceso=${this.tab}`)
      const nuevaLista = []
      for (const row of rows) {
        nuevaLista.push({
          id: row.id,
          tipo: row.nombre,
          participantes: []
        })
      }
      return nuevaLista
    },
    ...mapGetters({
      getProcesosUsuario: 'global/getProcesosUsuario'
    }),
    getParticipantesAgrupados (participantes) {
      const nuevoGrupo = []
      for (const grupo of this.tiposParticipante) {
        nuevoGrupo.push({
          tipo: grupo.tipo,
          participantes: participantes.filter(x => x.idTipoParticipante === grupo.id)
        })
      }
      return nuevoGrupo
    },
    async reporteDenuncia (id, participantes, data) {
      let slim = false
      if (data.slim) {
        slim = true
      }
      const idRol = this.global.rolactual.id
      if (idRol === this.idRolSocial) {
        const self = this
        this.$q.dialog({
          title: 'Atención',
          message: 'Seleccione el tipo de pdf a generar',
          options: {
            type: 'radio',
            model: '1',
            // isValid: val => val === 'opt2',
            // inline: true
            items: [
              { label: 'Ficha Social', value: '1' },
              { label: 'Formulario de Citación', value: '2' },
              { label: 'Ficha de Coordinación Interinstitucional', value: '5' },
              { label: 'Reporte del seguimiento', value: '6' }
              /* { label: 'Formulario de Inasistencia', value: '3' },
              { label: 'Formulario de Incumplimiento', value: '4' } */
            ]
          },
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
          if (data === '5') {
            const opcionesSD = this.defensorias.length > 0 ? this.defensorias : this.slims
            self.slimDefensoriaOption(data, opcionesSD, id, idRol)
          } if (data === '6') {
            const archivo = await self.$axios.get(`denuncias/denuncia/${id}/reporte?idRol=${idRol}&nro=${data}`)
            self.pdfDenuncia = archivo
            self.dialogPdf = true
          } else {
            participantes = this.filtrarParticipantesParaPdf(participantes)
            self.trabajoVictimasPdf(data, participantes, id, idRol)
          }
        }).onCancel(() => {})
      } else if (idRol === this.idRolPsicologia) {
        const self = this
        this.$q.dialog({
          title: 'Atención',
          message: 'Seleccione el tipo de pdf a generar',
          options: {
            type: 'radio',
            model: '1',
            // isValid: val => val === 'opt2',
            // inline: true
            items: [
              { label: 'Contención Emocional', value: '1' },
              { label: 'Acompañamiento a la víctima', value: '2' },
              { label: 'Orientacíon Psicoeducativa', value: '3' },
              { label: 'Evaluación Psicológica', value: '4' },
              { label: 'Terapia Psicológica', value: '5' },
              { label: 'Actividad Psicológica', value: '6' },
              { label: 'Coordinacion Interinstitucional Psicológica', value: '7' },
              { label: 'Formulario de citación', value: '8' },
              { label: 'Ficha de Coordinación Interinstitucional', value: '9' },
              { label: 'Reporte del seguimiento', value: '10' }
            ]
          },
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
          if (data === '9') {
            const opcionesSD = this.defensorias.length > 0 ? this.defensorias : this.slims
            self.slimDefensoriaOption(data, opcionesSD, id, idRol)
          } if (data === '10') {
            const archivo = await self.$axios.get(`denuncias/denuncia/${id}/reporte?idRol=${idRol}&nro=${data}`)
            self.pdfDenuncia = archivo
            self.dialogPdf = true
          } else {
            participantes = this.filtrarParticipantesParaPdf(participantes)
            self.trabajoVictimasPdf(data, participantes, id, idRol)
          }
        }).onCancel(() => {})
      } else if (this.idRolVentanilla === idRol) {
        const self = this
        this.$q.dialog({
          title: 'Atención',
          message: 'Seleccione el tipo de pdf a generar',
          options: {
            type: 'radio',
            model: '1',
            // isValid: val => val === 'opt2',
            // inline: true
            items: [
              { label: 'Orientación', value: '1' },
              { label: 'Formulario de Citación', value: '2' },
              { label: slim ? 'Generar formulario SLIM' : 'Generar formulario DEFENSORÍA', value: slim ? '3' : '4' },
              { label: 'Ficha de Coordinación Interinstitucional', value: '5' },
              { label: 'Reporte del seguimiento', value: '6' }
              /* { label: 'Formulario de Inasistencia', value: '3' },
              { label: 'Formulario de Incumplimiento', value: '4' } */
            ]
          },
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
          if (data === '5') {
            const opcionesSD = this.defensorias.length > 0 ? this.defensorias : this.slims
            self.slimDefensoriaOption(data, opcionesSD, id, idRol)
          } if (data === '6') {
            const archivo = await self.$axios.get(`denuncias/denuncia/${id}/reporte?idRol=${idRol}&nro=${data}`)
            self.pdfDenuncia = archivo
            self.dialogPdf = true
          } else {
            participantes = this.filtrarParticipantesParaPdf(participantes)
            self.trabajoVictimasPdf(data, participantes, id, idRol)
          }
        }).onCancel(() => {})
      } else {
        const self = this
        this.$q.dialog({
          title: 'Atención',
          message: 'Seleccione el tipo de pdf a generar',
          options: {
            type: 'radio',
            model: '1',
            // isValid: val => val === 'opt2',
            // inline: true
            items: [
              { label: 'Reporte del seguimiento', value: '1' },
              { label: 'Formulario de Citación', value: '2' },
              { label: 'Ficha de Coordinación Interinstitucional', value: '3' }
              /* { label: 'Formulario de Inasistencia', value: '3' },
              { label: 'Formulario de Incumplimiento', value: '4' } */
            ]
          },
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
          if (data === '1') {
            const archivo = await self.$axios.get(`denuncias/denuncia/${id}/reporte?idRol=${idRol}&nro=${data}`)
            self.pdfDenuncia = archivo
            self.dialogPdf = true
          } if (data === '3') {
            const opcionesSD = this.defensorias.length > 0 ? this.defensorias : this.slims
            self.slimDefensoriaOption(data, opcionesSD, id, idRol)
          } else {
            participantes = this.filtrarParticipantesParaPdf(participantes)
            self.psicologiaVictimasPdf(data, participantes, id, idRol)
          }
        }).onCancel(() => {})
      }
    },
    trabajoVictimasPdf (numeroformulario, participantes, id, idRol) {
      const items = []
      participantes.forEach(participante => {
        items.push({
          label: participante.nombreCompleto,
          value: participante.id
        })
      })
      const self = this
      this.$q.dialog({
        title: 'Atención',
        message: 'Seleccione la Víctima',
        options: {
          type: 'radio',
          model: '1',
          // isValid: val => val === 'opt2',
          // inline: true
          items
        },
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
        const archivo = await self.$axios.get(`denuncias/denuncia/${id}/reporte?idRol=${idRol}&nro=${numeroformulario}&idParticipante=${data}`)
        self.pdfDenuncia = archivo
        self.dialogPdf = true
      }).onCancel(() => {})
    },
    psicologiaVictimasPdf (numeroformulario, participantes, id, idRol) {
      const items = []
      participantes.forEach(participante => {
        items.push({
          label: participante.nombreCompleto,
          value: participante.id
        })
      })
      const self = this
      this.$q.dialog({
        title: 'Atención',
        message: 'Seleccione la Víctima',
        options: {
          type: 'radio',
          model: '1',
          // isValid: val => val === 'opt2',
          // inline: true
          items
        },
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
        const archivo = await self.$axios.get(`denuncias/denuncia/${id}/reporte?idRol=${idRol}&nro=${numeroformulario}&idParticipante=${data}`)
        self.pdfDenuncia = archivo
        self.dialogPdf = true
      }).onCancel(() => {})
    },
    slimDefensoriaOption (numeroformulario, opciones, id, idRol) {
      const items = []
      opciones.forEach(opcion => {
        items.push({
          label: opcion.nombre,
          value: opcion.id
        })
      })
      const self = this
      this.$q.dialog({
        title: 'Opciones',
        message: 'Seleccione la Opción al cuál va a derivar el caso',
        options: {
          type: 'radio',
          model: '1',
          // isValid: val => val === 'opt2',
          // inline: true
          items
        },
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
        const archivo = await self.$axios.get(`denuncias/denuncia/${id}/reporte?idRol=${idRol}&nro=${numeroformulario}&idParametro=${data}`)
        self.pdfDenuncia = archivo
        self.dialogPdf = true
      }).onCancel(() => {})
    },
    filtrarParticipantesParaPdf (participantes) {
      return participantes.filter(dat =>
        dat.idTipoParticipante === this.idParticipanteVictima ||
        dat.idTipoParticipante === this.idParticipanteDenunciante ||
        dat.idTipoParticipante === this.idParticipanteVictimaSlim ||
        dat.idTipoParticipante === this.idParticipanteDenuncianteSlim
      )
    },
    resetForm () {
      // this.step = 0
      this.denuncia = {
        estado: 'ACTIVO',
        etiquetas: [],
        idEntidad: this.$store.state.global.usuario.entidad.id
      }

      /* const f2Index = this.formularios.findIndex(dat => dat.id === process.env.ID_FORMULARIO_VICTIMA)
      if (f2Index === -1) throw new Error('No se encontro el formulario')
      const index = this.formularios[f2Index].configuracion.findIndex(dat => { return dat.name === 'participantes' })
      this.formularios[f2Index].configuracion[index].value = '[]'

      this.denunciaSaj = {
        idSucursal: null,
        reasignacion: null,
        sucursal: null,
        justificacionRecepcion: null
      } */
      /* index = this.formularios[0].configuracion.findIndex(dat => { return dat.name === 'codigoSaj' })
      this.formularios[0].configuracion[index].value = null */
    },
    editar (denuncia) {
      this.denuncia = { ...denuncia }
      this.$refs.crudTable.openModal()
    },
    reasignar (props, denuncia) {
      this.denuncia = { ...denuncia }
      this.dialogReasignacion = true
    },
    async reasignado () {
      try {
        this.denuncia = {
          estado: 'ACTIVO',
          etiquetas: [],
          idEntidad: this.$store.state.global.usuario.entidad.id
        }
        this.dialogReasignacion = false
        await this.$refs.crudTable.updateList()
      } catch (e) {
        console.log(e)
      }
    },
    async guardar (datos) {
      const form = {
        delitos: [],
        violenciaFisica: [],
        violenciaPsicologica: [],
        violenciaSexual: [],
        delitoPenalSlim: [],
        etiquetas: []
      }
      let codigoSaj = ''
      try {
        for (const campo of datos) {
          if (campo.name === 'etiquetas') {
            form.etiquetas.push(campo.value)
          } else if (campo.name === 'delitos') {
            form.delitos.push(campo.value)
          } else if (campo.name === 'violenciaFisica') {
            form.violenciaFisica.push(campo.value)
          } else if (campo.name === 'violenciaPsicologica') {
            form.violenciaPsicologica.push(campo.value)
          } else if (campo.name === 'violenciaSexual') {
            form.violenciaSexual.push(campo.value)
          } else if (campo.name === 'delitoPenalSlim') {
            form.delitoPenalSlim.push(campo.value)
          } else {
            form[campo.name] = campo.value
          }
          if (campo.name === 'codigoSaj') {
            codigoSaj = campo.value
          }
        }
        if (this.denuncia.etiquetas.length > 0) {
          form.etiquetas = this.denuncia.etiquetas.toString()
        } else {
          form.etiquetas = ''
        }
        // form.rolActual = this.global.rolActual
        form.rolActual = this.global.rolactual.id
        form.idEntidad = this.denuncia.idEntidad
        form.idTipoProceso = this.tab
        await this.$axios.post(this.url, form)
        this.resetForm()
        this.$refs.crudTable.closeModal()
        if (codigoSaj) {
          const usuario = this.global.usuario
          const data = {
            estado: 'RECEPCIONADO',
            funcionario: {
              numeroDocumento: usuario.numeroDocumento,
              nombreCompleto: `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
            },
            descripcion: 'SE RECEPCIONÓ EL CASO EN GAMEA',
            idSucursal: this.denunciaSaj.idSucursal,
            justificacion: this.denunciaSaj.justificacionRecepcion
          }
          await this.$axios.put(`denuncias/denuncia/cerrar/saj/${codigoSaj}`, data)
          /* const { data: respuestaPatch } = await axios({
            url: `${url}casos/${codigoSaj}/estado`,
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
          }) */
        }
        await this.$refs.crudTable.updateList()
        this.resetForm()
        this.step = 0
      } catch (error) {
        console.log(error)
        this.$alert.warning(error.message)
      }
    },
    async getFormulario (proceso) {
      this.formularios = []
      const rolActualId = (await this.$storage.get('rolactual')).id
      const datos = await this.$axios.get(`denuncias/proceso/${this.tab}?idRol=${rolActualId}`)
      const forms = datos.formularios
      this.consultado = false
      if (forms.length > 0) {
        for (const form of forms) {
          try {
            for (const element of form.configuracion) {
              element.visible = this.evaluarCondiciones(element, form.configuracion, element.reglas)
              element.value = null
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
        /* for (const formulario of this.formularios) {
          if (formulario.id === this.reglaInsert.formulario) {
            console.log(formulario.id)
            for (const iterator of formulario.configuracion) {
              console.log('==============FORMULARIO=================')
              console.log(iterator)
              console.log('==============FORMULARIO=================')
            }
          }
        } */
        // retirar para el saj
        this.consultado = true
      } /* else {
        this.$alert.error('El proceso  no tiene formulario')
      } */
    },
    save (e) {
      this.loading = true
      const formData = new FormData(e.target)
      const datos = []

      for (const [name, value] of formData.entries()) {
        datos.push({
          name,
          value
        })
      }
      this.guardar(datos)
    },
    ver (denuncia) {
      this.$router.push(`denuncia/${denuncia.row.id}`)
    },
    setValueDependencyUrl (direccion, dependency) {
      let url = direccion
      if (!url.includes('http')) url = `${process.env.BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`

      if (dependency) {
        if (dependency.value) {
          if (dependency.value === 'idTipoProceso') {
            url = this.setParameterUrl(url, dependency.name, this.tab)
          }
        }
      }
      return url
    },
    setParameterUrl (direccion, paramter, value) {
      const url = new URL(direccion)
      const searchParams = url.searchParams
      searchParams.set(paramter, value)
      url.search = searchParams.toString()
      return url.toString()
    },
    limpiarReporte () {
      this.$refs.crudTable.search = {}
      this.reporte = false
    },
    async aplicarBusquedaAvanzada () {
      if (this.search.length > 2) {
        this.filtroAvanzado.busquedaAvanzada = true
        // this.filtroAvanzado.idTipoProceso = this.tab
        if (this.search) {
          for (const filtro of this.filtros) {
            const _existeClave = Object.keys(this.filtroAvanzado).find(x => x === filtro)
            if (_existeClave) {
              if (!Array.isArray(this.filtroAvanzado[filtro])) {
                this.filtroAvanzado[filtro] = [this.filtroAvanzado[filtro]]
              }
              this.filtroAvanzado[filtro].push(this.search)
            } else {
              this.filtroAvanzado[filtro] = this.search
            }
          }
        }

        if (this.entidad) {
          this.filtroAvanzado.entidad = this.entidad
        }
        this.filtroConsultado = true
        await this.$refs.crudTable.updateList()
      }
    },
    limpiarBusqueda () {
      this.filtroAvanzado = {}
      this.entidad = null
      this.filtroConsultado = false
      this.search = ''
      setTimeout(async () => {
        await this.$refs.crudTable.updateList()
      }, 100)
    },
    async createValue (val, done) {
      if (val.length > 2) {
        if (!this.etiquetas.includes(val.toUpperCase())) {
          const respuesta = await this.$axios.post('system/parametros', {
            nombre: val.toUpperCase(),
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
      update(() => {
        if (val === '') {
          this.filterEntidades = this.entidades
        } else {
          const needle = val.toLowerCase()
          this.filterEntidades = this.entidades.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
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
    formatDate (stringDate) {
      return date.formatDate(`${stringDate} 23:59`, 'DD/MM/YYYY')
    },
    formatDateHour (stringDate) {
      return stringDate ? stringDate.replaceAll('-', '/') : ''
    },
    async pasoSiguiente () {
      this.consultado = false
      /* const valid = await this.$refs.formDenuncia.validate()
      if (valid && this.step === 0) {
        if (!this.denuncia.conCodigoSaj) {
          this.$refs.stepper.next()
          this.consultado = true
        } else if (!this.denunciaSaj.idSucursal && this.denuncia.codigoSaj) {
          await this.getCasoSaj()
          return null
        } else if (this.denunciaSaj.idSucursal) {
          this.$refs.stepper.next()
        }
      }

      if (this.step === 1 && this.dataSaj) {
        await this.insertarRegistrosSaj(this.dataSaj)
        this.consultado = true
      } */

      if (this.step === 0 && !this.dataSaj) {
        this.consultado = true
      }
    },
    cancelar () {
      this.resetForm()
    }
  }
}

</script>
<style>
.q-tab__indicator {
  opacity: 0;
  height: 6px !important;
  background: currentColor;
}
</style>
