<template>
  <div class="row q-col-gutter-md justify-center">
    <div class="col-xs-12 text-bold text-primary text-h5">SENTENCIAS LGI/FT </div>
    <div class="col-xs-12">
      <q-markup-table
        id="ReporteSLGI"
        wrap-cells
        flat
        separator="cell"
      >
        <thead>
          <tr>
            <th
              class="text-center bg-indigo-10 text-white"
              colspan="11"
            ><span class="text-h5">Desde: {{ filtros.fechaInicio || 'El inicio' }} - Hasta: {{ filtros.fechaFin ||  'Hoy'}}</span></th>

          </tr>
          <tr>
            <th
              class="text-center bg-blue-9 text-white"
              rowspan="2"
            >Por delito </th>
            <th
              class="text-center bg-blue-9 text-white"
              colspan="3"
            >Sentencias</th>
            <th
              class="text-center bg-blue-9 text-white"
              colspan="2"
            >Recursos</th>
            <th
              class="text-center bg-blue-9 text-white"
              rowspan="2"
            >Sentencia Ejecutoriada</th>
            <th
              class="text-center bg-blue-9 text-white"
              rowspan="2"
            >Número de personas condenadas</th>
          </tr>
          <tr>
            <th class="text-center bg-blue-9 text-white">Absolutoria</th>
            <th class="text-center bg-blue-9 text-white">Condenatoria</th>
            <th class="text-center bg-blue-9 text-white">Mixta</th>
            <th class="text-center bg-blue-9 text-white">Con Apelación Restringida</th>
            <th class="text-center bg-blue-9 text-white">En Casación</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(dato, index) of reporte"
            :key="index"
          >
            <td class="text-left text-bold">{{ dato.label }}</td>
            <td class="text-center">{{ dato.value['ABSOLUTORIA'] }}</td>
            <td class="text-center">{{ dato.value['CONDENATORIA'] }}</td>
            <td class="text-center">{{ dato.value['MIXTA'] }}</td>
            <td class="text-center">{{ dato.value['CON APELACIÓN RESTRINGIDA'] }}</td>
            <td class="text-center">{{ dato.value['EN CASACIÓN'] }}</td>
            <td class="text-center">{{ dato.value['SENTENCIA EJECUTORIADA'] }}</td>
            <td class="text-center">{{ dato.value['NUMERO DE PERSONAS CONDENADAS'] }}</td>
          </tr>
          <tr class="bg-grey-3">
            <td class="text-center text-bold">Totales</td>
            <td class="text-center text-bold">{{ totales['ABSOLUTORIA'] }}</td>
            <td class="text-center text-bold">{{ totales['CONDENATORIA'] }}</td>
            <td class="text-center text-bold">{{ totales['MIXTA'] }}</td>
            <td class="text-center text-bold">{{ totales['CON APELACIÓN RESTRINGIDA'] }}</td>
            <td class="text-center text-bold">{{ totales['EN CASACIÓN'] }}</td>
            <td class="text-center text-bold">{{ totales['SENTENCIA EJECUTORIADA'] }}</td>
            <td class="text-center text-bold">{{ totales['NUMERO DE PERSONAS CONDENADAS'] }}</td>
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
        ABSOLUTORIA: 0,
        CONDENATORIA: 0,
        MIXTA: 0,
        'CON APELACIÓN RESTRINGIDA': 0,
        'EN CASACIÓN': 0,
        'SENTENCIA EJECUTORIADA': 0,
        'NUMERO DE PERSONAS CONDENADAS': 0
      }
    }
  },
  async mounted () {
    await this.generarReporte()
  },
  methods: {
    async generarReporte () {
      this.totales = {
        ABSOLUTORIA: 0,
        CONDENATORIA: 0,
        MIXTA: 0,
        'CON APELACIÓN RESTRINGIDA': 0,
        'EN CASACIÓN': 0,
        'SENTENCIA EJECUTORIADA': 0,
        'NUMERO DE PERSONAS CONDENADAS': 0
      }
      let url = 'denuncias/reporte/sentencias-lgi'

      const filtros = this.getFiltrosReporte(this.filtros)

      url += `?${filtros.join('&')}`

      this.reporte = await this.$axios.get(url)

      for (const seccion of this.reporte) {
        this.totales.ABSOLUTORIA += parseInt(seccion.value.ABSOLUTORIA)
        this.totales.CONDENATORIA += parseInt(seccion.value.CONDENATORIA)
        this.totales.MIXTA += parseInt(seccion.value.MIXTA)
        this.totales['CON APELACIÓN RESTRINGIDA'] += parseInt(seccion.value['CON APELACIÓN RESTRINGIDA'])
        this.totales['EN CASACIÓN'] += parseInt(seccion.value['EN CASACIÓN'])
        this.totales['SENTENCIA EJECUTORIADA'] += parseInt(seccion.value['SENTENCIA EJECUTORIADA'])
        this.totales['NUMERO DE PERSONAS CONDENADAS'] += parseInt(seccion.value['NUMERO DE PERSONAS CONDENADAS'])
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
