<template>
  <div class="row q-col-gutter-md justify-center">
    <div class="col-xs-12 text-bold text-primary text-h5">BIENES DECOMISADOS POR GESTIÓN </div>
    <div class="col-xs-12">
      <q-markup-table
        id="ReporteBDG"
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
      reporte: [],
      objetoFiltros,
      fechaFiltro: {
        fechaInicio: null,
        fechaFin: null
      },
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
      let url = 'denuncias/reporte/bienes-decomisados'

      const filtros = this.getFiltrosReporte(this.filtros)

      url += `?${filtros.join('&')}`

      this.reporte = await this.$axios.get(url)

      for (const seccion of this.reporte) {
        this.totales['BIENES CASAS'] += parseInt(seccion.value['BIENES CASAS'])
        this.totales['VALOR ECONOMICO CASAS'] += parseFloat(seccion.value['VALOR ECONOMICO CASAS'])
        this.totales['VEHICULOS TERRESTRES'] += parseInt(seccion.value['VEHICULOS TERRESTRES'])
        this.totales['VALOR ECONOMICO VEHICULOS TERRESTRES'] += parseFloat(seccion.value['VALOR ECONOMICO VEHICULOS TERRESTRES'])
        this.totales['VEHICULOS AEREOS'] += parseInt(seccion.value['VEHICULOS AEREOS'])
        this.totales['VALOR ECONOMICO VEHICULOS AEREOS'] += parseFloat(seccion.value['VALOR ECONOMICO VEHICULOS AEREOS'])
        this.totales['VEHICULOS FLUVIALES'] += parseInt(seccion.value['VEHICULOS FLUVIALES'])
        this.totales['VALOR ECONOMICO VEHICULOS FLUVIALES'] += parseFloat(seccion.value['VALOR ECONOMICO VEHICULOS FLUVIALES'])
        this.totales['OTROS BIENES'] += parseInt(seccion.value['OTROS BIENES'])
        this.totales['VALOR ECONOMICO OTROS BIENES'] += parseFloat(seccion.value['VALOR ECONOMICO OTROS BIENES'])
        this.totales['DINERO (USD)'] += parseFloat(seccion.value['DINERO (USD)'])
        this.totales['DINERO (BS)'] += parseFloat(seccion.value['DINERO (BS)'])
        console.log('==========_MENSAJE_A_MOSTRARSE_==========')
        console.log(seccion.value['OTROS DINEROS'] ? seccion.value['OTROS DINEROS'] : '')
        console.log('==========_MENSAJE_A_MOSTRARSE_==========')
        this.totales['OTROS DINEROS'] += parseFloat(seccion.value['OTROS DINEROS'])
      }
      console.log('==========_DESDE_FINAL==========')
      console.log(this.totales['OTROS DINEROS'])
      console.log('==========_DESDE_FINAL==========')
    },
    filtrosAvanzados (label, tipo) {
      const query = {}

      if (this.fechaFiltro.fechaInicio) query.fechaDenunciaInicio = this.fechaFiltro.fechaInicio

      if (this.fechaFiltro.fechaFin) query.fechaDenunciaFin = this.fechaFiltro.fechaFin

      if (label === 'LGI') {
        query.idDelito = '482e5b57-65e2-4fa0-bf2c-f91c03383657'
      }

      if (label === 'FT') {
        query.idDelito = '92016e05-98dd-402b-9f15-6e6c12290069'
      }

      if (label === 'LGI + NARCOTRAFICO') {
        query.idDelito = '482e5b57-65e2-4fa0-bf2c-f91c03383657'
        query.idCategoriaDelito = 'c8ac29be-bffb-48e3-a3b6-e65504887f52'
      }

      if (label === 'LGI + CORRUPCIÓN') {
        query.idDelito = '482e5b57-65e2-4fa0-bf2c-f91c03383657'
        query.idCategoriaDelito = '60e1e363-e566-4b4d-9a6e-f12f8a1906fc'
      }

      if (label === 'LGI + CONTRABANDO') {
        query.idDelito = '482e5b57-65e2-4fa0-bf2c-f91c03383657'
        query.idCategoriaDelito = '89bcdabc-a7eb-4c7d-a281-179186742b87'
      }

      if (label === 'LGI + TRATA DE PERSONAS') {
        query.idDelito = '482e5b57-65e2-4fa0-bf2c-f91c03383657'
        query.idCategoriaDelito = '66ab53d5-2ec3-42ef-a431-47d2c6e95bdc'
      }

      if (label === 'LGI + OTROS') {
        query.idDelito = '482e5b57-65e2-4fa0-bf2c-f91c03383657'
        query.idCategoriaDelito = '7fd82b3a-51e3-48bd-b1e4-b38e98a50e98'
      }

      if (tipo === 'DENUNCIA (PARTICULAR)') query.idTipoOrigen = 'ead28ade-c9d7-49e0-ae4c-c84f61e557ff'
      if (tipo === 'DE OFICIO') query.idTipoOrigen = 'acd9cae3-08fb-4ab6-bddd-2cb4fe11f32e'
      if (tipo === 'POR INFORME UIF') query.idTipoOrigen = 'ce8e12ce-13a6-4993-b56c-11d12dfc7c65'
      if (tipo === 'DENUNCIA (AUTORIDAD)') query.idTipoOrigen = '77a39563-a841-4bd7-bfd1-54f7f597848c'
      if (tipo === 'TOTAL DE CASOS') query.idTipoOrigen = ['ead28ade-c9d7-49e0-ae4c-c84f61e557ff', 'acd9cae3-08fb-4ab6-bddd-2cb4fe11f32e', 'ce8e12ce-13a6-4993-b56c-11d12dfc7c65', '77a39563-a841-4bd7-bfd1-54f7f597848c']

      if (tipo === 'PRELIMINAR') query.etapaActual = 'PRELIMINAR'
      if (tipo === 'PREPARATORIA') query.etapaActual = 'PREPARATORIA'
      if (tipo === 'JUICIO ORAL') query.etapaActual = 'JUICIO ORAL'
      if (tipo === 'RECURSO - APELACIÓN RESTRINGIDA') query.etapaActual = 'RECURSO - APELACIÓN RESTRINGIDA'
      if (tipo === 'RECURSO - CASACIÓN') query.etapaActual = 'RECURSO - CASACIÓN'
      if (tipo === 'TOTAL DE CASOS POR ETAPA') query.etapaActual = ['PRELIMINAR', 'PREPARATORIA', 'JUICIO ORAL', 'RECURSO - APELACIÓN RESTRINGIDA', 'RECURSO - CASACIÓN']

      this.$router.push({ name: 'busqueda-avanzada', query })
    }
  }
}
</script>
