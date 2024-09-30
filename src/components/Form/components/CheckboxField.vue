<template>
  <div
    v-show="element?.visible"
    class="form-group"
    :class="element?.designColumn || ''"
    role="group">
    <q-checkbox
      v-model="model"
      :label="element?.label"
      :id="element?.name"
      :name="element?.name"
      :class="element?.customClass || ''"
      :disable="element?.disabled"
      :readonly="element?.readonly"
      :value="element?.value"
      :ariarequired="element?.required"
      :rules="rules" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import validation from '../../../common/validations'

export default {
  props: {
    element: {
      required: true,
      type: Object,
      default: () => {}
    },
    value: {
      default: false
    }
  },
  setup (props, context) {
    const model = ref(props.value)
    const rules = computed(() => {
      const rule = []
      if (props.element?.required) {
        rule.push(validation.requerido)
      }
      return rule
    })

    return {
      model,
      rules
    }
  }
}
</script>
