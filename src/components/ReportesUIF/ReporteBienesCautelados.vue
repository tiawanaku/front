<template>
  <div class="row q-col-gutter-md justify-center">
    <div class="col-xs-12 text-bold text-primary text-h5">BIENES CAUTELADOS POR GESTIÓN</div>
    <div class="col-xs-12">
      <q-markup-table
        id="ReporteBCPG"
        wrap-cells
        flat
        separator="cell"
      >
        <thead>
          <tr>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="4"
            >Proceso sólo por delito de LGI o proceso LGI con otros delitos </th>
            <th
              class="text-center bg-indigo-10 text-white"
              colspan="14"
            ><span class="text-h5">Desde: {{ filtros.fechaInicio || 'El inicio' }} - Hasta: {{ filtros.fechaFin ||  'Hoy'}}</span></th>
          </tr>
          <tr>
            <th
              class="text-center bg-blue-9 text-white"
              colspan="14"
            >Bienes cautelados</th>
          </tr>
          <tr>
            <th
              class="text-center bg-blue-9 text-white"
              colspan="2"
            >Bienes inmuebles (terrenos, casas, departamentos)</th>
            <th
              class="text-center bg-blue-9 text-white"
              colspan="2"
            >Vehículos (Terrestres)</th>
            <th
              class="text-center bg-blue-9 text-white"
              colspan="2"
            >Vehículos (aéreos)</th>
            <th
              class="text-center bg-blue-9 text-white"
              colspan="2"
            >Vehículos (fluviales y otros)</th>
            <th
              class="text-center bg-blue-9 text-white"
              colspan="2"
            >Otros bienes (Especificar)</th>
            <th
              class="text-center bg-blue-9 text-white"
              rowspan="2"
            >Dinero (USD)</th>
            <th
              class="text-center bg-blue-9 text-white"
              rowspan="2"
            >Dinero (Bs)</th>
            <th
              class="text-center bg-blue-9 text-white"
              rowspan="2"
            >Otros dineros (Especificar)</th>
          </tr>
          <tr>
            <th class="text-center bg-blue-9 text-white">Cantidad</th>
            <th class="text-center bg-blue-9 text-white">Valor Económico Bs</th>
            <th class="text-center bg-blue-9 text-white">Cantidad</th>
            <th class="text-center bg-blue-9 text-white">Valor Económico Bs</th>
            <th class="text-center bg-blue-9 text-white">Cantidad</th>
            <th class="text-center bg-blue-9 text-white">Valor Económico Bs</th>
            <th class="text-center bg-blue-9 text-white">Cantidad</th>
            <th class="text-center bg-blue-9 text-white">Valor Económico Bs</th>
            <th class="text-center bg-blue-9 text-white">Cantidad</th>
            <th class="text-center bg-blue-9 text-white">Valor Económico Bs</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(dato, index) of reporte"
            :key="index"
          >
            <td class="text-left text-bold">{{ dato.label }}</td>
            <td class="text-center">{{ dato.value['BIENES CASAS'] }}</td>
            <td class="text-center">{{ dato.value['VALOR ECONOMICO CASAS'] }}</td>
            <td class="text-center">{{ dato.value['VEHICULOS TERRESTRES'] }}</td>
            <td class="text-center">{{ dato.value['VALOR ECONOMICO VEHICULOS TERRESTRES'] }}</td>
            <td class="text-center">{{ dato.value['VEHICULOS AEREOS'] }}</td>
            <td class="text-center">{{ dato.value['VALOR ECONOMICO VEHICULOS AEREOS'] }}</td>
            <td class="text-center">{{ dato.value['VEHICULOS FLUVIALES'] }}</td>
            <td class="text-center">{{ dato.value['VALOR ECONOMICO VEHICULOS FLUVIALES'] }}</td>
            <td class="text-center">{{ dato.value['OTROS BIENES'] }}</td>
            <td class="text-center">{{ dato.value['VALOR ECONOMICO OTROS BIENES'] }}</td>
            <td class="text-center">{{ dato.value['DINERO (USD)'] }}</td>
            <td class="text-center">{{ dato.value['DINERO (BS)'] }}</td>
            <td class="text-center">{{ dato.value['OTROS DINEROS'] }}</td>
          </tr>
          <tr class="bg-grey-3">
            <td class="text-center text-bold">Totales</td>
            <td class="text-center text-bold">{{ totales['BIENES CASAS'] }}</td>
            <td class="text-center text-bold">{{ totales['VALOR ECONOMICO CASAS'] }}</td>
            <td class="text-center text-bold">{{ totales['VEHICULOS TERRESTRES'] }}</td>
            <td class="text-center text-bold">{{ totales['VALOR ECONOMICO VEHICULOS TERRESTRES'] }}</td>
            <td class="text-center text-bold">{{ totales['VEHICULOS AEREOS'] }}</td>
            <td class="text-center text-bold">{{ totales['VALOR ECONOMICO VEHICULOS AEREOS'] }}</td>
            <td class="text-center text-bold">{{ totales['VEHICULOS FLUVIALES'] }}</td>
            <td class="text-center text-bold">{{ totales['VALOR ECONOMICO VEHICULOS FLUVIALES'] }}</td>
            <td class="text-center text-bold">{{ totales['OTROS BIENES'] }}</td>
            <td class="text-center text-bold">{{ totales['VALOR ECONOMICO OTROS BIENES'] }}</td>
            <td class="text-center text-bold">{{ totales['DINERO (USD)'] }}</td>
            <td class="text-center text-bold">{{ totales['DINERO (BS)'] }}</td>
            <td class="text-center text-bold">{{ totales['OTROS DINEROS'] }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>
<script>
import ReporteMixin from '@common/Mixins/Reporte'

export default {
  mixins: [ReporteMixin],
  props: {
    filtros: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      reporte: [],
      totales: {
        'BIENES CASAS': 0,
        'VALOR ECONOMICO CASAS': 0,
        'VEHICULOS TERRESTRES': 0,
        'VALOR ECONOMICO VEHICULOS TERRESTRES': 0,
        'VEHICULOS AEREOS': 0,
        'VALOR ECONOMICO VEHICULOS AEREOS': 0,
        'VEHICULOS FLUVIALES': 0,
        'VALOR ECONOMICO VEHICULOS FLUVIALES': 0,
        'OTROS BIENES': 0,
        'VALOR ECONOMICO OTROS BIENES': 0,
        'DINERO (USD)': 0,
        'DINERO (BS)': 0,
        'OTROS DINEROS': 0
      }
    }
  },
  async mounted () {
    await this.generarReporte()
  },
  methods: {
    async generarReporte () {
      this.totales = {
        'BIENES CASAS': 0,
        'VALOR ECONOMICO CASAS': 0,
        'VEHICULOS TERRESTRES': 0,
        'VALOR ECONOMICO VEHICULOS TERRESTRES': 0,
        'VEHICULOS AEREOS': 0,
        'VALOR ECONOMICO VEHICULOS AEREOS': 0,
        'VEHICULOS FLUVIALES': 0,
        'VALOR ECONOMICO VEHICULOS FLUVIALES': 0,
        'OTROS BIENES': 0,
        'VALOR ECONOMICO OTROS BIENES': 0,
        'DINERO (USD)': 0,
        'DINERO (BS)': 0,
        'OTROS DINEROS': 0
      }
      let url = 'denuncias/reporte/bienes-cauteleados'

      const filtros = this.getFiltrosReporte(this.filtros)

      url += `?${filtros.join('&')}`

      this.reporte = await this.$axios.get(url)

      for (const seccion of this.reporte) {
        this.totales['BIENES CASAS'] += parseInt(seccion.value['BIENES CASAS'])
        this.totales['VALOR ECONOMICO CASAS'] += parseInt(seccion.value['VALOR ECONOMICO CASAS'])
        this.totales['VEHICULOS TERRESTRES'] += parseInt(seccion.value['VEHICULOS TERRESTRES'])
        this.totales['VALOR ECONOMICO VEHICULOS TERRESTRES'] += parseInt(seccion.value['VALOR ECONOMICO VEHICULOS TERRESTRES'])
        this.totales['VEHICULOS AEREOS'] += parseInt(seccion.value['VEHICULOS AEREOS'])
        this.totales['VALOR ECONOMICO VEHICULOS AEREOS'] += parseInt(seccion.value['VALOR ECONOMICO VEHICULOS AEREOS'])
        this.totales['VEHICULOS FLUVIALES'] += parseInt(seccion.value['VEHICULOS FLUVIALES'])
        this.totales['VALOR ECONOMICO VEHICULOS FLUVIALES'] += parseInt(seccion.value['VALOR ECONOMICO VEHICULOS FLUVIALES'])
        this.totales['OTROS BIENES'] += parseInt(seccion.value['OTROS BIENES'])
        this.totales['VALOR ECONOMICO OTROS BIENES'] += parseInt(seccion.value['VALOR ECONOMICO OTROS BIENES'])
        this.totales['DINERO (USD)'] += parseInt(seccion.value['DINERO (USD)'])
        this.totales['DINERO (BS)'] += parseInt(seccion.value['DINERO (BS)'])
        this.totales['OTROS DINEROS'] += parseInt(seccion.value['OTROS DINEROS'])
      }
    }
  }
}
</script>
