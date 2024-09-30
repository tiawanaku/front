<template>
  <div
    v-show="elementModel.visible"
    class="form-group q-gutter-sm"
    :class="`col-xs-12 ${elementModel.designColumn}`"
    role="group"
    @click="$store.commit('global/setSeleccionado', posicion)">
    <div
      class="row q-col-gutter-sm"
      v-if="loading">
      <template v-for="(config, index) of elementModel.configuration">
        <div
          :key="index"
          :class="config.designColumn"
          v-if="config.visible"
        >
          <q-select
            v-if="config.type === 'select'"
            filled
            :options="options[config.key]"
            :label="config.label"
            option-label="nombre"
            option-value="id"
            @filter="(val, update, abort) => filterFn(config.key, val, update, abort)"
            @input="(event) => changeList(index, elementModel.value[config.key], event)"
            v-model="elementModel.value[config.key]"
            :readonly="config.readonly"
            :rules="rules[config.key]"
            map-options
            use-input
            fill-input
          >
          </q-select>
          <q-input
            v-else
            filled
            :label="config.label"
            v-model="elementModel.value[config.key]"
            :readonly="config.readonly"
            :rules="rules[config.key]"
          />
        </div>
      </template>
    </div>
    <div v-if="load"></div>
    <div id="mapid"></div>
  </div>
</template>
<script>
import validation from '../../../common/validations'
import { createComputed } from '@common/utils'
import 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from '../../../assets/marker'
import SelectField from './SelectField'

export default ({
  components: [
    SelectField
  ],
  props: {
    element: { required: true, type: Object, default: () => {} },
    value: { default: '' },
    index: { type: Number, default: null },
    posicion: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      model: this.value,
      options: {},
      freezeOptions: {},
      rules: {},
      map: null,
      child: {},
      markers: null,
      loading: false,
      load: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    elementModel: createComputed('element')
  },
  methods: {
    async init () {
      // cambiar segun la pocision
      const value = {}
      if (this.elementModel.value) {
        if (this.elementModel.value.latitud) value.latitud = this.elementModel.value.latitud
        if (this.elementModel.value.longitud) value.longitud = this.elementModel.value.longitud
      }
      let [latitud, longitud] = [null, null]
      for (const index in this.elementModel.configuration) {
        const config = this.elementModel.configuration[index]
        const option = await this.getDpa(index)
        this.options[config.key] = JSON.parse(JSON.stringify(option))
        this.freezeOptions[config.key] = JSON.parse(JSON.stringify(option))
        if (!this.elementModel.value || !this.elementModel.value[config.key]) value[config.key] = config.defaultValue
        if (this.elementModel.value && this.elementModel.value[config.key]) value[config.key] = this.elementModel.value[config.key]
        if (value[config.key]) {
          if (value[config.key].latitud) latitud = value[config.key].latitud
          if (value[config.key].longitud) longitud = value[config.key].longitud
        }
        if (config.required) {
          this.rules[config.key] = [validation.requerido]
        }
      }
      this.elementModel.value = value
      this.loadMap(latitud, longitud)
      this.loading = true
    },
    loadMap (latDefault, lonDefault) {
      this.markers = window.L.layerGroup()
      let { latitud, longitud } = this.elementModel.defaultValue
      if (latDefault) latitud = latDefault
      if (lonDefault) longitud = lonDefault
      if (this.elementModel.value) {
        if (this.elementModel.value.latitud) latitud = this.elementModel.value.latitud
        if (this.elementModel.value.longitud) longitud = this.elementModel.value.longitud
      }
      const [lat, lon] = [latitud || -16.72085226067979, longitud || -64.81548176411331]
      this.map = window.L.map('mapid', {
        center: [lat, lon],
        zoom: 15,
        layers: [this.markers]
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
      window.L.marker({ lat: latitud, lng: longitud }, { icon: iconMark }).addTo(this.markers)
      if (this.elementModel.readonly) return
      const onMapClick = (event) => {
        this.markers.clearLayers()
        this.elementModel.value = { ...this.elementModel.value, latitud: event.latlng.lat, longitud: event.latlng.lng }
        window.L.marker(event.latlng, { icon: iconMark }).addTo(this.markers)
      }
      this.map.on('click', onMapClick)
    },
    changeMap (latitude, longitude) {
      this.map.panTo([latitude, longitude])
    },
    async getDpa (position, id) {
      const { dependPosition, nivel, type } = this.elementModel.configuration[position]
      if (type !== 'select') return []
      const query = { nivel }
      if (id) query.idPadre = id
      if (dependPosition >= 0 && !id) {
        if (!this.child[dependPosition]) this.child[dependPosition] = []
        this.child[dependPosition].push(position)
        const { defaultValue } = this.elementModel.configuration[dependPosition]
        if (defaultValue) {
          query.idPadre = defaultValue.id
        }
      }
      const { rows } = await this.$axios.get(`system/dpa${this.querys(query)}`)
      return this.orderOptions(rows)
    },
    async orderOptions (rows) {
      return rows.sort((a, b) => a.nombre.localeCompare(b.nombre))
    },
    async changeList (position, value, event) {
      await this.changeValue(position, value)
      this.load = !this.load
    },
    async changeValue (position, value) {
      if (value.latitud && value.longitud) {
        this.changeMap(value.latitud, value.longitud)
      }
      if (!this.child[position]) return
      for (const childUpdate of this.child[position]) {
        const { key } = this.elementModel.configuration[childUpdate]
        const option = await this.getDpa(childUpdate, value.id)
        this.options[key] = [...option]
        this.freezeOptions[key] = [...option]
        this.clearValue(childUpdate)
      }
    },
    clearValue (position) {
      const { key } = this.elementModel.configuration[position]
      this.elementModel.value[key] = null
      if (!this.child[position]) return
      for (const positionChild of this.child[position]) { this.clearValue(positionChild) }
    },
    filterFn (key, val, update, abort) {
      const option = JSON.parse(JSON.stringify(this.options))
      if (!val) {
        option[key] = JSON.parse(JSON.stringify(this.freezeOptions[key]))
        this.options = JSON.parse(JSON.stringify(option))
      }
      update(() => {
        const needle = val.toLowerCase()
        option[key] = JSON.parse(JSON.stringify(this.freezeOptions[key].filter(v => v.nombre.toLowerCase().includes(needle))))
        this.options = JSON.parse(JSON.stringify(option))
      })
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
