<template>
  <draggable
    :id="idLista"
    class="dragArea list-group full-width row q-col-gutter-xs"
    style="min-height: 50px;border: 2px dotted grey;"
    group="listaComponentes"
    :class="{ empty: listaComponentesModel.length === 0}"
    @add="onAdd"
    v-model="listaComponentesModel"
    :draggable="`.${idLista}`"
  >

    <div
      v-for="(element, index) of listaComponentesModel"
      :key="index"
      :class="`${idLista} ${element.designColumn || 'col-xs-12'} ${getClase(element) ? `bg-${bgColor}` : ''}`"
    >
      <component
        class="full-width"
        :is="`${element.type ||  'Acciones'}Field`"
        :element.sync="listaComponentesModel[findIndex(element)]"
        :posicion="{ index: posicion.index, subIndex: findIndex(element) }"
        :listaCampos.sync="listaComponentesModel"
      />
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import TitleField from 'components/Form/components/Configuracion/TitleField'
import AccionesField from 'components/Form/components/Configuracion/AccionesField'
import TextField from 'components/Form/components/Configuracion/TextField'
import SelectField from 'components/Form/components/Configuracion/SelectField'
import MapField from 'components/Form/components//Configuracion/MapField.vue'
import { createComputed } from 'src/common/utils'

export default {
  components: {
    draggable,
    titleField: TitleField,
    textField: TextField,
    selectField: SelectField,
    mapField: MapField,
    AccionesField
  },
  props: {
    idLista: { type: String, required: true, default: 'lista' },
    listaComponentes: { type: Array, required: true, default: () => ([]) },
    bgColor: { type: String, required: true, default: 'bg-teal-1' },
    posicion: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      model: this.value,
      options: null,
      optionsTemp: [],
      componenteSeleccionado: {},
      posicionSeleccionado: null

    }
  },
  computed: {
    listaComponentesModel: createComputed('listaComponentes')
  },
  methods: {
    getClase (element) {
      return this.findIndex(element) === this.$store.state.global.seleccionado.subIndex && this.posicion.index === this.$store.state.global.seleccionado.index
    },
    findIndex (element) {
      return this.listaComponentes.findIndex(x => x.uid === element.uid)
    },
    seleccionarComponente (index) {
      this.posicionSeleccionado = index
      this.$emit('seleccionarComponente', index)
    },
    onAdd (value) {
      console.log('==========_MENSAJE_A_MOSTRARSE_==========')
      console.log(value)
      console.log('==========_MENSAJE_A_MOSTRARSE_==========')
    }
  }
}
</script>

<style lang="scss">
.props-design-title {
  display: inline-block;
  vertical-align: top;
  padding: 7px 10px 0 0;
}

.props-design-column {
  display: inline-flex;
  align-items: center;
  border: 1px solid #efefef;
  padding: 0 4px 0 0;
  margin-bottom: 3px;
  border-radius: 3px;
  margin-right: 10px;
  cursor: pointer;
}

.props-columns {
  display: inline-flex;
  margin: 0 0 0 0;

  & > div {
    display: inline-block;
    width: 14px;
    height: 20px;
    background-color: #e0e0e0;
    margin-right: 3px;
  }
}
</style>
