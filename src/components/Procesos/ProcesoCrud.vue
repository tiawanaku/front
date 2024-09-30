<template>
  <q-page>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="getColumns"
      order="_created_at"
      ref="crudTable"
      :dialog.sync="dialog"
    >
      <template slot="buttons">
        <q-btn
          v-if="global.permisos['procesos:crear']"
          icon="add"
          color="secondary"
          @click="crear()"
        > AGREGAR</q-btn>
      </template>
      <template v-slot:form="props">
        <q-card style="width: 700px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="menu"
              size="md"
            />
            <q-toolbar-title>
              {{ proceso.id ? 'Editar' : 'Crear' }} proceso
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
              class="row q-col-gutter-sm"
              ref="proceso"
              @submit="guardar(props)"
            >
              <q-input
                filled
                class="col-xs-12"
                label="Nombre"
                v-model="proceso.nombre"
                :rules="procesoRules.nombre"
                @keyup="updateSigla"
              />
              <q-input
                filled
                class="col-xs-12 col-md-4"
                label="Sigla"
                v-model="proceso.sigla"
                :rules="procesoRules.sigla"
              />
              <q-input
                filled
                class="col-xs-12 col-md-4"
                label="Secuencia"
                v-model="proceso.secuencia"
                :rules="procesoRules.secuencia"
              />

              <q-toggle
                filled
                class="col-xs-12 col-md-4"
                label="Secuencia anual"
                size="lg"
                checked-icon="done"
                unchecked-icon="close"
                color="positive"
                v-model="proceso.secuenciaAnual"
                :rules="procesoRules.secuenciaAnual"
              />
              <q-input
                filled
                class="col-xs-12"
                label="Descripcion"
                v-model="proceso.descripcion"
                :rules="procesoRules.descripcion"
              />

              <q-select
                filled
                use-chips
                v-model="proceso.formularios"
                :options="formularios"
                option-value="id"
                option-label="nombre"
                label="Formularios"
                map-options
                emit-value
                class="col-xs-12"
                :rules="procesoRules.formularios"
                clearable
                multiple
              />
              <q-toggle
                filled
                class="col-xs-12 col-md-4"
                label="Entidades"
                size="lg"
                checked-icon="done"
                unchecked-icon="close"
                color="positive"
                v-model="proceso.entidades"
                :rules="procesoRules.secuenciaAnual"
              />
              <div class="col-xs-12">
                <EstadoProceso :estados="proceso.configuracion"></EstadoProceso>
              </div>
              <div class="col-xs-12 text-right">
                <q-btn
                  class="q-ml-sm"
                  icon="close"
                  label="Cancelar"
                  @click="cancelar()"
                />
                <q-btn
                  class="q-ml-sm"
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
              v-if="global.permisos['procesos:actualizar']"
              class="q-ml-lg"
              flat
              round
              icon="edit"
              @click="editar(props, props.row)"
            />
            <q-btn
              v-if="global.permisos['procesos:eliminar']"
              class="q-ml-lg"
              flat
              round
              color="negative"
              icon="delete"
              @click="eliminar(props, props.row.id)"
            />
          </q-td>
          <q-td>
            <q-toggle
              v-if="global.permisos['procesos:actualizar']"
              v-model="props.row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @input="cambiarEstado(props, props.row)"
            />
          </q-td>
          <q-td>{{ props.row.nombre }}</q-td>
          <q-td class="text-center">{{ props.row.sigla }}</q-td>
          <q-td>{{ props.row.descripcion }}</q-td>
          <q-td class="text-center">
            <Estado :estado="props.row.estado"></Estado>
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import EstadoProceso from './EstadoProceso.vue'
import CrudTable from '@components/CrudTable/CrudTable'
import validaciones from '@common/validations'
import { mapState } from 'vuex'

const filters = [
  {
    label: 'Nombre',
    field: 'nombre',
    type: 'input'
  },
  {
    label: 'Descripcion',
    field: 'descripcion',
    type: 'input'
  },
  {
    label: 'Estado',
    field: 'estado',
    type: 'select',
    options: [
      {
        label: 'ACTIVO',
        value: 'ACTIVO'
      },
      {
        label: 'INACTIVO',
        value: 'INACTIVO'
      }
    ]
  }
]

const getColumns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  },
  {
    name: 'activo',
    label: 'Activo',
    sortable: true
  },
  {
    name: 'nombre',
    label: 'Nombre',
    sortable: true
  },
  {
    name: 'sigla',
    label: 'Sigla',
    sortable: true
  },
  {
    name: 'descripcion',
    label: 'Descripcion',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: {
    CrudTable,
    EstadoProceso
  },
  data () {
    return {
      formularios: [],
      url: 'denuncias/proceso',
      dialog: false,
      proceso: {
        nombre: '',
        descripcion: '',
        estado: 'ACTIVO',
        configuracion: [],
        secuenciaAnual: false,
        entidades: false
      },
      procesoRules: {
        procesos: [
          validaciones.requerido
        ],
        menus: [
          validaciones.requerido
        ],
        sigla: [
          validaciones.requerido
        ],
        nombre: [
          validaciones.requerido
        ],
        descripcion: [
          validaciones.requerido
        ],
        formularios: [
          validaciones.requerido
        ]
      },
      filters,
      getColumns,
      entidades: [],
      procesos: [],
      permisos: []
    }
  },
  computed: {
    ...mapState(['global'])
  },
  async mounted () {
    await this.getFormularios()
  },
  methods: {
    async getFormularios () {
      const { rows } = await this.$axios.get('denuncias/formulario')
      this.formularios = rows
    },
    async getPermisos () {
      let url = 'system/roles/permisos'
      if (this.rol.id) {
        url += `?idRol=${this.rol.id}`
      }
      this.permisos = await this.$axios.get(url)
    },
    resetForm () {
      this.proceso = {
        nombre: '',
        descripcion: '',
        estado: 'ACTIVO',
        configuracion: [],
        secuenciaAnual: false,
        entidades: false
      }
    },
    async crear () {
      this.resetForm()
      // await this.getPermisos()
      this.dialog = true
    },
    editar (props, proceso) {
      this.proceso = Object.assign({}, {
        id: proceso.id,
        nombre: proceso.nombre,
        descripcion: proceso.descripcion,
        formularios: proceso.formularios.map(x => x.id || x),
        estado: proceso.estado,
        secuencia: proceso.secuencia,
        secuenciaAnual: proceso.secuenciaAnual,
        sigla: proceso.sigla,
        configuracion: [...proceso.configuracion],
        entidades: proceso.entidades
      })
      props.openModal()
    },
    async eliminar (props, id) {
      await props.eliminar({ url: `${this.url}/${id}` })
    },
    async cambiarEstado (props, row) {
      await props.cambiarEstado({ registro: row, url: `${this.url}/${row.id}` })
    },
    cancelar () {
      this.resetForm()
      this.dialog = false
    },
    async guardar (props) {
      if (this.proceso.id) {
        await this.$axios.put(this.url, this.proceso)
      } else {
        await this.$axios.post(this.url, this.proceso)
      }
      this.resetForm()
      await props.updateList()
      this.dialog = false
    },
    updateSigla () {
      const nombre = this.proceso.nombre.trim().split(' ').map(item => (item.length > 2 ? item[0] : '')).join('').toUpperCase()
      this.proceso.sigla = nombre
    }
  }
}

</script>
