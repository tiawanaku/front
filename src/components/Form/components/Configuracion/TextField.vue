<template>
  <div
    v-show="elementModel.visible"
    class="form-group"
    :class="`col-xs-12 ${elementModel.designColumn}`"
    role="group"
    @click="$store.commit('global/setSeleccionado', posicion)"
  >
    <q-input
      readonly
      filled
      v-model="valueComputed"
      :label="elementModel.label"
      :id="elementModel.id"
      :name="elementModel.name"
      :type="elementModel.typeInput"
      :class="elementModel.customClass || ''"
      :disable="elementModel.disabled"
      :autocomplete="elementModel.autocomplete"
      :placeholder="elementModel.placeholder"
      :max="elementModel.max"
      :min="elementModel.min"
      bottom-slots
      @keyup="onkeyup"
      @keydown="onkeydown"
      :stack-label="['date', 'time'].includes(elementModel.typeInput) || (elementModel.placeholder ? !!elementModel.placeholder.length : false)"
      :maxlength="elementModel.maxlength"
      :ariarequired="elementModel.required"
      :rules="rules"
    >
      <template
        v-if="['email', 'password'].includes(elementModel.typeInput)"
        v-slot:prepend
      >
        <q-icon :name="elementModel.typeInput === 'email' ? 'email' : 'lock'" />
      </template>
      <template
        v-slot:hint
        v-if="elementModel.info"
      >
        {{ elementModel.info }}
      </template>
      <template
        v-slot:after
        v-if="element.help"
      >
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
      </template>
    </q-input>
  </div>
</template>

<script>
import filter from '../lib/filter'
import validation from '../../../../common/validations'
import { createComputed } from '@common/utils'

export default {
  props: {
    element: { required: true, type: Object, default: () => {} },
    value: { default: null },
    posicion: { type: Object, default: () => ({}) }

  },
  data () {
    return {
      model: this.value
    }
  },
  computed: {
    elementModel: createComputed('element'),
    rules () {
      const rule = []
      if (this.elementModel.required) {
        rule.push(validation.requerido)
      }
      return rule
    },
    valueComputed: createComputed('value')
  },
  methods: {
    seleccionarComponente () {
      this.$store.commit('global/setSeleccionado', { posicionSeleccionado: this.index, subPosicionSeleccionado: null })
    },
    onkeyup (e) {
      if (this.elementModel.typeInput === 'number') {
        if (e.target.value.length === +this.elementModel.maxlength && +e.target.value > +this.elementModel.max) {
          e.target.value = this.elementModel.max
        }
        if (e.target.value.length === (this.elementModel.min + '').length && +e.target.value < +this.elementModel.min) {
          e.target.value = this.elementModel.min
        }
      }
    },
    onkeydown (e) {
      if (this.elementModel.typeInput === 'number') {
        filter.numeric(e)
      }
    }
  }
}
</script>
