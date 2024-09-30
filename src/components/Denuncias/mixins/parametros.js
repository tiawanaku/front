export default {
  data () {
    return {
      parametros: [],
      procesos: []
    }
  },
  mounted () {
    this.getParametros()
    this.getProcesos()
  },
  methods: {
    obtenerNombreParametro (id) {
      const filtro = this.parametros.filter(e => e.id === id)
      if (filtro.length > 0) {
        return filtro[0].nombre
      } else {
        return 'SIN DATO'
      }
    },
    obtenerNombreProceso (id) {
      const filtro = this.procesos.filter(e => e.id === id)
      if (filtro.length > 0) {
        return filtro[0].nombre
      } else {
        return 'SIN DATO'
      }
    },
    async getParametros () {
      const respuesta = await this.$axios.get('system/parametros?limit=10000')
      this.parametros = respuesta.rows
    },
    async getProcesos () {
      const respuesta = await this.$axios.get('denuncias/proceso')
      this.procesos = respuesta.rows
    }
  }
}
