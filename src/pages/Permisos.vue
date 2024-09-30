<template>
  <q-page>
    <Titulo
      icono="security"
      titulo="Permisos"
    ></Titulo>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="getColumns"
      order="createdAt"
      ref="crudTable"
      :dialog.sync="dialog"
    >
      <template slot="buttons">
        <q-btn
          icon="add"
          color="secondary"
          @click="crear()"
        > AGREGAR</q-btn>
      </template>
      <template v-slot:form="props">
        <q-card style="width: 500px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="security"
              size="md"
            />
            <q-toolbar-title>
              {{ rol.id ? 'Editar' : 'Crear' }} permiso
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
              ref="rol"
              class="row q-col-gutter-md"
              @submit="guardar(props)"
            >
              <q-input
                filled
                class="col-xs-12"
                label="Nombre"
                v-model="rol.nombre"
                :rules="rolRules.nombre"
              />
              <q-select
                filled
                class="col-xs-12"
                label="Grupo"
                :options="['SISTEMA', 'DENUNCIA']"
                v-model="rol.grupo"
                :rules="rolRules.grupo"
              />
              <q-input
                type="textarea"
                filled
                class="col-xs-12"
                label="Descripcion"
                v-model="rol.descripcion"
                :rules="rolRules.descripcion"
              />
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
              v-if="global.permisos['roles:actualizar']"
              class="q-ml-lg"
              flat
              round
              icon="edit"
              @click="editar(props, props.row)"
            />
            <q-btn
              v-if="global.permisos['roles:eliminar']"
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
              disable
              v-model="props.row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @input="cambiarEstado(props, props.row)"
            />
          </q-td>
          <q-td>{{ props.row.nombre }}</q-td>
          <q-td>{{ props.row.grupo }}</q-td>
          <q-td>{{ props.row.descripcion }}</q-td>
          <q-td>
            <Estado :estado="props.row.estado"></Estado>
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
import IconList from '@common/IconList'

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
    name: 'descripcion',
    label: 'Descripcion',
    sortable: true
  },
  {
    name: 'grupo',
    label: 'Grupo',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: {
    CrudTable
  },
  data () {
    return {
      IconList,
      IconListOriginal: IconList,
      pasoRol: 'datosGenerales',
      rolSeleccionado: {},
      dialogPermisos: false,
      url: 'system/permisos',
      dialog: false,
      menus: [],
      rol: {
        nombre: '',
        descripcion: '',
        estado: 'ACTIVO'
      },
      rolRules: {
        grupo: [
          validaciones.requerido
        ],
        nombre: [
          validaciones.requerido
        ],
        descripcion: [
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
    await this.getEntidades()
    await this.getProcesos()
    await this.getMenus()
  },
  methods: {
    async getEntidades () {
      const { rows } = await this.$axios.get('system/entidades')
      this.entidades = rows
    },
    async getProcesos () {
      const { rows } = await this.$axios.get('denuncias/proceso')
      this.procesos = rows
    },
    async getMenus () {
      const { rows } = await this.$axios.get('system/menus')
      this.menus = rows
    },
    async getPermisos () {
      let url = 'system/roles/permisos'
      if (this.rol.id) {
        url += `?idRol=${this.rol.id}`
      }
      this.permisos = await this.$axios.get(url)
    },
    resetForm () {
      this.rol = {
        menu: null,
        nombre: '',
        descripcion: '',
        estado: 'ACTIVO'
      }
    },
    async crear () {
      this.resetForm()
      await this.getPermisos()
      this.dialog = true
    },
    editar (props, rol) {
      this.rol = { ...rol }
      this.rol.activo = !!this.rol.activo
      props.openModal()
    },
    async eliminar (props, id) {
      await props.eliminar({ url: `${this.url}/${id}` })
    },
    async cambiarEstado (props, row) {
      await props.cambiarEstado({ registro: row, url: this.url })
    },
    cancelar () {
      this.resetForm()
      this.dialog = false
    },
    async guardar (props) {
      if (this.rol.id) {
        await this.$axios.put(this.url, this.rol)
      } else {
        await this.$axios.post(this.url, this.rol)
      }
      this.resetForm()
      props.closeModal()
      await props.updateList()
    },
    filtrarOpciones (val, update) {
      if (val === '') {
        update(() => {
          this.IconList = this.IconListOriginal
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.IconList = this.IconListOriginal.filter(v => v.toLowerCase().includes(needle))
      })
    }

  }
}

</script>
