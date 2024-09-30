<template>
  <div>
    <q-form ref="formLogin" @submit="solicitarContrasena">
      <div class="row">
        <div class="col-xs-12">
          <p class="text-h6 text-accent text-weight-regular"> Recordar contraseña </p>
        </div>
        <div class="col-xs-12">
          <q-input color="accent" square v-model="formLogin.usuario" ref="usuario" label="Correo electrónico" :rules="rulesLogin.usuario">
            <template v-slot:append>
              <q-icon name="email" color="accent" />
            </template>
          </q-input>
        </div>
        <div class="col-xs-12">
          <q-btn color="accent" type="submit" size="md" class="full-width q-ma-md" label="Solicitar nueva contraseña"
            :disable="disabled" />
        </div>
      </div>
    </q-form>
  </div>
</template>
<script>
import axios from 'axios'
import validaciones from '@common/validations'
export default {
  data () {
    return {
      disabled: false,
      isPwd: true,
      formLogin: {
        // usuario: '9248643@yopmail.com'
        usuario: ''
      },
      rulesLogin: {
        usuario: [
          validaciones.requerido,
          validaciones.correo
        ]
      }
    }
  },
  methods: {
    async solicitarContrasena () {
      try {
        const init = {
          url: `${process.env.BACKEND_URL}/public/reestablecer`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.STATIC_TOCKEN}`
          },
          data: this.formLogin
        }
        const respuesta = await axios(init)
        this.$alert.success(`${respuesta.data ? respuesta.data.datos : 'Success.'}`)
      } catch (error) {
        this.$alert.error(error.response ? error.response.data.message : 'Error... try again.')
      }
    }
  }
}
</script>
