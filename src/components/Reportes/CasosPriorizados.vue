<template>
  <section class="row q-col-gutter-md items-center justify-center">
    <div class="col-xs-12 col-md-8">
      <div class="row q-col-gutter-md items-center justify-center">
        <q-select
          dense
          class="col-xs-12 col-sm-6 col-md-3"
          filled
          label="Departamento"
          :options="departamentos"
          v-model="fechaFiltro.departamento"
          map-options
          emit-value
          clearable
        />

        <q-input
          dense
          filled
          class="col-xs-12 col-sm-6 col-md-3"
          clearable
          v-model="fechaFiltro.fechaInicio"
          label="Fecha de inicio"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="fechaInicio"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fechaFiltro.fechaInicio"
                  color="primary"
                  mask="YYYY-MM-DD"
                  @input="$refs.fechaInicio.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          dense
          filled
          class="col-xs-12 col-sm-6 col-md-3"
          clearable
          v-model="fechaFiltro.fechaFin"
          label="Fecha de fin"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="fechaFin"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fechaFiltro.fechaFin"
                  color="primary"
                  mask="YYYY-MM-DD"
                  @input="$refs.fechaFin.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-btn
            @click="generarReportes"
            class="full-width"
            color="positive"
            icon="refresh"
            label="Generar reportes"
          >
          </q-btn>
        </div>
      </div>
    </div>

    <div class="col-xs-12 text-center">
      <span class="text-bold  text-primary text-h5">Desde: <span class="text-positive">{{ fechaFiltro.fechaInicio || 'El inicio' }}</span> Hasta <span class="text-positive">{{ fechaFiltro.fechaFin ||  'Hoy'}}</span></span>
    </div>

    <div class="col-xs-12 text-center">
      <q-tabs
        v-model="tab"
        inline-label
        class="text-primary q-mb-md"
        switch-indicator
      >
        <q-tab
          name="grafico"
          icon="show_chart"
          label="PROCESOS PENALES PRIORIZADOS"
        />
        <q-tab
          name="tablas"
          icon="table_chart"
          label="ESTADO DE CASOS / DAÑO ECONOMICO AL ESTADO"
        />
      </q-tabs>
    </div>

    <div
      class="col-xs-10 text-center"
      v-if="!casos.length"
    >
      <q-card
        flat
        class="bg-blue-1"
      >
        <q-card-secct>
          <q-icon
            name="info"
            color="info"
            size="70px"
          />
        </q-card-secct>
        <q-card-section>
          <span class="text-primary text-h5 text-bold">No existen datos para mostrar</span><br>
          <span class="text-primary text-h6 text-bold">Cambie los filtros y vuelva a intentarlo</span>
        </q-card-section>
      </q-card>
    </div>

    <div
      class="col-xs-12 col-md-10"
      v-if="tab === 'grafico' && casos.length"
    >
      <VueApexCharts
        v-if="visualizarChart"
        type="bar"
        :height="tamanioCalculado"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </div>
    <div
      class="col-xs-12 col-md-2"
      v-if="tab === 'grafico' && casos.length"
    >
      <q-markup-table
        wrap-cells
        dense
      >
        <thead class="bg-primary text-white">
          <th><span class="text-bold">Etapa</span></th>
          <th><span class="text-bold">Ponderacion acumulada</span></th>
        </thead>
        <tbody>
          <tr>
            <td class="text-center text-bold">Preliminar</td>
            <td class="text-center">15%</td>
          </tr>
          <tr>
            <td class="text-center text-bold">Preparatoria</td>
            <td class="text-center">40%</td>
          </tr>
          <tr>
            <td class="text-center text-bold">Juicio</td>
            <td class="text-center">80%</td>
          </tr>
          <tr>
            <td class="text-center text-bold">Sentencia</td>
            <td class="text-center">100%</td>
          </tr>
          <tr class="bg-grey-3">
            <td class="text-center text-bold">Total avances del proceso</td>
            <td class="text-center">100%</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div
      class="col-xs-12 text-center"
      v-if="tab === 'tablas' && casos.length"
    >
      <q-btn
        color="positive"
        label="Descargar en formato excel"
        icon="download"
        @click="generarExcel"
      />
    </div>
    <div
      class="col-xs-12 col-md-6"
      v-if="tab === 'tablas' && casos.length"
    >
      <q-markup-table
        wrap-cells
        dense
        id="estadoCasosPriorizados"
      >
        <thead class="bg-primary text-white">
          <tr>
            <th
              colspan="3"
              class="no-padding"
            >
              <img
                width="100%"
                src="~assets/logoMinisterio.png"
                alt=""
              >
            </th>
          </tr>
          <tr>
            <th colspan="3">
              <span class="text-center text-bold">ESTADO DE CASOS PRIORIZADOS </span><br>
            </th>
          </tr>
          <tr>
            <th><span class="text-bold">N°</span></th>
            <th
              class="text-center"
              style="min-width:200px;"
            >
              <span class="text-bold">CASO</span>
            </th>
            <th class="text-center"><span class="text-bold">ACTUADO</span></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(caso, index) of casos"
            :key="index"
          >
            <td class="text-center text-white text-bold bg-info">{{ index + 1 }}</td>
            <td class="text-center">{{ caso.denominacion }}</td>
            <td class="text-left">{{ caso.actuacion }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div
      class="col-xs-12 col-md-6"
      v-if="tab === 'tablas' && casos.length"
    >
      <q-markup-table
        wrap-cells
        dense
        id="danioEconomicoEstado"
      >
        <thead class="bg-primary text-white">
          <tr>
            <th
              colspan="3"
              class="no-padding"
            >
              <img
                width="100%"
                src="~assets/logoMinisterio.png"
                alt=""
              >
            </th>
          </tr>
          <tr>
            <th colspan="3">
              <span class="text-center text-bold">DAÑO ECONOMICO AL ESTADO </span><br>
            </th>
          </tr>
          <tr>
            <th><span class="text-bold">N°</span></th>
            <th
              class="text-center"
              style="min-width:200px;"
            ><span class="text-bold">DENOMINATIVO CASO</span></th>
            <th class="text-center"><span class="text-bold">MONTO (BS)</span></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(caso, index) of casos"
            :key="index"
          >
            <td class="text-center text-white text-bold bg-info">{{ index + 1 }}</td>
            <td class="text-center">{{ caso.denominacion }}</td>
            <td class="text-left">{{ caso.monto || 'POR DETERMINAR' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </section>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import * as XLSX from 'xlsx'

export default {
  components: { VueApexCharts },
  props: {
    idTipoProceso: { type: String, default: null }
  },
  data () {
    return {
      departamentos: [
        'LA PAZ',
        'ORURO',
        'COCHABAMBA',
        'PANDO',
        'SANTA CRUZ',
        'CHUQUISACA',
        'TARIJA',
        'POTOSI',
        'BENI'
      ],
      fechaFiltro: {
        departamento: null,
        fechaInicio: null,
        fechaFin: null
      },
      tab: 'grafico',
      visualizarChart: false,
      tamanioCalculado: 1000,
      series: [
        { name: 'Avance', data: [] },
        { name: 'Porcentaje restante del proceso', data: [] }
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          stackType: '100%'
        },
        plotOptions: { bar: { horizontal: true } },
        xaxis: { categories: [] },
        yaxis: {
          labels: {
            show: true,
            align: 'right',
            minWidth: 400,
            maxWidth: 600,
            style: {
              cssClass: 'label-priorizados'
            },
            offsetX: 0,
            offsetY: 0,
            rotate: 0,
            formatter: (value) => { return value }
          }
        },
        axisBorder: {
          show: false,
          color: '#78909C',
          offsetX: 0,
          offsetY: 0
        },
        tooltip: {
          y: { formatter: function (val) { return val + '%' } }
        },
        colors: ['#42A5F5', '#F57C00'],
        fill: { opacity: 1, colors: ['#42A5F5', '#F57C00'] },
        legend: { position: 'top', horizontalAlign: 'center' }
      },
      casos: []
    }
  },
  async mounted () {
    await this.generarReportes()
  },
  methods: {
    async generarReportes () {
      this.visualizarChart = false
      let url = 'denuncias/reporte/priorizados-porcentaje'
      const filtros = []
      for (const key in this.fechaFiltro) {
        if (this.fechaFiltro[key]) {
          filtros.push(`${key}=${this.fechaFiltro[key]}`)
        }
      }

      url += `?${filtros.join('&')}`

      this.casos = await this.$axios.get(url)

      this.series[0].data = []
      this.series[1].data = []
      this.chartOptions.xaxis.categories = []

      for (const caso of this.casos) {
        this.chartOptions.xaxis.categories.push(caso.denominacion)
        this.series[0].data.push(caso.porcentaje)
        this.series[1].data.push(100 - caso.porcentaje)
      }
      this.tamanioCalculado = this.casos.length < 10 ? this.casos.length * 100 : this.casos.length * 30
      this.visualizarChart = true
    },
    async generarExcel () {
      const tabla = document.getElementById('danioEconomicoEstado')
      const worksheet = XLSX.utils.table_to_book(tabla, {})
      XLSX.writeFile(worksheet, 'Daño economico al estado.xlsx')

      const tabla1 = document.getElementById('estadoCasosPriorizados')
      const worksheet1 = XLSX.utils.table_to_book(tabla1, {})
      XLSX.writeFile(worksheet1, 'Estado casos priorizados.xlsx')
    }
  }
}
</script>
<style lang="scss">
.label-priorizados {
  font-size: 8pt;
  font-family: "poppins, Arial, sans-serif";
  font-weight: bold;
}
</style>
