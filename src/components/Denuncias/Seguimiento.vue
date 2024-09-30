<template>
  <q-card flat>
    <q-tabs
      v-model="tab"
      dense
    >
      <q-tab name="tab1" icon="timeline" label="Historial de asignación" />
      <q-tab name="tab2" icon="timeline" label="Historial Formulario" />
      <!-- <q-tab name="tab3" icon="timeline" label="Trabajo" /> -->
    </q-tabs>
    <q-card-section class="row q-col-gutter-md" v-if="tab === 'tab1'">
      <div class="col-xs-12">
        <div class="row">
          <div class="col-xs-12 col-md-3">
            <q-btn
              flat
              round
              color="primary"
              icon="refresh"
              @click="getSeguimiento"
            />
          </div>
          <div class="col-xs-12 col-md-9">
            <div class="text-h6 text-weight-bolder q-my-sm inline-block">
              <q-icon
                size="sm"
                name="timeline"
              /> Información historial
            </div>

          </div>
        </div>
        <q-space/>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none" v-if="tab === 'tab1'">
      <NuevoSeguimiento
        v-if="etapas.length > 0 && !denuncia.casoConcluido && (global.usuario.id === denuncia.idUsuarioAsignado || seguimientoHistorial)"
        :proceso="denuncia.idTipoProceso"
        :denuncia="denuncia.id"
        :slim="denuncia.slim"
        :defensoria="denuncia.defensoria"
        :checksPreliminar="denuncia.checksPreliminar"
        :checksPreparatoria="denuncia.checksPreparatoria"
        @nuevoSeguimiento="getSeguimiento"
        :etapas="etapas"
        :estado="denuncia.estadoActual"
      />
      <q-scroll-area style="height:75vh;">
        <q-timeline
          color="secondary"
          class="q-pl-md"
        >
          <q-timeline-entry
            v-for="seguimiento in seguimientos"
            :key="seguimiento.id"
            :title="seguimiento.etapaDenuncia + (seguimiento.etapaProcesal ? ' '+seguimiento.etapaProcesal.nombre : '')"
            :subtitle="seguimiento.fechaActuacion"
            :color="seguimiento.tipoSeguimiento== 'SISTEMA' ? 'secondary' : seguimiento.seAtendio ? 'green' : 'primary'"
            :icon="seguimiento.tipoSeguimiento=='SISTEMA'?'settings_suggest':undefined"
          >
            <template slot="default">
              <p class="text-justify q-mb-none">
                {{seguimiento.actuacion}}
                <br />
                <span class="text-caption text-grey">
                  Creado por : {{ getNombreUsuarioCreador(seguimiento)}}
                </span>
                <br/>
                <q-btn
                  v-if="global.usuario.id === seguimiento.userCreated && !seguimiento.seAtendio && seguimiento.tipoSeguimiento!=='SISTEMA'"
                  icon="done_all"
                  color="green"
                  size="sm"
                  @click="seDioAtencion(seguimiento.id)"
                />
                <q-btn
                  v-if="seguimiento.tipoSeguimiento!=='SISTEMA'"
                  icon="visibility"
                  color="primary"
                  size="sm"
                  @click="visualizarProceso(seguimiento, denuncia)"
                />
                <br/>
                <!-- <q-btn
                  v-if="global.usuario.id === seguimiento.userCreated && seguimiento.tipoSeguimiento!=='SISTEMA' && (global.usuario.id === denuncia.idUsuarioAsignado || seguimientoHistorial)"
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click="eliminarProceso(seguimiento.id)"
                /> -->
              </p>
              <q-expansion-item
                v-if="seguimiento.archivos.length>0"
                group="somegroup"
                icon="attach_file"
                label="VER ADJUNTOS"
                header-class="text-secondary"
              >
                <q-card>
                  <q-card-section>
                    <q-list>
                      <q-item
                        v-for="archivo in seguimiento.archivos"
                        :key="archivo.id"
                        clickable
                        v-ripple
                      >
                        <q-item-section @click="getAdjunto(archivo.id)">
                          <q-item-label>{{archivo.archivo}}</q-item-label>
                          <q-item-label
                            caption
                            lines="2"
                          >{{archivo.descripcion}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label
                            caption
                            lines="2"
                          >
                            <q-btn
                              v-if="global.usuario.id === archivo.userCreated && (global.usuario.id === denuncia.idUsuarioAsignado || seguimientoHistorial)"
                              size="xs"
                              icon="delete"
                              color="negative"
                              @click="eliminarAdjunto(archivo.id)"
                            />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </template>
          </q-timeline-entry>
        </q-timeline>
      </q-scroll-area>
    </q-card-section>
    <q-card-section class="row q-col-gutter-md" v-if="tab === 'tab2'">
      <div class="col-xs-12">
        <div class="row">
          <div class="col-xs-12 col-md-3">
            <q-btn
              flat
              round
              color="primary"
              icon="refresh"
              @click="getHistory"
            />
          </div>
          <div class="col-xs-12 col-md-9">
            <div class="text-h6 text-weight-bolder q-my-sm inline-block">
              <q-icon
                size="sm"
                name="timeline"
              /> Información historial
            </div>
          </div>
        </div>
        <q-space />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none" v-if="tab === 'tab2'">
      <q-scroll-area style="height:75vh;">
        <q-timeline
          color="secondary"
          class="q-pl-md"
        >
          <q-timeline-entry
            v-for="h in historialFormulario"
            :key="h.id"
            :subtitle="h.campo"
            :title="h.valor"
            color="primary"
            icon="settings_suggest"
          >
            <template slot="default">
              <p class="text-justify q-mb-none">
                En fecha {{(h.createdAt+'').substring(0,10)}}
                <br/>
                <span class="text-caption text-grey">
                  Por el usuario: {{ getNombreUsuarioCreadorHistorial(h)}}
                </span>
              </p>
            </template>
          </q-timeline-entry>
        </q-timeline>
      </q-scroll-area>
    </q-card-section>
    <!-- <q-card-section class="row q-col-gutter-md" v-if="tab === 'tab3'">
      <div class="col-xs-12">
        <div class="row">
          <div class="col-xs-12 col-md-3">
            <q-btn
              flat
              round
              color="primary"
              icon="refresh"
              @click="getTrabajo"
            />
          </div>
          <div class="col-xs-12 col-md-9">
            <div class="text-h6 text-weight-bolder q-my-sm inline-block">
              <q-icon
                size="sm"
                name="timeline"
              /> Información del trabajo realizado (usuario asignado)
            </div>
          </div>
        </div>
        <q-space />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none" v-if="tab === 'tab3'">
      <q-scroll-area style="height:75vh;">
        <q-timeline
          color="secondary"
          class="q-pl-md"
        >
          <q-timeline-entry
            v-for="t in trabajoFormulario"
            :key="t.id"
            :subtitle="t.estado"
            :title="t.trabajo"
            :color="calcularTiempo(t.createdAt, t.estado)"
            icon="settings_suggest"
          >
            <template slot="default">
              <p class="text-justify q-mb-none">
                En fecha {{(t.createdAt+'').substring(0,10)}}
                <br/>
                <span class="text-caption text-grey">
                  Por el usuario: {{ getNombreUsuarioCreadorHistorial(t)}}
                </span>
              </p>
            </template>
          </q-timeline-entry>
        </q-timeline>
      </q-scroll-area>
    </q-card-section> -->
    <q-dialog v-model="dialogVisible" persistent>
      <q-card>
        <q-card-section>
          <q-card-section class="text-center">
            DETALLES
          </q-card-section>

          <q-card-section>
            <p><strong>{{ seguimientoActual ? seguimientoActual.etapaDenuncia : '' }}</strong></p>
            <p>Fecha de inicio: <strong>{{ seguimientoActual ? seguimientoActual.fechaInicio : '' }}</strong></p>
            <p>Fecha estimada de finalización: <strong>{{ seguimientoActual ? seguimientoActual.fechaFin : '' }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === preliminarId">
            <p>Fecha Situación Jurídica Preliminar: <strong>{{ seguimientoActual.fechaPreliminar }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === rechazoObjecionId">
            <p>Fecha del rechazo con objeción: <strong>{{ seguimientoActual.fechaRechazoCon }}</strong></p>
            <p>N° de resolución jerárquica: <strong>{{ seguimientoActual.numeroResolucion }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === rechazoSinObjecionId">
            <p>Fecha del rechazo sin objeción: <strong>{{ seguimientoActual.fechaRechazoSin }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === preparatoriaImputacionId">
            <p>Delito por el que se ha imputado: <strong>{{ seguimientoActual.delitoImputacion ? seguimientoActual.delitoImputacion.nombre : '' }}</strong></p>
            <p>Fecha de la imputación: <strong>{{ seguimientoActual.fechaImputacion }}</strong></p>
            <p>Fecha de audiencia de medida cautelar: <strong>{{ seguimientoActual.fechaMedidaCautelar }}</strong></p>
            <p>Fecha de audiencia de situación jurídica del imputado: <strong>{{ seguimientoActual.fechaAudiencia }}</strong></p>
            <p>Medida cautelar de cararter personal: <strong>{{ seguimientoActual.medidaCautelar ? seguimientoActual.medidaCautelar.nombre : '' }}</strong></p>
            <p>Meses de la detención: <strong>{{ seguimientoActual.mesesDetencion }}</strong></p>
            <p>Ampliación de la detención en meses: <strong>{{ seguimientoActual.mesesAmpliacion }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === sobreseimientoImpugnacionId">
            <p>Delito por el que se ha sobreseido: <strong>{{ seguimientoActual.delitoConImpugnacion ? seguimientoActual.delitoConImpugnacion.nombre : '' }}</strong></p>
            <p>Fecha del sobreseimiento con impugnación: <strong>{{ seguimientoActual.fechaConImpugnacion }}</strong></p>
            <p>N° de resolución jerárquica: <strong>{{ seguimientoActual.numeroResolucionConImpugnacion }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === sobreseimientoSinImpugnacionId">
            <p>Delito por el que se ha sobreseido: <strong>{{ seguimientoActual.delitoSinImpugnacion ? seguimientoActual.delitoSinImpugnacion.nombre : '' }}</strong></p>
            <p>Fecha del sobreseimiento sin impugnación: <strong>{{ seguimientoActual.fechaSinImpugnacion }}</strong></p>
            <p>Motivo de la no impugnación: <strong>{{ seguimientoActual.numeroResolucionSinImpugnacion }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === acusacionId">
            <p>Fecha de la acusación Fiscal: <strong>{{ seguimientoActual.fechaAcusacionFiscal }}</strong></p>
            <p>Fecha de la acusación Particular: <strong>{{ seguimientoActual.fechaAcusacionParticular }}</strong></p>
            <p>Fecha de la acusación de Las Defensorias de la niñez y Adolecencia: <strong>{{ seguimientoActual.fechaAcusacionDefensorias }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === juicioOralId">
            <p>Fecha de apertura de juicio oral: <strong>{{ seguimientoActual.fechaJuicioOral }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === sentenciaAbsolutoriaId">
            <p>Delito por el que se ha absuelto: <strong>{{ seguimientoActual.delitoSentenciaAbsolutoria ? seguimientoActual.delitoSentenciaAbsolutoria.nombre : '' }}</strong></p>
            <p>Fecha de la sentencia: <strong>{{ seguimientoActual.fechaSentAbsolutoria }}</strong></p>
            <p>N° de sentencia: <strong>{{ seguimientoActual.numeroSentencia }}</strong></p>
            <p>¿Se presentó?: <strong>{{ seguimientoActual.idPresentoSentAbsolutoria }}</strong></p>
            <p>Recurso de apelación restringida: <strong>{{ seguimientoActual.recursoSentAbsolutoria }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === sentenciaCondenatoriaId">
            <p>Delito por el que se ha condenado: <strong>{{ seguimientoActual.delitoSentenciaCondenatoria ? seguimientoActual.delitoSentenciaCondenatoria.nombre : '' }}</strong></p>
            <p>Fecha de la sentencia: <strong>{{ seguimientoActual.fechaSentencia }}</strong></p>
            <p>Años de sentencia: <strong>{{ seguimientoActual.aniosSentencia }}</strong></p>
            <p>Meses de sentencia: <strong>{{ seguimientoActual.mesesSentencia }}</strong></p>
            <p>Días de multa: <strong>{{ seguimientoActual.diasMulta }}</strong></p>
            <p>Penal donde se esta cumpliendo la sentencia: <strong>{{ seguimientoActual.penal ? seguimientoActual.penal.nombre : '' }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === sentenciaMixtaId">
            <p>Delito por el que se ha condenado: <strong>{{ seguimientoActual.delitoSentenciaCondenatoriaMixta ? seguimientoActual.delitoSentenciaCondenatoriaMixta.nombre : '' }}</strong></p>
            <p>Delito por el que se ha absuelto: <strong>{{ seguimientoActual.delitoSentenciaAbsolutoriaMixta ? seguimientoActual.delitoSentenciaAbsolutoriaMixta.nombre : '' }}</strong></p>
            <p>Fecha de sentencia mixta: <strong>{{ seguimientoActual.fechaSentMixta }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === recursoId">
            <p>Fecha de planteamiento del recurso: <strong>{{ seguimientoActual.fechaPlanteamiento }}</strong></p>
            <p>Fecha de notificación del recurso: <strong>{{ seguimientoActual.fechaNotificacion }}</strong></p>
          </q-card-section>

          <q-card-section v-if="seguimientoActual && seguimientoActual.idEtapaProcesal === ejecucionId">
            <p>Auto interlocutorio de ejecución de sentencia: <strong>{{ seguimientoActual.autoInterlocutorio }}</strong></p>
          </q-card-section>

          <q-card-section>
            <div v-if="seguimientoActual && seguimientoActual.participantes">
              <div
                v-for="(grupo, index) of getParticipantesAgrupados(seguimientoActual.participantes)"
                :key="index"
              >
                <div v-if="grupo.participantes.length > 0">
                  <span class="text-bold text-caption">{{ grupo.tipo }}(S)</span>
                  <li
                    v-for="(participante, index2) of grupo.participantes"
                    :key="index2"
                    class="text-caption q-pl-md"
                  >
                    {{ participante.nombreCompleto }} - {{ participante.numeroDocumento }}
                  </li>
                  <br>
                </div>
              </div>
            </div>
            <p v-if="seguimientoActual && seguimientoActual.fechaActuacion">Fecha actuación: <strong>{{ seguimientoActual.fechaActuacion }}</strong></p>
            <p>Actuación: <strong>{{ seguimientoActual ? seguimientoActual.actuacion : '' }}</strong></p>
            <p>Se dió atención: <strong>{{ seguimientoActual && seguimientoActual.seAtendio ? 'SI' : 'NO' }}</strong> </p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Cerrar" color="primary" @click="dialogVisible = false" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
import NuevoSeguimiento from '@components/Denuncias/NuevoSeguimiento'
import MixinParametros from '@components/Denuncias/mixins/parametros'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  components: {
    NuevoSeguimiento
  },
  mixins: [
    MixinParametros
  ],
  props: {
    denuncia: {
      type: Object,
      default: () => {
        return {
          seguimiento: []
        }
      }
    },
    etapas: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      seguimientos: [],
      historialFormulario: [],
      trabajoFormulario: [],
      tab: 'tab1',
      // agregados
      patrocinioId: null,
      orientacionId: null,
      psicologiaId: null,
      socialId: null,
      preliminarId: null,
      rechazoObjecionId: null,
      rechazoSinObjecionId: null,
      preparatoriaImputacionId: null,
      sobreseimientoImpugnacionId: null,
      sobreseimientoSinImpugnacionId: null,
      acusacionId: null,
      juicioOralId: null,
      sentenciaAbsolutoriaId: null,
      sentenciaCondenatoriaId: null,
      sentenciaMixtaId: null,
      recursoId: null,
      ejecucionId: null,
      dialogVisible: false,
      seguimientoActual: null,
      tiposParticipante: null
    }
  },
  computed: {
    ...mapState(['global']),
    seguimientoHistorial () {
      const index = this.denuncia.asignacionAnterior.findIndex(dat => { return dat === this.global.usuario.id })
      return index !== -1
    }
  },
  async mounted () {
    try {
      const { rows } = await this.$axios.get(`denuncias/seguimiento?idDenuncia=${this.denuncia.id}`)
      this.procesarFechas(rows)
      const resp = await this.$axios.get('denuncias/historial?idDenuncia=' + this.denuncia.id)
      this.historialFormulario = resp.rows

      const {
        preliminarId,
        rechazoObjecionId,
        rechazoSinObjecionId,
        preparatoriaImputacionId,
        sobreseimientoImpugnacionId,
        sobreseimientoSinImpugnacionId,
        acusacionId,
        juicioOralId,
        sentenciaAbsolutoriaId,
        sentenciaCondenatoriaId,
        sentenciaMixtaId,
        recursoId,
        ejecucionId
      } = await this.$axios.get(`/system/parametros/procesos/ids?idProceso=${this.denuncia.idTipoProceso}`)

      this.tiposParticipante = await this.getTipoParticipante()

      this.preliminarId = preliminarId
      this.rechazoObjecionId = rechazoObjecionId
      this.rechazoSinObjecionId = rechazoSinObjecionId
      this.preparatoriaImputacionId = preparatoriaImputacionId
      this.sobreseimientoImpugnacionId = sobreseimientoImpugnacionId
      this.sobreseimientoSinImpugnacionId = sobreseimientoSinImpugnacionId
      this.acusacionId = acusacionId
      this.juicioOralId = juicioOralId
      this.sentenciaAbsolutoriaId = sentenciaAbsolutoriaId
      this.sentenciaCondenatoriaId = sentenciaCondenatoriaId
      this.sentenciaMixtaId = sentenciaMixtaId
      this.recursoId = recursoId
      this.ejecucionId = ejecucionId

      /* const resp2 = await this.$axios.get('denuncias/trabajo?idDenuncia=' + this.denuncia.id)
      this.trabajoFormulario = resp2.rows */
    } catch (error) { }
  },
  methods: {
    procesarFechas (seguimientos) {
      /* let order = []
      let temporal = []
      for (let z = 0; z < seguimientos.length; z++) {
        const elm = seguimientos[z]
        if (elm.tipoSeguimiento === 'SISTEMA') {
          if (temporal.length > 0) {
            temporal = this.ordenarTemporal(temporal)
            order = order.concat(temporal)
            temporal = []
          }
          order.push(elm)
        } else {
          temporal.push(elm)
        }
      }
      this.seguimientos = order */
      this.seguimientos = seguimientos
    },
    ordenarTemporal (array) {
      return array.sort((a, b) => moment(b.fechaActuacion).unix() - moment(a.fechaActuacion).unix())
    },
    async getAdjunto (id) {
      const { nombre, codigo } = await this.$axios.get(`denuncias/archivo/${id}`)
      const a = document.createElement('a')
      const ext = nombre.split('.')
      const mimes = {
        pdf: 'application/pdf',
        png: 'image/png',
        jpg: 'image/jpg',
        jpeg: 'image/jpeg',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ppt: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      }
      a.href = `data:${mimes[ext[ext.length - 1].toLowerCase()]};base64,${codigo}`
      a.download = nombre
      a.click()
    },
    async eliminarAdjunto (id) {
      const self = this
      this.$q.dialog({
        title: 'Atención',
        message: '¿Esta Segur@ de eliminar este archivo?, recuerde que toda acción de eliminación queda registrada con nombre y usuario',
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
        await self.$axios.delete(`denuncias/archivo/${id}`)
        self.getSeguimiento()
      }).onCancel(() => {})
    },
    async eliminarProceso (id) {
      const self = this
      this.$q.dialog({
        title: 'Atención',
        message: '¿Esta Segur@ de eliminar este proceso?, recuerde que toda acción de eliminación queda registrada con nombre y usuario. Así mismo se eliminarán todos los archivos adjuntos a este',
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
        await self.$axios.delete(`denuncias/seguimiento/${id}`)
        self.getSeguimiento()
      }).onCancel(() => {})
    },
    async getSeguimiento () {
      const respuesta = await this.$axios.get(`denuncias/seguimiento?idDenuncia=${this.denuncia.id}`)
      this.procesarFechas(respuesta.rows)
    },
    async nombreParametro (id) {
      const respuesta = await this.$axios.get(`/system/parametros/${id}`)
      return respuesta.nombre
    },
    async getHistory () {
      const resp = await this.$axios.get('denuncias/historial?idDenuncia=' + this.denuncia.id)
      this.historialFormulario = resp.rows
    },
    /* async getTrabajo () {
      const resp = await this.$axios.get(`denuncias/trabajo?idDenuncia=${this.denuncia.id}`)
      this.trabajoFormulario = resp.rows
    }, */
    getNombreUsuarioCreador (seguimiento) {
      const usuario = seguimiento.usuarioCreacion
      return `${usuario.nombres ? usuario.nombres : ''} ${usuario.primerApellido ? usuario.primerApellido : ''} ${usuario.segundoApellido ? usuario.segundoApellido : ''}`
    },
    getNombreUsuarioCreadorHistorial (historial) {
      const usuario = historial.usuario
      return `${usuario.nombres ? usuario.nombres : ''} ${usuario.primerApellido ? usuario.primerApellido : ''} ${usuario.segundoApellido ? usuario.segundoApellido : ''}`
    },
    calcularTiempo (date, estado) {
      if (estado === 'INACTIVO') return 'primary'
      const fechaInicial = moment(date, 'DD-MM-YYYY')
      const fechaActual = moment()
      const dias = fechaActual.diff(fechaInicial, 'days')
      if (dias < 6 || dias === 732 || dias === 733) return 'green'
      else if (dias >= 6 && dias <= 12) return 'warning'
      else return 'red'
    },
    visualizarProceso (seguimiento, denuncia) {
      this.seguimientoActual = seguimiento
      this.dialogVisible = true
    },
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
    async getTipoParticipante () {
      const { rows } = await this.$axios.get(`system/parametros?grupo=TIPO_PARTICIPANTE&grupo=TIPO_PARTICIPANTE_SLIM&idProceso=${this.denuncia.idTipoProceso}`)
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
    seDioAtencion (id) {
      const self = this
      this.$q.dialog({
        title: 'Atención',
        message: '¿Esta Segur@ de cambiar el estado?, recuerde que toda acción de finalización de tarea queda registrado',
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
        await self.$axios.put(`denuncias/seguimiento/atencion/${id}`, { seAtendio: true })
        self.getSeguimiento()
      }).onCancel(() => {})
    }
  }
}
</script>
<style>
.q-timeline__content {
  padding-bottom: 10px !important;
}
</style>
