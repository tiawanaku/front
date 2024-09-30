<template>
  <q-page>
    <Titulo
      icono="search"
      titulo="Busqueda Avanzada"
    ></Titulo>
    <q-card class="q-ma-md">
      <q-card-section>
        <div class="row q-pa-sm">
          <q-select
            v-model="filtros"
            :options="options"
            label="Buscar en"
            filled
            class="col-md-12 q-mb-md"
            multiple
            use-chips
            emit-value
            map-options
            option-label="label"
            option-value="value"
            :readonly="consultado"
          >
            <template v-slot:selected-item="scope">
              <q-chip
                :removable="!consultado"
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="secondary"
                text-color="white"
                class="q-ma-xs"
              >
                {{ scope.opt.label }}
              </q-chip>
            </template>
          </q-select>
          <q-select
            v-model="entidad"
            label="Entidad"
            filled
            class="col-md-12 q-mb-sm col-xs-12"
            use-chips
            emit-value
            map-options
            option-label="descripcion"
            option-value="id"
            multiple
            :readonly="consultado"
            :hint="entidad?'':'En caso de no elegir una entidad, se buscara una conincidencia en todas las entidades'"
            :options="filterEntidades"
            @filter="filterFnEntidad"
            use-input
          >
            <template v-slot:prepend>
              <q-icon name="business" />
            </template>
            <template v-slot:selected-item="scope">
              <q-chip
                :removable="!consultado"
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="secondary"
                text-color="white"
                class="q-ma-xs"
              >
                {{ scope.opt.descripcion }}
              </q-chip>
            </template>
          </q-select>
          <q-select
            v-if="tiposProcesoHabilitados.length > 1 && !!global.permisos['denuncia:buscar:tipoProceso']"
            v-model="proceso"
            label="Tipo de Proceso"
            filled
            class="col-md-12 q-mb-sm col-xs-12"
            use-chips
            emit-value
            map-options
            option-label="nombre"
            option-value="id"
            multiple
            :readonly="consultado"
            :options="tiposProcesoHabilitados"
            @filter="filterFnProceso"
            use-input
          >
            <template v-slot:prepend>
              <q-icon name="gavel" />
            </template>
            <template v-slot:selected-item="scope">
              <q-chip
                :removable="!consultado"
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="secondary"
                text-color="white"
                class="q-ma-xs"
              >
                {{ scope.opt.nombre }}
              </q-chip>
            </template>
          </q-select>
          <div
            class="col-xs-12"
            v-if="filtros.length>0 || entidad.length>0"
          >
            <q-input
              v-model="search"
              filled
              label="Texto Buscar"
              stack-label
              placeholder="Ingrese una palabra o frase"
              :readonly="consultado"
              @keypress.enter="aplicarBusquedaAvanzada"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template
                v-slot:after
                v-if="search.length > 2 || entidad.length>0"
              >
                <q-btn
                  v-if="!consultado"
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
          <div
            class="col-xs-12"
            v-else
          >
            <div class=" alert alert--warning">
              <q-icon
                name="info"
                color="orange"
                size="sm"
              />
              <div> Debe elegir al menos un filtro de busqueda</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <CrudTable
      v-if="consultado"
      titulo="Usuarios"
      :url="url"
      :filters="filters"
      :columns="getColumns"
      order="_created_at"
      ref="crudTable"
      :dialog.sync="dialog"
      :wrap="true"
    >
      <template slot="buttons">

      </template>
      <template v-slot:row="props">
        <q-tr>
          <q-td>
            <q-btn
              v-if="global.permisos['usuarios:actualizar']"
              class="q-pa-xs"
              flat
              round
              color="secondary"
              icon="visibility"
              @click="ver(props,props.row)"
            />
          </q-td>
          <q-td>{{ props.row.codigoDenuncia }}</q-td>
          <q-td>{{ props.row.proceso.nombre }}</q-td>
          <q-td>{{ props.row.denominacion }}</q-td>
          <q-td class="text-center">{{ formatDate(props.row.fechaDenuncia) }}</q-td>
          <q-td class="text-center">{{props.row.lugarHecho}}</q-td>
          <q-td class="text-center">{{props.row.etapaActual}}</q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import CrudTable from '@components/CrudTable/CrudTable'
