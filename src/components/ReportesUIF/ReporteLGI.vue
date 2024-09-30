<template>
  <div class="row q-col-gutter-md justify-center">
    <div class="col-xs-12 text-bold text-primary text-h5">INVESTIGACIONES DEL DELITO LGI/FT</div>
    <div class="col-xs-12">
      <q-markup-table
        id="ReporteLGI"
        wrap-cells
        flat
        separator="cell"
      >
        <thead>
          <tr>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="3"
            >Tipo Delito</th>
            <th
              class="text-center bg-indigo-10 text-white"
              colspan="13"
            ><span class="text-h5">Desde: {{ filtros.fechaInicio || 'El inicio' }} - Hasta: {{ filtros.fechaFin ||  'Hoy'}}</span>
            </th>

          </tr>
          <tr>
            <th
              class="text-center bg-indigo-10 text-white"
              colspan="4"
            >Origen de las investigaciones LGI</th>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="2"
            >Total de casos</th>
            <th
              class="text-center bg-blue-6 text-white"
              rowspan="2"
            >Numero de personas investigadas</th>
            <th
              class="text-center bg-light-blue-6 text-white"
              colspan="5"
            >Cantidad de casos por etapa procesal</th>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="2"
            >Ejecutoría</th>
            <th
              class="text-center bg-indigo-10 text-white"
              rowspan="2"
            >Total de casos por etapa</th>
          </tr>
          <tr>
            <th class="text-center bg-indigo-10 text-white">Denuncias (particular)</th>
            <th class="text-center bg-indigo-10 text-white">De oficio</th>
            <th class="text-center bg-indigo-10 text-white">Por informe UIF</th>
            <th class="text-center bg-indigo-10 text-white">Denuncia (autoridad)</th>
            <th class="text-center bg-light-blue-6 text-white">Preliminar</th>
            <th class="text-center bg-light-blue-6 text-white">Preparatoria</th>
            <th class="text-center bg-light-blue-6 text-white">Juicio</th>
            <th class="text-center bg-light-blue-6 text-white">Con recurso apelación</th>
            <th class="text-center bg-light-blue-6 text-white">Con recurso casación</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(dato, index) of reporte"
            :key="index"
          >
            <td class="text-left text-bold">{{ dato.label }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'DENUNCIA (PARTICULAR)')"
            >{{ dato.value['DENUNCIA (PARTICULAR)'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'DE OFICIO')"
            >{{ dato.value['DE OFICIO'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'POR INFORME UIF')"
            >{{ dato.value['POR INFORME UIF'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'DENUNCIA (AUTORIDAD)')"
            >{{ dato.value['DENUNCIA (AUTORIDAD)'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'TOTAL DE CASOS')"
            >{{ dato.value['TOTAL DE CASOS'] }}</td>
            <td class="text-center">{{ dato.value['NUMERO DE PERSONAS INVESTIGADOS'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'PRELIMINAR')"
            >{{ dato.value['PRELIMINAR'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'PREPARATORIA')"
            >{{ dato.value['PREPARATORIA'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'JUICIO ORAL')"
            >{{ dato.value['JUICIO ORAL'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'RECURSO - APELACIÓN RESTRINGIDA')"
            >{{ dato.value['RECURSO - APELACIÓN RESTRINGIDA'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'RECURSO - CASACIÓN')"
            >{{ dato.value['RECURSO - CASACIÓN'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'EJECUTORIA')"
            >{{ dato.value['EJECUTORIA'] }}</td>
            <td
              class="text-center"
              @click="filtrosAvanzados(dato.label, 'TOTAL DE CASOS POR ETAPA')"
            >{{ dato.value['TOTAL DE CASOS POR ETAPA'] }}</td>
          </tr>
          <tr class="bg-grey-3">
            <td class="text-center text-bold">Totales</td>
            <td class="text-center text-bold">{{ totales['DENUNCIA (PARTICULAR)'] }}</td>
            <td class="text-center text-bold">{{ totales['DE OFICIO'] }}</td>
            <td class="text-center text-bold">{{ totales['POR INFORME UIF'] }}</td>
            <td class="text-center text-bold">{{ totales['DENUNCIA (AUTORIDAD)'] }}</td>
            <td class="text-center text-bold">{{ totales['TOTAL DE CASOS'] }}</td>
            <td class="text-center text-bold">{{ totales['NUMERO DE PERSONAS INVESTIGADOS'] }}</td>
            <td class="text-center text-bold">{{ totales['PRELIMINAR'] }}</td>
            <td class="text-center text-bold">{{ totales['PREPARATORIA'] }}</td>
            <td class="text-center text-bold">{{ totales['JUICIO ORAL'] }}</td>
            <td class="text-center text-bold">{{ totales['RECURSO - APELACIÓN RESTRINGIDA'] }}</td>
            <td class="text-center text-bold">{{ totales['RECURSO - CASACIÓN'] }}</td>
            <td class="text-center text-bold">{{ totales['EJECUTORIA'] }}</td>
            <td class="text-center text-bold">{{ totales['TOTAL DE CASOS POR ETAPA'] }}</td>
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
        'DENUNCIA (PARTICULAR)': 0,
        'DE OFICIO': 0,
        'POR INFORME UIF': 0,
        'DENUNCIA (AUTORIDAD)': 0,
        'TOTAL DE CASOS': 0,
        'NUMERO DE PERSONAS INVESTIGADOS': 0,
        PRELIMINAR: 0,
        PREPARATORIA: 0,
        'JUICIO ORAL': 0,
        'RECURSO - APELACIÓN RESTRINGIDA': 0,
        'RECURSO - CASACIÓN': 0,
        'TOTAL DE CASOS POR ETAPA': 0
      }
    }
  },
  async mounted () {
    await this.generarReporte()
  },
  methods: {
    async generarReporte () {
      this.totales = {
        'DENUNCIA (PARTICULAR)': 0,
        'DE OFICIO': 0,
        'POR INFORME UIF': 0,
        'DENUNCIA (AUTORIDAD)': 0,
        'TOTAL DE CASOS': 0,
        'NUMERO DE PERSONAS INVESTIGADOS': 0,
        PRELIMINAR: 0,
        PREPARATORIA: 0,
        'JUICIO ORAL': 0,
        'RECURSO - APELACIÓN RESTRINGIDA': 0,
        'RECURSO - CASACIÓN': 0,
        EJECUTORIA: 0,
        'TOTAL DE CASOS POR ETAPA': 0
      }
      let url = 'denuncias/reporte/lgi-ft'

      const filtros = this.getFiltrosReporte(this.filtros)

      url += `?${filtros.join('&')}`

      this.reporte = await this.$axios.get(url)

      for (const seccion of this.reporte) {
        this.totales['DENUNCIA (PARTICULAR)'] += parseInt(seccion.value['DENUNCIA (PARTICULAR)'])
        this.totales['DE OFICIO'] += parseInt(seccion.value['DE OFICIO'])
        this.totales['POR INFORME UIF'] += parseInt(seccion.value['POR INFORME UIF'])
        this.totales['DENUNCIA (AUTORIDAD)'] += parseInt(seccion.value['DENUNCIA (AUTORIDAD)'])
        this.totales['TOTAL DE CASOS'] += parseInt(seccion.value['TOTAL DE CASOS'])
        this.totales['NUMERO DE PERSONAS INVESTIGADOS'] += parseInt(seccion.value['NUMERO DE PERSONAS INVESTIGADOS'])
        this.totales.PRELIMINAR += parseInt(seccion.value.PRELIMINAR)
        this.totales.PREPARATORIA += parseInt(seccion.value.PREPARATORIA)
        this.totales['JUICIO ORAL'] += parseInt(seccion.value['JUICIO ORAL'])
        this.totales['RECURSO - APELACIÓN RESTRINGIDA'] += parseInt(seccion.value['RECURSO - APELACIÓN RESTRINGIDA'])
        this.totales['RECURSO - CASACIÓN'] += parseInt(seccion.value['RECURSO - CASACIÓN'])
        this.totales.EJECUTORIA += parseInt(seccion.value.EJECUTORIA)
        this.totales['TOTAL DE CASOS POR ETAPA'] += parseInt(seccion.value['TOTAL DE CASOS POR ETAPA'])
      }
    },
    filtrosAvanzados (label, tipo) {
      const query = {
        idTipoProceso: '9b49b99c-01ea-47d7-bd8a-42d46d8dc530'
      }

      if (this.filtros.fechaInicio) query.fechaDenunciaInicio = this.filtros.fechaInicio

      if (this.filtros.fechaFin) query.fechaDenunciaFin = this.filtros.fechaFin

      if (this.filtros.idUsuarioAsignado) query.idUsuarioAsignado = this.filtros.idUsuarioAsignado

      if (this.filtros.departamento) query.lugarHecho = this.filtros.departamento

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
      if (tipo === 'EJECUTORIA') query.etapaActual = 'EJECUTORIA'
      if (tipo === 'TOTAL DE CASOS POR ETAPA') query.etapaActual = ['PRELIMINAR', 'PREPARATORIA', 'JUICIO ORAL', 'RECURSO - APELACIÓN RESTRINGIDA', 'RECURSO - CASACIÓN']

      this.$router.push({ name: 'busqueda-avanzada', query })
    }
  }
}
</script>
