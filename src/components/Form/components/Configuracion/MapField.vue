<template>
  <div
    v-show="elementModel.visible"
    class="form-group q-gutter-sm"
    :class="`col-xs-12 ${elementModel.designColumn}`"
    role="group"
    @click="$store.commit('global/setSeleccionado', posicion)">
    <div
      class="row q-col-gutter-sm"
      v-if="loading"
    >
      <template v-for="(config, index) of elementModel.configuration">
        <div
          :key="index"
          :options="options[index]"
          :class="config.designColumn"
          v-if="config.visible"
        >
          <q-select
            v-if="config.type === 'select'"
            filled
            :options="options[index]"
            :label="config.label"
            v-model="valueDefault[config.key]"
            option-label="nombre"
            :readonly="config.readonly"
          >
          </q-select>
          <q-input
            v-else
            filled
            :label="config.label"
            v-model="valueDefault[config.key]"
            :readonly="config.readonly"
          />
        </div>
      </template>
    </div>
    <div id="mapid"></div>
  </div>
</template>
<script>
import validation from '../../../../common/validations'
import { createComputed } from '@common/utils'
import 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from '../../../../assets/marker'

export default ({
  props: {
    element: { required: true, type: Object, default: () => {} },
    value: { default: '' },
    index: { type: Number, default: null },
    posicion: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      model: this.value,
      valueDefault: {},
      options: [],
      rules: [],
      map: null,
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    elementModel: createComputed('element'),
    valueComputed: createComputed('value')
  },
  methods: {
    async init () {
      this.options = new Array(this.elementModel.configuration.length)
      this.rules = new Array(this.elementModel.configuration.length)
      for (const index in this.elementModel.configuration) {
        this.options[index] = await this.getDpa(index)
        if (this.elementModel.configuration[index].required) { this.rules[index] = [validation.requerido] }
      }
      this.loading = true
      this.loadMap()
    },
    loadMap () {
      const markers = window.L.layerGroup()
      const { latitud, longitud } = this.elementModel.defaultValue
      const [lat, lon] = [latitud || -16.72085226067979, longitud || -64.81548176411331]
      this.map = window.L.map('mapid', {
        center: [lat, lon],
        zoom: 6,
        layers: [markers]
      })
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
      }).addTo(this.map)
      const { icon, width, height } = this.elementModel.marker
      const LeafIcon = window.L.Icon.extend({
        options: { iconSize: [width, height], iconAnchor: [14, 42] }
      })
      const iconMark = new LeafIcon({ iconUrl: markerIcon[icon] })
      const onMapClick = (event) => {
        markers.clearLayers()
        this.elementModel.defaultValue = { latitud: event.latlng.lat, longitud: event.latlng.lng }
        window.L.marker(event.latlng, { icon: iconMark }).addTo(markers)
      }
      this.map.on('click', onMapClick)
    },
    async getDpa (position, id) {
      const { dependPosition, nivel, type } = this.elementModel.configuration[position]
      if (type !== 'select') return []
      const query = { nivel }
      if (id) query.idPadre = id
      if (dependPosition && !id) {
        const { defaultValue } = this.elementModel.configuration[dependPosition]
        if (defaultValue && defaultValue.id) query.idPadre = defaultValue.id
      }
      const { rows } = await this.$axios.get(`system/dpa${this.querys(query)}`)
      return rows
    },
    querys (json) {
      const querys = []
      for (const key in json) {
        if (!Array.isArray(json[key])) {
          querys.push(`${key}=${json[key]}`)
          continue
        }
        for (const value of json[key]) { querys.push(`${key}=${value}`) }
      }
      return `?${querys.join('&')}`
    }
  }
})
</script>
<style lang="scss">
  #mapid { height: 320px; }
</style>
