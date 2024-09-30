<template>
  <section class="row q-col-gutter-sm justify-center">
    <div class="col-xs-12">
      <p class="text-bold">Estados</p>
    </div>
    <div class="col-xs-12 col-sm-8 col-md-7">
      <q-input
        label=" Nuevo estado"
        filled
        outlined
        v-model="nuevoEstado.nombre"
      >
        <template v-slot:append>
          <q-btn
            size="sm"
            @click="agregarEstado"
            icon="add"
            round
            color="positive"
          ></q-btn>
        </template>
      </q-input>
    </div>
    <div class="col-xs-12">
      <draggable
        :list="estadosModel"
        group="tabs"
        @start="drag=true"
        @end="drag=false"
        :move="checkMove"
      >
        <q-expansion-item
          bordered
          v-for="(estado, index) of estadosModel"
          :key="index"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar
                size="sm"
                color="primary"
                text-color="white"
              > {{ index + 1 }}</q-avatar>
            </q-item-section>

            <q-item-section>
              {{ estado.nombre }}
            </q-item-section>

            <q-item-section side>
              <span>Numero de etapas: {{ estado.etapas.length }}
                <q-btn
                  @click.stop="eliminarEstado(index)"
                  class="q-ml-md"
                  round
                  size="sm"
                  icon="delete"
                  color="negative"
                ></q-btn>
              </span>

            </q-item-section>
          </template>

          <q-card>
            <q-card-section>
              <div class="row q-col-gutter-sm justify-center">
                <div class="col-xs-12 col-sm-8 col-md-7">
                  <q-input
                    label="Nueva Etapa"
                    dense
                    filled
                    outlined
                    v-model="nuevaEtapa.nombre"
                  >
                    <template v-slot:append>
                      <q-btn
                        size="sm"
                        @click="agregarEtapa(index)"
                        icon="add"
                        round
                        color="positive"
                      ></q-btn>
                    </template>
                  </q-input>

                </div>
                <div class="col-xs-12">
                  <draggable
                    :list="estado.etapas"
                    group="people"
                    @start="drag=true"
                    @end="drag=false"
                    :move="checkMove"
                    class="row q-col-gutter-sm justify-center"
                  >
                    <div
                      class="col-xs-12 col-sm-8 col-md-7"
                      v-for="(etapa, index1) of estado.etapas"
                      :key="index1"
                    >
                      <q-input
                        v-model="etapa.nombre"
                        label="Etapa"
                        dense
                        outlined
                        readonly
                      >
                        <template v-slot:prepend>
                          <p class="text-caption q-mt-md text-bold">{{ index1 + 1 }}</p>
                          <q-icon name="open_with"></q-icon>
                        </template>
                        <template v-slot:append>
                          <q-btn
                            @click="eliminarEtapa(index, index1)"
                            icon="delete"
                            size="sm"
                            round
                            color="negative"
                          ></q-btn>
                        </template>
                      </q-input>
                    </div>
                  </draggable>
                </div>
              </div>

            </q-card-section>
          </q-card>
        </q-expansion-item>
      </draggable>
    </div>
  </section>
</template>
<script>
import draggable from 'vuedraggable'
import { createComputed } from '@common/utils'

export default {
  components: {
    draggable
  },
  props: {
    estados: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tab: 'email',
      drag: false,
      nuevoEstado: {
        nombre: '',
        etapas: []
      },
      estadoSeleccionado: {},
      nuevaEtapa: {
        nombre: ''
      }
    }
  },
  computed: {
    estadosModel: createComputed('estados')
  },
  mounted () {
    this.tab = this.estadosModel[0] ? this.estadosModel[0].nombre : ''
  },
  methods: {
    seleccionarEstado (value) {
      this.estadoSeleccionado = this.estadosModel.find(x => x.nombre === value)
    },
    eliminarEtapa (index, index1) {
      this.estadosModel[index].etapas.splice(index1, 1)
    },
    eliminarEstado (index) {
      this.estadosModel.splice(index, 1)
    },
    agregarEstado () {
      try {
        const existeEstado = this.estadosModel.find(x => x.nombre.toLowerCase() === this.nuevoEstado.nombre.toLowerCase())
        if (existeEstado) {
          throw new Error(`El estado con el nombre ${this.nuevoEstado.nombre} ya esta registrado`)
        }
        this.estadosModel.push(this.nuevoEstado)
        this.nuevoEstado = {
          nombre: '',
          etapas: []
        }
      } catch (error) {
        this.$alert.warning(error.message)
      }
    },
    agregarEtapa (indexEstado) {
      try {
        const existeEtapa = this.estadosModel[indexEstado].etapas.find(x => x.nombre.toLowerCase() === this.nuevaEtapa.nombre.toLowerCase())
        if (existeEtapa) {
          throw new Error(`La etapa con el nombre ${this.nuevaEtapa.nombre} ya esta registrado en el estado ${this.estadosModel[indexEstado].nombre}.`)
        }
        this.estadosModel[indexEstado].etapas.push({ ...this.nuevaEtapa })
        this.nuevaEtapa = {
          nombre: ''
        }
      } catch (error) {
        this.$alert.warning(error.message)
      }
    },
    checkMove (e) {
      // window.console.log('Future index: ' + e.draggedContext.futureIndex)
    }
  }
}
</script>
