<template>
  <div>
    <component
      v-for="(element, iElement) in configuracionModel"
      :key="iElement"
      :is="components[element.type]"
      :element.sync="configuracion[iElement]"
      :listaComponentes.sync="configuracionModel"
    />
  </div>
</template>
<script>
import RadioField from './components/RadioField'
import SelectField from './components/SelectField'
import TextField from './components/TextField'
import DataGridField from './components/DataGridField'
import TitleField from './components/TitleField'
import MapField from './components/MapField'
import { createComputed } from 'src/common/utils'
import FormularioMixin from '@common/Mixins/Formulario'

const components = {
  text: 'TextField',
  textarea: 'TextAreaField',
  select: 'SelectField',
  checkbox: 'CheckboxField',
  radio: 'RadioField',
  editor: 'EditorField',
  upload: 'UploadField',
  datagrid: 'DataGridField',
  person: 'PersonField',
  map: 'MapField',
  title: 'TitleField'
}

export default {
  mixins: [FormularioMixin],
  components: {
    RadioField,
    SelectField,
    TextField,
    DataGridField,
    TitleField,
    MapField
  },
  props: {
    configuracion: { required: true, type: Array, default: () => ([]) }
  },
  data () {
    return {
      components
    }
  },
  watch: {
    configuracionModel: {
      handler (nuevo, antiguo) {
        for (const campo of this.configuracionModel) {
          campo.visible = this.evaluarCondiciones(campo, this.configuracionModel, campo.reglas)
          if (!campo.visible) campo.value = null
        }
      },
      deep: true
    }
  },
  computed: {
    configuracionModel: createComputed('configuracion')
  }
}
</script>

<style lang="scss">
</style>
