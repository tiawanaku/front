<template>
  <div class="row q-col-gutter-sm">
    <q-select
      :options="getComponentes()"
      class="col-xs-12"
      label="Campo "
      filled
      dense
      option-label="label"
      option-value="uid"
      emit-value
      map-options
      v-model="valoresModel.uid"
      @input="seleccionarComponente"
    />
    <q-select
      dense
      v-model="valoresModel.operador"
      emit-value
      map-options
      label="Operador"
      :options="operadores"
      class="col-xs-12 col-sm-6"
      filled
    />

    <q-input
      v-if="componenteSeleccionado.type === 'text' || !componenteSeleccionado.type"
      class="col-xs-12 col-md-6"
      label="Valor"
      filled
      dense
      v-model="valoresModel.value"
    />

    <q-select
      v-if="componenteSeleccionado.type === 'select'"
      dense
      v-model="valoresModel.value"
      emit-value
      map-options
      label="Valor"
      :option-label="componenteSeleccionado.optionLabel"
      :option-value="componenteSeleccionado.optionValue"
      :options="opciones"
      class="col-xs-12 col-sm-6"
      filled
    />

    <q-input
      v-if="componenteSeleccionado.type === 'map'"
      v-model="valoresModel.value"
    />

  </div>
</template>
<script>
import { createComputed } from 'src/common/utils'
import axios from 'axios'

const operadores = [
  { label: '(===) Igual a', value: '===' },
  { label: '(!==) Distinto a', value: '!==' },
  { label: '(>) Mayor a', value: '>' },
  { label: '(>=) Mayor o ogual a', value: '>=' },
  { label: '(<) Menor a', value: '<' },
  { label: '(<=) Menor o ogual a', value: '<=' },
  { label: '(contains) Que contenga', value: 'contains' },
  { label: '(no-contains) Que no contenga', value: 'no-contains' }
]

export default {
  props: {
    valores: { type: Object, default: () => ({}) },
    idComponente: { type: String, default: '' },
    listaComponentes: { type: Array, default: () => ([]) }
  },
  data () {
    return {
      operadores,
      opciones: [],
      componenteSeleccionado: {}
    }
  },
  async mounted () {
    this.componenteSeleccionado = this.getComponentes().find(x => x.uid === this.valores.uid) || {}
    if (this.componenteSeleccionado.type === 'select') await this.consumirServicio()
  },
  methods: {
    async consumirServicio () {
      if (this.componenteSeleccionado.url) {
        let url = this.componenteSeleccionado.url

        if (!url.includes('http')) url = `${process.env.BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`

        const { data } = await axios({
          method: 'GET',
          url,
          headers: { Authorization: `Bearer ${this.componenteSeleccionado.token || this.$storage.get('token')}` }
        })
        this.opciones = data.datos.rows
      }
    },
    getComponentes () {
      let lista = this.listaComponentes.filter(x => x.type !== 'datagrid' && !!x.type)
      if (this.$store.state.global.seleccionado.subIndex) {
        lista = this.listaComponentes[this.$store.state.global.seleccionado.index].options.filter(x => x.type !== 'datagrid' && !!x.type)
      }
      return lista
    },
    async seleccionarComponente (value) {
      this.componenteSeleccionado = this.getComponentes().find(x => x.uid === value) || {}
      if (this.componenteSeleccionado) {
        this.tipoComponenteSeleccionado = this.componenteSeleccionado.type
        this.valoresModel.value = null
        if (this.componenteSeleccionado.type === 'select') await this.consumirServicio()
        return this.componenteSeleccionado
      }
    }
  },
  watch: {
    async idComponente (value) {
      await this.consumirServicio()
    }
  },
  computed: {
    valoresModel: createComputed('valores')
  }
}
</script>
