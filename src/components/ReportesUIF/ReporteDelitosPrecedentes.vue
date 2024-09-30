<template>
  <div class="row q-col-gutter-md justify-center">
    <div class="col-xs-12 text-bold text-primary text-h5">SÓLO DELITOS PRECEDENTES (no incluye LGI)</div>
    <div class="col-xs-12">
      <q-markup-table
        id="ReporteSDPNLGI"
        wrap-cells
        flat
        separator="cell"
      >
        <thead>
          <tr>

            <th
              class="text-center bg-indigo-10 text-white"
              colspan="12"
            ><span class="text-h5">Desde: {{ filtros.fechaInicio || 'El inicio' }} - Hasta: {{ filtros.fechaFin ||  'Hoy'}}</span></th>

          </tr>
          <tr>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="2"
            >Delito</th>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="2"
            >Casos en investigación</th>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="2"
            >Casos en Juicio</th>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="2"
            >Casos con Sentencia</th>
            <th
              class="text-center bg-indigo-10 text-white"
              colspan="4"
            >Tipo de Sentencia</th>
          </tr>
          <tr>
            <th class="text-center bg-indigo-10 text-white">Absolutoria</th>
            <th class="text-center bg-indigo-10 text-white">Condenatoria</th>
            <th class="text-center bg-indigo-10 text-white">Mixto</th>
            <th class="text-center bg-indigo-10 text-white">Ejecutoria</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(dato, index) of reporte"
            :key="index"
          >
            <td class="text-left text-bold">{{ dato.label }}</td>
            <td class="text-center">{{ dato.value['INVESTIGACION'] }}</td>
            <td class="text-center">{{ dato.value['JUICIO'] }}</td>
            <td class="text-center">{{ dato.value['CASOS CON SENTENCIA'] }}</td>
            <td class="text-center">{{ dato.value['ABSOLUTORIA'] }}</td>
            <td class="text-center">{{ dato.value['CONDENATORIA'] }}</td>
            <td class="text-center">{{ dato.value['MIXTO'] }}</td>
            <td class="text-center">{{ dato.value['EJECUTORIA'] }}</td>

          </tr>
          <tr class="bg-grey-3">
            <td class="text-center text-bold">Totales</td>
            <td class="text-center text-bold">{{ totales['INVESTIGACION'] }}</td>
            <td class="text-center text-bold">{{ totales['JUICIO'] }}</td>
            <td class="text-center text-bold">{{ totales['CASOS CON SENTENCIA'] }}</td>
            <td class="text-center text-bold">{{ totales['ABSOLUTORIA'] }}</td>
            <td class="text-center text-bold">{{ totales['CONDENATORIA'] }}</td>
            <td class="text-center text-bold">{{ totales['MIXTO'] }}</td>
            <td class="text-center text-bold">{{ totales['EJECUTORIA'] }}</td>
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
        INVESTIGACION: 0,
        JUICIO: 0,
        'CASOS CON SENTENCIA': 0,
        ABSOLUTORIA: 0,
        CONDENATORIA: 0,
        MIXTO: 0,
        EJECUTORIA: 0
      }
    }
  },
  async mounted () {
    await this.generarReporte()
  },
  methods: {
    async generarReporte () {
      this.totales = {
        INVESTIGACION: 0,
        JUICIO: 0,
        'CASOS CON SENTENCIA': 0,
        ABSOLUTORIA: 0,
        CONDENATORIA: 0,
        MIXTO: 0,
        EJECUTORIA: 0
      }

      let url = 'denuncias/reporte/solo-delitos-precedentes'

      const filtros = this.getFiltrosReporte(this.filtros)

      url += `?${filtros.join('&')}`

      this.reporte = await this.$axios.get(url)

      for (const seccion of this.reporte) {
        this.totales.INVESTIGACION += parseInt(seccion.value.INVESTIGACION)
        this.totales.JUICIO += parseInt(seccion.value.JUICIO)
        this.totales['CASOS CON SENTENCIA'] += parseInt(seccion.value['CASOS CON SENTENCIA'])
        this.totales.ABSOLUTORIA += parseInt(seccion.value.ABSOLUTORIA)
        this.totales.CONDENATORIA += parseInt(seccion.value.CONDENATORIA)
        this.totales.MIXTO += parseInt(seccion.value.MIXTO)
        this.totales.EJECUTORIA += parseInt(seccion.value.EJECUTORIA)
      }
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
