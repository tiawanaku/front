<template>
  <div :class="[
    { 'light-page': !$q.dark.isActive },
    'row',
    'q-col-gutter-md',
    'justify-center'
  ]">
    <div
      class="col-lg-10 col-md-8 col-xs-12"
      v-if="tipoProceso.options.length > 0"
    >
      <SelectField
        :element="tipoProceso"
        :value.sync="tipoProceso.value"
        :clearable="false"
      />
    </div>
    <div class="col-lg-2 col-md-4 col-xs-12 text-center">
      <q-btn
        color="primary"
        icon="refresh"
        label="ACTUALIZAR REPORTE"
        @click="actualizarReporte"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12">
      <q-breadcrumbs>
        <div
          v-for="(key, index) in keyfilter"
          :key="key"
        >
          <q-btn
            flat
            color="primary"
            :label="`${key.replace('_', ' ')}: ${valuefilter[key].replace('_', ' ')}`"
            @click="deleteFilter(key, index)"
          />
        </div>
      </q-breadcrumbs>
    </div>
    <div class="col-xs-12">
      <div class="row justify-center">

        <div class="col-md-4 col-xs-12 q-pa-md flex-container">
          <q-card class="q-pa-lg flex-card bordered-card bg-primary text-white">
            <q-card-section>
              <div class="text-h6">DENUNCIAS SLIMS</div>
            </q-card-section>

            <q-card-section class="row items-center">
              <q-icon name="fact_check" size="50px" class="q-mr-md" />
              <div>
                <div class="text-subtitle1">Total:</div>
                <div class="text-h5">{{ contadores.denunciasSlim }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-md-4 col-xs-12 q-pa-md flex-container">
          <q-card class="q-pa-lg flex-card bordered-card bg-accent text-white">
            <q-card-section>
              <div class="text-h6">DENUNCIAS DEFENSORÍAS</div>
            </q-card-section>

            <q-card-section class="row items-center">
              <q-icon name="list_alt" size="50px" class="q-mr-md" />
              <div>
                <div class="text-subtitle1">Total:</div>
                <div class="text-h5">{{ contadores.denunciasDefensoria }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-md-4 col-xs-12 q-pa-md flex-container">
          <q-card class="q-pa-lg flex-card bordered-card">
            <q-card-section>
              <div class="text-h6">USUARIOS</div>
            </q-card-section>

            <q-card-section class="row items-center">
              <q-icon name="people_alt" size="50px" class="q-mr-md" />
              <div>
                <div class="text-subtitle1">Total:</div>
                <div class="text-h5">{{ contadores.usuarios }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-md-6 col-xs-12 q-pa-md flex-container">
          <q-card class="q-pa-lg flex-card bordered-card">
            <GraphField
              :element="elementEtapa"
              ref="etapa"
              idChart="etapa"
            />
          </q-card>
        </div>

        <div class="col-md-6 col-xs-12 q-pa-md flex-container">
          <q-card class="q-pa-lg flex-card bordered-card">
            <GraphField
              :element="elementZona"
              @actionReport="filterOption($event)"
              ref="zona"
              idChart="zona"
            />
          </q-card>
        </div>

        <div class="col-12 q-pa-md">
          <q-card class="q-pa-lg bordered-card">
            <GraphField
              :element="elementDefensoria"
              ref="defensoria"
              idChart="defensoria"
            />
          </q-card>
        </div>

        <div class="col-12 q-pa-md">
          <q-card class="q-pa-lg bordered-card">
            <GraphField
              :element="elementSlim"
              ref="slim"
              idChart="slim"
            />
          </q-card>
        </div>

        <div class="col-12 q-pa-md">
          <q-card class="q-pa-lg bordered-card">
            <GraphField
              :element="elementConclusion"
              ref="conclusion"
              idChart="conclusion"
            />
          </q-card>
        </div>

        <div class="col-12 q-pa-md flex-container">
          <q-card class="q-pa-lg flex-card bordered-card">
            <GraphField
              :element="elementDelito"
              ref="delito"
              idChart="delito"
            />
          </q-card>
        </div>

        <div class="col-12 q-pa-md flex-container">
          <q-card class="q-pa-lg flex-card bordered-card">
            <GraphField
              :element="elementUsuario"
              @actionReport="filterOption($event)"
              ref="usuario"
              idChart="usuario"
            />
          </q-card>
        </div>

        <!-- <GraphField
          class="col-12"
          :element="elementCasosUsuario"
          ref="casosUsuario"
          idChart="casosUsuario"
        /> -->

        <GraphField
          v-if="tipoProceso.value === '9b49b99c-01ea-47d7-bd8a-42d46d8dc530'"
          class="col-xs-9"
          :element="elementsDelitoPrecedente"
          ref="delitoPrecedente"
          idChart="delitoPrecedente"
        />
        <!-- @actionReport="filterOption($event)" -->

        <GraphField
          v-if="tipoProceso.value === '9b49b99c-01ea-47d7-bd8a-42d46d8dc530'"
          class="col-xs-7"
          :element="elementsBienCautelado"
          ref="bienCautelado"
          idChart="bienCautelado"
        />
        <!-- @actionReport="filterOption($event)" -->
        <GraphField
          v-if="tipoProceso.value === '9b49b99c-01ea-47d7-bd8a-42d46d8dc530'"
          class="col-xs-7"
          :element="elementsSituacionJuridica"
          ref="situacionJuridica"
          idChart="situacionJuridica"
        />

        <GraphField
          v-if="tipoProceso.value === '9b49b99c-01ea-47d7-bd8a-42d46d8dc530'"
          class="col-xs-7"
          :element="elementsMedidaCautelar"
          ref="medidaCautelar"
          idChart="medidaCautelar"
        />

        <GraphField
          labelGraph="Total de dinero"
          v-if="tipoProceso.value === '9b49b99c-01ea-47d7-bd8a-42d46d8dc530'"
          class="col-xs-12 col-md-7"
          :element="elementsRetencionFondos"
          ref="retencionFondos"
          idChart="retencionFondos"
        />

        <CasosPriorizados
          class="col-xs-12"
          v-if="['7d98dd0d-740f-4025-ae80-07bfed39e627', '9b49b99c-01ea-47d7-bd8a-42d46d8dc530'].includes(tipoProceso.value)"
        ></CasosPriorizados>
      </div>
    </div>

    <!--
    <GraphField
      :element="elementMunicipioHecho"
      @actionReport="filterOption($event)"
      ref="municipioHecho"
    />
    <GraphField
      :element="elementEtiqueta"
      @actionReport="filterOption($event)"
      ref="etiqueta"
    />
    <GraphField
      :element="elementRangoEtario"
      @actionReport="filterOption($event)"
      ref="rangoEtario"
    />
    -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SelectField from '@components/Form/components/SelectField'
import GraphField from '@components/Form/components/GraphField'
import CasosPriorizados from '../Reportes/CasosPriorizados'
const urlReporte = 'denuncias/reporte/denuncias'
// const urlDenuncias = 'denuncias/denuncia'
export default {
  components: {
    GraphField,
    SelectField,
    CasosPriorizados
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
      contadores: {
        denunciasSlim: 0,
        denunciasDefensoria: 0,
        usuarios: 0
      },
      elementZona: {
        view: false,
        title: 'Reporte por zona o urbanización',
        subtitle: 'Presione en alguna etiqueta para adicionarlo como filtro',
        type: 'pie',
        url: this.getUrl('zona'),
        key: 'nombre',
        urlKey: 'zona'
      },
      elementDefensoria: {
        view: false,
        title: 'Reporte Defensorías',
        subtitle: 'Reporte por defensorías',
        type: 'pie',
        url: this.getUrl('defensoria'),
        key: 'nombre',
        urlKey: 'defensoria'
      },
      elementSlim: {
        view: false,
        title: 'Reporte SLIMS',
        subtitle: 'Reporte por SLIMS',
        type: 'pie',
        url: this.getUrl('slim'),
        key: 'nombre',
        urlKey: 'slim'
      },
      elementConclusion: {
        view: false,
        title: 'Reporte Conclusión',
        subtitle: 'Reporte Conclusión',
        type: 'pie',
        url: this.getUrl('conclusion'),
        key: 'nombre',
        urlKey: 'conclusion'
      },
      elementEtapa: {
        view: false,
        title: 'Reporte por Etapa de la Denuncia',
        subtitle: 'Reporte',
        type: 'pie',
        url: this.getUrl('etapa'),
        key: 'etapa_actual',
        urlKey: 'etapa'
      },
      elementCiudad: {
        view: false,
        title: 'Reporte por Departamentos',
        subtitle: 'Presione en algun departamento para adicionarlo como filtro y para habilitar el reporte de Departamentos',
        type: 'pie',
        url: this.getUrl('ciudad'),
        key: 'nombre',
        urlKey: 'ciudad'
      },
      elementDelito: {
        view: false,
        title: 'Reporte por Delito',
        subtitle: 'Reporte por Tipologías',
        type: 'pie',
        url: this.getUrl('delito'),
        key: 'nombre',
        urlKey: 'delito'
      },
      /* elementDelitoBar: {
        view: false,
        title: 'Reporte por Delito en Barra',
        subtitle: 'Presione en algun departamento para adicionarlo como filtro y para habilitar el reporte de Municipios',
        type: 'bar',
        url: this.getUrl('delito'),
        key: 'nombre',
        urlKey: 'delito'
      }, */
      elementUsuario: {
        view: false,
        title: 'Usuarios',
        subtitle: 'Lista de usuarios en el sistema con el total de casos ASIGNADOS en este momento',
        type: 'pie',
        url: this.getUrl('usuario'),
        key: 'nombre',
        urlKey: 'usuario'
      },

      /* elementCasosUsuario: {
        view: false,
        title: 'Casos por usuario',
        subtitle: 'Lista de usuarios en el sistema con el total de casos ASIGNADOS en este momento, Presione en algún usuario para ver los casos que estan asignados',
        type: 'pie',
        url: this.getUrl('casosUsuario'),
        key: 'nombre',
        urlKey: 'casosUsuario'
      }, */
      elementEtiqueta: {
        view: false,
        title: 'Reporte por Etiqueta',
        url: this.getUrl('etiqueta'),
        subtitle: 'Presione en alguna etiqueta para adicionarlo como filtro',
        type: 'bar',
        key: 'etiqueta',
        urlKey: 'etiqueta'
      },
      elementRangoEtario: {
        view: false,
        title: 'Reporte por Rango Etario',
        url: this.getUrl('rangoEtario'),
        subtitle: 'Presione en algun rango etario para adicionarlo como filtro',
        type: 'bar',
        key: 'edad',
        urlKey: 'rangoEtario'
      },
      // REPORTE DE DELITOS PRECEDENTES
      elementsDelitoPrecedente: {
        view: false,
        title: 'Reporte por delito precedente',
        subtitle: 'Reporte por delito precedente',
        type: 'pie',
        url: this.getUrl('delitoPrecedente'),
        key: 'delito_precedente',
        urlKey: 'delitoPrecedente'
      },
      elementsBienCautelado: {
        view: false,
        title: 'Medidas cautelares de carácter real',
        subtitle: 'Reporte por bien cautelado',
        type: 'pie',
        url: this.getUrl('bienCautelado'),
        key: 'bien_cautelado',
        urlKey: 'bienCautelado'
      },
      elementsRetencionFondos: {
        view: false,
        title: 'Reporte por retencion de fondos',
        subtitle: 'Reporte por retencion de fondos',
        type: 'bar',
        url: this.getUrl('retencionFondos'),
        key: 'retencion_fondos',
        urlKey: 'retencionFondos'
      },
      // REPORTES DENUNCIADOS
      elementsSituacionJuridica: {
        view: false,
        title: 'Situación Jurídica',
        subtitle: 'Situación Jurídica',
        type: 'pie',
        url: this.getUrl('situacionJuridica'),
        key: 'situacion_juridica',
        urlKey: 'situacionJuridica'
      },
      elementsMedidaCautelar: {
        view: false,
        title: 'Medidas cautelares de caracter personal',
        subtitle: 'Medidas cautelares de caracter personal',
        type: 'pie',
        url: this.getUrl('medidaCautelar'),
        key: 'medida_cautelar',
        urlKey: 'medidaCautelar'
      },
      keyfilter: [],
      urlKeyfilter: {},
      valuefilter: {}
    }
  },
  async mounted () {
    this.tipoProceso.options =
      this.getProcesosUsuario()
    if (this.tipoProceso.options.length > 0) {
      this.tipoProceso.value = this.tipoProceso.options[0].id
      this.actualizarReporte()
    }
    this.contadores = await this.$axios.get('denuncias/denuncia/contadores/dashboard')
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
      await this.getReporte()
    },
    async deleteFilter (key, index) {
      delete this.valuefilter[key]
      delete this.urlKeyfilter[key]
      this.keyfilter = this.keyfilter.length > 1 ? this.keyfilter.filter(x => x !== key) : []
      await this.getReporte()
    },
    async filterOption (event) {
      if (!this.valuefilter[event.key]) {
        if (this.keyfilter.length <= 5) {
          this.keyfilter.push(event.key)
          this.urlKeyfilter[event.key] = event.urlKey
          this.valuefilter[event.key] = event.value
          const index = this.keyfilter.indexOf(event.key)
          await this.getReporte(index)
        }
      } else {
        this.valuefilter[event.key] = event.value
        this.keyfilter.push()
        const index = this.keyfilter.indexOf(event.key)
        await this.getReporte(index)
      }
    },
    getUrl (key) {
      let url = urlReporte
      if (this.tipoProceso && this.tipoProceso.value) {
        url = `${url}?idTipoProceso=${this.tipoProceso.value}&key=${key}`
        this.keyfilter.forEach(item => {
          if (item === key) {
            return url
          } else {
            url += `&${this.urlKeyfilter[item]}=${this.valuefilter[item]}`
          }
        })
      } else {
        url = `${url}?idTipoProceso=1e00fe13-1c41-4219-873b-6771bf1836e4&key=${key}`
      }
      return url
    },
    async getReporte (index = -1) {
      let url
      if (this.keyfilter.indexOf('defensoria') > index || this.keyfilter.indexOf('defensoria') === -1) {
        url = this.getUrl('defensoria')
        await this.$refs.defensoria.getReporte(url)
        this.$refs.defensoria.$props.element.view = true
      }
      if (this.keyfilter.indexOf('slim') > index || this.keyfilter.indexOf('slim') === -1) {
        url = this.getUrl('slim')
        await this.$refs.slim.getReporte(url)
        this.$refs.slim.$props.element.view = true
      }
      if (this.keyfilter.indexOf('zona') > index || this.keyfilter.indexOf('zona') === -1) {
        url = this.getUrl('zona')
        await this.$refs.zona.getReporte(url)
        this.$refs.zona.$props.element.view = true
      }
      if (this.keyfilter.indexOf('etapa') > index || this.keyfilter.indexOf('etapa') === -1) {
        url = this.getUrl('etapa')
        await this.$refs.etapa.getReporte(url)
        this.$refs.etapa.$props.element.view = true
      }

      if (this.keyfilter.indexOf('delito') > index || this.keyfilter.indexOf('delito') === -1) {
        url = this.getUrl('delito')
        await this.$refs.delito.getReporte(url)
        this.$refs.delito.$props.element.view = true
      }

      if (this.keyfilter.indexOf('conclusion') > index || this.keyfilter.indexOf('conclusion') === -1) {
        url = this.getUrl('conclusion')
        await this.$refs.conclusion.getReporte(url)
        this.$refs.conclusion.$props.element.view = true
      }

      /* if (this.keyfilter.indexOf('delitoBar') > index || this.keyfilter.indexOf('delitoBar') === -1) {
        url = this.getUrl('delito')
        await this.$refs.delitoBar.getReporte(url)
        this.$refs.delitoBar.$props.element.view = true
      } */

      if (this.keyfilter.indexOf('usuario') > index || this.keyfilter.indexOf('usuario') === -1) {
        url = this.getUrl('usuario')
        await this.$refs.usuario.getReporte(url)
        this.$refs.usuario.$props.element.view = true
      }

      if (this.keyfilter.indexOf('ciudad') > index || this.keyfilter.indexOf('ciudad') === -1) {
        url = this.getUrl('ciudad')
        await this.$refs.ciudad.getReporte(url)
        this.$refs.ciudad.$props.element.view = true
      }

      /* if (this.keyfilter.indexOf('casosUsuario') > index || this.keyfilter.indexOf('casosUsuario') === -1) {
        url = this.getUrl('casosUsuario')
        await this.$refs.casosUsuario.getReporte(url)
        this.$refs.casosUsuario.$props.element.view = true
      } */

      if (this.keyfilter.indexOf('delito_precedente') > index || this.keyfilter.indexOf('delito_precedente') === -1) {
        url = this.getUrl('delitoPrecedente')
        await this.$refs.delitoPrecedente.getReporte(url)
        this.$refs.delitoPrecedente.$props.element.view = true
      }

      if (this.keyfilter.indexOf('bien_cautelado') > index || this.keyfilter.indexOf('bien_cautelado') === -1) {
        url = this.getUrl('bienCautelado')
        await this.$refs.bienCautelado.getReporte(url)
        this.$refs.bienCautelado.$props.element.view = true
      }

      if (this.keyfilter.indexOf('retencion_fondos') > index || this.keyfilter.indexOf('retencion_fondos') === -1) {
        url = this.getUrl('retencionFondos')
        await this.$refs.retencionFondos.getReporte(url)
        this.$refs.retencionFondos.$props.element.view = true
      }

      if (this.keyfilter.indexOf('situacion_juridica') > index || this.keyfilter.indexOf('situacion_juridica') === -1) {
        url = this.getUrl('situacionJuridica')
        await this.$refs.situacionJuridica.getReporte(url)
        this.$refs.situacionJuridica.$props.element.view = true
      }

      if (this.keyfilter.indexOf('medida_cautelar') > index || this.keyfilter.indexOf('medida_cautelar') === -1) {
        url = this.getUrl('medidaCautelar')
        await this.$refs.medidaCautelar.getReporte(url)
        this.$refs.medidaCautelar.$props.element.view = true
      }
      /* if (this.keyfilter.indexOf('lugar_hecho') >= 0 && (this.keyfilter.indexOf('municipio_hecho') > index || this.keyfilter.indexOf('municipioHecho') === -1)) {
        url = this.getUrl('municipioHecho')
        await this.$refs.municipioHecho.getReporte(url)
        this.$refs.municipioHecho.$props.element.view = true
      }
      if (this.keyfilter.indexOf('etiqueta') > index || this.keyfilter.indexOf('etiqueta') === -1) {
        url = this.getUrl('etiqueta')
        await this.$refs.etiqueta.getReporte(url)
        this.$refs.etiqueta.$props.element.view = true
      }
      if (this.keyfilter.indexOf('edad') > index || this.keyfilter.indexOf('edad') === -1) {
        url = this.getUrl('rangoEtario')
        await this.$refs.rangoEtario.getReporte(url)
        this.$refs.rangoEtario.$props.element.view = true
      } */
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

.flex-container {
  display: flex;
  flex-direction: column;
}

.flex-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bordered-card {
  border: 1px solid #ccc;
  border-radius: 10px;
}

.light-page {
  background-color: #dee0e3;
}

</style>
