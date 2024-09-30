<template>
  <q-page>
    <Titulo
      icono="business"
      titulo="Entidades"
    ></Titulo>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="getColumns"
      order="_created_at"
      ref="crudTable"
      :dialog.sync="dialog"
      :wrap="true"
    >
      <template slot="buttons">
        <q-btn
          v-if="global.permisos['roles:crear']"
          icon="add"
          color="secondary"
          @click="crear()"
        > AGREGAR</q-btn>
      </template>
      <template v-slot:form="props">
        <q-card style="width: 700px; max-width: 90vw;">
          <q-toolbar class="text-secondary q-pa-md">
            <q-icon
              name="business"
              size="md"
            />
            <q-toolbar-title>
              {{ entidad.id ? 'Editar' : 'Crear' }} entidad
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
              ref="entidad"
              @submit="guardar(props)"
              class="row q-col-gutter-sm"
            >
              <q-input
                filled
                class="col-xs-12 col-md-8"
                label="Nombre"
                v-model="entidad.nombre"
                :rules="entidadRules.nombre"
              >
              </q-input>
              <q-input
                filled
                class="col-xs-12 col-md-4"
                label="Sigla"
                v-model="entidad.sigla"
                :rules="entidadRules.sigla"
              ></q-input>
              <q-input
                filled
                class="col-xs-12 col-md-12"
                label="Descripcion"
                v-model="entidad.descripcion"
                :rules="entidadRules.descripcion"
              ></q-input>
              <q-input
                filled
                class="col-xs-12 col-md-6"
                label="Email"
                v-model="entidad.email"
                :rules="entidadRules.email"
              ></q-input>
              <q-input
                filled
                class="col-xs-12 col-md-6"
                label="Web"
                v-model="entidad.web"
                :rules="entidadRules.nombre"
              ></q-input>
              <q-input
                filled
                class="col-xs-12 col-md-12"
                label="Direccion"
                v-model="entidad.direccion"
                :rules="entidadRules.nombre"
              ></q-input>
              <q-input
                filled
                class="col-xs-12 col-md-6"
                label="Telefono"
                v-model="entidad.telefono"
                :rules="entidadRules.nombre"
              ></q-input>

              <q-select
                filled
                v-model="entidad.idEntidad"
                :options="entidades"
                option-value="id"
                option-label="nombre"
                label="Entidad superior"
                map-options
                emit-value
                class="col-xs-12 col-md-6"
              />
              <q-input
                filled
                class="col-xs-12 col-md-6"
                label="Nivel"
                v-model="entidad.nivel"
                :rules="entidadRules.nombre"
              ></q-input>

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
              v-if="global.permisos['entidades:actualizar']"
              class="q-ml-lg"
              flat
              round
              icon="edit"
              @click="editar(props,props.row)"
            />
            <q-btn
              v-if="global.permisos['entidades:eliminar']"
              class="q-ml-lg"
              flat
              round
              color="negative"
              icon="delete"
              @click="eliminar(props,props.row.id)"
            />
          </q-td>
          <q-td>
            <q-toggle
              :disable="!global.permisos['entidades:actualizar']"
              v-model="props.row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @input="cambiarEstado(props,props.row)"
            />
          </q-td>
          <q-td>{{ props.row.nombre }}</q-td>
          <q-td>{{ props.row.sigla }}</q-td>
          <q-td>{{ props.row.email }}</q-td>
          <q-td>{{ props.row.telefono }}</q-td>
          <q-td>
            <q-chip
              v-if="props.row.estado === 'ACTIVO'"
              square
              color="info"
              text-color="white"
              label="ACTIVO"
            />
            <q-chip
              v-if="props.row.estado === 'INACTIVO'"
              square
              color="warning"
              text-color="white"
              label="INACTIVO"
            />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
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
    label: 'Sigla',
    field: 'sigla',
    type: 'input'
  },
  {
    label: 'Correo electronico',
    field: 'correo',
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
    sortable: false
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
    name: 'correo',
    label: 'Correo',
    sortable: true
  },
  {
    name: 'telefono',
    label: 'Telefono',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: true
  }
]

export default {
  components: {
    CrudTable
  },
  data () {
    return {
      dialog: false,
      url: 'system/entidades',
      entidad: {
        idEntidad: null,
        estado: 'ACTIVO'
      },
      entidadRules: {
        nombre: [
          validaciones.requerido
        ],
        sigla: [
          validaciones.requerido
        ],
        descripcion: [
          validaciones.requerido
        ],
        email: [
          validaciones.requerido,
          validaciones.correo
        ]
      },
      filters,
      getColumns,
      entidades: []
    }
  },
  computed: {
    ...mapState(['global'])
  },
  async mounted () {
    await this.getEntidades()
  },
  methods: {
    async getEntidades () {
      const { rows } = await this.$axios.get('system/entidades')
      this.entidades = rows
    },
    resetForm () {
      this.entidad = {
        idEntidad: null,
        estado: 'ACTIVO'
      }
    },
    async crear () {
      this.resetForm()
      this.dialog = true
    },
    editar (props, entidad) {
      this.entidad = { ...entidad }
      props.openModal()
    },
    async eliminar (props, id) {
      await props.eliminar({ url: `${this.url}/${id}` })
    },
    async cambiarEstado (props, row) {
      await props.cambiarEstado({ registro: row, url: `${this.url}` })
    },
    cancelar () {
      this.resetForm()
      this.dialog = false
    },
    async guardar (props) {
      if (this.entidad.id) {
        await this.$axios.put(this.url, this.entidad)
      } else {
        await this.$axios.post(this.url, this.entidad)
      }
      this.resetForm()
      this.dialog = false
      await props.updateList()
    }
  }
}

</script>
