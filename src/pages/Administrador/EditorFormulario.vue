<template>
  <q-layout view="hHh lpR fFf">

    <q-header
      bordered
      class="bg-primary text-white"
    >
      <q-toolbar class="flex justify-between q-pl-none">
        <q-btn-group
          outline
          class="editor-header"
        >
          <q-btn
            flat
            class=""
            icon="save"
            @click="guardar"
          >
            <q-tooltip>Guardar cambios</q-tooltip>
          </q-btn>
          <q-btn
            flat
            icon="arrow_back"
            @click="$router.push('/app/procesos')"
          >
            <q-tooltip>Volver atrás</q-tooltip>
          </q-btn>
        </q-btn-group>
        <div class="text-center">
          <h2 class="text-h6 text-white q-ma-none">Formulario: {{ formulario.nombre }}</h2>
          <div class="layout-form-subtitulo">Estado: {{ formulario.estado }}</div>
        </div>
        <div class="editor-header flex justify-end">
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <q-splitter
          v-model="splitterModelLeft"
          style="height: 100%"
        >

          <template v-slot:before>
            <q-splitter
              v-model="splitterModelRigth"
              style="height: 100%; min-heigth:800px;"
            >
              <template v-slot:before>
                <q-toolbar class="bg-primary">
                  <h2 class="text-h6 text-white q-ma-none">Componentes</h2>
                </q-toolbar>
                <draggable
                  class="dragArea list-group"
                  v-model="componentes"
                  v-bind="dragOptions"
                  :move="onMove"
                  :group="{ name: 'listaComponentes', pull: 'clone', put: false }"
                  :clone="cloneComponente"
                  @start="isDragging = true"
                  @end="isDragging = false"
                >
                  <q-item
                    v-for="(componente, index) in componentes"
                    :key="index"
                    class="q-py-md"
                  >
                    <q-item-section avatar>
                      <q-icon
                        size="xl"
                        color="primary"
                        :name="componente.icono"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-section class="text-bold text-subtitle1">{{ componente.nombre }}</q-item-section>
                      <q-item-label caption>{{ componente.descripcion }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </draggable>
              </template>
              <template v-slot:after>
                <div class="q-gutter-md q-pa-lg">
                  <q-scroll-area style="height: 87vh;">
                    <DragComponent
                      :listaComponentes.sync="listaComponentes"
                      @seleccionarComponente="seleccionarComponente"
                      idLista="listaPrincipal"
                      bg-color="blue-1"
                    />
                  </q-scroll-area>
                </div>
              </template>
            </q-splitter>
          </template>

          <template v-slot:separator>
            <q-avatar
              color="primary"
              text-color="white"
              size="25px"
              icon="drag_indicator"
            />
          </template>
          <template v-slot:after>
            <q-scroll-area style="height: 87vh;">
              <Propiedades
                v-if="componenteSeleccionado"
                :valores.sync="formulario"
                :componenteSeleccionado.sync="componenteSeleccionado"
                :listaComponentes="listaComponentes"
                @eliminar="eliminar"
              />
            </q-scroll-area>
          </template>
        </q-splitter>
      </q-page>
    </q-page-container>
  </q-layout>

</template>
<script>

import DragComponent from 'components/Form/components/DragComponent'
import Propiedades from 'components/Form/components/Propiedades'
import componentes from '@common/Componentes'
import draggable from 'vuedraggable'
import { uid } from 'quasar'

const contadores = {
  text: 0,
  select: 0,
  datagrid: 0,
  title: 0,
  map: 0
}

export default {
  components: {
    DragComponent,
    Propiedades,
    draggable
  },
  name: 'OutLoginLayout',
  data () {
    return {
      splitterModelLeft: 70,
      splitterModelRigth: 25,
      formulario: { configuracion: [] },
      listaComponentes: [],
      posicionSeleccionado: null,
      subPosicionSeleccionado: null,
      componenteSeleccionado: null,
      componentes,
      isDragging: false,
      dragOptions: {},
      contadores
    }
  },
  async mounted () {
    this.formulario = await this.$axios.get(`denuncias/formulario/${this.$route.params.id}`)
    this.$store.commit('global/setIdTipoProcesoConfiguracion', this.formulario.procesos.map(x => x.id))
    this.listaComponentes = this.formulario.configuracion
    for (const componente of this.formulario.configuracion) {
      contadores[componente.type]++
      if (componente.type === 'datagrid') {
        for (const subComponente of componente.options) {
          contadores[subComponente.type]++
        }
      }
    }
  },
  watch: {
    '$store.state.global.seleccionado': function ({ index, subIndex }) {
      this.componenteSeleccionado = this.listaComponentes[index]
      if (subIndex || subIndex === 0) this.componenteSeleccionado = this.listaComponentes[index].options[subIndex]
    }
  },
  methods: {
    onMove (element) {
      console.log('==========_MENSAJE_A_MOSTRARSE_==========')
      console.log(element)
      console.log('==========_MENSAJE_A_MOSTRARSE_==========')
    },
    async guardar (props) {
      try {
        await this.$axios.put(`denuncias/formulario/${this.formulario.id}`, { configuracion: this.listaComponentes })
        this.$alert.success('Formulario guardado correctamente')
      } catch (error) {
        this.$alert.error(error.message)
      }
    },
    onAdd () {},
    cloneComponente (componente) {
      const nuevoComponente = JSON.parse(JSON.stringify(componente.configuracionJson))
      contadores[nuevoComponente.type]++
      nuevoComponente.name = `${nuevoComponente.name}-${contadores[nuevoComponente.type]}`
      nuevoComponente.label = `${nuevoComponente.label}-${contadores[nuevoComponente.type]}`
      nuevoComponente.uid = uid()
      return nuevoComponente
    },
    eliminar () {
      if (this.$store.state.global.seleccionado.subIndex) {
        this.listaComponentes[this.$store.state.global.seleccionado.index].options.splice(this.$store.state.global.seleccionado.subIndex, 1)
      } else {
        this.listaComponentes.splice(this.$store.state.global.seleccionado.index, 1)
      }
      this.$store.commit('global/setSeleccionado', { posicionSeleccionado: null, subPosicionSeleccionado: null })

      this.componenteSeleccionado = null
    },
    seleccionarComponente (index, subIndex) {
      this.posicionSeleccionado = index
      this.subPosicionSeleccionado = subIndex
      this.componenteSeleccionado = this.listaComponentes[index]
      if (subIndex || subIndex === 0) this.componenteSeleccionado = this.listaComponentes[index].options[subIndex]
    }
  }
}
</script>

<style lang="scss">
.props-design-title {
  display: inline-block;
  vertical-align: top;
  padding: 7px 10px 0 0;
}

.props-design-column {
  display: inline-flex;
  align-items: center;
  border: 1px solid #efefef;
  padding: 0 4px 0 0;
  margin-bottom: 3px;
  border-radius: 3px;
  margin-right: 10px;
  cursor: pointer;
}

.props-columns {
  display: inline-flex;
  margin: 0 0 0 0;

  & > div {
    display: inline-block;
    width: 14px;
    height: 20px;
    background-color: #e0e0e0;
    margin-right: 3px;
  }
}
</style>
