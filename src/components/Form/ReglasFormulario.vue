<template>
  <div class="row q-col-gutter-sm">
    <div class="col-xs-12">
      <q-bar class="bg-grey-4">
        <div class="text-weight-medium">
          Configuracion de campos condicionales
        </div>
        <q-space />
        <q-btn
          flat
          label="Adicionar regla"
          color="positive"
          icon="add"
          @click="adicionarRegla"
        />
      </q-bar>
    </div>
    <q-banner class="bg-blue-1 text-info full-width q-px-lg text-justify">
      <span><q-icon
          name="info"
          size="sm"
          class="q-mr-sm"
        /></span> <span>Las condiciones son solamente para mostrar un campo de acuerdo a una condicion establecida en el campo seleccionado.</span>
    </q-banner>
    <div class="col-xs-12 text-center bg-blue-1">
      <span class="text-primary text-bold text-body1">{{ valoresModel.label.toUpperCase() }}</span>
    </div>
    <div class="col-xs-12 text-center">
      <q-tabs
        v-if="valoresModel.reglas && valoresModel.reglas.length > 0"
        v-model="valoresModel.operadorReglas"
        dense
        inline-label
        active-class="bg-info text-white"
        align="justify"
      >
        <q-tab
          name="and"
          label="Y (and)"
        />
        <q-tab
          name="or"
          label="O (Or)"
        />
      </q-tabs>
    </div>
    <div class="col-xs-12">
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12">
          <q-item
            clickable
            v-ripple
            v-for="(regla, index) of valoresModel.reglas"
            :key="index"
          >
            <q-item-section>
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12">
                  <Regla
                    :valores="valoresModel.reglas[index]"
                    :listaComponentes="listaComponentes"
                  />
                </div>
                <div
                  class="col-xs-12 text-center no-padding"
                  v-if="valoresModel.reglas && valoresModel.reglas.length > 1 && index !== valoresModel.reglas.length - 1"
                >
                  <span class="text-bold">{{ valoresModel.operadorReglas === 'and' ? 'Y' : 'O'}}</span>
                </div>
              </div>
            </q-item-section>
            <q-item-section avatar>
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                @click="valoresModel.reglas.splice(index, 1)"
              />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createComputed } from 'src/common/utils'
import Regla from './Regla'

export default {
  components: { Regla },
  props: {
    valores: { type: Object, default: () => ({}) },
    listaComponentes: { type: Array, default: () => ([]) }
  },
  data () {
    return {
      componenteSeleccionado: null,
      tipoComponenteSeleccionado: 'text'
    }
  },
  mounted () {
    if (!this.valoresModel.reglas) this.valoresModel.reglas = []
  },
  methods: {
    adicionarRegla () {
      this.valoresModel.reglas.push({ uid: null, operador: null, value: null })
    },
    eliminarRegla (index) {
      this.valoresModel.reglas.splice(index, 1)
    }
  },
  computed: {
    valoresModel: createComputed('valores')
  }
}
</script>
