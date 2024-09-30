<template>
  <CrudTable
    :url="url"
    :filters="filters"
    :columns="getColumns"
    order="orden"
    ref="crudTable"
    :dialog.sync="dialog"
  >
    <template slot="buttons">
      <q-btn
        v-if="global.permisos['menus:crear']"
        icon="add"
        color="secondary"
        @click="crear()"
      > AGREGAR</q-btn>
    </template>
    <template v-slot:form="{updateList,closeModal }">
      <q-card style="width: 700px; max-width: 90vw;">
        <q-toolbar class="q-pa-md">
          <q-icon
            name="preview"
            size="md"
          />
          <q-toolbar-title>
            {{ rol.id ? 'Editar' : 'Crear' }} vista
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
          <Menu
            :valores.sync="rol"
            @guardar="guardar(updateList, closeModal)"
            @cancelar="closeModal()"
          />
        </q-card-section>
      </q-card>
    </template>
    <template v-slot:row="props">
      <q-tr>
        <q-td>
          <q-btn
            v-if="global.permisos['menus:actualizar']"
            class="q-ml-lg"
            flat
            round
            icon="edit"
            @click="editar(props, props.row)"
          />
          <q-btn
            v-if="global.permisos['menus:eliminar']"
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
            v-if="global.permisos['menus:actualizar']"
            v-model="props.row.estado"
            color="primary"
            false-value="INACTIVO"
            true-value="ACTIVO"
            @input="cambiarEstado(props, props.row)"
          />
        </q-td>
        <q-td>{{ props.row.nombre }}</q-td>
        <q-td>{{ props.row.ruta }}</q-td>
        <q-td>
          <q-icon
            color="primary"
            size="md"
            :name="props.row.icono"
          />
        </q-td>
        <q-td>{{ props.row.orden }}</q-td>
        <q-td class="text-center">
          <q-chip
            v-if="props.row.esMenu"
            color="primary"
            text-color="white"
            icon="menu"
          >
            MENU
          </q-chip>
          <q-chip
            v-if="!props.row.esMenu"
            color="info"
            text-color="white"
            icon="preview"
          >
            SOLO VISTA
          </q-chip>
        </q-td>
        <q-td>{{ props.row.menuPadre ? props.row.menuPadre.nombre : '' }}</q-td>
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
</template>

<script>
import CrudTable from '@components/CrudTable/CrudTable'
import Menu from 'components/Formularios/Menu'
import validaciones from '@common/validations'
import { mapState } from 'vuex'
import IconList from '@common/IconList'

const filters = [
  { label: 'Nombre', field: 'nombre', type: 'input' },
  { label: 'Ruta', field: 'ruta', type: 'input' },
  { label: 'Orden', field: 'orden', type: 'input' },
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
  { name: 'acciones', label: 'Acciones', sortable: false },
  { name: 'activo', label: 'Activo', sortable: true },
  { name: 'nombre', label: 'Nombre', sortable: true },
  { name: 'ruta', label: 'Ruta', sortable: true },
  { name: 'icono', label: 'Icono', sortable: false },
  { name: 'orden', label: 'Orden', sortable: true },
  { name: 'esMenu', label: 'Tiene menu', sortable: true },
  { name: 'menuSuperior', label: 'Menu superior', sortable: false },
  { name: 'estado', label: 'Estado', sortable: false }
]

export default {
  components: {
    CrudTable,
    Menu
  },
  data () {
    return {
      IconList,
      IconListOriginal: IconList,
      pasoRol: 'datosGenerales',
      rolSeleccionado: {},
      dialogPermisos: false,
      url: 'system/menus',
      dialog: false,
      menus: [],
      rol: {
        nombre: '',
        descripcion: '',
        estado: 'ACTIVO'
      },
      rolRules: {
        procesos: [validaciones.requerido],
        menus: [validaciones.requerido],
        idEntidad: [validaciones.requerido],
        nombre: [validaciones.requerido],
        descripcion: [validaciones.requerido]
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
    async guardar (update, close) {
      if (this.rol.id) {
        await this.$axios.put(this.url, this.rol)
      } else {
        await this.$axios.post(this.url, this.rol)
      }
      this.resetForm()
      close()
      await update()
    }

  }
}

</script>