import CrudTableMixin from '@components/CrudTable/mixins/crud-table'
import Titulo from '@components/common/Titulo'
// import validaciones from '@common/validations'
import parametros from '@common/Mixins/parametros'
import { mapState, mapGetters } from 'vuex'
// import SelectField from '@components/Form/components/SelectField'

// import RenderForm from '@components/Form/RenderForm.vue'
// import { form } from '@components/Form/prueba_denuncia.js'
import { date } from 'quasar'

const url = 'denuncias/denuncia?busquedaAvanzada=true'

export default {
  mixins: [parametros, CrudTableMixin],
  components: {
    CrudTable,
    Titulo
    // SelectField,

    // RenderForm
  },
  data () {
    return {
      tiposProcesoHabilitados: [],
      formularios: [],
      consultado: false,
      url,
      dialog: false,
      denuncia: {
        estado: 'ACTIVO'
      },
      filters: [],
      options: [
        {
          label: 'Codigo Denuncia',
          value: 'codigoDenuncia'
        },
        {
          label: 'Lugar Hecho',
          value: 'lugarHecho'
        }, {
          label: 'Fiscal',
          value: 'fiscal'
        }, {
          label: 'Juzgado',
          value: 'juzgado'
        }, {
          label: 'Policia',
          value: 'policia'
        }, {
          label: 'Relacion hecho',
          value: 'relacionHecho'
        }, {
          label: 'Numero Fiscalia',
          value: 'numeroFiscalia'
        }, {
          label: 'Etapa actual',
          value: 'etapaActual'
        }, {
          label: 'Nombre de las Partes',
          value: 'nombrePartes'
        }, {
          label: 'Numero Documento Partes',
          value: 'numeroDocumentoPartes'
        },
        {
          label: 'Etiquetas',
          value: 'etiquetas'
        },
        {
          label: 'Denominacion',
          value: 'denominacion'
        }
      ],
      entidades: [],
      entidad: [],
      proceso: [],
      filtros: [

      ],
      search: '',
      getColumns: [
        {
          name: 'acciones',
          label: 'Acciones',
          sortable: false
        },
        {
          name: 'codigoDenuncia',
          label: 'Codigo Denuncia',
          sortable: true,
          align: 'left'
        },
        {
          name: 'proceso',
          label: 'Proceso',
          sortable: true,
          align: 'left'
        },
        {
          name: 'denominacion',
          label: 'Denominacion',
          sortable: true
        },
        {
          name: 'fechaDenuncia',
          label: 'Fecha Denuncia',
          sortable: true
        },
        {
          name: 'lugarHecho',
          label: 'Lugar Hecho',
          sortable: true
        },
        {
          name: 'estado',
          label: 'Etapa',
          sortable: true
        }
      ],
      filterEntidades: []
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
    this.filtros = this.options.map(x => x.value)
    const { rows } = await this.$axios.get('system/entidades')
    this.entidades = rows
    this.tiposProcesoHabilitados = await this.getProcesosUsuario()
    console.log(global.permisos['denuncia:buscar:tipoProceso'])
    console.log(this.tiposProcesoHabilitados)
  },
  methods: {
    ...mapGetters({
      getProcesosUsuario: 'global/getProcesosUsuario'
    }),
    ver (denuncia) {
      this.$router.replace(`denuncia/${denuncia.row.id}`)
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
          query = `${query}&${filtro}=${this.search}`
        }
      }
      if (this.entidad.length > 0) {
        for (const e of this.entidad) {
          query = `${query}&entidad=${e}`
        }
      }
      if (this.tiposProcesoHabilitados.length === 1) {
        this.proceso = this.tiposProcesoHabilitados[0].id
      }
      if (this.proceso.length > 0 && !!this.global.permisos['denuncia:buscar:tipoProceso']) {
        for (const e of this.proceso) {
          query = `${query}&idTipoProceso=${e}`
        }
      }
      this.url = url + query
      this.consultado = true
    },
    limpiarBusqueda () {
      this.consultado = false
      this.search = ''
      this.entidad = []
    },
    formatDate (stringDate) {
      return date.formatDate(`${stringDate} 23:59`, 'DD/MM/YYYY')
    },
    filterFnEntidad (val, update) {
      console.log(val)
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
      console.log(val)
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
