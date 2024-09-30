<template>
  <q-page>
    <Titulo
      icono="settings"
      titulo="Parametros"
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
          v-if="global.permisos['parametros:crear']"
          icon="add"
          color="secondary"
          @click="crear()"
        > AGREGAR</q-btn>
      </template>
      <template v-slot:form="props">
        <q-card style="width: 600px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="settings"
              size="md"
            />
            <q-toolbar-title>
              {{ parametro.id ? 'Editar' : 'Crear' }} parametro
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
              ref="parametro"
              class="row q-col-gutter-sm"
              @submit="guardar(props)"
            >
              <q-input
                filled
                class="col-xs-12"
                label="Nombre"
                v-model="parametro.nombre"
                :rules="parametroRules.nombre"
              />

              <q-select
                class="col-xs-12 col-md-8"
                filled
                v-model="parametro.grupo"
                use-input
                hide-selected
                fill-input
                use-chips
                input-debounce="0"
                label="Grupo"
                :options="grupos"
                new-value-mode="add-unique"
                @filter="filterFn"
                :rules="parametroRules.grupo"
              />

              <q-input
                filled
                type="number"
                class="col-xs-12 col-md-4"
                label="Orden"
                v-model="parametro.orden"
                :rules="parametroRules.orden"
              />

              <q-input
                filled
                class="col-xs-12"
                label="Codigo"
                v-model="parametro.codigo"
                :rules="parametroRules.codigo"
              />

              <q-input
                filled
                class="col-xs-12"
                label="Descripcion"
                v-model="parametro.descripcion"
                :rules="parametroRules.descripcion"
              />

              <q-select
                filled
                v-model="parametro.idPadre"
                :options="parametros"
                label="Parametro padre"
                map-options
                emit-value
                class="col-xs-12"
                clearable
                use-input
                option-label="nombre"
                option-value="id"
                @filter="filtrarParametros"
              />

              <q-select
                filled
                v-model="parametro.idProceso"
                :options="procesos"
                option-value="id"
                option-label="nombre"
                label="Proceso"
                map-options
                emit-value
                class="col-xs-12"
                clearable
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
              v-if="global.permisos['parametros:actualizar']"
              class="q-ml-lg"
              flat
              round
              icon="edit"
              @click="editar(props, props.row)"
            />
            <q-btn
              v-if="global.permisos['parametros:eliminar']"
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
              @input="cambiarEstado(props, props.row)"
            />
          </q-td>
          <q-td>{{ props.row.nombre }}</q-td>
          <q-td>{{ props.row.grupo }}</q-td>
          <q-td>{{ props.row.orden }}</q-td>
          <q-td>{{ props.row.descripcion }}</q-td>
          <q-td>{{ props.row.codigo }}</q-td>
          <q-td>{{ props.row.proceso ? props.row.proceso.nombre : ' - ' }}</q-td>
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
  { label: 'Nombre', field: 'nombre', type: 'input' },
  { label: 'Grupo', field: 'grupo', type: 'input' },
  { label: 'Descripcion', field: 'descripcion', type: 'input' },
  { label: 'Proceso', field: 'idProceso', type: 'select', options: [] },
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
  { name: 'grupo', label: 'Grupo', sortable: true },
  { name: 'orden', label: 'Orden', sortable: true },
  { name: 'descripcion', label: 'Descripcion', sortable: true },
  { name: 'codigo', label: 'Codigo', sortable: true },
  { name: 'proceso', label: 'Proceso', sortable: false },
  { name: 'estado', label: 'Estado', sortable: false }
]

export default {
  components: {
    CrudTable
  },
  data () {
    return {
      dialog: false,
      url: 'system/parametros',
      parametro: {
        nombre: '',
        descripcion: '',
        estado: 'ACTIVO'
      },
      grupos: [],
      parametroRules: {
        grupo: [
          validaciones.requerido
        ],
        nombre: [
          validaciones.requerido
        ],
        descripcion: [
          validaciones.requerido
        ],
        codigo: [
          validaciones.requerido
        ]
      },
      filters,
      getColumns,
      entidades: [],
      procesos: [],
      permisos: [],
      menus: [],
      parametros: [],
      parametrosTemp: []
    }
  },
  computed: {
    ...mapState(['global'])
  },
  async mounted () {
    await this.getParametros()
    await this.getProcesos()
  },
  methods: {
    async getParametros () {
      const { rows } = await this.$axios.get('system/parametros')
      this.parametros = rows
      this.parametrosTemp = JSON.parse(JSON.stringify(rows))
    },
    async getProcesos () {
      const { rows } = await this.$axios.get('denuncias/proceso')
      this.filters[3].options = rows.map(x => ({ label: x.nombre, value: x.id }))
      this.procesos = rows
    },
    resetForm () {
      this.parametro = {
        grupo: '',
        nombre: '',
        descripcion: '',
        estado: 'ACTIVO'
      }
    },
    async crear () {
      this.resetForm()
      this.dialog = true
    },
    async editar (props, parametro) {
      this.parametro = { ...parametro }
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
      delete this.parametro.createdAt
      if (this.parametro.id) {
        await this.$axios.put(this.url, this.parametro)
      } else {
        await this.$axios.post(this.url, this.parametro)
      }
      this.resetForm()
      this.dialog = false
      await props.updateList()
    },
    async filtrarParametros (val, update, abort) {
      update(async () => {
        if (val === '') {
          this.parametros = this.parametrosTemp
        } else {
          const needle = val.toLowerCase()
          this.parametros = this.parametrosTemp.filter(v => v.nombre.toLowerCase().includes(needle))
        }
      })
    },
    async filterFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(async () => {
        let respuesta = []
        const { rows } = await this.$axios.get(`system/parametros?limit=999999${val ? '&grupo=' + val : ''}`)
        if (rows.length > 0) {
          respuesta = [...new Set(rows.map(item => item.grupo))]
        }
        this.grupos = respuesta
      })
    }
  }
}

</script>
