<template>
  <q-page>
    <Titulo
      titulo="Reportes UIF"
      icono="auto_graph"
    />
    <q-card class="q-mx-md">
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <span class="text-h5 text-bold text-primary">FILTROS DISPONIBLES </span>
          </div>
          <q-select
            class="col-xs-12 col-sm-6 col-md-4"
            filled
            label="Tipo de reporte"
            :options="listaReportes"
            v-model="tipoReporte"
            map-options
            emit-value
            options-selected-class="bg-grey-3 text-bold"
          />

          <q-select
            class="col-xs-12 col-sm-6 col-md-4"
            filled
            label="Departamento"
            :options="departamentos"
            multiple
            use-chips
            v-model="fechaFiltro.departamento"
            map-options
            emit-value
            clearable
            options-selected-class="bg-grey-3 text-bold"
          />

          <q-select
            filled
            :option-label="(usuario) => `${usuario.nombres || ''} ${usuario.primerApellido || ''} ${usuario.segundoApellido || ''}`"
            option-value="id"
            :options="usuarios"
            class="col-xs-12 col-sm-6 col-md-4"
            clearable
            v-model="fechaFiltro.idUsuarioAsignado"
            label="Usuario asignado"
            use-input
            map-options
            emit-value
            @filter="filtrarUsuarios"
            options-selected-class="bg-grey-3 text-bold"
          >
            <template v-slot:append>
              <q-icon name="people" />
            </template>
          </q-select>

          <q-input
            filled
            class="col-xs-12 col-sm-6 col-md-3"
            clearable
            v-model="fechaFiltro.fechaInicioDenuncia"
            label="(Desde) Fecha de la denuncia"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="fechaInicioDenuncia"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    default-view="Years"
                    v-model="fechaFiltro.fechaInicioDenuncia"
                    color="primary"
                    mask="YYYY-MM-DD"
                    @input="$refs.fechaInicioDenuncia.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            class="col-xs-12 col-sm-6 col-md-3"
            clearable
            v-model="fechaFiltro.fechaFinDenuncia"
            label="(Hasta) Fecha de la denuncia"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="fechaFinDenuncia"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    default-view="Years"
                    v-model="fechaFiltro.fechaFinDenuncia"
                    color="primary"
                    mask="YYYY-MM-DD"
                    @input="$refs.fechaFinDenuncia.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            class="col-xs-12 col-sm-6 col-md-3"
            clearable
            v-model="fechaFiltro.fechaInicioActuado"
            label="(Desde) Fecha ultimo actuado"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="fechaInicioActuado"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    default-view="Years"
                    v-model="fechaFiltro.fechaInicioActuado"
                    color="primary"
                    mask="YYYY-MM-DD"
                    @input="$refs.fechaInicioActuado.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            class="col-xs-12 col-sm-6 col-md-3"
            clearable
            v-model="fechaFiltro.fechaFinActuado"
            label="(Hasta) Fecha ultimo actuado"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="fechaFinActuado"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    default-view="Years"
                    v-model="fechaFiltro.fechaFinActuado"
                    color="primary"
                    mask="YYYY-MM-DD"
                    @input="$refs.fechaFinActuado.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="col-sm-12">
            <div class="row q-col-gutter-md justify-center items-center">
              <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
                <q-btn
                  class="full-width"
                  @click="generarReporte"
                  color="positive"
                  label="generar reporte"
                  icon="search"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
                <q-btn
                  class="full-width"
                  @click="generarExcel"
                  color="info"
                  label="Descargar"
                  icon="download"
                />
              </div>
            </div>

          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="tipoReporte">
        <ReporteLGI
          ref="ReporteLGI"
          :filtros="fechaFiltro"
          class="col-xs-12"
          v-if="tipoReporte === 'INVESTIGACIONES DEL DELITO LGI/FT'"
        />
        <ReporteBienesCautelados
          ref="ReporteBCPG"
          :filtros="fechaFiltro"
          class="col-xs-12"
          v-if="tipoReporte === 'BIENES CAUTELADOS POR GESTIÓN'"
        />
        <ReportePenasImpuestas
          ref="ReportePIES"
          :filtros="fechaFiltro"
          class="col-xs-12"
          v-if="tipoReporte === 'PENAS IMPUESTAS EN LAS SENTENCIAS'"
        />
        <ReporteDelitosPrecedentes
          ref="ReporteSDPNLGI"
          :filtros="fechaFiltro"
          class="col-xs-12"
          v-if="tipoReporte === 'SÓLO DELITOS PRECEDENTES (no incluye LGI)'"
        />
        <ReporteSentenciasLGI
          ref="ReporteSLGI"
          :filtros="fechaFiltro"
          class="col-xs-12"
          v-if="tipoReporte === 'SENTENCIAS LGI/FT'"
        />
        <ReporteBienesDecomisados
          ref="ReporteBDG"
          :filtros="fechaFiltro"
          class="col-xs-12"
          v-if="tipoReporte === 'BIENES DECOMISADOS POR GESTIÓN'"
        />

        <ReporteBienesConfiscados
          ref="ReporteBCG"
          :filtros="fechaFiltro"
          class="col-xs-12"
          v-if="tipoReporte === 'BIENES CONFISCADOS POR GESTIÓN'"
        />

        <ReporteBienesIncautados
          ref="ReporteBIG"
          :filtros="fechaFiltro"
          class="col-xs-12"
          v-if="tipoReporte === 'BIENES INCAUTADOS POR GESTIÓN'"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import ReporteLGI from 'components/ReportesUIF/ReporteLGI'
