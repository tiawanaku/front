<template>
  <div
    v-if="elementModel.visible"
    class="form-group"
    :class="element.designColumn || ''"
    role="group"
  >
    <q-input
      filled
      v-model="elementModel.value"
      :label="element.label"
      :id="element.id"
      :name="element.name"
      :type="element.typeInput"
      :class="element.customClass || ''"
      :disable="element.disabled"
      :readonly="element.readonly"
      :autocomplete="element.autocomplete"
      :placeholder="element.placeholder"
      :max="element.max"
      :min="element.min"
      bottom-slots
      :stack-label="['date', 'time'].includes(element.typeInput) || (element.placeholder ? !!element.placeholder.length : false)"
      :maxlength="element.maxlength"
      :ariarequired="element.required"
      :rules="rules"
      v-bind="$attrs"
      clearable
    >
      <template
        v-if="['email', 'password'].includes(element.typeInput)"
        v-slot:prepend
      >
        <q-icon :name="element.typeInput === 'email' ? 'email' : 'lock'" />
      </template>
      <template v-slot:hint>
        <div v-if="element.customValidations">
          <div v-if="element.customValidations.includes('decimales')">
            <span class="text-bold">MONTO EN LITERAL: </span> <span class="text-primary">{{ numeroALetras(elementModel.value, { plural: ' ', singular: ' ', centPlural: ' ', centSingular: ' '}) }}</span>
          </div>
        </div>
        <div v-if="element.typeInput !== 'number'">
          {{ element.info }}
        </div>
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
import filter from './lib/filter'
import validation from '../../../common/validations'
import { createComputed } from '@common/utils'
import numeroALetras from '@common/numeroALetras'

export default {
  props: {
    element: { required: true, type: Object, default: () => ({}) },
    index: { type: Number, default: null }
  },
  data () {
    return {
      numeroALetras
    }
  },
  computed: {
    elementModel: createComputed('element'),
    rules () {
      const rule = []
      if (this.element.required) {
        rule.push(validation.requerido)
      }

      if (this.element.customValidations) {
        for (const validacion of this.element.customValidations) {
          rule.push(validation[validacion])
        }
      }

      if (this.element.longitudMinima) {
        rule.push((v) => validation.longitudMinima(v, this.element.longitudMinima))
      }

      if (this.element.longitudMaxima) {
        rule.push((v) => validation.longitudMaxima(v, this.element.longitudMaxima))
      }

      return rule
    }
  },
  methods: {
    onkeyup (e) {
      if (this.element.typeInput === 'number') {
        if (e.target.value.length === +this.element.maxlength && +e.target.value > +this.element.max) {
          e.target.value = this.element.max
        }
        if (e.target.value.length === (this.element.min + '').length && +e.target.value < +this.element.min) {
          e.target.value = this.element.min
        }
      }
    },
    onkeydown (e) {
      if (this.element.typeInput === 'number') {
        filter.numeric(e)
      }
    }
  }
}
</script>
