<template>
  <q-form
    ref="rol"
    class="row q-col-gutter-md"
    @submit="guardar()"
  >

    <q-input
      filled
      class="col-xs-12 col-md-8"
      label="Nombre"
      v-model="valoresModel.nombre"
      :rules="valoresModelRules.nombre"
    />

    <q-select
      filled
      :options="['SISTEMA', 'DENUNCIA']"
      class="col-xs-12 col-md-4"
      label="Grupo"
      v-model="valoresModel.grupo"
      :rules="valoresModelRules.grupo"
      map-options
      emit-value
    />

    <q-input
      filled
      type="textarea"
      class="col-xs-12"
      label="Descripcion"
      v-model="valoresModel.descripcion"
      :rules="valoresModelRules.descripcion"
    />

    <q-select
      filled
      v-model="valoresModel.idMenu"
      :options="menus"
      option-value="id"
      option-label="nombre"
      label="Menu"
      map-options
      emit-value
      class="col-xs-12"
      options-selected-class="bg-grey-3 text-bold  text-primary"
      :rules="valoresModelRules.idMenu"
      clearable
    />

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
  nombre: [validations.requerido],
  grupo: [validations.requerido],
  descripcion: [validations.requerido],
  idMenu: [validations.requerido]
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
