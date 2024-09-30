<template>
  <q-page>
    <Titulo
      icono="preview"
      titulo="Vistas y permisos"
    ></Titulo>
    <q-tabs
      v-model="tab"
      inline-label
      switch-indicator
      align="left"
      class="q-mx-md text-white"
    >
      <q-tab
        v-if="global.permisos['menus:tab:vistas']"
        name="vistas"
        icon="preview"
        label="Vistas"
      />
      <q-tab
        v-if="global.permisos['menus:tab:permisos']"
        name="permisos"
        icon="security"
        label="Permisos"
      />
    </q-tabs>
    <Menus v-if="tab === 'vistas' && global.permisos['menus:tab:vistas']" />
    <Permisos v-if="tab === 'permisos' && global.permisos['menus:tab:permisos']" />
  </q-page>
</template>

<script>
import Menus from 'components/Menus/Menus'
import Permisos from 'components/Menus/Permisos'
import { mapState } from 'vuex'

export default {
  components: {
    Menus,
    Permisos
  },
  data () {
    return {
      tab: 'vistas'
    }
  },
  computed: {
    ...mapState(['global'])
  }
}

</script>
