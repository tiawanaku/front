<template>
  <div
    class="form-group row"
    :class="element.designColumn || ''"
    role="group"
  >
    <div class="col-xs-12">
      <div class="row">
        <q-btn
          v-if="!element.readonly"
          :label="element.button || 'añadir parte'"
          icon="add"
          color="primary"
          @click="openModal"
          class="q-mb-md"
        />
        <q-space />
        <div v-if="element.help">
          <q-btn
            flat
            round
            color="primary"
            icon="help"
          >
            <q-popup-proxy>
              <q-card style="width: 400px; max-width: 90vw;">
                <q-card-section class="q-pa-sm q-pl-md q-pr-md bg-green-1">
                  <q-icon
                    name="help"
                    color="primary"
                    size="sm"
                  /> <span class="text-bold q-pl-sm">Ayuda</span>
                </q-card-section>
                <q-separator />
                <q-card-actions class="q-pa-sm q-pl-md q-pr-md">
                  {{ element.help || '' }}
                </q-card-actions>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </div>
      </div>
    </div>

    <q-dialog
      v-model="dialog"
      persistent
    >
      <q-card style="width: 800px; max-width: 90vw;">
        <q-form
          @submit="guardar"
          ref="formDataGrid"
        >
          <q-toolbar class="q-pa-md">
            <q-icon
              name="grid_on"
              size="md"
            />
            <q-toolbar-title>{{ element.label }}</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="limpiarDatos"
            />
          </q-toolbar>
          <q-card-section class="q-pt-none">
            <div>
              <component
                v-for="campo in camposEditar"
                :key="campo.uid"
                :is="componentes[campo.type]"
                :element="campo"
                :value.sync="campo.value"
                :listaCampos="camposEditar"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="cancelar"
              icon="close"
              color="negative"
              @click="limpiarDatos"
            />
            <q-space />
            <q-btn
              label="guardar"
              icon="save"
              color="primary"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- <pre>{{ columns }}</pre> -->

    <div class="col-xs-12">
      <q-table
        v-if="table"
        :data.sync="rows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[20, 50, 100, 200]"
        :wrap-cells="true"
      >
        <template
          slot="body"
          slot-scope="props"
        >
          <q-tr>
            <q-td
              v-for="(campo,index) in columns"
              :key="index"
            >
              <span v-if="campo.type === 'select'">
                {{obtenerNombreParametro( props.row[campo.field])}}
              </span>
              <span v-else-if="campo.type === 'map'">
                <p v-for="(config, index) in props.row[campo.field]" :key="index">
                  <b>{{ config.key }}:</b> {{ config.value }}
                </p>
                <b>{{ props.row[campo.field] }}</b>
              </span>
              <span v-else-if="campo.label === 'Acciones'">
                <q-btn
                  class="q-pa-xs"
                  flat
                  round
                  icon="edit"
                  @click="editarRow(props.row, props.rowIndex)"
                  v-if="!element.readonly"
                />
                <q-btn
                  class="q-pa-xs"
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="eliminar(props.row.id)"
                  v-if="!element.readonly"
                />
              </span>
              <span v-else>
                {{props.row[campo.field]}}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <input
        type="hidden"
        v-model="value"
        :name="element.name"
      />
    </div>
  </div>
</template>

<script>

import TitleField from './TitleField'
import TextField from './TextField'
import MapField from './MapField.vue'
import SelectField from './SelectField'
import MixinParametros from '@components/Denuncias/mixins/parametros'
import FormularioMixin from '@common/Mixins/Formulario'
// import CheckboxField from './CheckboxField'
// import RadioField from './RadioField'

const componentes = {
  text: 'TextField',
  select: 'SelectField',
  title: 'TitleField',
  map: 'MapField'
  // checkbox: 'CheckboxField',
  // radio: 'RadioField'
}

let id = 1

