<template>
  <div
    v-show="element.visible"
    class="form-group select"
    :class="element.designColumn || 'col-xs-12'"
    role="group"
    @click="$store.commit('global/setSeleccionado', posicion)"
  >
    <q-select
      :ref="`select-${element.name}`"
      filled
      :label="element.label"
      :options="options"
      :id="element.name"
      :name="element.name"
      :class="element.customClass || ''"
      :disable="element.disabled"
      :readonly="element.readonly"
      :multiple="element.multiple"
      :use-chips="element.multiple"
      :ariarequired="element.required"
      :required="element.required"
      :option-value="element.optionValue"
      :option-label="element.optionLabel"
      :rules="rules"
      :use-input="element.typeInput === 'autocomplete'"
      :hide-selected="element.typeInput === 'autocomplete'"
      :fill-input="element.typeInput === 'autocomplete'"
      :input-debounce="element.query ? 500 : 0"
      bottom-slots
      emit-value
      map-options
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
import validation from '@common/validations'
import { createComputed } from '@common/utils'
import FormularioMixin from '@common/Mixins/Formulario'

export default {
  mixins: [FormularioMixin],
  props: {
    element: { required: true, type: Object, default: () => {} },
    value: { default: '' },
    index: { type: Number, default: null },
    posicion: { type: Object, default: () => ({}) }
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
    rules () {
      const rule = []
      if (this.element.required) {
        rule.push(validation.requerido)
      }
      return rule
    },
    valueComputed: createComputed('value')
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
    filterFn (val, update, abort) {
      console.log('filer')
      if (this.element.url) {
        if (this.element.query) {
          if (val) {
            this.getOptions(update, this.element.query, val)
          } else {
            abort()
          }
        } else {
          if (val) {
            const needle = (val + '').toLowerCase()
            this.options = this.optionsTemp.value.filter(v => v[this.element.optionLabel].toLowerCase().indexOf(needle) > -1)
            update()
          } else {
            /* if (this.options !== null) {
              update()
              return
            } */

            this.getOptions(update)
          }
        }
      } else {
        update(() => {
          if (val) {
            const needle = (val + '').toLowerCase()
            this.options = this.element.options.filter(v => v[this.element.optionLabel].toLowerCase().indexOf(needle) > -1)
          } else {
            this.options = this.element.options
          }
        })
      }
    },
    async getOptions (query, val) {
      try {
        if (this.element.url) {
          let url = this.element.url

          if (!url.includes('http')) url = `${process.env.BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`

          if (val && query) url += `${url.includes('?') ? '&' : '?'}${query}=${val}`

          const filtros = this.getFiltrosComponenteConfiguracion(this.element, [], this.element.filtros)

          url += `&${filtros.join('&')}`

          console.log('_DESDE_EJECUCION_SELECT_CONFIG ', url)

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