import ReporteBienesCautelados from 'components/ReportesUIF/ReporteBienesCautelados'
import ReporteBienesDecomisados from 'components/ReportesUIF/ReporteBienesDecomisados'
import ReportePenasImpuestas from 'components/ReportesUIF/ReportePenasImpuestas'
import ReporteDelitosPrecedentes from 'components/ReportesUIF/ReporteDelitosPrecedentes'
import ReporteSentenciasLGI from 'components/ReportesUIF/ReporteSentenciasLGI'
import ReporteBienesConfiscados from 'components/ReportesUIF/ReporteBienesConfiscados'
import ReporteBienesIncautados from 'components/ReportesUIF/ReporteBienesIncautados'
import * as XLSX from 'xlsx'

export default {
  components: {
    ReporteLGI,
    ReporteBienesCautelados,
    ReportePenasImpuestas,
    ReporteDelitosPrecedentes,
    ReporteSentenciasLGI,
    ReporteBienesDecomisados,
    ReporteBienesConfiscados,
    ReporteBienesIncautados
  },
  data () {
    return {
      fechaFiltro: {
        departamento: null,
        fechaInicioDenuncia: null,
        fechaFinDenuncia: null,
        fechaInicioActuado: null,
        fechaFinActuado: null
      },
      tipoReporte: 'INVESTIGACIONES DEL DELITO LGI/FT',
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
      listaReportes: [
        { label: 'INVESTIGACIONES DEL DELITO LGI/FT', value: 'INVESTIGACIONES DEL DELITO LGI/FT', id: 'ReporteLGI', ref: 'ReporteLGI', nroTablas: 1 },
        { label: 'BIENES CAUTELADOS POR GESTIÓN', value: 'BIENES CAUTELADOS POR GESTIÓN', id: 'ReporteBCPG', ref: 'ReporteBCPG', nroTablas: 1 },
        { label: 'PENAS IMPUESTAS EN LAS SENTENCIAS', value: 'PENAS IMPUESTAS EN LAS SENTENCIAS', id: 'ReportePIES', ref: 'ReportePIES', nroTablas: 2 },
        { label: 'SÓLO DELITOS PRECEDENTES (no incluye LGI)', value: 'SÓLO DELITOS PRECEDENTES (no incluye LGI)', id: 'ReporteSDPNLGI', ref: 'ReporteSDPNLGI', nroTablas: 1 },
        { label: 'SENTENCIAS LGI/FT', value: 'SENTENCIAS LGI/FT', id: 'ReporteSLGI', ref: 'ReporteSLGI', nroTablas: 1 },
        { label: 'BIENES DECOMISADOS POR GESTIÓN', value: 'BIENES DECOMISADOS POR GESTIÓN', id: 'ReporteBDG', ref: 'ReporteBDG', nroTablas: 1 },
        { label: 'BIENES CONFISCADOS POR GESTIÓN', value: 'BIENES CONFISCADOS POR GESTIÓN', id: 'ReporteBCG', ref: 'ReporteBCG', nroTablas: 1 },
        { label: 'BIENES INCAUTADOS POR GESTIÓN', value: 'BIENES INCAUTADOS POR GESTIÓN', id: 'ReporteBIG', ref: 'ReporteBIG', nroTablas: 1 }
      ],
      usuarios: [],
      usuariosTemp: [],
      keyfilter: [],
      urlKeyfilter: {},
      valuefilter: {}
    }
  },
  async mounted () {
    await this.getUsuarios()

    this.getProcesosUsuario()

    await this.actualizarReporte()
  },
  methods: {
    filtrarUsuarios (val, update) {
      update(() => {
        if (val === '') {
          this.usuarios = JSON.parse(JSON.stringify(this.usuariosTemp))
        } else {
          const needle = val.toLowerCase()
          this.usuarios = this.usuariosTemp.filter(v => `${v.nombres} ${v.primerApellido} ${v.segundoApellido}`.toLowerCase().includes(needle))
        }
      })
    },
    async getUsuarios () {
      const { rows } = await this.$axios.get('system/usuarios')
      this.usuarios = rows
      this.usuariosTemp = JSON.parse(JSON.stringify(rows))
    },
    ...mapGetters({ getProcesosUsuario: 'global/getProcesosUsuario' }),
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
      console.log('==========_MENSAJE_A_MOSTRARSE_==========')
      console.log(this.valuefilter)
      console.log('==========_MENSAJE_A_MOSTRARSE_==========')
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
    async getReporte (index = -1) {
    },
    async generarReporte () {
      const reporte = this.listaReportes.find(x => x.value === this.tipoReporte)
      if (!reporte) throw new Error('Error al obtener la tabla para los reportes')
      await this.$refs[reporte.ref].generarReporte()
    },
    async generarExcel () {
      const reporte = this.listaReportes.find(x => x.value === this.tipoReporte)

      if (!reporte) throw new Error('Error al obtener la tabla para los reportes')

      for (let index = 0; index < reporte.nroTablas; index++) {
        const tabla = document.getElementById(index ? `${reporte.id}${index}` : reporte.id)
        const worksheet = XLSX.utils.table_to_book(tabla, {})
        XLSX.writeFile(worksheet, `${reporte.label}.xlsx`)
      }
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
