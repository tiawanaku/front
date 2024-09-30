<template>
  <q-page>
    <Titulo
      titulo="Mi cuenta"
      icono="person"
    ></Titulo>
    <q-dialog
      v-model="modalContrasena"
      persistent
    >
      <q-card style="width: 500px; max-width: 90vw;">
        <q-toolbar class="text-secondary q-pa-md">
          <q-toolbar-title>
            <span>
              <q-icon
                name="lock"
                size="md"
              /> Cambiar contraseña
            </span>
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
          />
        </q-toolbar>
        <q-card-section>
          <q-form
            ref="formUsuario"
            @submit="guardar"
            class="row q-col-gutter-md justify-center"
          >
            <q-input
              filled
              class="col-xs-12"
              label="Contraseña antigua"
              v-model="usuario.antiguaContrasena"
              :rules="usuarioRules.antiguaContrasena"
            ></q-input>
            <q-input
              filled
              class="col-xs-12"
              label="Nueva contraseña"
              v-model="usuario.nuevaContrasena"
              :rules="usuarioRules.nuevaContrasena"
            ></q-input>
            <q-input
              filled
              class="col-xs-12"
              label="Repetir nueva contraseña"
              v-model="usuario.nuevaContrasenaVerificacion"
              :rules="usuarioRules.nuevaContrasenaVerificacion"
            ></q-input>
            <div class="col-xs-12 text-right q-gutter-sm">
              <q-btn
                icon="close"
                label="Cancelar"
                @click="cancelar()"
              />
              <q-btn
                icon="check"
                color="primary"
                label="Guardar"
                type="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card class="q-mx-md">
      <q-card-section class="bg-secondary text-white">
        <div class="row q-col-gutter-md justify-center">
          <div class="col-xs-12 col-md-4 column justify-center">
            <div class="row q-col-gutter-md justify-center">
              <div class="col-xs-12">
                <div class="text-center">
                  <q-avatar
                    size="150px"
                    color="primary"
                    v-if="global.usuario.usuario"
                  >
                    {{ global.usuario.foto_perfil ? null : global.usuario.usuario.toUpperCase().charAt(0) }}
                  </q-avatar>
                </div>
              </div>
              <div class="col-xs-12 text-subtitle1 text-secondary">
                Cambio de foto de perfil
              </div>
              <div class="col-xs-12">
                <q-uploader
                  accept=".jpg, image/*"
                  :factory="factoryFn"
                  color="secondary"
                  class="text-primary"
                  flat
                  style="width: 100%;"
                  ref="uploader"
                  @finish="actualizarData()"
                  auto-upload
                  no-thumbnails
                  v-show="false"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-md-8">
            <p class="text-h6">Datos generales</p>
            <div
              class="q-pa-md"
              style="background-color: rgba(255, 255, 255, 0.8);"
            >
              <p class="text-subtitle1 text-secondary"><span class="text-bold">Correo electronico: </span>
                {{ global.usuario.correoElectronico }}</p>
              <p class="text-subtitle1 text-secondary"><span class="text-bold">Usuario:</span> {{ global.usuario.usuario }}</p>
              <p class="text-subtitle1 text-secondary"><span class="text-bold">Nombre:</span> {{ global.usuario.nombres }} {{ global.usuario.primerApellido }} {{ global.usuario.segundoApellido }}</p>
              <span class="text-subtitle1 text-secondary"><span class="text-bold">Roles:</span>
                <li
                  v-for="(rol, index) of global.roles"
                  :key="index"
                >
                  {{ rol.nombre }}
                </li>
              </span>
              <span class="text-subtitle1 text-secondary"><span class="text-bold">DEFENSORÍAS ASIGNADAS:</span>
                <li
                  v-for="(def, index) of global.usuario.defensorias"
                  :key="index"
                >
                  {{ def.nombre }}
                </li>
              </span>
              <span class="text-subtitle1 text-secondary"><span class="text-bold">SLIMS ASIGNADOS:</span>
                <li
                  v-for="(slim, index) of global.usuario.slims"
                  :key="index"
                >
                  {{ slim.nombre }}
                </li>
              </span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          class="q-ma-xs"
          color="primary"
          icon="lock"
          @click="abrirModalCambiarContrasena"
          label="Cambiar contraseña"
        />
        <q-btn
          class="q-ma-xs"
          color="negative"
          icon="close"
          disable
          label="Desactivar cuenta"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import validaciones from '@common/validations'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      rutaImagen: process.env.BACKEND_URL,
      url: 'system/usuarios',
      modalContrasena: false,
      usuario: {},
      usuarioRules: {
        antiguaContrasena: [
          validaciones.requerido,
          validaciones.contrasena
        ],
        nuevaContrasena: [
          validaciones.requerido,
          validaciones.contrasena
        ],
        nuevaContrasenaVerificacion: [
          validaciones.requerido,
          validaciones.contrasena
        ]
      },
      fotoPerfil: null
    }
  },
  created () {
  },
  async mounted () {
    if (this.usuario.foto_perfil) {
      this.fotoPerfil = `${process.env.BACKEND_URL}/Src/Uploads/${this.usuario.foto_perfil}`
    }
  },
  computed: {
    ...mapState(['global'])
  },
  methods: {
    cancelar () {
      this.modalContrasena = false
    },
    abrirModalCambiarContrasena () {
      this.usuario = {
        id: this.$storage.get('usuario').id,
        antiguaContrasena: '',
        nuevaContrasena: '',
        nuevaContrasenaVerificacion: ''
      }
      this.modalContrasena = true
    },
    async guardar () {
      try {
        if (this.usuario.nuevaContrasena !== this.usuario.nuevaContrasenaVerificacion) {
          this.$alert.warning('La nueva contraseña y su verificacion no coinciden.')
        } else {
          await this.$axios.put(`${this.url}/cambiar-contrasena`, this.usuario)
          this.modalContrasena = false
        }
      } catch (error) {
      } finally {
        this.usuario.id = this.$storage.get('usuario').id
      }
    },
    factoryFn (files) {
      return {
        url: `${process.env.API_URL}${this.url}/foto-perfil`,
        method: 'POST',
        headers: [
          { name: 'Authorization', value: `Bearer ${this.$storage.get('token')}` }
        ]
      }
    },
    async seleccionarArchivo () {
      this.$refs.uploader.pickFiles()
    },
    async actualizarData () {
      try {
        this.$refs.uploader.removeUploadedFiles()
        const usuario = await this.$axios.post(`${this.url}/configurar-perfil`, {})
        this.$storage.set('usuario', usuario)
        this.$storage.set('rol', usuario.rol)
        this.$storage.set('menu', usuario.rol.menu)
        this.$store.commit('global/changeUsuario', usuario)
        this.$store.commit('global/changeRol', usuario.rol)
        this.$store.commit('global/changeMenu', usuario.rol.menu)
        this.$alert.success('Foto actualizada correctamente')
      } catch (error) {
      }
    }
  }

}
</script>
