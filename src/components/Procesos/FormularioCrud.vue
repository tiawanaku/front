<template>
  <section>
    <q-dialog v-model="dialogDuplicar">
      <q-card style="width: 600px; max-width: 90vw;">
        <q-toolbar class="q-pa-md">
          <q-icon
            name="file_copy"
            size="md"
          />
          <q-toolbar-title>
            Duplicar el formulario
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="closeDialogDuplicar()"
          />
        </q-toolbar>
        <q-card-section>
          <q-form
            class="row q-col-gutter-sm"
            @submit="guardarClonacion"
          >
            <q-input
              class="col-xs-12"
              label="Nombre del nuevo formulario"
              filled
              clearable
              v-model="datosClonar.nombre"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>

            <div class="col-xs-12 text-right q-gutter-sm">
              <q-btn
                icon="close"
                label="cancelar"
                @click="closeDialogDuplicar()"
              />
              <q-btn
                type="submit"
                icon="save"
                color="primary"
                label="Guardar"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogImportacion">
      <q-card style="width: 700px; max-width: 90vw;">
        <q-toolbar class="q-pa-md">
          <q-icon
            name="backup_table"
            size="md"
          />
          <q-toolbar-title>
            Importar Formulario
          </q-toolbar-title>
          <q-space />
          <q-btn
            flat
            round
            icon="close"
            @click="closeModalImportacion"
          />
        </q-toolbar>
        <q-card-section>
          <q-form
            @submit="importarFormulario()"
            class="row q-col-gutter-sm"
          >
            <q-file
              accept=".json"
              filled
              class="col-xs-12"
              label="Importar archivo json"
              v-model="archivoJSON"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>

            </q-file>

            <div class="col-xs-12 q-gutter-sm text-right">
              <q-btn
                icon="close"
                label="cancelar"
                @click="closeModalImportacion"
              />
              <q-btn
                color="primary"
                icon="done_all"
                label="Aceptar"
                type="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <CrudTable
      v-if="global.permisos['formularios:listar']"
      :url="url"
      :filters="filters"
      :columns="getColumns"
      order="_created_at"
      ref="crudTable"
      :dialog.sync="dialog"
    >
      <template slot="buttons">
        <q-btn
          v-if="global.permisos['formularios:crear']"
          icon="add"
          color="secondary"
          @click="crear()"
        > AGREGAR</q-btn>
      </template>
      <template v-slot:buttons-end>
        <q-btn
          color="positive"
          icon="upload"
          label="Importar formulario"
          @click="openModalImportacion"
        />
      </template>
      <template v-slot:form="props">
        <q-card style="width: 700px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="list_alt"
              size="md"
            />
            <q-toolbar-title>
              {{ rol.id ? 'Editar' : 'Crear' }} formulario
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
              class="roq q-col-gutter-md"
              @submit="guardar(props)"
            >
              <q-input
                filled
                class="col-xs-12 col-md-6"
                label="Nombre"
                v-model="rol.nombre"
                :rules="rolRules.nombre"
              />
              <p>Codigo</p>
              <v-jsoneditor
                v-model="rol.configuracion"
                :plus="false"
                :options="{ mode: 'code' }"
                height="400px"
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
      <template v-slot:row="{ row, openModal, eliminar }">
        <q-tr>
          <q-td class="q-gutter-sm">
            <q-btn
              v-if="global.permisos['formularios:actualizar']"
              flat
              round
              color="primary"
              icon="settings"
              @click="configurar(row.id)"
            >
              <q-tooltip content-class="bg-primary text-body2 text-white">
                Configurar formulario
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="global.permisos['formularios:actualizar']"
              flat
              round
              color="warning"
              icon="edit"
              @click="editar(openModal, row)"
            >
              <q-tooltip content-class="bg-warning text-body2 text-white">
                Editar el formulario
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="accent"
              icon="download"
              @click="descargarFormulario(row.id)"
            >
              <q-tooltip content-class="bg-accent text-body2">
                Descargar formulario
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="global.permisos['formularios:actualizar']"
              flat
              round
              color="info"
              icon="file_copy"
              @click="duplicarFormulario(row)"
            >
              <q-tooltip content-class="bg-info text-body2 text-white">
                Duplicar el formulario
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="global.permisos['formularios:eliminar']"
              flat
              round
              color="negative"
              icon="delete"
              @click="eliminar({ url: `${url}/${row.id}` })"
            >
              <q-tooltip content-class="bg-negative text-body2 text-white">
                Eliminar el formulario
              </q-tooltip>
            </q-btn>
          </q-td>
          <q-td>
            <q-toggle
              :disable="!global.permisos['formularios:actualizar']"
              v-model="row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @input="cambiarEstado(props, row)"
            />
          </q-td>
          <q-td>{{ row.nombre }}</q-td>
          <q-td>
            <ul>
              <li
                v-for="(proceso, index) of row.procesos"
                :key="index"
              >
                {{ proceso.nombre }}
              </li>
            </ul>
          </q-td>
          <q-td>
            <q-chip
              v-if="row.estado === 'ACTIVO'"
              square
              color="info"
              text-color="white"
              label="ACTIVO"
            />
            <q-chip
              v-if="row.estado === 'INACTIVO'"
              square
              color="warning"
              text-color="white"
              label="INACTIVO"
            />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </section>
