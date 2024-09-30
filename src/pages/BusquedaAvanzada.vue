<template>
  <q-page>
    <Titulo
      icono="search"
      titulo="Busqueda Avanzada"
    ></Titulo>

    <q-tabs
      v-model="search.idTipoProceso"
      class="q-mx-md"
      active-color="white"
      active-bg-color="accent"
      indicator-color="white"
      switch-indicator
      align="left"
      @input="changeTab"
    >
      <q-tab
        :name="proceso.id"
        :label="proceso.nombre"
        v-for="proceso in tiposProcesoHabilitados"
        :key="proceso.key"
      />
    </q-tabs>

    <CrudTable
      titulo="Usuarios"
      :url="url"
      :columns="getColumns"
      order="_created_at"
      ref="crudTable"
      :dialog.sync="dialog"
      :wrap="true"
    >
      <template slot="headers">
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <q-expansion-item
              v-if="global.permisos['busqueda:filtrado:avanzado']"
              v-model="expansionFiltros"
              header-class="text-primary text-bold"
              expand-separator
              icon="search"
              label="Mostrar filtros"
              caption="Se muestran los filtros por secciones"
            >
              <q-card>
                <q-card-section>
                  <div class="row q-col-gutter-xs">
                    <div
                      class="col-xs-12"
                      v-for="(seccion, i) of filters"
                      :key="i"
                    >
                      <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                          <span class="text-primary text-body2 text-bold">{{ seccion.titulo  }}</span>
                        </div>
                        <div
                          v-for="(item, index) of seccion.filtros"
                          :key="index"
                          align="center"
                          class="col-xs-12 col-sm-6 col-md-3"
                        >
                          <q-select
                            v-if="item.type === 'select'"
                            behavior="menu"
                            clearable
                            :label="item.label"
                            filled
                            dense
                            :multiple="item.multiple"
                            :use-chips="item.multiple"
                            v-model="search[item.value]"
                            :options="item.options"
                            emit-value
                            map-options
                            use-input
                            @filter="(val, update) => filtrar(item, val, update)"
                          />
                          <q-checkbox
                            v-if="item.type === 'checkbox'"
                            :label="item.label"
                            filled
                            dense
                            v-model="search[item.value]"
                            autofocus
                          />
                          <q-input
                            v-if="item.type === 'input'"
                            clearable
                            :label="item.label"
                            filled
                            dense
                            v-model="search[item.value]"
                            autofocus
                          />
                          <q-input
                            v-if="item.type === 'date'"
                            clearable
                            filled
                            v-model="search[item.value]"
                            :label="item.label"
                            dense
                          >
                            <template
                              v-slot:append
                              :props="item"
                            >
                              <q-icon
                                name="event"
                                class="cursor-pointer"
                              >
                                <q-popup-proxy
                                  :ref="item.value"
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
                                  <q-date
                                    v-model="search[item.value]"
                                    color="primary"
                                    mask="YYYY-MM-DD"
                                    @input="(evt) => ocultarPopup(evt, item.value)"
                                  />
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </div>
      </template>
      <template slot="buttons">
        <q-btn
          icon="search"
          label="Realizar busqueda"
          color="primary"
          @click="realizarBusqueda"
        />
      </template>
      <template slot="buttons">
        <q-btn
          icon="search"
          label="Generar excel"
          color="secondary"
          @click="generarExcel"
        />
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
      <template v-slot:row="props">
        <q-tr>
          <q-td>
            <q-btn
              v-if="global.permisos['denuncia:ver']"
              class="q-pa-xs"
              flat
              round
              color="secondary"
              icon="visibility"
              @click="ver(props,props.row)"
            />
          </q-td>
          <q-td>{{ props.row.codigoDenuncia }}</q-td>
          <q-td>{{ props.row.correlativoGamea }}</q-td>
          <q-td class="text-center">{{ formatDate(props.row.fechaDenuncia) }}</q-td>
          <q-td class="text-center">{{ props.row.zona && props.row.zona.nombre ? props.row.zona.nombre : null }}</q-td>
          <q-td class="text-center">{{ props.row.defensoria?props.row.defensoria.nombre:'' }}</q-td>
          <q-td class="text-center">{{ props.row.slim?props.row.slim.nombre:'' }}</q-td>
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
                    {{ participante.nombre_completo }} - {{ participante.numero_documento }}
                  </li>
                  <br>
                </div>
              </div>
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
  </q-page>
</template>

<script>
import CrudTable from '@components/CrudTable/CrudTable'
import CrudTableMixin from '@components/CrudTable/mixins/crud-table'
import Titulo from '@components/common/Titulo'
import parametros from '@common/Mixins/parametros'
import { mapState, mapGetters } from 'vuex'
import { date } from 'quasar'
import axios from 'axios'
const urlOriginal = 'denuncias/denuncia/listado/filtrado-avanzado'

