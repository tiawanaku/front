<template>
  <div>
    <q-tab-panels
      v-model="method"
      animated
      flat
      :class="method"
    >
      <q-tab-panel name="login">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 text-center">
            <span class="text-primary text-h6">G.A.M.E.A.</span>
          </div>
          <div class="col-12 text-center">
            <q-img :src="require('../../assets/logoGamea.png')" style="max-width:300px;" />
          </div>
          <div class="col-xs-12">
            <Login></Login>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="registro">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12">
            <Registro></Registro>
          </div>
          <div class="col-xs-12 text-center no-padding">
            <q-btn
              class="text-accent"
              flat
              no-caps
              label="Olvide mi contraseña"
              @click="method = 'recuperarContrasena'"
            />
          </div>
          <div class="col-xs-12 text-center no-padding">
            <span class="text-grey-8 text-weight-bol">¿Ya tienes una cuenta?</span>
            <q-btn
              class="text-primary"
              no-caps
              flat
              label="Iniciar sesión"
              @click="method = 'login'"
            />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="recuperarContrasena">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12">
            <RecuperarContrasena></RecuperarContrasena>
          </div>
          <div class="col-xs-12 text-center no-padding">
            <q-btn
              class=" text-primary"
              no-caps
              flat
              label="Iniciar sesión"
              @click="method = 'login'"
            />
          </div>
          <div class="col-xs-12 text-center no-padding">
            <span class="text-grey-8 text-weight-bol">¿No tienes una cuenta?</span>
            <q-btn
              class="text-info"
              flat
              no-caps
              label="Regístrate"
              @click="method = 'registro'"
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import Login from './Login'
import Registro from './Registro'
import RecuperarContrasena from './RecuperarContrasena'
export default {
  components: {
    Login,
    Registro,
    RecuperarContrasena
  },
  props: {
    metodo: {
      type: String,
      default: () => 'login'
    }
  },
  data () {
    return {
      method: 'login'
    }
  },
  mounted () {
    this.method = this.metodo
  }
}
</script>
