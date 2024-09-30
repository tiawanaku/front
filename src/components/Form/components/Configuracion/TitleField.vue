<template>
  <div
    v-show="element.visible"
    class="form-group"
    :class="element.designColumn || ''"
    role="group"
    @click="$store.commit('global/setSeleccionado', posicion)"
  >
    <span v-html="element.label" />
  </div>
</template>

<script>
import validation from '@common/validations'

export default {
  props: {
    element: { required: true, type: Object, default: () => {} },
    value: { default: null },
    posicion: { type: Object, default: () => ({}) }

  },
  computed: {
    rules () {
      const rule = []
      if (this.element.required) {
        rule.push(validation.requerido)
      }
      return rule
    }
  },
  data () {
    return {
      model: this.value

    }
  }
}
</script>
