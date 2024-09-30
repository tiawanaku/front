<template>
  <div class="row">
    <div class="col-lg-6 col-md-6 col-xs-12" v-if="tipoProceso.options.length>0">
        <SelectField :element="tipoProceso" :value.sync="tipoProceso.value" />
    </div>
    <div class="col-lg-6 col-md-6 col-xs-12">
      <q-btn color="primary" class="q-mt-md" icon="refresh" label="ACTUALIZAR REPORTE" @click="actualizarReporte" />
    </div>
    <div class="col-lg-5 col-md-6 col-xs-12" v-if="reporteLugarHecho!=null">
      <div class="text-h6">
        Reporte Nacional por lugar hecho
        <div class="text-caption">Presione en algun lugar para obtener el detalle por etapa</div>
      </div>
      <apexchart
        id="reportePie"
        type="pie"
        :options="chartOptionsPie"
        :series="seriesPie"
        @dataPointSelection="elegirLugarHecho"
      ></apexchart>
    </div>
    <div class="col-lg-6 col-md-6 col-xs-12" v-if="reporteEtapa">
      <div class="text-h6">
        Reporte de {{lugarHecho}} por Etapa
      </div>
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="series"
        @click="verLista"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import SelectField from '@components/Form/components/SelectField'

const urlReporte = 'denuncias/reporte/denuncias'
const urlDenuncias = 'denuncias/denuncia'
export default {
  components: {
    apexchart: VueApexCharts,
    SelectField
  },
  data () {
    return {
      tipoProceso: {
        label: 'Tipo Proceso',
        disabled: false,
        readonly: false,
        visible: true,
        value: null,
        options: [],
        optionValue: 'id',
        optionLabel: 'nombre',
        typeInput: 'normal',
        type: 'select',
        uid: '7a52742d-1a85-481b-ad3f-233df84d51b9',
        name: 'idTipoProceso',
        required: false,
        active: false,
        designColumn: 'col-12'
      },
      chartOptions: {
        chart: {
          id: 'vuechart-example',
          type: 'bar'
        },
        xaxis: {
          categories: []
        },
        plotOptions: {
          bar: {
            columnWidth: '50%'
          }
        }
      },
      series: [{
        name: 'series-1',
        data: []
      }],
      seriesPie: [],
      chartOptionsPie: {
        chart: {
          type: 'pie'
        },
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: '100%'
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      reporteLugarHecho: null,
      reporteEtapa: null,
      lugarHecho: null
    }
  },
  async mounted () {
    this.tipoProceso.options =
       this.getProcesosUsuario()
    if (this.tipoProceso.options.length > 0) {
      this.tipoProceso.value = this.tipoProceso.options[0].id
      this.actualizarReporte()
    }
  },
  watch: {
    tipoProceso: {
      handler (newValue) {
        if (newValue) {
          this.actualizarReporte()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapGetters({
      getProcesosUsuario: 'global/getProcesosUsuario'
    }),
    async actualizarReporte () {
      this.reporteLugarHecho = null
      this.reporteEtapa = null
      this.lugarHecho = null
      this.getReporte()
    },
    async getReporte () {
      let url = urlReporte
      if (this.tipoProceso.value) {
        url = `${url}?idTipoProceso=${this.tipoProceso.value}`
        if (this.lugarHecho) {
          url = `${url}&lugarHecho=${this.lugarHecho}`
        }
      }
      const respuesta = await this.$axios.get(url)
      if (this.lugarHecho) {
        this.reporteEtapa = null
        this.series = [{
          name: 'Cantidad de Denuncias',
          data: await respuesta.map(e => parseInt(e.total))
        }]
        this.chartOptions.xaxis = Object.assign({}, {
          categories: await respuesta.map(e => `${e.etapa_actual ? e.etapa_actual : 'SIN SEGUIMIENTO'}-(${e.total})`)
        })
        this.reporteEtapa = respuesta
      } else {
        this.reporteLugarHecho = null
        this.seriesPie = await respuesta.map(e => parseInt(e.total))
        this.chartOptionsPie.labels = await respuesta.map(e => `${e.lugar_hecho} (${e.total})`)
        this.reporteLugarHecho = respuesta
      }
    },
    elegirLugarHecho (event, chartContext, config) {
      this.lugarHecho = this.reporteLugarHecho[config.dataPointIndex].lugar_hecho
      this.getReporte()
    },
    verLista (event, chartContext, config) {
      let [etapa, total] = this.chartOptions.xaxis.categories[config.dataPointIndex].split('-')
      console.log(total)
      if (etapa === 'SIN SEGUIMIENTO') {
        etapa = null
      }
      this.$router.push({ path: 'denuncias', query: { etapaActual: etapa, idTipoProceso: this.tipoProceso.value, lugarHecho: this.lugarHecho } })
      const url = `${urlDenuncias}?etapaActual=${etapa}`
      console.log(url)
    }
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
