export function tiempoActual (state) {
  return state.tiempo
};

export function formularioProceso (state) {
  return idProceso => {
    let form = []
    if (state.roles.length > 0) {
      if (state.roles[0].procesos.length > 0) {
        const proceso = state.roles[0].procesos.filter(e => e.id === idProceso)
        if (proceso[0].formularios.length > 0) {
          form = proceso[0].formularios[0].configuracion
        }
      }
    }
    return form
  }
}

export function getProcesosUsuario (state) {
  const procesos = []

  if (state.roles.length > 0) {
    state.roles.forEach(rol => {
      if (rol.procesos.length > 0) {
        rol.procesos.forEach(p => {
          if (procesos.findIndex(e => e.id === p.id) < 0) {
            procesos.push(p)
          }
        })
      }
    })
  }
  return procesos
}
