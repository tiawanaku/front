<template>
  <div class="row">
    <div class="col-xs-12">
      <q-dialog
        v-model="dialogComputed"
        persistent
      >
        <slot
          name="form"
          :updateList="updateList"
          :closeModal="closeModal"
        >Agregue su formulario aquí</slot>
        <slot
          name="filtrarSaj"
          class="row q-col-gutter-xs no-padding full-width"
        ></slot>
      </q-dialog>
    </div>
    <div class="col-xs-12">
      <q-card class="q-mx-md">
        <q-card-section>
          <slot name="headers"></slot>
        </q-card-section>
        <q-toolbar
          inset
          class="q-gutter-md q-pa-md"
        >
          <slot name="buttons"></slot>
          <q-btn @click="toggleSearch()">
            <q-icon
              center
              name="search"
            />

          </q-btn>
          <q-btn @click="updateList()">
            <q-icon
              center
              name="refresh"
              color="secondary"
            />
          </q-btn>
          <slot name="buttons-end"></slot>
        </q-toolbar>
        <q-table
          :data="registros"
          :columns="getColumns"
          :pagination.sync="pagination"
          rows-per-page-label="Filas por página"
          :rows-per-page-options="[10, 25, 50, 100, 200]"
          @request="getData"
          :wrap-cells="true"
          :loading="loading"
          loading-label="Listando registros"
        >
          <template
            v-slot:top
            v-if="enableSearch"
            class="full-width"
          >
            <slot
              name="filtros"
              class="row q-col-gutter-xs no-padding full-width"
            ></slot>
            <div
              class="row q-col-gutter-xs no-padding full-width"
              id="container-filters"
            >
              <div
                v-for="(item, index) of filters"
                :key="index"
                align="center"
                class="col-grow"
                style="min-width:250px;"
              >
                <q-select
                  v-if="item.type === 'select'"
                  behavior="menu"
                  clearable
                  :label="item.label"
                  filled
                  dense
                  v-model="search[item.field]"
                  :options="item.options"
                  emit-value
                  map-options
                />
                <q-checkbox
                  v-if="item.type === 'checkbox'"
                  :label="item.label"
                  filled
                  dense
                  v-model="search[item.field]"
                  autofocus
                />
                <q-input
                  v-if="item.type === 'input'"
                  clearable
                  :label="item.label"
                  filled
                  dense
                  v-model="search[item.field]"
                  autofocus
                />
                <q-input
                  v-if="item.type === 'date'"
                  clearable
                  filled
                  v-model="search[item.field]"
                  :label="item.label"
                  dense
                >
                  <template
                    v-slot:append
                    :props="item"
                  >
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        :ref="item.field"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="search[item.field]"
                          color="primary"
                          mask="YYYY-MM-DD"
                          @input="(evt) => ocultarPopup(evt, item.field)"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </template>
          <template
            slot="body"
            slot-scope="props"
          >
            <slot
              name="row"
              :row="props.row"
              :openModal="openModal"
              :cambiarEstado="cambiarEstado"
              :eliminar="eliminar"
            />
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script>

import { createComputed } from '@common/utils'

export default {
  name: 'PageIndex',
  props: {
    maximized: {
      type: Boolean,
      default: false
    },
    dialog: {
      type: Boolean,
      default: false
    },
    filters: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: 'url'
    },
    idRefresh: {
      type: String,
      default: 'btn-refresh-list'
    },
    order: {
      type: String,
      default: () => ''
    },
    filtrosAvanzados: {
      type: Object,
      default: () => ({})
    },
    wrap: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      tamanioColumna: 3,
      registros: [],
      persistent: false,
      enableSearch: false,
      crudTableModal: false,
      search: {},
      page: 1,
      limit: 5,
      edit: false,
      pagination: {
        sortBy: this.order,
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        'rows-per-page-label': 'Paginas'
      }
    }
  },
  watch: {
    url: {
      async handler () {
        this.getData({
          pagination: this.pagination,
          filter: undefined
        })
      }
    },
    search: {
      handler () {
        this.getData({
          pagination: this.pagination,
          filter: undefined
        })
      },
      deep: true
    }
  },
  mounted () {
    const division = parseInt(this.filters.length / 12)
    this.tamanioColumna = division > 1 ? division : 2
    this.updateList()
  },
  computed: {
    dialogComputed: createComputed('dialog'),
    getColumns () {
      const items = []
      for (const el of this.columns) {
        el.align = 'center'
        items.push(el)
      }
      return items
    }
  },
  methods: {
    ocultarPopup (evt, field) {
      this.$refs[field][0].hide()
    },
    updateList () {
      this.getData({
        pagination: this.pagination,
        filter: undefined
      })
    },
    openModal () {
      this.dialogComputed = true
    },
    closeModal () {
      this.dialogComputed = false
    },
    toggleSearch () {
      this.enableSearch = !this.enableSearch
      this.search = {}
    },
    async cambiarEstado ({ registro, url, titulo, mensaje, aceptar, cancelar }) {
      try {
        const estadoOriginal = registro.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
        this.$q.dialog({
          title: titulo || 'Atención',
          message: mensaje || `¿Esta seguro de que quiere ${registro.estado === 'ACTIVO' ? 'activar' : 'desactivar'} este registro?`,
          ok: {
            color: 'primary',
            label: 'Aceptar'
          },
          cancel: {
            color: 'white',
            'text-color': 'secondary',
            label: 'Cancelar'
          },
          persistent: true
        }).onOk(async () => {
          if (aceptar) {
            await aceptar()
          } else {
            await this.$axios.put(url, registro)
          }
          this.updateList()
        }).onCancel(async () => {
          if (aceptar) {
            await aceptar()
          } else {
            registro.estado = estadoOriginal
          }
        })
      } catch (error) {
        this.$alert.error(this.$t(error.message))
      }
    },
    async eliminar ({ titulo, mensaje, aceptar, cancelar, url }) {
      try {
        this.$q.dialog({
          title: titulo || 'Confirmación',
          message: mensaje || '¿Está seguro de que quiere eliminar este registro?',
          ok: {
            color: 'primary',
            label: 'Aceptar'
          },
          cancel: {
            color: 'white',
            'text-color': 'secondary',
            label: 'Cancelar'
          },
          persistent: true
        }).onOk(async () => {
          if (aceptar) {
            await aceptar()
          } else {
            await this.$axios.delete(url)
          }
          this.updateList()
          this.closeModal()
        })
      } catch (error) {
        this.$alert.error(this.$t(error.message))
      }
    },
    async getData (props) {
      this.loading = true
      try {
        const { page, rowsPerPage, sortBy, descending } = props.pagination
        const query = {
          limit: rowsPerPage === 0 ? 99999 : rowsPerPage,
          page: page
        }
        if (sortBy) {
          query.order = (descending ? '-' : '') + sortBy
        }
        if (Object.keys(this.search).length) {
          for (const key of Object.keys(this.search)) {
            if (this.search[key]) {
              if (this.search[key].toString().length > 0) {
                query[key] = this.search[key]
              }
            }
          }
        }
        if (this.filtrosAvanzados) {
          Object.assign(query, this.filtrosAvanzados)
        }
        const url = this.url
        const response = await this.$axios.list(url, query)
        if (response) {
          this.registros = response.rows
          this.pagination = props.pagination
          this.pagination.rowsNumber = response.count
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="sass" scoped>
#container-filters
  justify-content: bottom
  align-items: flex-end
  .container-ranges
    display: flex
    justify-content: space-between
    label
      width: 100%
</style>
