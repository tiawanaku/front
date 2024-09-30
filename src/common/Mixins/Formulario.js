export default {
  data () {
    return {

    }
  },
  methods: {
    getFiltrosComponenteConfiguracion (campo, campos, filtros) {
      const filtrosFinal = []
      for (const filtro of filtros) {
        if (filtro.value === 'idTipoProceso') {
          for (const idProceso of this.$store.state.global.idTipoProcesoConfiguracion) {
            filtrosFinal.push(`idProceso=${idProceso}`)
          }
        }
      }
      return filtrosFinal
    },
    getFiltrosComponenteEjecucion (campo, campos) {
      const filtrosFinal = []
      if (campo.filtros) {
        for (const filtro of campo.filtros) {
          if (filtro.value === 'idTipoProceso') filtrosFinal.push(`idProceso=${this.$store.state.global.idTipoProceso}`)

          if (filtro.value !== 'idTipoProceso') {
            const existe = campos.find(x => x.uid === filtro.value)
            if (existe) {
              if (Array.isArray(existe.value)) {
                for (const value of existe.value) {
                  filtrosFinal.push(`${filtro.label}=${value}`)
                }
              } else {
                filtrosFinal.push(`${filtro.label}=${existe.value}`)
              }
            }
          }
        }
      }
      return filtrosFinal
    },
    evaluarCondiciones (campo, campos, reglas) {
      if (reglas) {
        const resultadoCondiciones = []
        for (const regla of reglas) {
          const componenteInicial = campos.find(x => x.uid === regla.uid)
          // console.log('_DESDE_EVALUAR_CONDICIONES_ ', campo.name, componenteInicial.name, componenteInicial.value, regla.operador, regla.value)
          if (regla.operador === '===') resultadoCondiciones.push(componenteInicial.value === regla.value)
          if (regla.operador === '!==') resultadoCondiciones.push(componenteInicial.value !== regla.value)
          if (regla.operador === '>') resultadoCondiciones.push(componenteInicial.value > regla.value)
          if (regla.operador === '>=') resultadoCondiciones.push(componenteInicial.value >= regla.value)
          if (regla.operador === '<') resultadoCondiciones.push(componenteInicial.value < regla.value)
          if (regla.operador === '<=') resultadoCondiciones.push(componenteInicial.value <= regla.value)
          if (regla.operador === 'contains') resultadoCondiciones.push(componenteInicial.value ? componenteInicial.value.toString().includes(regla.value) : '')
          if (regla.operador === 'no-contains') resultadoCondiciones.push(componenteInicial.value ? !componenteInicial.value.toString().includes(regla.value) : '')
        }

        if (resultadoCondiciones.length > 0) {
          if (campo.operadorReglas === 'and') return resultadoCondiciones.every(x => x)
          if (campo.operadorReglas === 'or') return resultadoCondiciones.some(x => x)
        }
      }
      return true
    }
  }
}
