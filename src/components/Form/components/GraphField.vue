<template>
  <div
    v-if="element.view && change"
    class="row q-col-gutter-md"
  >
    <div class="col-xs-12">
      <div class="text-h6">
        {{ element.title }}
        <div
          class="text-caption"
          v-if="element.subtitle"
        >{{ element.subtitle }}</div>
      </div>
    </div>

    <div
      class="text-h4 text-center text-primary q-pt-xl col-xs-12"
      v-show="!visible"
    >
      SIN DATOS PARA MOSTRAR
    </div>
    <div class="col-xs-12">
      <apexchart
        style="min-height:600px;"
        :id="idChart"
        class="fit"
        v-show="visible"
        :type="this.element.type"
        :options="chartOptions"
        :series="series"
        @dataPointSelection="pointSelect"
      ></apexchart>
    </div>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'

const optionsToolbar = {
  show: true
}

export default {
  props: {
    idChart: { type: String, default: '' },
    labelGraph: { type: String, default: '' },
    element: {
      required: true,
      type: Object,
      default: () => { }
    }
  },
  components: {
    apexchart: VueApexCharts
  },
  data () {
    return {
      series: [],
      reporte: [],
      chartOptionsPie: {
        chart: {
          redrawOnParentResize: true,
          toolbar: optionsToolbar,
          height: '800',
          type: 'pie'
        },
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      change: true,
      chartOptionsBar: {
        chart: {
          type: 'bar',
          redrawOnParentResize: true,
          toolbar: optionsToolbar
        },
        xaxis: { categories: [] },
        plotOptions: { bar: { columnWidth: '50%' } }
      },
      chartOptions: {
        chart: {
          type: this.element.type,
          redrawOnParentResize: true,
          toolbar: optionsToolbar
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: '100%' },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      visible: false
    }
  },
  async mounted () {
    await this.getReporte(this.element.url)
  },
  methods: {
    descargar (chartId) {
      const chartInstance = document.getElementById(this.idChart)

      console.log('==========_MENSAJE_A_MOSTRARSE_==========')
      console.log(chartInstance.chart)
      console.log('==========_MENSAJE_A_MOSTRARSE_==========')
    },
    async getReporte (url) {
      this.visible = false
      const respuesta = await this.$axios.get(url)
      this.reporte = null
      let chartOptions
      if (respuesta) {
        this.change = false
        switch (this.element.type) {
          case 'bar':
            this.series = [{
              name: this.labelGraph || 'Cantidad de Denuncias',
              data: await respuesta.map(e => parseInt(e.total))
            }]
            chartOptions = this.chartOptionsBar
            chartOptions.xaxis = Object.assign({}, {
              categories: await respuesta.map(e => `${e[this.element.key]}-(${e.total})`)
            })
            this.chartOptions = chartOptions
            this.visible = this.chartOptions.xaxis.categories.length > 0
            break
          case 'pie':
            this.series = await respuesta.map(e => parseInt(e.total))
            chartOptions = this.chartOptionsPie
            chartOptions.labels = await respuesta.map(e => `${e[this.element.key]} (${e.total})`)
            this.chartOptions = chartOptions
            this.visible = this.chartOptions.labels.length > 0
            break
          default:
            break
        }
        this.change = true
      }
      this.reporte = respuesta
    },
    pointSelect (event, chartContext, config) {
      const select = this.reporte[config.dataPointIndex][this.element.key]
      this.$emit('actionReport', { value: select, key: this.element.key, urlKey: this.element.urlKey })
    }
  }
}
</script>
