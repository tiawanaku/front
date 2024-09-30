<template>
  <div
    v-show="element?.visible"
    class="form-group"
    :class="element?.designColumn || ''"
    role="group">
    <label>{{ element.label }}</label>
    <q-editor
      v-model="model"
      min-height="5rem" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    element: {
      required: true,
      type: Object,
      default: () => {}
    },
    value: {
      default: ''
    }
  },
  setup (props) {
    const model = ref(props.value)

    console.log('editor', props.element)

    return {
      model
    }
  }
}
</script>
