export default ({ Vue }) => {
  const prefix = 'app'
  Vue.prototype.$storage = {
    get (keyName) {
      if (localStorage.getItem(`${prefix}_${keyName}`)) {
        try {
          return JSON.parse(localStorage.getItem(`${prefix}_${keyName}`))
        } catch (error) {
          return localStorage.getItem(`${prefix}_${keyName}`)
        }
      }
      return null
    },
    existUser () {
      return this.exist('user')
    },
    removeUser () {
      this.remove('user')
    },
    remove (key) {
      localStorage.removeItem(`${prefix}_${key}`)
    },
    destroy (key) {
      this.remove(`${prefix}_${key}`)
    },
    set (keyName, keyValue) {
      localStorage.setItem(`${prefix}_${keyName}`, JSON.stringify(keyValue))
    },
    setUser (user) {
      this.set('user', user)
    },
    getUser () {
      return this.get('user')
    },
    exist (keyName) {
      const existe = localStorage.getItem(`${prefix}_${keyName}`)
      if (existe) {
        try {
          return JSON.parse(existe)
        } catch (error) {
          return existe
        }
      } else {
        return false
      }
    },
    clearAll () {
      localStorage.clear()
    }
  }
}