const filtros = [
  { label: 'DEPARTAMENTO', value: 'departamento', type: 'STRING' },
  { label: 'FECHA DE LA DENUNCIA', value: 'provincia', type: 'STRING' }
]

export default {
  mixins: [parametros, CrudTableMixin],
  components: {
    CrudTable,
    Titulo
  },
  data () {
    return {
      incluirCasosConcluidos: false,
      expansionFiltros: false,
      tab: null,
      tiposParticipante: {},
      filtrosDisponibles: filtros,
      tiposProcesoHabilitados: [],
      formularios: [],
      consultado: false,
      url: urlOriginal,
      dialog: false,
      denuncia: { estado: 'ACTIVO' },
      filters: [],
      entidades: [],
      entidad: [],
      proceso: [],
      filtros: [],
      search: {
        idTipoProceso: null,
        codigoDenuncia: null,
        idTipoOrigen: null,
        estadoDenuncia: null,
        etapaDenuncia: null,
        fechaDenuncia: null,
        usuarioAsignado: null,
        lugarHecho: null,
        fiscal: null,
        denominacion: null,
        idDelito: null,
        delitos: null,
        numeroFiscalia: null,
        nurej: null,
        fiscalAsignado: null,
        juzgado: null,
        policia: null,
        relacionHecho: null,
        tipoParticipante: null,
        tipoDocumento: null,
        numeroDocumentoPartes: null,
        nombreCompleto: null,
        direccion: null,
        situacionJuridica: null,
        medidaCautelar: null,
        tipoBien: null,
        descripcion: null,
        delitoPrecedente: null,
        observaciones: null
      },
      registrosSinPaginacion: [],
      getColumns: [
        {
          name: 'acciones',
          label: 'Acciones',
          sortable: false
        },
        {
          name: 'codigoDenuncia',
          label: 'Codigo Denuncia',
          sortable: false,
          align: 'left'
        },
        {
          name: 'correlativoGamea',
          label: 'Código Gamea',
          sortable: false,
          align: 'left'
        },
        {
          name: 'fechaDenuncia',
          label: 'Fecha del Hecho',
          sortable: false
        },
        {
          name: 'zona',
          label: 'Zona o Urbanización',
          sortable: true
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
          label: 'concluido',
          sortable: false
        },
        {
          label: 'Tipo de conclusion',
          sortable: false
        },
        {
          label: 'Participantes',
          sortable: false
        },
        {
          label: 'Usuario asignado',
          sortable: false
        }
      ],
      filterEntidades: [],
      tablaVisible: true
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
  async mounted () {
    this.tiposProcesoHabilitados = await this.getProcesosUsuario()
    this.search.idTipoProceso = this.tiposProcesoHabilitados[0].id

    this.tiposParticipante = await this.getTipoParticipante()

    this.expansionFiltros = Boolean(this.$route.query)
    for (const key in this.$route.query) {
      if (key !== 'idTipoProceso') this.tab = this.$route.query[key]

      this.search[key] = JSON.parse(JSON.stringify(this.$route.query[key]))
    }

    await this.changeTab()
  },
  methods: {
    async generarExcel () {
      // await this.$axios.get(`denuncias/denuncia/excel/filtrado-datos?idTipoProceso=${this.search.idTipoProceso}`)
      this.tablaVisible = false
      const consulta = []
      for (const key in this.search) {
        if (this.search[key]) {
          if (Array.isArray(this.search[key])) {
            for (const valor of this.search[key]) {
              consulta.push(`${key}=${valor}`)
            }
          } else {
            consulta.push(`${key}=${this.search[key]}`)
          }
        }
      }
      // this.url = `${urlExcel}?${consulta.join('&')}`
      this.tablaVisible = true
      let queryExcel = ''
      for (let z = 0; z < consulta.length; z++) {
        const elm = consulta[z]
        if (z === 0) {
          queryExcel += elm
        } else {
          queryExcel += `&${elm}`
        }
      }
      const { data } = await axios({
        url: `${process.env.BACKEND_URL}/api/denuncias/denuncia/excel/filtrado-datos?${queryExcel}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${this.$storage.get('token')}` },
        responseType: 'arraybuffer'
      })
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    },
    /* async base64toBlob (base64Data, contentType) {
      contentType = contentType || ''
      const sliceSize = 1024
      const byteCharacters = window.atob(base64Data)
      const bytesLength = byteCharacters.length
      const slicesCount = Math.ceil(bytesLength / sliceSize)
      const byteArrays = new Array(slicesCount)

      for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize
        const end = Math.min(begin + sliceSize, bytesLength)

        const bytes = new Array(end - begin)
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0)
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes)
      }
      return new Blob(byteArrays, { type: contentType })
    }, */
    async getTipoParticipante () {
      const { rows } = await this.$axios.get('system/parametros?grupo=TIPO_PARTICIPANTE&idProceso=0a190c5a-c5b7-47d1-9bad-faef5f8689d2')
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
    async adicionarCasosConcluidos () {
      this.incluirCasosConcluidos = true
      this.search.casoConcluido = true
      this.realizarBusqueda()
    },
    removerCasosConcluidos () {
      this.incluirCasosConcluidos = false
      this.search.casoConcluido = null
      this.realizarBusqueda()
    },
    ...mapGetters({ getProcesosUsuario: 'global/getProcesosUsuario' }),
    async changeTab () {
      await this.getFiltros()
      await this.realizarBusqueda()
    },
    ocultarPopup (evt, field) {
      this.$refs[field][0].hide()
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
    async filtrar (item, val, update) {
      if (item.filter) {
        let url = item.filter.url
        if (item.filter.query) {
          url += `${url.includes('?') ? '&' : '?'}${item.filter.query}=${val}`
        }
        const { rows } = await this.$axios.get(url)

        item.options = rows.map(x => ({ label: this.concatParams(x, item.filter.label), value: x[item.filter.value] }))
      }
      update()
    },
    concatParams (objeto, parametros) {
      let cadenaInicial = ''
      for (const parametro of parametros) {
        cadenaInicial += ` ${objeto[parametro]}`
      }
      return cadenaInicial
    },
    getMaximo (denuncia) {
      const cantidadParticipantes = denuncia.participantes.length || 1
      const cantidadDelitos = denuncia.delitos.length || 1
      const cantidadBienesCautelados = denuncia.bienesCautelados.length || 1
      const cantidadDelitosPrecedentes = denuncia.delitosPrecedentes.length || 1
      return Math.max(cantidadParticipantes, cantidadDelitos, cantidadBienesCautelados, cantidadDelitosPrecedentes)
    },
    nombreCompleto (usuario) {
      if (!usuario) return ''
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido} `
    },
    async realizarBusqueda () {
      this.tablaVisible = false
      const consulta = []
      for (const key in this.search) {
        if (this.search[key]) {
          if (Array.isArray(this.search[key])) {
            for (const valor of this.search[key]) {
              consulta.push(`${key}=${valor}`)
            }
          } else {
            consulta.push(`${key}=${this.search[key]}`)
          }
        }
      }
      this.url = `${urlOriginal}?${consulta.join('&')}`
      this.tablaVisible = true
      // await this.$refs.crudTable.updateList()
    },
    async getFiltros () {
      this.filters = await this.$axios.get(`denuncias/denuncia/reporte/filtros?idTipoProceso=${this.search.idTipoProceso}`)
    },
    ...mapGetters({
      getProcesosUsuario: 'global/getProcesosUsuario'
    }),
    ver (denuncia) {
      this.$router.push(`denuncia/${denuncia.row.id} `)
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
    aplicarBusquedaAvanzada () {
      let query = ''
      if (this.search) {
        for (const filtro of this.filtros) {
          query = `${query}& ${filtro}=${this.search} `
        }
      }
      if (this.entidad.length > 0) {
        for (const e of this.entidad) {
          query = `${query}& entidad=${e} `
        }
      }
      if (this.tiposProcesoHabilitados.length === 1) {
        this.proceso = this.tiposProcesoHabilitados[0].id
      }
      if (this.proceso.length > 0 && !!this.global.permisos['denuncia:buscar:tipoProceso']) {
        for (const e of this.proceso) {
          query = `${query}& idTipoProceso=${e} `
        }
      }
      this.url = urlOriginal + query
      this.consultado = true
    },
    limpiarBusqueda () {
      this.consultado = false
      this.search = ''
      this.entidad = []
    },
    formatDate (stringDate) {
      return date.formatDate(`${stringDate} 23: 59`, 'DD/MM/YYYY')
    },
    filterFnEntidad (val, update) {
      update(async () => {
        if (val === '') {
          this.filterEntidades = this.entidades
        } else {
          const needle = val.toLowerCase()
          this.filterEntidades = await this.entidades.filter(
            v => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    filterFnProceso (val, update) {
      update(async () => {
        if (val === '') {
          this.tiposProcesoHabilitados = await this.getProcesosUsuario()
        } else {
          const needle = val.toLowerCase()
          const procesos = await this.getProcesosUsuario()
          this.tiposProcesoHabilitados = await procesos.filter(
            v => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        }
      })
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
