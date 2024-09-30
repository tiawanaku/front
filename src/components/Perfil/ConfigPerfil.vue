<template>
  <div class="row">
    <div class="col-xs-12">
      <q-stepper flat v-model="step" ref="stepper" color="primary" animated>
        <q-step :name="1" title="Foto de perfil" caption="Elegir una foto de perfil" icon="settings" :done="step > 1">
          <div class="row q-col-gutter-md justify-center">
            <div class="col-xs-12 text-subtitle1 text-secondary">
              Cambio de foto de perfil
            </div>
            <div class="col-xs-12">
              <q-uploader accept=".jpg, image/*" no-thumbnails :factory="factoryFn" color="primary" flat bordered
                style="width: 100%;" ref="uploader" auto-upload @finish="next"/>
            </div>
            <div class="col-xs-12 col-md-6">
              <q-btn class="full-width" color="secondary" label="Seleccionar foto" @click="seleccionarArchivo()" />
            </div>
            <!-- <div class="col-xs-12 col-md-6">
              <q-btn class="full-width" color="secondary" label="Subir Foto" @click="subirFoto" />
            </div> -->
          </div>
        </q-step>
        <q-step :name="2" title="Contraseña" caption="Cambiar contraseña" icon="create_new_folder" :done="step > 2">
          <div class="row">
            <div class="col-xs-12">
              <q-form ref="formUsuario" @submit="cambiarContrasena">
                <div class="row q-col-gutter-md justify-center">
                  <div class="col-xs-12 text-subtitle1 text-secondary">
                    Cambio de contraseña
                  </div>
                  <div class="col-xs-12">
                    <q-input type="password" label="Contraseña antigua" v-model="usuario.contrasena_anterior" :rules="rulesUsuario.contrasena_anterior"></q-input>
                  </div>
                  <div class="col-xs-12">
                    <q-input type="password" label="Nueva contraseña" v-model="usuario.nueva_contrasena" :rules="rulesUsuario.nueva_contrasena"></q-input>
                  </div>
                  <div class="col-xs-12">
                    <q-input type="password" label="Repetir nueva contraseña"
                      v-model="usuario.nueva_contrasena_verificacion" :rules="rulesUsuario.nueva_contrasena_verificacion"></q-input>
                  </div>
                  <div class="col-xs-12 text-center">
                    <q-btn color="secondary" label="Cambiar contraseña" type="submit"/>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </q-step>
        <q-step :name="3" title="Finalizar" caption="" icon="create_new_folder" :done="step > 2">
          <div class="row justify-center">
            <div class="col-xs-12 text-center">
              <p class="text-h6 text-primary">Muy bien ya hemos terminado</p>
            </div>
            <div class="col-xs-10 col-sm-6 col-md-4">
              <q-img src="../../assets/check.png"></q-img>
            </div>
          </div>
        </q-step>
        <template v-slot:navigation>
          <q-stepper-navigation class="text-center">
            <q-btn @click="next" color="primary" :label="step === 3 ? 'Finalizar' : 'Continuar'" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Volver"
              class="q-ml-sm" />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </div>
</template>
<script>
import validaciones from '@common/validations'
export default {
  name: 'ConfigPerfil',
  props: {
    cerrar: {
      type: Function,
      default: () => null
    }
  },
  data () {
    return {
      step: 1,
      usuario: {
        contrasena_anterior: null,
        nueva_contrasena: null,
        nueva_contrasena_verificacion: null
      },
      rulesUsuario: {
        contrasena_anterior: [
          validaciones.requerido
        ],
        nueva_contrasena: [
          validaciones.requerido
        ],
        nueva_contrasena_verificacion: [
          validaciones.requerido
        ]
      }
    }
  },
  async mounted () {
  },
  methods: {
    factoryFn (files) {
      return {
        url: `${process.env.API_URL}usuario/foto-perfil`,
        method: 'POST',
        headers: [
          { name: 'Authorization', value: `Bearer ${this.$storage.get('token')}` }
        ]
      }
    },
    async seleccionarArchivo () {
      this.$refs.uploader.pickFiles()
    },
    async subirFoto () {
      try {
        await this.$refs.uploader.upload()
      } catch (error) {
        this.$alert.error(error.message || 'Ocurrio un error al subir su foto')
      }
    },
    async cambiarContrasena () {
      try {
        await this.$axios.put('cambiar-contrasena', this.usuario)
        await this.$refs.stepper.next()
      } catch (error) {
      }
    },
    async next () {
      try {
        if (this.step === 1) {
          this.$refs.stepper.next()
        } else if (this.step === 2) {
          this.$refs.stepper.next()
        } else if (this.step === 3) {
          const usuario = await this.$axios.post('usuario/configurar-perfil', {})
          this.$storage.set('usuario', usuario)
          this.$storage.set('rol', usuario.rol)
          this.$storage.set('menu', usuario.rol.menu)
          this.$store.commit('global/changeUsuario', usuario)
          this.$store.commit('global/changeRol', usuario.rol)
          this.$store.commit('global/changeMenu', usuario.rol.menu)
          this.cerrar()
        }
      } catch (error) {
      }
    }
  }
}
</script>
