<template>
  <q-page>
    <Titulo
      icono="gavel"
      titulo="Procesos"
    ></Titulo>
    <q-tabs
      v-model="tab"
      class="q-mx-md"
      active-color="white"
      active-bg-color="accent"
      indicator-color="white"
      switch-indicator
      align="left"
    >
      <q-tab
        v-if="global.permisos['procesos:tab:procesos']"
        name="proceso"
        label="Procesos"
      />
      <q-tab
        v-if="global.permisos['procesos:tab:formularios']"
        name="formulario"
        label="Formularios"
      />
    </q-tabs>
    <FormularioCrud v-if="tab === 'formulario' && global.permisos['procesos:tab:formularios']"></FormularioCrud>
    <ProcesoCrud v-if="tab=== 'proceso' && global.permisos['procesos:tab:formularios']"></ProcesoCrud>
  </q-page>
</template>

<script>
import FormularioCrud from '@components/Procesos/FormularioCrud'
import ProcesoCrud from '@components/Procesos/ProcesoCrud'
import { mapState } from 'vuex'

export default {
  components: {
    FormularioCrud,
    ProcesoCrud
  },
  data () {
    return {
      tab: 'proceso'
    }
  },
  computed: {
    ...mapState(['global'])
  },
  async mounted () {
  }
}

</script>
