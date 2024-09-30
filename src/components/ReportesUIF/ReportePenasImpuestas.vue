<template>
  <div class="row q-col-gutter-md justify-center items-center">
    <div class="col-xs-12 text-bold text-primary text-h5">PENAS IMPUESTAS EN LAS SENTENCIAS</div>
    <div
      class="col-xs-12 col-md-6"
      v-if="reporteAnios.length > 0"
    >
      <q-markup-table
        id="ReportePIES"
        wrap-cells
        flat
        separator="cell"
      >
        <thead>
          <tr>
            <th
              class="text-center bg-indigo-10 text-white"
              colspan="2"
            ><span class="text-h5">Desde: {{ filtros.fechaInicio || 'El inicio' }} - Hasta: {{ filtros.fechaFin ||  'Hoy'}}</span></th>

          </tr>
          <tr>
            <th class="text-center bg-blue-9 text-white">Pena privativa de libertad </th>
            <th class="text-center bg-blue-9 text-white">N° de personas condenadas</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(anio, index) of reporteAnios"
            :key="index"
          >
            <td class="text-left text-bold">{{ anio.label }}</td>
            <td class="text-center">{{ anio.value.total }}</td>
          </tr>
          <tr class="bg-grey-3">
            <td class="text-center text-bold">Totales</td>
            <td class="text-center text-bold">{{ totalesAnios }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div
      class="col-xs-12 col-md-6"
      v-if="reporteDias.length > 0"
    >

      <q-markup-table
        id="ReportePIES1"
        wrap-cells
        flat
        separator="cell"
      >
        <thead>
          <tr>
            <th
              class="text-center bg-indigo-10 text-white"
              colspan="3"
            ><span class="text-h5">Desde: {{ filtros.fechaInicio || 'El inicio' }} - Hasta: {{ filtros.fechaFin ||  'Hoy'}}</span></th>

          </tr>
          <tr>
            <th class="text-center bg-blue-9 text-white">Pena privativa de libertad </th>
            <th class="text-center bg-blue-9 text-white">N° de personas condenadas</th>
            <th class="text-center bg-blue-9 text-white">Estimación en Bs.</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(dia, index) of reporteDias"
            :key="index"
          >
            <td class="text-left text-bold">{{ dia.label }}</td>
            <td class="text-center">{{ dia.value.total }}</td>
            <td class="text-center">{{ dia.value.totalMonetario }}</td>
          </tr>
          <tr class="bg-grey-3">
            <td class="text-center text-bold">Totales</td>
            <td class="text-center text-bold">{{ totalesDias.totalDias }}</td>
            <td class="text-center text-bold">{{ totalesDias.totalMonetario }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>
<script>
import ReporteMixin from '@common/Mixins/Reporte'

const objetoFiltros = [
  { campo: 'idParametroDelito', valor: '482e5b57-65e2-4fa0-bf2c-f91c03383657', campoReporte: 'LGI' },
  { campo: 'idParametroDelito', valor: '92016e05-98dd-402b-9f15-6e6c12290069', campoReporte: 'FT' },
  { campo: 'idTipoOrigen', valor: 'acd9cae3-08fb-4ab6-bddd-2cb4fe11f32e', campoReporte: 'DE OFICIO' },
  { campo: 'idTipoOrigen', valor: 'ead28ade-c9d7-49e0-ae4c-c84f61e557ff', campoReporte: 'DENUNCIA (PARTICULAR)' },
  { campo: 'idTipoOrigen', valor: 'ce8e12ce-13a6-4993-b56c-11d12dfc7c65', campoReporte: 'POR INFORME UIF' },
  { campo: 'idTipoOrigen', valor: '77a39563-a841-4bd7-bfd1-54f7f597848c', campoReporte: 'DENUNCIA (AUTORIDAD)' },
  { campo: 'etapaActual', valor: 'PRELIMINAR', campoReporte: 'PRELIMINAR' },
  { campo: 'etapaActual', valor: 'PREPARATORIA', campoReporte: 'PREPARATORIA' },
  { campo: 'etapaActual', valor: 'JUICIO ORAL', campoReporte: 'JUICIO ORAL' },
  { campo: 'etapaActual', valor: 'RECURSO - APELACIÓN RESTRINGIDA', campoReporte: 'RECURSO - APELACIÓN RESTRINGIDA' },
  { campo: 'etapaActual', valor: 'RECURSO - CASACIÓN', campoReporte: 'RECURSO - CASACIÓN' },
  { campo: 'etapaActual', valor: ['PRELIMINAR', 'PREPARATORIA', 'JUICIO ORAL', 'RECURSO - APELACIÓN RESTRINGIDA', 'RECURSO - CASACIÓN'], campoReporte: 'TOTAL DE CASOS POR ETAPA' }
]

export default {
  mixins: [ReporteMixin],
  props: {
    filtros: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      objetoFiltros,
      fechaFiltro: {
        fechaInicio: null,
        fechaFin: null
      },
      reporteDias: [],
      reporteAnios: [],
      totalesAnios: 0,
      totalesDias: {
        totalDias: 0,
        totalMonetario: 0
      }
    }
  },
  async mounted () {
    await this.generarReporte()
  },
  methods: {
    async generarReporte () {
      this.totalesAnios = 0
      this.totalesDias = {
        totalDias: 0,
        totalMonetario: 0
      }
      let url = 'denuncias/reporte/penas-impuestas'

      const filtros = this.getFiltrosReporte(this.filtros)

      url += `?${filtros.join('&')}`

      const respuesta = await this.$axios.get(url)
      this.reporteAnios = respuesta.reporteAnios
      this.reporteDias = respuesta.reporteDias

      for (const anio of this.reporteAnios) {
        this.totalesAnios += parseInt(anio.value.total)
      }

      for (const dia of this.reporteDias) {
        this.totalesDias.totalDias += parseInt(dia.value.total)
        this.totalesDias.totalMonetario += parseInt(dia.value.totalMonetario)
      }
    }
  }
}
</script>
