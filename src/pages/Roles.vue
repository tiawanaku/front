<template>
  <q-page>
    <Titulo
      icono="people_alt"
      titulo="Roles"
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
        <q-card style="width: 900px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="people_alt"
              size="md"
            />
            <q-toolbar-title>
              {{ rol.id ? 'Editar' : 'Crear' }} rol
            </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="cancelar()"
            />
          </q-toolbar>
          <q-card-section class="no-padding">
            <q-stepper
              header-class="text-center"
              v-model="step"
              ref="stepper"
              color="info"
              animated
              flat
              done-color="positive"
              inactive-color="grey"
              header-nav
            >
              <q-step
                :name="1"
                title="Datos Generales"
                caption="Informacion del Rol."
                icon="settings"
                :done="step > 1"
              >
                <q-form
                  ref="formRol"
                  class="row q-col-gutter-md"
                >
                  <q-input
                    filled
                    class="col-xs-12 col-md-6"
                    label="Nombre"
                    v-model="rol.nombre"
                    :rules="rolRules.nombre"
                  >
                  </q-input>
                  <q-input
                    filled
                    class="col-xs-12 col-md-6"
                    label="Descripcion"
                    v-model="rol.descripcion"
                    :rules="rolRules.descripcion"
                  ></q-input>
                  <q-select
                    filled
                    v-model="rol.idEntidad"
                    :options="entidades"
                    option-value="id"
                    option-label="nombre"
                    label="Entidad"
                    map-options
                    emit-value
                    class="col-xs-12"
                    :rules="rolRules.idEntidad"
                  />
                  <q-select
                    filled
                    multiple
                    use-chips
                    v-model="rol.menus"
                    :options="menus"
                    option-value="id"
                    option-label="nombre"
                    label="Menus"
                    map-options
                    emit-value
                    class="col-xs-12"
                    :rules="rolRules.menus"
                  />
                  <q-select
                    filled
                    multiple
                    use-chips
                    v-model="rol.procesos"
                    :options="procesos"
                    option-value="id"
                    option-label="nombre"
                    label="Procesos"
                    map-options
                    emit-value
                    class="col-xs-12"
                    :rules="rolRules.procesos"
                  />

                </q-form>
              </q-step>

              <q-step
                :name="2"
                title="Permisos"
                caption="Permisos del sistema"
                icon="create_new_folder"
                :done="step > 2"
              >
                <q-expansion-item
                  dense
                  expand-separator
                  v-for="(menu, index) of permisos"
                  :key="index"
                  header-class="text-primary text-bold bg-green-1"
                  default-opened
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-avatar
                        :icon="menu.icono"
                        color="primary"
                        text-color="white"
                      />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{ menu.nombre }}</q-item-label>
                      <q-item-label class="text-caption text-grey-5">{{ menu.esMenu ? 'MENU' : 'SOLO VISTA' }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <div class="row items-center">
                        <q-chip
                          text-color="white"
                          icon="security"
                          color="info"
                        >{{ menu.permisos.length }}</q-chip>
                      </div>
                    </q-item-section>
                  </template>
                  <q-card>
                    <q-card-section>
                      <div class="row q-col-gutter-xs">
                        <div
                          class="col-xs-12 col-sm-6 col-md-4"
                          v-for="(permiso, index) of menu.permisos"
                          :key="index"
                        >
                          <q-toggle
                            v-model="permiso.permitido"
                            checked-icon="check"
                            color="positive"
                            unchecked-icon="clear"
                            :label="permiso.nombre"
                            size="sm"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-step>
              <template v-slot:navigation>
                <q-stepper-navigation
                  align="right"
                  class="row q-gutter-md"
                >
                  <q-btn
                    v-if="step > 1"
                    @click="cancelar()"
                    label="Cancelar"
                    icon="close"
                    class="q-ml-sm"
                  />
                  <q-space />
                  <q-btn
                    v-if="step > 1"
                    @click="anterior"
                    label="Back"
                    icon="navigate_before"
                    class="q-ml-sm"
                  />
                  <q-btn
                    @click="siguiente(props)"
                    color="primary"
                    :icon="step === 2 ? 'save' : 'navigate_next'"
                    :label="step === 2 ? 'Guardar' : 'Siguiente'"
                  />
                </q-stepper-navigation>
              </template>
            </q-stepper>

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
              v-if="global.permisos['roles:actualizar']"
              v-model="props.row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @input="cambiarEstado(props, props.row)"
            />
          </q-td>
          <q-td>{{ props.row.nombre }}</q-td>
          <q-td>{{ props.row.descripcion }}</q-td>
          <q-td>{{ props.row.entidad ? props.row.entidad.nombre : 'SIN ENTIDAD' }}</q-td>
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
    name: 'entidad',
    label: 'Entidad',
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
    CrudTable
  },
  data () {
    return {
      step: 1,
      pasoRol: 'datosGenerales',
      rolSeleccionado: {},
      dialogPermisos: false,
      dialog: false,
      url: 'system/roles',
      rol: {
        nombre: '',
        descripcion: '',
        estado: 'ACTIVO'
      },
      rolRules: {
        procesos: [
          validaciones.requerido
        ],
        menus: [
          validaciones.requerido
        ],
        idEntidad: [
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
      permisos: [],
      menus: []
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
    async anterior () {
      this.step--
    },
    async siguiente (props) {
      if (this.step === 1) {
        const validacion = await this.$refs.formRol.validate()
        if (validacion) {
          this.step++
        }
      } else {
        await this.guardar(props)
      }
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
      if (this.rol.id) url += `?idRol=${this.rol.id}`
      this.permisos = await this.$axios.get(url)
      this.permisos = this.permisos.filter(x => x.permisos.length > 0)
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
    async editar (props, rol) {
      this.rol = { ...rol }
      this.rol.menus = this.rol.menus.map(x => x.id)
      this.rol.procesos = this.rol.procesos.map(x => x.id)
      await this.getPermisos()
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
      this.step = 1
      this.dialog = false
    },
    async guardar (props) {
      delete this.rol.createdAt
      this.rol.permisos = []
      for (const menu of this.permisos) {
        for (const permiso of menu.permisos) {
          if (permiso.permitido) this.rol.permisos.push(permiso.id)
        }
      }
      if (this.rol.id) {
        await this.$axios.put(this.url, this.rol)
      } else {
        await this.$axios.post(this.url, this.rol)
      }
      this.step = 1
      this.resetForm()
      this.dialog = false
      await props.updateList()
    }
  }
}

</script>
