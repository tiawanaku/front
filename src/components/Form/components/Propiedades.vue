<template>
  <section v-if="loadEvent">
    <q-tabs
      v-model="tab"
      align="justify"
      class="text-primary"
      inline-label
      dense
      active-class="bg-info text-white"
    >
      <q-tab
        name="diseno"
        icon="draw"
        label="Diseño"
      />
      <q-tab
        name="condiciones"
        icon="lan"
        label="Condiciones"
      />
      <q-tab
        name="desarrollo"
        icon="code"
        label="Vista desarrollo"
      />
    </q-tabs>
    <div
      class="q-pa-xs q-mb-lg"
      v-if="tab === 'diseno'"
    >
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12">
          <q-bar>
            <div class="text-weight-medium">
              Opciones basicas
            </div>
            <q-space />
            <q-btn
              flat
              label="Eliminar componente"
              color="negative"
              icon="delete"
              @click="$emit('eliminar')"
            />
          </q-bar>
        </div>
        <q-input
          dense
          class="col-xs-12"
          filled
          label="UUID"
          v-model="componenteSeleccionadoModel.uid"
        />

        <q-input
          dense
          class="col-xs-12"
          filled
          label="Nombre interno"
          v-model="componenteSeleccionadoModel.name"
        />

        <q-input
          v-if="!['title'].includes(componenteSeleccionadoModel.type)"
          dense
          class="col-xs-12"
          filled
          label="Nombre"
          v-model="componenteSeleccionadoModel.label"
        />
        <div
          v-if="['map'].includes(componenteSeleccionadoModel.type)"
          class="col-xs-12 row q-col-gutter-sm"
        >
          <div class="col-xs-12">
            <q-bar>
              <div class="text-weight-medium">
                Valor por defecto
              </div>
            </q-bar>
          </div>
          <q-input
            dense
            class="col-xs-12"
            filled
            label="Latitud"
            v-model="componenteSeleccionadoModel.defaultValue.latitud"
          />
          <q-input
            dense
            class="col-xs-12"
            filled
            label="Longitud"
            v-model="componenteSeleccionadoModel.defaultValue.longitud"
          />
        </div>
        <div
          v-if="['map'].includes(componenteSeleccionadoModel.type)"
          class="col-xs-12 row q-col-gutter-sm"
        >
          <div class="col-xs-12">
            <q-bar>
              <div class="text-weight-medium">
                Opciones de Marker
              </div>
            </q-bar>
          </div>
          <q-select
            dense
            class="col-xs-12"
            filled
            :options="icon"
            label="Icono de Market"
            v-model="componenteSeleccionadoModel.marker.icon"
            emit-value
            map-options
          />
          <q-input
            dense
            class="col-xs-6"
            filled
            label="Ancho del Icono"
            v-model="componenteSeleccionadoModel.marker.width"
          />
          <q-input
            dense
            class="col-xs-6"
            filled
            label="Largo del Icono"
            v-model="componenteSeleccionadoModel.marker.height"
          />
          <div class="col-xs-12" style="display: flex; justify-content: center; padding: 2px;">
            <img
              style="border: 1px solid"
              :src="icons[componenteSeleccionadoModel.marker.icon]"
              :width="componenteSeleccionadoModel.marker.width * 3"
              :height="componenteSeleccionadoModel.marker.height * 3"
            >
          </div>
          <div class="col-xs-12">
            <q-bar>
              <div class="text-weight-medium">
                Opciones de Campos
              </div>
            </q-bar>
          </div>
        </div>
        <q-list
          v-if="['map'].includes(componenteSeleccionadoModel.type)"
          padding
          bordered
          class="rounded-borders col-xs-12"
          style="max-width: 100%"
        >
          <q-expansion-item
            v-for="(config, index) of componenteSeleccionadoModel.configuration"
            :key="index"
            :label="`Configuración de ${config.label}`"
            class="full-width"
          >
            <div class="row q-col-gutter-sm ">
              <q-input
                dense
                class="col-xs-12"
                filled
                label="Nombre"
                v-model="config.label"
              />
              <q-input
                dense
                class="col-xs-12"
                filled
                label="Clave"
                v-model="config.key"
              />
              <q-select
                dense
                class="col-xs-12"
                filled
                :options="listaSubcampos"
                label="Tipo de campo"
                v-model="config.type"
                emit-value
                map-options
              />
              <q-input
                dense
                v-if="config.type === 'select'"
                class="col-xs-12"
                filled
                @input="(event) => getOptionsMap(config)"
                label="Nivel"
                v-model="config.nivel"
              />
              <q-input
                dense
                v-if="config.type === 'select'"
                class="col-xs-12"
                filled
                label="Dependecia"
                v-model="config.dependPosition"
              />
              <q-select
                dense
                v-if="config.type === 'select' && optionMap[config.key]"
                class="col-xs-12"
                filled
                :options="optionMap[config.key]"
                label="Valor por defecto"
                option-label="nombre"
                v-model="config.defaultValue"
              />
              <div v-if="load"></div>
              <q-item
                tag="label"
                v-ripple
                class="col-xs-12"
              >
                <q-item-section
                  side
                  top
                >
                  <q-checkbox v-model="config.readonly" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">Solo Lectura</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                tag="label"
                v-ripple
                class="col-xs-12"
              >
                <q-item-section
                  side
                  top
                >
                  <q-checkbox v-model="config.required" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">Requerido</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                tag="label"
                v-ripple
                class="col-xs-12"
              >
                <q-item-section
                  side
                  top
                >
                  <q-checkbox v-model="config.visible" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">Visible</q-item-label>
                </q-item-section>
              </q-item>
              <q-input
                dense
                class="col-xs-12"
                filled
                label="Diseño Columna"
                v-model="config.designColumn"
              />
            </div>
          </q-expansion-item>
        </q-list>

        <q-editor
          v-if="['title'].includes(componenteSeleccionadoModel.type)"
          dense
          class="col-xs-12"
          filled
          label="Nombre"
          v-model="componenteSeleccionadoModel.label"
          :toolbar="[
            [
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                options: ['left', 'center', 'right', 'justify']
              }
            ],
            ['bold', 'italic', 'strike'],
            [{
              label: $q.lang.editor.fontSize,
              icon: $q.iconSet.editor.fontSize,
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'size-1',
                'size-2',
                'size-3',
                'size-4',
                'size-5',
                'size-6',
                'size-7'
              ]},
            ],

            ['undo', 'redo'],
            ['viewsource']
          ]"
        />

        <q-input
          type="textarea"
          dense
          class="col-xs-12"
          filled
          label="Texto de ayuda"
          v-model="componenteSeleccionadoModel.help"
        />

        <q-input
          dense
          v-if="['datagrid'].includes(componenteSeleccionadoModel.type)"
          class="col-xs-12"
          filled
          label="Texto del boton"
          v-model="componenteSeleccionadoModel.button"
        />

        <q-input
          dense
          v-if="['text'].includes(componenteSeleccionadoModel.type)"
          class="col-xs-12"
          filled
          label="Placeholder"
          v-model="componenteSeleccionadoModel.placeholder"
        />

        <q-select
          dense
          v-if="!['datagrid', 'title', 'select', 'map'].includes(componenteSeleccionadoModel.type)"
          class="col-xs-12"
          filled
          :options="tiposCampos"
          label="Tipo de campo"
          v-model="componenteSeleccionadoModel.typeInput"
          emit-value
          map-options
        />

        <q-select
          dense
          v-if="!['datagrid', 'title', 'map'].includes(componenteSeleccionadoModel.type)"
          class="col-xs-12"
          filled
          :options="validaciones"
          label="Validaciones"
          use-chips
          multiple
          use-input
          v-model="componenteSeleccionadoModel.customValidations"
          emit-value
          map-options
        />

        <div
          class="col-xs-12"
          v-if="!['datagrid', 'title', 'select', 'map'].includes(componenteSeleccionadoModel.type)"
        >
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-xs-12 col-md-6"
              type="number"
              filled
              dense
              label="Longitud minima"
              v-model="componenteSeleccionadoModel.longitudMinima"
            />
            <q-input
              class="col-xs-12 col-md-6"
              type="number"
              filled
              dense
              label="Longitud maxima"
              v-model="componenteSeleccionadoModel.longitudMaxima"
            />
          </div>

        </div>

        <div
          class="col-xs-12"
          v-if="['select'].includes(componenteSeleccionadoModel.type)"
        >
          <q-bar>
            <div class="text-weight-medium">
              Opciones
            </div>
            <q-space />
            <q-btn
              v-if="componenteSeleccionadoModel.tipoOpciones === 'manual'"
              flat
              label="Agregar opcion"
              color="primary"
              icon="add"
              @click="componenteSeleccionadoModel.options.push({ label: null, value: null})"
            />
          </q-bar>
        </div>
        <div
          class="col-xs-12"
          v-if="['select'].includes(componenteSeleccionadoModel.type)"
        >
          <q-tabs
            v-model="componenteSeleccionadoModel.tipoOpciones"
            class="text-primary"
            dense
            align="justify"
            active-class="bg-primary text-white"
            inline-label
          >
            <q-tab
              name="manual"
              icon="list"
              label="Manualmente"
            />
            <q-tab
              name="api"
              icon="cloud_sync"
              label="Api"
            />
          </q-tabs>
        </div>

        <div
          class="col-xs-12"
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'manual'"
        >
          <q-list
            dense
            bordered
            separator
          >
            <q-item
              clickable
              v-ripple
              v-for="(opcion, index) of componenteSeleccionadoModel.options"
              :key="index"
            >
              <q-item-section>

                <div class="row q-col-gutter-sm">
                  <q-input
                    class="col-xs-12 col-md-5"
                    label="Label"
                    filled
                    dense
                    v-model="componenteSeleccionadoModel.options[index].label"
                  />
                  <q-input
                    class="col-xs-12 col-md-7"
                    label="Value"
                    filled
                    dense
                    v-model="componenteSeleccionadoModel.options[index].value"
                  />
                </div>
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  icon="delete"
                  color="negative"
                  round
                  flat
                  @click="componenteSeleccionadoModel.options.splice(index, 1)"
                />
              </q-item-section>
            </q-item>
          </q-list>

        </div>

        <q-input
          dense
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'api'"
          class="col-xs-12"
          filled
          label="Url"
          hint="http://localhost:3000/api"
          v-model="componenteSeleccionadoModel.url"
        />

        <q-input
          dense
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'api'"
          class="col-xs-12"
          filled
          label="Token"
          hint="ndqwjkdnwjkqnkdjwqjkdwqn"
          v-model="componenteSeleccionadoModel.token"
        />

        <div
          class="col-xs-12"
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'api'"
        >
          <q-btn
            @click="consultarServicio"
            icon="settings"
            color="primary"
            label="Configurar servicio"
            class="full-width"
          />
        </div>

        <div
          class="col-xs-12"
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'api'"
        >
          <JsonPreview
            v-if="componenteSeleccionadoModel.ejemploRespuesta"
            :collapse="false"
            :json="componenteSeleccionadoModel.ejemploRespuesta"
            @obtenerListaSubcampos="obtenerListaSubcampos"
          />
        </div>

        <q-select
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'api'"
          class="col-xs-12 col-md-6"
          label="Texto a mostrarse"
          filled
          :options="listaSubcampos"
          v-model="componenteSeleccionadoModel.optionLabel"
        />

        <q-select
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'api'"
          class="col-xs-12 col-md-6"
          label="Valor a guardarse"
          :options="listaSubcampos"
          filled
          v-model="componenteSeleccionadoModel.optionValue"
        />

        <div
          class="col-xs-12"
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'api'"
        >
          <q-bar>
            <div class="text-weight-medium">
              Parametros de busqueda
            </div>
            <q-space />
            <q-btn
              flat
              label="Agregar parametro"
              color="primary"
              icon="add"
              @click="componenteSeleccionadoModel.filtros.push({ label: null, value: null})"
            />
          </q-bar>
        </div>
        <div
          class="col-xs-12"
          v-if="['select'].includes(componenteSeleccionadoModel.type) && componenteSeleccionadoModel.tipoOpciones === 'api'"
        >
          <q-list
            dense
            bordered
            separator
          >
            <q-item
              clickable
              v-ripple
              v-for="(opcion, index) of componenteSeleccionadoModel.filtros"
              :key="index"
            >
              <q-item-section>

                <div class="row q-col-gutter-sm">
                  <q-input
                    class="col-xs-12 col-md-5"
                    label="Label"
                    filled
                    dense
                    v-model="componenteSeleccionadoModel.filtros[index].label"
                  />
                  <q-select
                    :options="getComponentes()"
                    class="col-xs-12 col-md-7"
                    label="Value"
                    filled
                    dense
                    option-label="label"
                    option-value="uid"
                    emit-value
                    map-options
                    v-model="componenteSeleccionadoModel.filtros[index].value"
                  />
                </div>
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  icon="delete"
                  color="negative"
                  round
                  flat
                  @click="componenteSeleccionadoModel.filtros.splice(index, 1)"
                />
              </q-item-section>
            </q-item>
          </q-list>

        </div>

        <div
          class="col-xs-12"
          v-if="['datagrid'].includes(componenteSeleccionadoModel.type)"
        >
          <q-bar>
            <div class="text-weight-medium">
              Columnas
            </div>
          </q-bar>
        </div>
        <div
          class="col-xs-12"
          v-if="['datagrid'].includes(componenteSeleccionadoModel.type)"
        >
          <q-scroll-area style="height: 200px;">
            <q-list
              bordered
              separator
              dense
              class="full-width"
            >
              <q-item
                v-for="(opcion, indexOption) of componenteSeleccionadoModel.options.filter(x => x.uid)"
                :key="indexOption"
                tag="label"
                v-ripple
              >
                <q-item-section
                  side
                  top
                >
                  <q-checkbox v-model="componenteSeleccionadoModel.options[findIndex(opcion)].esColumna" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">{{ opcion.label }}</q-item-label>
                  <q-item-label caption>{{ opcion.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>

        <div class="col-xs-12">
          <q-bar>
            <div class="text-weight-medium">
              Otras opciones
            </div>
          </q-bar>
        </div>

        <div class="col-xs-12">
          <q-list
            separator
            dense
            class="full-width"
          >
            <q-item
              tag="label"
              v-ripple
              v-for="(opcion, index) of opcionesComponente"
              :key="index"
            >
              <q-item-section
                side
                top
              >
                <q-checkbox v-model="componenteSeleccionadoModel[opcion.value]" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">{{ opcion.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <q-bar v-if="!['map'].includes(componenteSeleccionadoModel.type)">
        <div class="text-weight-medium">
          Diseño
        </div>
      </q-bar>
      <label v-if="!['map'].includes(componenteSeleccionadoModel.type)" class="props-design-column">

        <q-radio
          v-model="componenteSeleccionadoModel.designColumn"
          val="col-12"
          size="xs"
          @click="$emit('update:designColumn', componenteSeleccionadoModel.designColumn)"
        />
        <div class="props-columns col-xs-1">
          <div></div>
        </div>
      </label>
      <label v-if="!['map'].includes(componenteSeleccionadoModel.type)" class="props-design-column">
        <q-radio
          v-model="componenteSeleccionadoModel.designColumn"
          val="col-6"
          size="xs"
          @click="$emit('update:designColumn', componenteSeleccionadoModel.designColumn)"
        />
        <div class="props-columns col-xs-2">
          <div
            v-for="i in [1, 2]"
            :key="i"
          ></div>
        </div>
      </label>
      <label v-if="!['map'].includes(componenteSeleccionadoModel.type)" class="props-design-column">
        <q-radio
          v-model="componenteSeleccionadoModel.designColumn"
          val="col-4"
          size="xs"
          @click="$emit('update:designColumn', componenteSeleccionadoModel.designColumn)"
        />
        <div class="props-columns col-xs-3">
          <div
            v-for="i in [1, 2, 3]"
            :key="i"
          ></div>
        </div>
      </label>
      <label v-if="!['map'].includes(componenteSeleccionadoModel.type)" class="props-design-column">
        <q-radio
          v-model="componenteSeleccionadoModel.designColumn"
          val="col-3"
          size="xs"
          @click="$emit('update:designColumn', componenteSeleccionadoModel.designColumn)"
        />
        <div class="props-columns col-xs-4">
          <div
            v-for="i in [1, 2, 3, 4]"
            :key="i"
          ></div>
        </div>
      </label>
      <label v-if="!['map'].includes(componenteSeleccionadoModel.type)" class="props-design-column">
        <q-radio
          v-model="componenteSeleccionadoModel.designColumn"
          val="col-2"
          size="xs"
          @click="$emit('update:designColumn', componenteSeleccionadoModel.designColumn)"
        />
        <div class="props-columns col-xs-4">
          <div
            v-for="i in [1, 2, 3, 4, 5]"
            :key="i"
          ></div>
        </div>
      </label>
    </div>

    <ReglasFormulario
      v-if="tab === 'condiciones'"
      :valores.sync="componenteSeleccionadoModel"
      :listaComponentes.sync="listaComponentes"
    />

    <v-jsoneditor
      v-if="tab === 'desarrollo'"
      v-model="componenteSeleccionadoModel"
      :plus="true"
      :options="{ mode: 'code' }"
      height="700px"
    />
  </section>
</template>
<script>
import { createComputed } from 'src/common/utils'
import JsonPreview from 'components/Form/components/Configuracion/JsonPreview'
import VJsoneditor from 'v-jsoneditor/src/index'
import ReglasFormulario from '../ReglasFormulario'
import axios from 'axios'
import markerIcon from '../../../assets/marker'

export default {
  components: {
    VJsoneditor,
    JsonPreview,
    ReglasFormulario
  },
  props: {
    valores: { type: Object, default: () => ({}) },
    componenteSeleccionado: { type: Object, default: () => ({}) },
    listaComponentes: { type: Array, default: () => ([]) }
  },
  mounted () {
    this.init()
  },
  data () {
    return {
      tab: 'diseno',
      model: this.value,
      options: null,
      jsonConfigSelect: [],
      opcionesComponente: [
        { label: 'Visible', value: 'visible' },
        { label: 'Deshabilitado', value: 'disabled' },
        { label: 'Solo lectura', value: 'readonly' },
        { label: 'Auto completado', value: 'autoComplete' },
        { label: 'Multiple', value: 'multiple' }
      ],
      optionsTemp: [],
      validaciones: [
        { label: 'CAMPO REQUERIDO', value: 'requerido' },
        { label: 'SOLO NUMERO DE TELEFONO', value: 'telefono' },
        { label: 'SOLO LETRAS', value: 'letras' },
        { label: 'SOLO TEXTO ALFANUMERICO', value: 'alfanumerico' },
        { label: 'SOLO NUMEROS ENTEROS POSITIVOS', value: 'numeros' },
        { label: 'SOLO NUMEROS DECIMALES', value: 'decimales' },
        { label: 'CORREO ELECTRONICO', value: 'correo' }
      ],
      tiposCampos: [
        { label: 'FECHA', value: 'date' },
        { label: 'AREA DE TEXTO', value: 'textarea' },
        { label: 'NORMAL', value: 'text' },
        { label: 'NUMERICO', value: 'number' }
      ],
      tipoSelector: [
        { label: 'FECHA', value: 'date' },
        { label: 'AREA DE TEXTO', value: 'textarea' },
        { label: 'NORMAL', value: 'text' },
        { label: 'NUMERICO', value: 'number' }
      ],
      listaSubcampos: [
        { label: 'SELECTOR', value: 'select' },
        { label: 'CAMPO TEXTO', value: 'textfield' }
      ],
      optionMap: {},
      loadEvent: false,
      icon: Object.keys(markerIcon),
      icons: markerIcon,
      load: false
    }
  },
  methods: {
    async init () {
      if (this.componenteSeleccionadoModel.type === 'map') {
        for (const content of this.componenteSeleccionadoModel.configuration) {
          await this.getOptionsMap(content)
        }
      }
      this.loadEvent = true
    },
    async getOptionsMap (content) {
      this.optionsMap = null
      if (content.type === 'select') {
        if (!content.nivel) return
        const options = await this.getDpa(content)
        this.optionMap[content.key] = [...options]
      }
      this.load = !this.load
    },
    obtenerListaSubcampos (listaCampos) {
      this.listaSubcampos = listaCampos
    },
    getComponentes () {
      let lista = this.listaComponentes.filter(x => x.type !== 'datagrid' && !!x.type && x.uid !== this.componenteSeleccionado.uid)

      if (this.$store.state.global.seleccionado.subIndex) {
        lista = this.listaComponentes[this.$store.state.global.seleccionado.index].options.filter(x => x.type !== 'datagrid' && !!x.type && x.uid !== this.componenteSeleccionado.uid)
      }

      lista.unshift({ uid: 'idTipoProceso', label: 'Tipo de proceso', value: 'idTipoProceso' })

      lista = lista.map(x => ({ uid: x.uid, label: x.label, value: x.value }))
      return lista
    },
    findIndex (element) {
      const posicion = this.componenteSeleccionadoModel.options.findIndex(x => x.uid === element.uid)
      return posicion
    },
    async consultarServicio () {
      let url = this.componenteSeleccionadoModel.url

      if (!url.includes('http')) url = `${process.env.BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`

      const init = {
        method: 'GET',
        url,
        headers: { Authorization: `Bearer ${this.componenteSeleccionadoModel.token || this.$storage.get('token')}` }
      }
      const { data } = await axios(init)
      this.componenteSeleccionadoModel.ejemploRespuesta = this.jsonFormat(data)
      this.jsonConfigSelect = this.componenteSeleccionadoModel.ejemploRespuesta
    },
    async getDpa ({ nivel }) {
      const { rows } = await this.$axios.get(`system/dpa?nivel=${nivel}`)
      return rows
    },
    jsonFormat (json, path = [], collapse = false, show = true) {
      const tree = []
      for (const key in json) {
        const value = json[key]
        const item = {
          key,
          type: typeof value,
          path: path.concat([key]),
          children: []
        }
        if (item.type === 'object' && value !== null) {
          item.type = Array.isArray(value) ? 'array' : 'object'
          item.collapse = collapse
          item.children = Array.isArray(value) ? this.jsonFormat([value[0]], path.concat([key]), collapse, show) : this.jsonFormat(value, path.concat([key]), collapse, show)
          item.checked = false
          item.show = !show
        } else {
          item.checked = false
          item.value = value
          item.show = show
        }
        tree.push(item)
      }
      return tree
    }

  },
  computed: {
    optionsMap: createComputed('optionMap'),
    valoresModel: createComputed('valores'),
    componenteSeleccionadoModel: createComputed('componenteSeleccionado')
  }
}
</script>
