export default {
  methods: {
    crear () {
      this.resetForm()
      this.$store.commit('global/openCrudGridModal')
    },
    cancelar () {
      this.resetForm()
      this.$store.commit('global/crudGridModal')
    },
    async cambiarEstado (registro) {
      try {
        const estadoOriginal = registro.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
        this.$q.dialog({
          title: 'Atención',
          message: `Esta seguro de que quiere ${registro.estado === 'ACTIVO' ? 'activar' : 'desactivar'} este registro?`,
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
          await this.$axios.put(this.url, registro)
          await this.$refs.crudGrid.updateList()
        }).onCancel(() => {
          registro.estado = estadoOriginal
        })
      } catch (error) {
        this.$alert.error(error.message)
      }
    },
    async eliminar (id) {
      try {
        this.$q.dialog({
          title: 'Atención',
          message: 'Está seguro de que quiere eliminar este registro?',
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
          await this.$axios.delete(`${this.url}/${id}`)
          await this.$refs.crudGrid.updateList()
        })
      } catch (error) {
        this.$alert.error(error.message)
      }
    }
  }
}
