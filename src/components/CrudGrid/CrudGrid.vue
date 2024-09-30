<template>
  <div class="row">
    <div class="col-xs-12">
      <q-dialog
        v-model="global.crudGridModal"
        persistent
      >
        <slot name="form">Agregue su formulario aquí</slot>
      </q-dialog>
    </div>
    <div class="col-xs-12">
      <q-card flat>
        <q-toolbar
          inset
          class="q-gutter-md q-pa-md"
        >
          <slot name="buttons"></slot>
          <q-btn
            v-if="filters.length > 0"
            @click="toggleSearch()"
          >
            <q-icon
              center
              name="search"
              color="secondary"
            />
          </q-btn>
          <q-btn @click="updateList()">
            <q-icon
              center
              name="refresh"
              color="secondary"
            />
          </q-btn>
          <slot
            class="col-grow"
            name="buttons-end"
          ></slot>
        </q-toolbar>
        <q-table
          grid
          :data="registros"
          :columns="getColumns"
          :pagination.sync="pagination"
          rows-per-page-label="Elementos por pagina"
          :rows-per-page-options="[6, 12, 24]"
          @request="getData"
        >
          <template
            v-slot:top
            v-if="enableSearch"
          >
            <div
              v-for="(item, index) of filters"
              :key="index"
              align="right"
              :class="`col-xs-12 col-sm-6 col-md-${parseInt(12/filters.length)} q-pa-xs`"
            >
              <q-input
                :label="item.label"
                outlined
                dense
                v-model="search[item.field]"
                autofocus
              />
            </div>
          </template>
          <template
            slot="item"
            slot-scope="props"
            class="row q-col-gutter-md"
          >
            <slot
              :props="props.row"
              name="row"
            />
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PageIndex',
  props: {
    filters: { type: Array, default: () => ([]) },
    columns: { type: Array, default: () => ([]) },
    url: { type: String, default: 'url' },
    idRefresh: { type: String, default: 'btn-refresh-list' },
    order: { type: String, default: () => ([]) }
  },
  data () {
    return {
      modal: false,
      registros: [],
      persistent: false,
      enableSearch: false,
      crudTableModal: false,
      search: '',
      page: 1,
      limit: 5,
      edit: false,
      pagination: {
        sortBy: this.order,
        descending: false,
        page: 1,
        rowsPerPage: 6,
        rowsNumber: 0,
        'rows-per-page-label': 'Paginas'
      }
    }
  },
  created () {
    this.windowHeight = window.innerHeight + 'px'
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
    this.updateList()
  },
  computed: {
    ...mapState(['global']),
    getColumns () {
      const items = []
      this.columns.map(el => {
        el.align = 'center'
        items.push(el)
      })
      return items
    }
  },
  methods: {
    updateList () {
      this.getData({
        pagination: this.pagination,
        filter: undefined
      })
    },
    openModal () {
      this.modal = true
    },
    closeModal () {
      this.modal = false
    },
    toggleSearch () {
      this.enableSearch = !this.enableSearch
      this.search = {}
    },
    getData (props) {
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
          query[key] = this.search[key]
        }
      }
      const url = this.url
      this.$axios.list(url, query)
        .then(response => {
          if (response) {
            this.registros = response.rows
            this.pagination = props.pagination
            this.pagination.rowsNumber = response.count
          }
        })
    }
  }
}
</script>
