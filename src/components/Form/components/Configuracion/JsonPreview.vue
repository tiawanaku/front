<template>
  <section>
    <q-tree
      v-if="json"
      :nodes="json"
      node-key="key"
      dense
      :expanded.sync="expanded"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <q-checkbox
            :disable="prop.node.type !== 'array'"
            value="false"
            v-model="prop.node.checked"
            @input="nodoSeleccionado(prop.node)"
          />
          <div class="text-weight-bold">{{ prop.node.key }} - <span class="text-caption">{{ prop.node.type }}</span></div>
        </div>
      </template>
    </q-tree>
  </section>
</template>

<script>
export default {
  props: {
    collapse: { type: Boolean, default: false },
    json: { default: [], required: true }
  },
  data () {
    return {
      expanded: []
    }
  },
  mounted () {
    const nodo = this.buscarSeleccionado(this.json)
    if (nodo) {
      const listaCampos = nodo.children[0] ? nodo.children[0].children.map(x => x.key) : []
      this.$emit('obtenerListaSubcampos', listaCampos)
      this.expanded = nodo.path
    }
  },
  methods: {
    buscarSeleccionado (nodos) {
      // let seleccionado = null
      for (const nodo of nodos) {
        if (nodo.checked) return nodo

        if (nodo.children.length > 0) {
          return this.buscarSeleccionado(nodo.children)
        }
      }
    },
    nodoSeleccionado (seleccionado) {
      if (seleccionado.checked) {
        const listaCampos = seleccionado.children[0] ? seleccionado.children[0].children.map(x => x.key) : []
        this.$emit('obtenerListaSubcampos', listaCampos)
      }
    }
  }
}
</script>

<style lang="scss">
.json {
  padding: 0px 0 10px 15px;
  font-size: 14px;

  & > {
    .json__item {
      display: block;
    }
  }
}

.json__item {
  display: none;
  margin-top: 4px;
  padding-left: 20px;
  user-select: none;
}

.json__item--collapsible {
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &::before {
    content: "+";
    position: absolute;
    left: 5px;
  }

  &.collapse {
    &::before {
      content: "-";
    }
  }

  &::after {
    background-color: lightgrey;
    content: "";
    height: 100%;
    left: 9px;
    position: absolute;
    top: 26px;
    width: 1px;
  }

  &:hover {
    & > .json__key,
    & > .json__value {
      text-decoration: underline;
    }
  }
}

.json__toggle {
  display: none;

  &:checked ~ .json__item {
    display: block;
  }
}

.json__key {
  color: $primary;
  display: inline;

  &.json__key-item {
    margin-left: -20px;
  }

  &::after {
    content: ": ";
  }
}

.json__value {
  display: inline-block;
  vertical-align: bottom;
}

.json__value--string {
  color: $positive;
}

.json__value--number {
  color: $info;
}

.json__value--boolean {
  color: $negative;
}
</style>
