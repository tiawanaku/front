<template>
  <div class="">
    <div
      v-for="element in form"
      :key="element.name"
    >
      <div
        v-if="element.type === 'AVANZADO'"
        :class="{ [element.designColumn]: element.designColumn }"
        class="form-group p-lr-0"
      >
        <label
          class="label-group"
          v-if="element?.label?.length"
        >{{ element.label }}</label>
        <div>
          <div
            v-for="item in element.items"
            :key="item.id"
          >
            <div
              v-if="item.items"
              class="form-group"
              :class="item.designColumn"
            >
              <label v-if="element?.label?.length">{{ item.label }}</label>
              <div>
                <component
                  v-for="subitem in item.items"
                  :key="subitem.id"
                  :is="components[subitem.type]"
                  :element="subitem"
                />
              </div>
            </div>
            <component
              v-else
              :is="components[item.type]"
              :element="item"
            />
          </div>
        </div>
      </div>
      <component
        v-else
        :is="components[element.type]"
        :element="element"
      />
    </div>
  </div>
</template>
<script>

// import { ref } from 'vue'
import CheckboxField from './components/CheckboxField'
import RadioField from './components/RadioField'
import SelectField from './components/SelectField'
import TextField from './components/TextField'
import EditorField from './components/EditorField'
import UploadField from './components/UploadField'
import DataGridField from './components/DataGridField'
import PersonField from './components/PersonField'
import MapField from './components/MapField'
import TitleField from './components/TitleField'

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
  components: {
    CheckboxField,
    RadioField,
    SelectField,
    TextField,
    EditorField,
    UploadField,
    DataGridField,
    PersonField,
    MapField,
    TitleField
  },
  props: {
    form: {
      default: null,
      required: true
    }
  },
  data () {
    return {
      components
    }
  }
}
</script>

<style lang="scss">
</style>
