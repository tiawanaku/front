<template>
  <div
    v-if="elementModel.visible"
    class="form-group select"
    :class="elementModel.designColumn || ''"
    role="group"
  >
    <q-select
      :ref="`select-${element.name}`"
      filled
      :name="elementModel.name"
      v-model="elementModel.value"
      :label="elementModel.label"
      :disable="element.disabled"
      :readonly="element.readonly"
      :options="options"
      :option-value="elementModel.optionValue"
      :option-label="elementModel.optionLabel"
      :rules="rules"
      :multiple="elementModel.multiple"
      :use-chips="elementModel.multiple"
      :use-input="elementModel.autoComplete"
      :input-debounce="elementModel.query ? 500 : 0"
      options-selected-class="text-bold text-primary bg-grey-3"
      bottom-slots
      emit-value
      map-options
      :clearable="clearable"
      @filter="filterFn"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sin registros
          </q-item-section>
        </q-item>
      </template>
      <template
        v-slot:hint
        v-if="element.info"
      >
        {{ element.info }}
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
    </q-select>
  </div>
</template>

<script>
import axios from 'axios'
import validation from '../../../common/validations'
import { createComputed } from '@common/utils'
import FormularioMixin from '@common/Mixins/Formulario'

export default {
  mixins: [FormularioMixin],
  props: {
    element: { required: true, type: Object, default: () => {} },
    value: { default: '' },
    listaComponentes: { type: Array, default: () => ([]) },
    clearable: { type: Boolean, default: true }
  },
  data () {
    return {
      model: this.value,
      options: null,
      optionsTemp: []
    }
  },
  mounted () {
    this.getOptions()
    if (this.element.url) {
      /* console.log('mouted selet')
      this.$refs[`select-${this.element.name}`].filter() */
    }
  },
  computed: {
    elementModel: createComputed('element'),
    rules () {
      const rule = []

      if (this.element.required) rule.push(validation.requerido)

      return rule
    }
  },
  /* watch: {
    'element.visible': {
      deep: true,
      handler (value, old) {
        alert(value)
      }
    }
  }, */
  methods: {
    async filterFn (val, update, abort) {
      if (this.element.url) {
        if (this.element.query) {
          await this.getOptions(this.element.query, val)
        } else {
          if (val) {
            const needle = (val + '').toLowerCase()
            this.options = this.optionsTemp.filter(v => v[this.element.optionLabel].toLowerCase().indexOf(needle) > -1)
          } else {
            await this.getOptions()
          }
        }
      } else {
        if (val) {
          const needle = (val + '').toLowerCase()
          this.options = this.element.options.filter(v => v[this.element.optionLabel].toLowerCase().includes(needle))
        } else {
          this.options = this.element.options
        }
      }
      update()
    },
    async getOptions (query, val) {
      try {
        if (this.element.url) {
          let url = this.element.url

          if (!url.includes('http')) url = `${process.env.BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`

          if (val && query) url += `${url.includes('?') ? '&' : '?'}${query}=${val}`

          const filtros = this.getFiltrosComponenteEjecucion(this.element, this.listaComponentes)

          url += filtros.length > 0 ? `&${filtros.join('&')}` : ''

          console.log('_DESDE_EJECUCION_SELECT_ ', url)

          const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${this.$storage.get('token')}` } })

          const items = data.datos ? data.datos : data
          this.options = items.rows ? items.rows : items
          this.optionsTemp = JSON.parse(JSON.stringify(items.rows))
        } else {
          this.options = this.element.options
        }
      } catch (error) {
        console.log('ERROR_SELECT:  ', error)
      }
    }
  }
}
</script>
