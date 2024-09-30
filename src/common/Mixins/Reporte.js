export default {
  data () {
    return {

    }
  },
  methods: {
    getFiltrosReporte (filtros) {
      const filtrosFinal = []
      for (const key in filtros) {
        if (filtros[key]) {
          if (Array.isArray(filtros[key])) {
            for (const value of filtros[key]) {
              if (value) filtrosFinal.push(`${key}=${value}`)
            }
          } else {
            filtrosFinal.push(`${key}=${filtros[key]}`)
          }
        }
      }
      return filtrosFinal
    }
  }
}
