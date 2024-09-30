import Vue from 'vue'
import Vuex from 'vuex'
import * as VueGoogleMaps from 'vue2-google-maps'
import global from './global'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDWfhkbkuAlTm08GKlCAUcINKqXUSTdzqE',
    libraries: 'places' // This is required if you use the Autocomplete plugin
  }
})

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      global
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
