<template>
  <q-page>
    <Titulo
      icono="people"
      titulo="Usuarios"
    ></Titulo>
    <CrudTable
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
        <q-btn
          v-if="global.permisos['usuarios:crear']"
          icon="add"
          color="secondary"
          @click="crear()"
        > AGREGAR</q-btn>
      </template>
      <template v-slot:form="props">
        <q-card style="width: 800px; max-width: 80vw;">
          <q-toolbar class="text-secondary q-pa-md">
            <q-icon
              name="people_alt"
              size="md"
            />
            <q-toolbar-title>
              {{ usuario.id ? 'Editar' : 'Crear' }} usuario
            </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="cancelar()"
            />
          </q-toolbar>
          <q-card-section class="q-pt-none">
            <q-form
              ref="usuario"
              @submit="guardar(props)"
            >
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 text-subtitle1 text-secondary text-weight-bold">
                  Datos personales
                </div>
                <div class="col-xs-12 col-md-4">
                  <q-input
                    filled
                    class="required"
                    :dense="dense"
                    label="Cedula de identidad"
                    v-model="usuario.numeroDocumento"
                    :rules="rulesUsuario.numeroDocumento"
                  ></q-input>
                </div>
                <div class="col-xs-12 col-md-4">
                  <q-input
                    filled
                    :dense="dense"
                    label="Nombres"
                    class="required"
                    v-model="usuario.nombres"
                    :rules="rulesUsuario.nombres"
                  ></q-input>
                </div>
                <div class="col-xs-12 col-md-4">
                  <q-input
                    filled
                    :dense="dense"
                    label="Primer apellido"
                    class="required"
                    v-model="usuario.primerApellido"
                    :rules="rulesUsuario.primerApellido"
                  ></q-input>
                </div>
                <div class="col-xs-12 col-md-4">
                  <q-input
                    filled
                    :dense="dense"
                    label="Segundo apellido"
                    v-model="usuario.segundoApellido"
                    :rules="rulesUsuario.segundoApellido"
                  ></q-input>
                </div>
                <div class="col-xs-12 col-md-4">
                  <q-input
                    filled
                    :dense="dense"
                    label="Telefono"
                    v-model="usuario.telefono"
                  ></q-input>
                </div>
                <div class="col-xs-12 col-md-4">
                  <q-input
                    filled
                    :dense="dense"
                    label="Celular"
                    v-model="usuario.celular"
                    :rules="rulesUsuario.celular"
                  ></q-input>
                </div>
                <div class="col-xs-12 text-subtitle1 text-secondary text-weight-bold">
                  Datos de usuario
                </div>
                <div class="col-xs-12 col-md-4">
                  <q-select
                    ref="entidad"
                    filled
                    :dense="dense"
                    v-model="usuario.idEntidad"
                    :options="entidades"
                    label="Entidad"
                    option-value="id"
                    option-label="nombre"
                    emit-value
                    map-options
                    :rules="rulesUsuario.idEntidad"
                    class="required"
                    @input="getRoles($event,true)"
                  />
                </div>
                <div class="col-xs-12 col-md-8">
                  <q-input
                    filled
                    :dense="dense"
                    label="Cargo"
                    v-model="usuario.cargo"
                    :rules="rulesUsuario.cargo"
                  ></q-input>
                </div>
                <div class="col-12">
                  <q-select
                    v-model="usuario.roles"
                    filled
                    :dense="dense"
                    :options="roles"
                    label="Rol"
                    option-value="rol"
                    option-label="nombre"
                    use-chips
                    emit-value
                    map-options
                    multiple
                    :rules="rulesUsuario.id_rol"
                    class="required"
                  />
                </div>
                <div class="col-12">
                  <q-select
                    v-model="usuario.slims"
                    filled
                    :dense="dense"
                    :options="slimOpciones"
                    label="Asignado a Slim"
                    option-value="id"
                    option-label="nombre"
                    use-chips
                    emit-value
                    map-options
                    multiple
                    :rules="rulesUsuario.slims"
                    class="required"
                  />
                </div>
                <div class="col-12">
                  <q-select
                    v-model="usuario.defensorias"
                    filled
                    :dense="dense"
                    :options="defensoriaOpciones"
                    label="Asignado a Defensoria"
                    option-value="id"
                    option-label="nombre"
                    use-chips
                    emit-value
                    map-options
                    multiple
                    :rules="rulesUsuario.defensorias"
                    class="required"
                  />
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-select
                    v-model="usuario.nivel"
                    filled
                    :dense="dense"
                    :options="nivelOpciones"
                    label="Nivel de usuario"
                    emit-value
                    map-options
                    :rules="rulesUsuario.nivel"
                    class="required"
                  />
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-input
                    filled
                    :dense="dense"
                    label="Correo Electrónico"
                    v-model="usuario.correoElectronico"
                    class="required"
                    :rules="rulesUsuario.correoElectronico"
                  ></q-input>
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-input
                    filled
                    :dense="dense"
                    label="Nombre Usuario"
                    v-model="usuario.usuario"
                    class="required"
                    :rules="rulesUsuario.usuario"
                  ></q-input>
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-input
                    v-if="!usuario.id"
                    filled
                    :dense="dense"
                    label="Contraseña"
                    class="required"
                    v-model="usuario.contrasena"
                    :rules="disableContrasena ? null : rulesUsuario.contrasena  "
                  ></q-input>
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-input
                    v-if="!usuario.id"
                    filled
                    :dense="dense"
                    label="Confirmacion de contraseña"
                    v-model="usuario.confirmarContrasena"
                    :rules="disableContrasena ? null : rulesUsuario.contrasena"
                  ></q-input>
                </div>

                <div class="col-xs-12 text-right q-gutter-sm">
                  <q-btn
                    icon="close"
                    label="Cancelar"
                    @click="cancelar()"
                  />
                  <q-btn
                    icon="check"
                    color="primary"
                    label="Guardar"
                    type="submit"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="props">
        <q-tr>
          <q-td>
            <q-btn
              class="q-pa-xs"
              flat
              round
              color="info"
              icon="lock_open"
              @click="regenerarContrasena(props, props.row.id)"
            />
            <q-btn
              v-if="global.permisos['usuarios:actualizar']"
              class="q-ml-lg"
              flat
              round
              icon="edit"
              @click="editar(props, props.row)"
            />
            <q-btn
              v-if="global.permisos['usuarios:eliminar']"
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
              v-model="props.row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @input="cambiarEstado(props,props.row)"
            />
          </q-td>
          <q-td>{{ props.row.usuario }}</q-td>
          <q-td>{{ props.row.numeroDocumento }}</q-td>
          <q-td>{{ props.row.nombres }} {{ props.row.primerApellido }} {{ props.row.segundoApellido }}</q-td>
          <q-td>{{ props.row.entidad? props.row.entidad.sigla:''}}</q-td>
          <q-td>{{ props.row.cargo}}</q-td>
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

