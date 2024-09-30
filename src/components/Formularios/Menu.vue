<template>
  <q-form
    ref="rol"
    class="row q-col-gutter-md"
    @submit="guardar()"
  >
    <q-input
      filled
      class="col-xs-12 col-md-6"
      label="Nombre"
      v-model="valoresModel.nombre"
      :rules="valoresModelRules.nombre"
    />
    <q-input
      filled
      class="col-xs-12 col-md-6"
      label="Ruta"
      v-model="valoresModel.ruta"
      :rules="valoresModelRules.ruta"
    />
    <q-select
      filled
      use-input
      class="col-xs-12 col-md-6"
      label="Icono"
      :options="IconList"
      v-model="valoresModel.icono"
      :rules="valoresModelRules.icono"
      @filter="filtrarOpciones"
    >
      <template v-slot:append>
        <q-icon
          size="md"
          color="secondary"
          :name="valoresModel.icono"
          class="q-ml-md"
        />
      </template>

      <template v-slot:option="props">
        <q-item
          v-bind="props.itemProps"
          v-on="props.itemEvents"
        >
          <q-item-section avatar>
            <q-icon :name="props.opt" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="props.opt" />
            <q-item-label caption>{{ props.opt }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      filled
      class="col-xs-12 col-md-6"
      label="orden"
      v-model="valoresModel.orden"
      :rules="valoresModelRules.orden"
    />

    <q-select
      filled
      v-model="valoresModel.idMenu"
      :options="menus"
      option-value="id"
      option-label="nombre"
      label="Menu superior"
      map-options
      emit-value
      class="col-xs-12 col-md-6"
      :rules="valoresModelRules.idMenu"
      clearable
    />

    <div class="col-xs-12 col-md-6">
      <q-toggle
        color="positive"
        checked-icon="done_all"
        unchecked-icon="close"
        size="lg"
        v-model="valoresModel.esMenu"
        label="Aparecera como menu en el lado izquierdo de la pantalla"
      >
        <q-tooltip content-class="bg-info text white">
          Si se trata de una pantalla individual sin menu, no marque esta opcion.
        </q-tooltip>
      </q-toggle>
    </div>

    <div class="col-xs-12 text-right">
      <q-btn
        class="q-ml-sm"
        icon="close"
        label="Cancelar"
        @click="cancelar()"
      />
      <q-btn
        class="q-ml-sm"
        icon="check"
        color="primary"
        label="Guardar"
        type="submit"
      />
    </div>
  </q-form>
</template>
<script>
import IconList from '@common/IconList'
import { createComputed } from 'src/common/utils'
import validations from 'src/common/validations'
const valoresModelRules = {
  ruta: [validations.requerido],
  menus: [validations.requerido],
  icono: [validations.requerido],
  orden: [validations.requerido]
}

export default {
  props: {
    valores: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      IconList,
      IconListOriginal: IconList,
      valoresModelRules,
      menus: []
    }
  },
  computed: {
    valoresModel: createComputed('valores')
  },
  async mounted () {
    await this.getMenus()
  },
  methods: {
    cancelar () {
      this.$emit('cancelar')
    },
    async guardar () {
      await this.$emit('guardar')
    },
    async getMenus () {
      const { rows } = await this.$axios.get('system/menus')
      this.menus = rows
    },
    filtrarOpciones (val, update) {
      if (val === '') {
        update(() => {
          this.IconList = this.IconListOriginal
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.IconList = this.IconListOriginal.filter(v => v.toLowerCase().includes(needle))
      })
    }
  }
}
</script>
