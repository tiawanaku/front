export default {
  methods: {
    setValueDependencyUrl (direccion, dependency) {
      let url = direccion

      if (!url.includes('http')) url = `${process.env.BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`

      if (dependency) {
        if (dependency.value) {
          if (dependency.value === 'idTipoProceso') {
            let valor = null
            if (this.tab) {
              valor = this.tab
            } else {
              valor = this.denuncia.idTipoProceso
            }
            url = this.setParameterUrl(url, dependency.name, valor)
          }
        }
      }
      return url
    },
    setParameterUrl (direccion, paramter, value) {
      const url = new URL(direccion)
      const searchParams = url.searchParams
      searchParams.set(paramter, value)
      url.search = searchParams.toString()
      return url.toString()
    }
  }
}