const rulesUsuario = {
  numeroDocumento: [validaciones.requerido],
  nombres: [validaciones.requerido],
  primerApellido: [],
  segundoApellido: [],
  idEntidad: [validaciones.requerido],
  cargo: [validaciones.requerido],
  correoElectronico: [validaciones.requerido, validaciones.correo],
  celular: [validaciones.requerido, validaciones.telefono]
}

const filters = [
  {
    label: 'Usuario',
    field: 'usuario',
    type: 'input'
  },
  {
    label: 'Nombres',
    field: 'nombres',
    type: 'input'
  },
  {
    label: 'Primer Apellido',
    field: 'primerApellido',
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
  { name: 'acciones', label: 'Acciones', sortable: false },
  { name: 'activo', label: 'Activo', sortable: true },
  { name: 'nombre', label: 'Nombre Usuario', sortable: true },
  { name: 'numeroDocumento', label: 'Nombre Documento', sortable: true },
  { name: 'nombrePersona', label: 'Nombre Persona', sortable: true },
  { name: 'entidad', label: 'Entidad', sortable: false },
  { name: 'cargo', label: 'Cargo', sortable: true },
  { name: 'estado', label: 'Estado', sortable: false }
]

export default {
  components: {
    CrudTable
  },
  data () {
    return {
      dialog: false,
      dense: false,
      disableContrasena: false,
      disableSucursal: false,
      sucursales: [],
      entidades: [],
      roles: [],
      tiposDocumento: [],
      menus: [],
      procesos: [],
      permisos: [],
      url: 'system/usuarios',
      usuario: {
        idEntidad: null,
        roles: [],
        estado: 'ACTIVO',
        cargo: null
      },
      rulesUsuario,
      filters,
      getColumns,
      idUsuarioModificar: null,
      defensoriaOpciones: [],
      slimOpciones: [],
      nivelOpciones: ['ALTO', 'MEDIO']
    }
  },
  computed: {
    ...mapState(['global'])
  },
  async mounted () {
    await this.getEntidades()
    await this.getTiposDocumento()
    this.slimOpciones = await this.$axios.get('/system/parametros?grupo=SLIM').then(({ rows }) => rows)
    this.defensoriaOpciones = await this.$axios.get('/system/parametros?grupo=DEFENSORIA').then(({ rows }) => rows)
  },
  methods: {
    async getTiposDocumento () {
      const { rows } = await this.$axios.get('system/parametros?grupo=TIPO_DOCUMENTO')
      this.tiposDocumento = rows
    },
    async getRoles (idEntidad, cambiar = false) {
      if (cambiar) {
        this.usuario.roles = []
      }
      const { rows } = await this.$axios.get(`system/roles?idEntidad=${idEntidad}`)
      this.roles = rows
    },
    async getEntidades () {
      const { rows } = await this.$axios.get('system/entidades')
      this.entidades = rows
    },
    async eliminar (props, id) {
      await props.eliminar({ url: `${this.url}/${id}` })
    },
    async cambiarEstado (props, row) {
      await props.cambiarEstado({ registro: row, url: this.url })
    },
    async crear () {
      this.resetForm()
      this.dialog = true
    },
    cancelar () {
      this.resetForm()
      this.dialog = false
    },
    resetForm () {
      this.usuario = {
        roles: [],
        idEntidad: null,
        estado: 'ACTIVO'
      }
      this.idUsuarioModificar = null
    },
    editar (props, usuario) {
      this.disableSucursal = usuario.idRol === 1
      this.disableContrasena = true
      this.usuario = {
        celular: usuario.celular,
        correoElectronico: usuario.correoElectronico,
        estado: usuario.estado,
        foto: usuario.foto,
        idEntidad: usuario.idEntidad,
        nombres: usuario.nombres,
        numeroDocumento: usuario.numeroDocumento,
        primerApellido: usuario.primerApellido,
        // roles: usuario.roles.map(e => e.id),
        roles: usuario.roles,
        segundoApellido: usuario.segundoApellido,
        telefono: usuario.telefono,
        usuario: usuario.usuario,
        id: usuario.id,
        cargo: usuario.cargo,
        nivel: usuario.nivel,
        slims: usuario.slims.map(item => item.id),
        defensorias: usuario.defensorias.map(item => item.id)
      }
      this.getRoles(this.usuario.idEntidad)
      props.openModal()
    },
    async guardar (props) {
      try {
        delete this.usuario.createdAt
        if (this.usuario.id) {
          this.idUsuarioModificar = this.usuario.id
          await this.$axios.put(this.url, this.usuario)
        } else {
          if (this.usuario.contrasena !== this.usuario.confirmarContrasena) {
            throw new Error('La contraseña y confirmacion de contraseña no coinciden.')
          }
          await this.$axios.post(this.url, this.usuario)
        }
        this.resetForm()
        this.dialog = false
        await props.updateList()
      } catch (error) {
        if (this.idUsuarioModificar) {
          this.usuario.id = this.idUsuarioModificar
        }
        this.$alert.warning(error.message)
      }
    },
    async regenerarContrasena (props, id) {
      this.$q.dialog({
        title: 'Atención',
        message: '¿Esta seguro de reestablecer la contraseña de este usuario?',
        ok: {
          color: 'primary',
          label: 'Si'
        },
        cancel: {
          color: 'white',
          'text-color': 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(async () => {
        await this.$axios.patch(`${this.url}/reestablecer-contrasena/${id}`)
        await props.updateList()
      })
    }
  }
}

</script>
<style>
.required .q-field__label::before {
  content: "* ";
  color: red;
}
</style>
