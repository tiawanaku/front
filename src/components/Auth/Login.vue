<template>
  <div>
    <q-form
      ref="formLogin"
      @submit="login"
    >
      <div class="row">
        <div class="col-xs-12">
          <p
            class="text-h6 text-primary text-weight-bold"
            color="primary"
          >
            Inicio de Sesión
          </p>
        </div>
        <div class="col-xs-12">
          <q-input
            square
            v-model="formLogin.usuario"
            ref="usuario"
            label="Usuario"
            :rules="rulesLogin.usuario"
            filled
          >
            <template v-slot:append>
              <q-icon
                name="people"
                color="primary"
              />
            </template>
          </q-input>
        </div>
        <div class="col-xs-12">
          <q-input
            filled
            v-model="formLogin.contrasena"
            :type="isPwd ? 'password' : 'text'"
            label="Contraseña"
            :rules="rulesLogin.contrasena"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                color="primary"
              />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 text-center">
          <q-btn
            color="primary"
            type="submit"
            size="md"
            class="full-width q-ma-md"
            label="Ingresar"
            :disable="disabled"
          />
        </div>
        <div class="col-xs-12 text-center q-mt-md">
          GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO - {{ new Date().getFullYear() }}
        </div>
        <div class="col-xs-12 text-center q-mt-md">
          CON EL APOYO DE <q-img :src="require('../../assets/ijm.png')" style="max-width:40px;" />
        </div>
        <!--
        <div class="col-xs-12 text-center">
          Ó
        </div>
        <div class="col-xs-12">
          <q-btn
            color="secondary"
            size="md"
            class="full-width q-ma-md"
            label="Ingresar con ciudadania"
            @click="loginCiudadania"
          />
        </div>
        -->
      </div>
    </q-form>
  </div>
</template>
<script>
import validaciones from '@common/validations'
import axios from 'axios'
export default {
  data () {
    return {
      disabled: false,
      isPwd: true,
      formLogin: {
        // usuario: '9248643@yopmail.com',
        // contrasena: 'Developer'
        usuario: '',
        contrasena: ''
      },
      rulesLogin: {
        usuario: [
          validaciones.requerido,
          validaciones.formatoCorrecto
        ],
        contrasena: [validaciones.requerido, validaciones.contrasena]
      }
    }
  },
  async mounted () {
    try {
      const { code, codigo, unlockcode, recuperationcode } = this.$route.query
      if (unlockcode || recuperationcode) {
        const init = {
          url: `${process.env.BACKEND_URL}/public/confirmacion?code=${unlockcode || recuperationcode
            }`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.STATIC_TOCKEN}`
          }
        }
        const respuesta = await axios(init)
        this.$alert.success(`${respuesta.data ? respuesta.data : 'Success.'}`)
        this.$router.replace({ query: null })
      }

      if (code) {
        this.formLogin.codigo = code
        await this.$axios.auth(this.formLogin)
      }

      if (codigo) {
        this.formLogin.url_inicio = `curso?codigo=${codigo}`
      }
    } catch (error) { }
  },
  methods: {
    async loginCiudadania () {
      this.$axios.loginCiudadania()
    },
    async login () {
      this.disabled = true
      try {
        if (await this.$refs.formLogin.validate()) {
          await this.$axios.auth(this.formLogin)
        } else {
          this.$alert.error('EL Formulario no esta correctamente llenado.')
        }
      } catch (error) {
        this.$alert.error(error.message)
      } finally {
        this.disabled = false
      }
    }
  }
}
</script>
