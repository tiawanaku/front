<template>
  <q-layout view="lHh lpR lff">

    <q-header :class="{ 'bg-primary': ! $q.dark.isActive, 'q-dark': $q.dark.isActive }">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          :color="!$q.dark.isActive ? 'white' : ''"
          @click="toggleLeftDrawer"
        />
        <q-btn
          dense
          flat
          round
          class="text-white"
          :icon="mini?'keyboard_arrow_right':'keyboard_arrow_left'"
          color="white"
          @click="toogleMini"
        />
        <q-space />
        <q-space />
        <q-toggle
          v-model="darkMode"
          icon="dark_mode"
          @input="darkModeChange"
        />
        <!-- <q-btn
          icon="auto_stories"
          flat
          round
          @click="irTutoriales"
        >
          <q-tooltip
            content-class="bg-info text-body2"
            anchor="center left"
            self="center right"
          >
            Manuales y tutoriales
          </q-tooltip>
        </q-btn> -->
        <q-item
          clickable
          v-ripple
        >
        <q-item-section v-if="usuario" class="flex flex-col items-start">
          <div class="flex items-center">
            <q-avatar class="mr-2 ml-2">
              <img :src="require('../assets/person.jpg')" alt="Avatar">
            </q-avatar>
            <div>
              {{ usuario.nombres }} - {{ global.rolactual.nombre }}
            </div>
            <q-icon name="arrow_drop_down" class="mt-1" />
          </div>
        </q-item-section>
          <q-menu
            anchor="bottom right"
            self="top right"
          >
            <q-list style="min-width: 300px">
              <q-item class="text-secondary">
                <q-item-section>
                  <div class="row">
                    <div class="col-xs-2 column justify-center">
                      <q-avatar
                        color="primary text-white"
                        style="vertical-align: middle"
                        v-if="usuario.usuario"
                      >
                        {{
                            usuario.foto_perfil
                              ? ""
                              : usuario.usuario.toUpperCase().charAt(0)
                          }}
                        <img
                          v-if="usuario.foto_perfil"
                          :src="`${rutaImagen}/Src/Uploads/${usuario.foto_perfil}`"
                          style="max-width: 80px"
                        />
                      </q-avatar>
                    </div>
                    <div class="col-xs-10 q-pl-md">
                      <p class="text-h6">

                      </p>
                      <p class="text-weight-regular">
                        <q-icon name="people" /> {{ usuario.usuario }}
                      </p>
                      <p class="text-weight-regular">
                        <q-icon name="person" /> {{ usuario.nombres }} {{ usuario.primerApellido }} {{ usuario.segundoApellido }}
                      </p>
                      <p class="text-weight-regular">
                        <q-icon name="email" />
                        {{ usuario.correoElectronico }}
                      </p>
                      <!-- <p class="text-weight-regular">
                        <q-icon name="group" /> Roles
                      </p>
                      <li
                        class="q-ml-md"
                        v-for="(rol, index) of global.roles"
                        :key="index"
                      >
                        {{ rol.nombre }}
                      </li> -->
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-item
                v-for="rol in global.roles"
                :key="rol.id"
                clickable
                v-ripple
                v-close-popup
                @click="cambiarRol(rol)"
              >
                <q-item-section avatar>
                  <q-icon
                    color="primary"
                    name="person"
                    v-if="rol.id == global.rolactual.id"
                  />
                </q-item-section>
                <q-item-section>{{rol.nombre}}</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="$router.replace('/app/perfil')"
              >
                <q-item-section avatar>
                  <q-icon
                    color="primary"
                    name="person_outline"
                  />
                </q-item-section>
                <q-item-section>Mi cuenta</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                v-close-popup
                @click="logout"
              >
                <q-item-section avatar>
                  <q-icon
                    color="primary"
                    name="exit_to_app"
                  />
                </q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
      </q-toolbar>
      <q-drawer
        show-if-above
        v-model="leftDrawerOpen"
        side="left"
        bordered
        :breakpoint="700"
        class="aside-dark"
        :width="250"
        :mini="mini"
      >
        <div class="text-center">
          <!-- <p class="text-white text-h6 q-mt-md">
            <q-icon
              name="gavel"
              size="sm"
            /> GAMEA
          </p> -->
          <div
            class="text-center q-pt-md"
            v-if="!mini"
          >
            <!-- <q-avatar
              v-if="usuario.nombres"
              size="64px"
              font-size="42px"
              color="info"
              text-color="white"
            >
              {{ usuario.nombres[0].toUpperCase() }}

            </q-avatar>
            <div class="text-weight-bold text-white q-mt-sm">{{ usuario.nombres }}</div>
            <div>{{ usuario.correoElectronico }}</div> -->
            <q-img :src="require('../assets/logo.png')"></q-img>
          </div>
          <div v-else>
            <q-avatar
              v-if="usuario.nombres"
              size="40px"
              font-size="35px"
              color="info"
              text-color="white"
              class="q-my-md"
            >
              <q-tooltip
                anchor="center end"
                self="center start"
                class="bg-info text-white text-body2"
              >
                {{ `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}` }}
              </q-tooltip>
              {{ usuario.nombres[0].toUpperCase() }}
            </q-avatar>
          </div>
        </div>
        <q-list
          padding
          v-if="global.menu.length"
        >
          <q-item-label
            header
            class="text-white"
          >Menu</q-item-label>
          <q-item
            v-for="item in global.menu"
            :key="item.ruta"
            :active="esSeleccionado(item)"
            clickable
            v-ripple
            active-class="bg-accent text-white"
            @click="$router.push(`/app/${item.ruta}`)"
          >
            <q-item-section avatar>
              <q-icon
                :name="item.icono"
                :color="esSeleccionado(item) ? 'white' : 'black'"
              >
                <q-tooltip
                  v-if="mini"
                  anchor="center end"
                  self="center start"
                  content-class="bg-secondary text-white text-body2"
                >
                  {{ item.nombre }}
                </q-tooltip>
              </q-icon>
              <q-badge
                v-if="['Bandeja'].includes(item.nombre)"
                color="red"
                floating
                class="q-mr-sm q-mt-sm q-px-xs"
              >
                {{cantidadBandeja}}
              </q-badge>
            </q-item-section>
            <q-item-section :class="esSeleccionado(item) ? 'text-white' : 'text-black'">
              {{ item.nombre }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </q-header>

    <q-page-container>
      <router-view class="layout-view" />
    </q-page-container>

    <q-footer class="bg-secondary q-footer-main">
      <q-toolbar>
        <q-toolbar-title>
          <div class="footer text-white">
            © GAMEA {{ new Date().getFullYear() }}
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>
<script>
import { mapState } from 'vuex'
export default {
  components: {
  },
  name: 'MainLayout',
  data () {
    return {
      dialogcambiarRol: false,
      rutaImagen: process.env.BACKEND_URL,
      leftDrawerOpen: this.$q.platform.is.desktop,
      usuario: [],
      configurarPerfil: false,
      notificaciones: [],
      mostrarNotificaciones: false,
      notificacion: 1,
      darkMode: false,
      mini: false
    }
  },
  computed: {
    ...mapState(['global'])
  },
  created () {
    this.usuario = this.$storage.get('usuario')
    this.$store.commit('global/changeUsuario', this.$storage.get('usuario'))
    this.$store.commit('global/changeRoles', this.$storage.get('roles'))
    this.$store.commit('global/changeRol', this.$storage.get('rolactual'))
    this.$store.commit('global/changeMenu', this.$storage.get('menu'))
    this.$store.commit('global/changePermisos', this.$storage.get('permisos'))
    this.configurarPerfil = this.usuario.configurar_perfil
    this.$q.dark.set(this.$storage.get('dark'))
  },
  methods: {
    esSeleccionado (item) {
      return (this.$route.path.includes(item.ruta) && item.ruta !== '') || (item.ruta === '' && this.$route.path === '/')
    },
    toogleMini () {
      this.leftDrawerOpen = true
      this.mini = !this.mini
    },
    irTutoriales () {
      window.open(
        'https://drive.google.com/drive/folders/1_xMR58ZYzg28z4nhkTS-JTOE5fof03M5',
        '_blank'
      )
    },
    darkModeChange () {
      this.$storage.set('dark', !this.$q.dark.isActive)
      this.$q.dark.toggle()
    },
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    cancelar () {
      this.mostrarNotificaciones = false
    },
    refresh () {
      this.$store.commit('global/setMain', false)
      this.$nextTick(() => {
        this.$store.commit('global/setMain', true)
      })
    },
    logout () {
      this.$axios.logout()
    },
    async gotToPage (item) {
      if (this.$route.name !== item.ruta) {
        this.$router.push({ name: item.ruta })
      }
    },
    cerrarModal () {
      this.configurarPerfil = false
    },
    async cambiarRol (rol) {
      const respuesta = await this.$axios.refreshToken(rol.id)
      this.$storage.set('rolactual', rol)
      this.$store.commit('global/changeRol', rol)
      this.$storage.set('menu', respuesta.data.datos.menu)
      this.$store.commit('global/changeMenu', respuesta.data.datos.menu)
      this.$storage.set('permisos', respuesta.data.datos.permisos)
      this.$store.commit('global/changePermisos', respuesta.data.datos.permisos)
      this.dialogcambiarRol = false
      /* if (respuesta.data.datos.menu[0]) {
        await this.$router.replace(respuesta.data.datos.menu[0].ruta).catch(() => {})
      } */
      window.location.reload()
    }
  }
}
</script>

<style lang="scss">
$aside: #1e1e2d;
$aside-dark: #ffffff;
$height: 190px;

.q-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: $aside-dark !important;
}

.aside-dark {
  background-color: $aside;
  color: #9899ac;

  .aside-scroll {
    height: calc(100% - 190px);
    margin-top: $height;
  }

  .aside-header {
    height: $height;
    background-color: $aside-dark;
  }

  .aside-title {
    color: white;
    margin: 0;
    font-size: 1.4rem;
    font-weight: bold;
    // text-align: center;
    line-height: 3.2rem;
    background: #1b1b28 !important;
    padding: 0 28px;
  }

  .aside-email {
    font-size: 0.75rem;
  }

  .q-item {
    padding: 6px 25px;
    min-height: 46px;

    &.q-router-link,
    &:hover {
      transition: color 0.2s ease, background-color 0.2s ease;
      background-color: $aside-dark;

      .q-item__section {
        color: white;
      }

      .q-icon {
        color: $primary;
      }
    }

    .q-item__section--avatar {
      padding-right: 10px;
      min-width: 40px;
    }

    &.q-hoverable:hover {
      & > .q-focus-helper {
        opacity: 0;
      }
    }

    .q-icon {
      color: #494b74;
    }
  }
}
</style>
