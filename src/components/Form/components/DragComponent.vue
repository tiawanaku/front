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
      v-for="(element, index) in listaComponentesModel"
      :key="index"
      :class="`${idLista} ${element.designColumn} ${index ===  $store.state.global.seleccionado.index ? `bg-${bgColor}` : null}`"
    >
      <component
        class="full-width"
        :is="`${element.type}Field`"
        :element.sync="listaComponentesModel[index]"
        :posicion="{ index: index, subIndex: null }"
      />
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import TitleField from 'components/Form/components/Configuracion/TitleField'
import TextField from 'components/Form/components/Configuracion/TextField'
import SelectField from 'components/Form/components/Configuracion/SelectField'
import MapField from 'components/Form/components/Configuracion/MapField'
import DataGridField from 'components/Form/components/Configuracion/DataGridField'
import { createComputed } from 'src/common/utils'

export default {
  components: {
    draggable,
    titleField: TitleField,
    textField: TextField,
    selectField: SelectField,
    datagridField: DataGridField,
    mapField: MapField
  },
  props: {
    idLista: { type: String, required: true, default: 'lista' },
    listaComponentes: { type: Array, required: true, default: () => ([]) },
    bgColor: { type: String, required: true, default: 'bg-teal-1' }
  },
  data () {
    return {
      model: this.value,
      options: null,
      optionsTemp: [],
      posicionSeleccionado: null,
      subPosicionSeleccionado: null
    }
  },
  computed: {
    listaComponentesModel: createComputed('listaComponentes')
  },
  methods: {
    onAdd () {}
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
