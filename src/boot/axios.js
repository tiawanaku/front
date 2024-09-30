import axios from 'axios'
const protocol = window.location.protocol.replace(':', '')
const PATERN_HOST = protocol === 'https' ? /(https:\/\/|www\.)\S+/i : /(http:\/\/|www\.)\S+/i
const codigoErroresLogout = [401, 403, 404, 500, 503]
export default ({ Vue, store, router }) => {
  const Services = {
    options (url, loading = true) {
      return _http('get', url + '/fields')
    },

    get (url, id, loading = true) {
      return _http('get', url, id, loading)
    },

    post (url, data, loading = true) {
      return _http('post', url, data, loading)
    },

    put (url, data, loading = true) {
      return _http('put', url, data, loading)
    },

    patch (url, data, loading = true) {
      return _http('patch', url, data, loading)
    },

    delete (url, id, loading = true) {
      return _http('delete', url, id, loading)
    },

    remove (url, id, loading = true) {
      return this.delete(url, id, loading)
    },
    save (url, data, loading = true) {
      return _http(data.id ? 'put' : 'post', url, data, loading)
    },
    list (url, query, loading = true) {
      let string = []
      for (const i in query) {
        if (Array.isArray(query[i])) {
          for (const j of query[i]) {
            string.push(i + '=' + j)
          }
        } else {
          string.push(i + '=' + query[i])
        }
      }
      string = string.join('&')
      if (url.includes('?')) {
        query = query ? '&' + string : ''
      } else {
        query = query ? '?' + string : ''
      }
      return _http('get', url + query, {}, loading)
    },
    async register (data) {
      try {
        const respuesta = await axios.post(process.env.REGISTER_URL, data)
        return respuesta
      } catch (error) {
        Vue.prototype.$alert.error(error.response ? error.response.data.message : 'Error... try again.')
      }
    },
    async  logoutCiudadania () {
      try {
        const codigo = Vue.prototype.$storage.get('oauth2_state')
        const usuario = Vue.prototype.$storage.get('usuario')
        if (codigo && usuario) {
          const { data } = await axios.post(`${process.env.BACKEND_URL}/logout`, { usuario, codigo })
          window.location.href = data.url
        } else {
          Vue.prototype.$storage.removeUser()
          Vue.prototype.$storage.remove('menu')
          Vue.prototype.$storage.remove('token')
          Vue.prototype.$storage.remove('sidenav')
          Vue.prototype.$storage.remove('permisos')
          router.push('/login')
        }
      } catch (error) {
      }
    },
    async loginCiudadania () {
      const { data } = await axios.get(`${process.env.BACKEND_URL}/codigo`)
      if (data.codigo) {
        Vue.prototype.$storage.set('oauth2_state', data.codigo || null)
        window.location.href = data.url
      }
    },
    async auth (data) {
      try {
        const { data: respuesta } = await axios.post(`${process.env.AUTH_URL}/login`, data)
        Vue.prototype.$storage.set('token', respuesta.datos.token)
        Vue.prototype.$storage.set('usuario', respuesta.datos)
        Vue.prototype.$storage.set('menu', respuesta.datos.menu)
        Vue.prototype.$storage.set('permisos', respuesta.datos.permisos)
        Vue.prototype.$storage.set('roles', respuesta.datos.roles)
        Vue.prototype.$storage.set('defensorias', respuesta.datos.defensorias)
        Vue.prototype.$storage.set('slims', respuesta.datos.slims)
        Vue.prototype.$storage.set('dark', Vue.prototype.$storage.get('dark'))
        Vue.prototype.$storage.set('rolactual', respuesta.datos.roles.pop())
        store.commit('global/changeLogin', true)
        store.commit('global/changePermisos', respuesta.datos.permisos)
        store.commit('global/changeRoles', respuesta.datos.roles)
        store.commit('global/changeDefensorias', respuesta.datos.defensorias)
        store.commit('global/changeSlims', respuesta.datos.slims)
        store.commit('global/changeSucursal', respuesta.datos.sucursal)
        let url = '/app/'
        url += respuesta.datos.menu[0].ruta
        router.replace(url)
        Vue.prototype.$alert.success(`${respuesta.data ? respuesta.mensaje : 'Success.'}`)
        return respuesta
      } catch (error) {
        if (error.response) {
          if (error.response.data) {
            const { data } = error.response
            Vue.prototype.$alert.error(data.mensaje)
          } else {
            Vue.prototype.$alert.error('Ocurrio un error desconocido.')
          }
        } else {
          Vue.prototype.$alert.error('Ocurrio un error desconocido.')
        }
      }
    },
    async logout () {
      try {
        const theme = Vue.prototype.$storage.get('dark')
        Vue.prototype.$storage.clearAll()
        Vue.prototype.$storage.set('dark', theme)
        store.commit('global/changeLogin', false)
        router.replace('/')
      } catch (error) {
        Vue.prototype.$alert.error('Error... try again.')
      }
    },
    async refreshToken (idRol) {
      try {
        const settings = {
          method: 'POST',
          url: `${process.env.API_URL}public/refresh-token?idRol=${idRol}`,
          headers: {
            Authorization: `Bearer ${Vue.prototype.$storage.get('token')}`
          }
        }
        const respuesta = await axios(settings)
        Vue.prototype.$storage.set('token', respuesta.data.datos.token)
        Vue.prototype.$storage.set('rolactual', respuesta.data.datos.rolActual)
        Vue.prototype.$storage.set('menu', respuesta.data.datos.menu)
        Vue.prototype.$storage.set('permisos', respuesta.data.datos.permisos)
        store.commit('global/changePermisos', respuesta.data.datos.permisos)
        return respuesta
      } catch (error) {
        Vue.prototype.$alert.error(error.response ? error.response.data.message : 'Ocurrio un error desconocido.')
      }
    }
  }

  function getUrl (url, data) {
    let id = ''
    if (typeof data === 'object') {
      id = data.id
    }
    if (typeof data === 'string' || typeof data === 'number') {
      id = data
    }
    id = id ? id.toString() : ''
    if (url[url.length - 1] !== '/' && id.length > 0) {
      id = `/${id}`
    }
    return PATERN_HOST.test(url) ? `${url}${id}` : `${process.env.API_URL}${url}${id}`
  }
  async function _http (method, url, data, loading) {
    try {
      if (loading) {
        Vue.prototype.$q.loading.show({
          message: 'Cargando...'
        })
      }
      url = getUrl(url, data)
      const setting = {
        method,
        url
      }
      if (typeof data === 'object' && Object.keys(data).length) {
        delete data.id
        setting.data = data
      }
      if (Vue.prototype.$storage.exist('token')) {
        setting.headers = {
          Authorization: `Bearer ${Vue.prototype.$storage.get('token')}`
        }
      }
      const respuesta = await axios(setting)
      if (!respuesta.data) {
        throw new Error('Ocurrio un error al intentar procesar su operacion.')
      }
      // Vue.prototype.$alert.success(`${respuesta.data ? respuesta.data.message : 'Peticion dealizada con exito.'}`)
      return respuesta.data.datos
    } catch (error) {
      if (error.response) {
        Vue.prototype.$alert.error(error.response.data.mensaje ? error.response.data.mensaje : 'Ocurrio un error desconocido.')
        if (codigoErroresLogout.includes(error.response.status)) {
          await Services.logout()
        }
      } else {
        Vue.prototype.$alert.error(error.message || 'Ocurrio un error desconocido.')
      }
      throw error
    } finally {
      if (loading) {
        Vue.prototype.$q.loading.hide()
      }
    }
  }

  Vue.prototype.$axios = Services
}
