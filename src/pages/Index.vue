<template>
  <q-page>
    <Titulo
      icono="security"
      titulo="Dashboard"
    ></Titulo>
    <q-card class="q-mx-sm">
      <q-card-section>
        <Reporte />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Titulo from '@components/common/Titulo'
import Reporte from '@components/Denuncias/ReporteV3'
export default {
  components: {
    Titulo,
    Reporte
  },
  data () {
    return {
    }
  },
  created () {
  },
  async mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss">
.card-dashboard {
  border-top: solid 10px;
  border-color: $warning !important;
  border-radius: 10px;
}
</style>
