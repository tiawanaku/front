<template>
  <div
    class="form-group"
    :class="element.designColumn || ''"
    role="group"
  >
    <DragComponentTable
      :listaComponentes.sync="element.options"
      idLista="listaGrid"
      bg-color="amber-1"
      :posicion="{ index: posicion.index, subIndex: null }"
    />

    <div
      class="row"
      @click="$store.commit('global/setSeleccionado', posicion)"
    >

      <q-btn
        disable
        v-if="!element.readonly"
        :label="element.button || 'añadir elemento'"
        icon="add"
        color="primary"
        @click="dialog = true"
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

      <div class="table-container q-pa-xs">

        <q-table
          v-if="table"
          :data.sync="rows"
          :columns="columns"
          row-key="id"
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
                  {{ obtenerNombreParametro( props.row[campo.field] )}}
                </span>
                <span v-else-if="campo.label === 'Acciones'">
                  <q-btn
                    class="q-pa-xs"
                    flat
                    round
                    icon="edit"
                    @click="editarRow(props.row,props.rowIndex)"
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
      </div>
    </div>
  </div>
</template>

<script>
import MixinParametros from '@components/Denuncias/mixins/parametros'
import { createComputed } from 'src/common/utils'
import DragComponentTable from 'components/Form/components/DragComponentTable'

let id = 1

export default {
  props: {
    element: { required: true, type: Object, default: () => ({}) },
    editar: { type: Function, default: () => {} },
    add: { type: Function, default: () => {} },
    posicion: { type: Object, default: () => ({}) }
  },
  components: { DragComponentTable },
  mixins: [
    MixinParametros
  ],
  data () {
    return {
      dialog: false,
      rows: [],
      campos: [...this.element.options],
      editedIndex: null,
      table: false,
      form: null,
      value: null
    }
  },
  computed: {
    elementModel: createComputed('element'),
    columns () {
      if (this.element.options.length > 0) {
        const campos = this.element.options.filter(e => e.required || e.label === 'Acciones')
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
      this.rows = JSON.parse(this.element.value || '[]')
      this.value = this.element.value
    }
    this.dialog = true
    setTimeout(() => {
      this.dialog = false
    }, 100)
    setTimeout(() => {
      this.table = true
    }, 100)
  },
  methods: {
    seleccionarComponente (subIndex) {
      console.log('DESDE TABLA =>', subIndex)
      this.posicionSeleccionado = subIndex
      this.$emit('seleccionarComponente', this.index, subIndex)
    },
    agregar () {
      try {
        const datos = {}
        for (const key in this.campos) {
          const input = this.campos[key]
          if (typeof input === 'object' && input.name) {
            if (input.type === 'checkbox') {
              datos[input.name] = input.checked
            } else {
              datos[input.name] = input.value
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
      for (const iterator of this.campos) {
        if (row[iterator.name] !== undefined) {
          if (row[iterator.name]) {
            iterator.value = row[iterator.name]
          } /* else {
            delete iterator.value
          } */
        }
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
      for (const campo of this.campos) {
        delete campo.value
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