</template>

<script>
import CrudTable from '@components/CrudTable/CrudTable'
import validaciones from '@common/validations'
import { mapState } from 'vuex'
import IconList from '@common/IconList'
import VJsoneditor from 'v-jsoneditor/src/index'

const filters = [
  { label: 'Nombre', field: 'nombre', type: 'input' },
  { label: 'Descripcion', field: 'descripcion', type: 'input' },
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
  { name: 'proceso', label: 'Proceso', sortable: false },
  { name: 'estado', label: 'Estado', sortable: false }
]

export default {
  components: {
    CrudTable,
    VJsoneditor
  },
  data () {
    return {
      datosClonar: {
        idFormulario: null,
        nombre: null
      },
      dialogDuplicar: false,
      IconList,
      IconListOriginal: IconList,
      pasoRol: 'datosGenerales',
      rolSeleccionado: {},
      dialogPermisos: false,
      url: 'denuncias/formulario',
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
      dialogImportacion: false,
      archivoJSON: null,
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
    async descargarFormulario (idFormulario) {
      const formulario = await this.$axios.get(`${this.url}/${idFormulario}`)
      delete formulario.id
      delete formulario.createdAt
      delete formulario.deletedAt
      delete formulario.updatedAt
      delete formulario.userCreated
      delete formulario.userDeleted
      delete formulario.userUpdated
      delete formulario._user_created
      delete formulario.procesos
      formulario.nombre = `${formulario.nombre}-EXP`
      const linkSource = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formulario))}`

      const downloadLink = document.createElement('a')
      downloadLink.href = linkSource
      downloadLink.download = `${formulario.nombre}.json`
      downloadLink.click()
    },
    openModalImportacion () {
      this.dialogImportacion = true
    },
    closeModalImportacion () {
      this.dialogImportacion = false
    },
    async importarFormulario () {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const datos = JSON.parse(event.target.result)
        await this.$axios.post(`/${this.url}`, datos)
        await this.$refs.crudTable.updateList()
        this.closeModalImportacion()
      }
      reader.readAsText(this.archivoJSON)
    },
    async guardarClonacion () {
      try {
        await this.$axios.patch(`denuncias/formulario/${this.datosClonar.idFormulario}/clonar`, { nombre: this.datosClonar.nombre })
        await this.$refs.crudTable.updateList()
        this.closeDialogDuplicar()
      } catch (error) {
        this.$alert.error(error.message)
      }
    },
    closeDialogDuplicar () {
      this.datosClonar.nombre = null
      this.datosClonar.idFormulario = null
      this.dialogDuplicar = false
    },
    duplicarFormulario (formulario) {
      this.datosClonar.nombre = formulario.nombre
      this.datosClonar.idFormulario = formulario.id
      this.dialogDuplicar = true
    },
    configurar (idFormulario) {
      this.$router.push({ name: 'editor-formulario', params: { id: idFormulario } })
    },
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
    editar (openModal, rol) {
      this.rol = {
        id: rol.id,
        nombre: rol.nombre,
        configuracion: rol.configuracion,
        estado: rol.estado
      }
      openModal()
    },
    async cambiarEstado (props, row) {
      await props.cambiarEstado({ registro: row, url: `${this.url}/${row.id}` })
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
      await props.updateList()
      this.dialog = false
    }
  }
}

</script>
