export function changeDrawer (state) {
  state.drawer = !state.drawer
}

export function changeLogin (state, estado) {
  state.logueado = estado
}

export function changeAppFullScreen (state, value) {
  state.appFullScreen = value
}
export function setMain (state, value) {
  state.main = value
}

export function changeRoute (state, ruta) {
  state.rutaActual = ruta
}

export function openCrudTableModal (state) {
  state.crudTableModal = true
}

export function closeCrudTableModal (state) {
  state.crudTableModal = false
}

export function openCrudGridModal (state) {
  state.crudGridModal = true
}

export function closeCrudGridModal (state) {
  state.crudGridModal = false
}

export function changeUsuario (state, usuario) {
  state.usuario = usuario
}

export function changeRoles (state, roles) {
  state.roles = roles
}

export function changeDefensorias (state, defensorias) {
  state.defensorias = defensorias
}

export function changeSlims (state, slims) {
  state.slims = slims
}

export function changeSucursal (state, sucursal) {
  state.sucursal = sucursal
}

export function changeMenu (state, menu) {
  state.menu = menu
}

export function changeRol (state, rolactual) {
  state.rolactual = rolactual
}

export function changeComponente (state, componente) {
  state.componente = componente
}

export function changePermisos (state, permisos) {
  state.permisos = permisos
}

export function setListaComponente (state, listaComponentes) {
  state.listaComponentes = listaComponentes
}

export function setComponenteSeleccionado (state, componenteSeleccionado) {
  state.componenteSeleccionado = componenteSeleccionado
}

export function setSeleccionado (state, seleccionado) {
  state.seleccionado = seleccionado
}

export function setIdTipoProceso (state, idTipoProceso) {
  state.idTipoProceso = idTipoProceso
}

export function setIdTipoProcesoConfiguracion (state, idTipoProcesoConfiguracion) {
  state.idTipoProcesoConfiguracion = idTipoProcesoConfiguracion
}