export default {
  props: {
    element: { required: true, type: Object, default: () => ({}) },
    editar: { type: Function, default: () => ({}) },
    add: { type: Function, default: () => ({}) }
  },
  components: { TextField, SelectField, TitleField, MapField },
  mixins: [MixinParametros, FormularioMixin],
  data () {
    return {
      dialog: false,
      rows: [],
      campos: [...this.element.options],
      editedIndex: null,
      table: false,
      form: null,
      value: null,
      componentes,
      camposEditar: []
    }
  },
  computed: {
    columns () {
      if (this.element.options.length > 0) {
        const campos = this.element.options.filter(e => e.esColumna || e.label === 'Acciones')
        return campos.map(item => ({
          name: item.name ? item.name : item.label,
          field: item.name,
          label: item.label,
          sortable: false,
          align: 'left',
          type: item.type,
          options: item.options
        }))
      }
      return []
    }
  },
  created () {
    if (this.element.value !== null) {
      /* console.log('==============MENSAJE DATAGRID=================')
      console.log(this.element.value)
      console.log('==============MENSAJE DATAGRID=================') */
      this.rows = JSON.parse(this.element.value)
      this.value = this.element.value
    }
    this.dialog = true
    setTimeout(() => { this.dialog = false }, 100)
    setTimeout(() => { this.table = true }, 100)
  },
  watch: {
    camposEditar: {
      handler (nuevo, antiguo) {
        for (const campo of this.camposEditar) {
          campo.visible = this.evaluarCondiciones(campo, this.camposEditar, campo.reglas)
          if (!campo.visible) campo.value = null
        }
      },
      deep: true
    }
  },
  methods: {
    openModal () {
      this.limpiarDatos()
      this.dialog = true
    },
    guardar () {
      try {
        const datos = {}
        for (const campo of this.camposEditar) {
          if (typeof campo === 'object' && campo.name) {
            if (campo.type === 'map') {
              datos[campo.name] = {
                latitud: campo.value.latitud,
                longitud: campo.value.longitud
              }
              for (const config of campo.configuration) {
                if (config.visible) {
                  datos[campo.name][config.key] = campo.value[config.key]
                }
              }
              continue
            }
            if (campo.type === 'checkbox') {
              datos[campo.name] = campo.checked
            } else {
              if (campo.visible) {
                datos[campo.name] = campo.value
              } else {
                if (!Object.keys(datos).includes(campo.name)) {
                  datos[campo.name] = null
                }
              }
              // console.log('DATA GRID GUARDAR: ', campo.name, campo.visible, campo.value, datos[campo.name])
            }
          }
        }
        if (this.editedIndex === null) {
          datos.id = id++
          this.rows.push(datos)
        } else {
          const tempRows = [...this.rows]
          this.rows = []
          tempRows[this.editedIndex] = { ...datos }
          this.rows = tempRows
        }
        this.value = JSON.stringify(this.rows)
        this.limpiarDatos()
      } catch (error) {
        console.log(error)
      }
    },
    editarRow (row, index) {
      this.camposEditar = []
      for (const campo of this.element.options) {
        // cambiar segun la key
        if (campo.name === 'mapa') {
          const value = {
            latitud: row.latitud,
            longitud: row.longitud
          }
          if (campo.configuration && campo.configuration.length > 0) {
            for (const config of campo.configuration) {
              if (row[config.key]) value[config.key] = row[config.key]
              else value[config.key] = row[campo.name][config.key]
            }
          }
          this.camposEditar.push(JSON.parse(JSON.stringify({ ...campo, value })))
        } else this.camposEditar.push(JSON.parse(JSON.stringify({ ...campo, value: row[campo.name] || null })))
      }
      this.editedIndex = index
      this.dialog = true
    },
    eliminar (id) {
      this.rows = this.rows.filter(item => item.id !== id)
      this.value = JSON.stringify(this.rows)
    },
    removeId (item) {
      const clone = JSON.parse(JSON.stringify(item))
      delete clone.id
      return clone
    },
    limpiarDatos () {
      this.camposEditar = []
      /* console.log('==========_MENSAJE_A_MOSTRARSE_==========')
      console.log(this.element.options)
      console.log('==========_MENSAJE_A_MOSTRARSE_==========') */
      for (const campo of this.element.options) {
        campo.visible = this.evaluarCondiciones(campo, this.element.options, campo.reglas)
        this.camposEditar.push(JSON.parse(JSON.stringify({ ...campo, value: null })))
      }
      this.editedIndex = null
      this.dialog = false
    },
    obtenerLabelSelect (campo, row) {
      let label = 'SIN DATO'
      const filtro = campo.options.filter(e => e.val === row[campo.name])
      if (filtro.length > 0) {
        label = filtro[0].label
      }
      return label
    }
  }
}
</script>

<style lang="scss">
.table-container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
.grid-datagrid-form {
  display: grid;
  grid-template-columns: 1fr 50px;
}
</style>
