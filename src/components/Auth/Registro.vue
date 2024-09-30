<template>
  <div class="row">
    <div class="col-xs-12 no-padding">
      <q-tab-panels v-model="step" animated class="no-padding">
        <q-tab-panel :name="1" flat class="no-padding">
          <div class="row">
            <div class="col-xs-12 float-right">
              <div class="float-right">
                <span class="text-positive text-bold text-subtitle1"> Paso 1 de 2 </span>
                <q-btn @click="step++" round color="positive" icon="arrow_forward" />
              </div>
            </div>
            <div class="col-xs-12">
              <p class="text-h5 text-center text-bold text-secondary">PAGO POR DEPÓSITO O TRANSFERENCIA BANCARIA</p>

              <p class="text-subtitle1 text-justify text-grey-7">
                Para inscribirse debe realizar el pago o transferencia bancaria a la cuenta.

              </p>
              <p class="text-subtitle1 text-justify text-grey-7">
                A nombre de:
              </p>

              <p class="text-center text-subtitle1 text-bold">
                Mabel Ticona Monasterio 4610391-SC
              </p>
              <p class="text-center text-subtitle1 text-bold">
                Representante EDUCENTER Bolivia

              </p>
              <p class="text-subtitle1">
                Banco BISA (SC) – Caja de Ahorro en Bs.

              </p>
              <p class="text-h5 text-center text-bold">
                201-50688958-2-48
              </p>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel :name="2" class="no-padding">
          <q-form ref="usuario" @submit="guardar">
            <div class="row">
              <div class="col-xs-12 float-left" v-if="informacionCuenta">
                <div class="float-left">
                  <q-btn @click="step--" round color="positive" icon="arrow_back" class="" />
                  <span class="text-positive text-bold text-subtitle1"> Paso 2 de 2</span>
                </div>
              </div>
              <div class="col-xs-12 text-center">
                <span class="text-h6 text-center text-info text-weight-regular"> Registro de usuario </span>
              </div>
              <div class="col-xs-12">
                <q-input color="info" label="Nombre completo" v-model="usuario.persona.nombres"
                  :rules="rulesUsuario.persona.nombres">
                  <template v-slot:append>
                    <q-icon name="people" color="info" />
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12">
                <q-input v-model="usuario.persona.celular" ref="usuario" label="Celular"
                  :rules="rulesUsuario.persona.celular" :prefix="prefixNumber">
                  <template v-slot:append>
                    <q-icon name="phonelink_ring" color="info" />
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12">
                <q-input color="info" label="Correo electronico" placeholder="Ej: correo@gmail.com"
                  v-model="usuario.persona.correo_electronico" :rules="rulesUsuario.persona.correo_electronico">
                  <template v-slot:append>
                    <q-icon name="email" color="info" />
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12">
                <q-input color="info" label="Contraseña" :type="isPwd ? 'password' : 'text'" placeholder="Ej: X123ABX-1"
                  v-model="usuario.contrasena" :rules="rulesUsuario.contrasena">
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" color="info" />
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12">
                <q-btn color="info" type="submit" size="md" class="full-width q-ma-md" label="Registrarme"
                  :disable="disabled" />
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel :name="3">
          <div class="row justify-center">
            <div class="col-xs-12">
              <p class="text-h4 text-center">Registro realizado con exito</p>
            </div>
            <div class="col-xs-10 col-sm-6 col-md-4">
              <q-img src="../../assets/check.png"></q-img>
            </div>
            <div class="col-xs-12">
              <p class="text-h6 text-justify">Recibirás en la dirección de correo electrónico proporcionada, un email
                con un link de activación de cuenta.</p>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import paises from '@common/paises'
import validaciones from '@common/validations'
export default {
  data () {
    return {
      step: 2,
      informacionCuenta: true,
      paises: paises.paises,
      disabled: false,
      isPwd: true,
      prefixNumber: null,
      usuario: {
        id_rol: 3,
        contrasena: '',
        persona: {
          nombres: '',
          correo_electronico: '',
          pais: '',
          celular: ''
        }
      },
      rulesUsuario: {
        contrasena: [
          validaciones.requerido,
          validaciones.contrasena
        ],
        persona: {
          correo_electronico: [
            validaciones.requerido,
            validaciones.correo
          ],
          nombres: [
            validaciones.requerido
          ],
          celular: [
            validaciones.requerido,
            validaciones.telefono
          ]
        }
      }
    }
  },
  async mounted () {
    const { codigo } = this.$route.query
    if (codigo) {
      this.step = 1
      this.usuario.codigo = codigo
    } else {
      this.informacionCuenta = false
    }
    const respuesta = await axios.get('https://ipapi.co/json')
    this.usuario.persona.pais = respuesta.data.country_name
    this.prefixNumber = respuesta.data.country_calling_code
  },
  methods: {
    async guardar () {
      this.$q.loading.show({ message: 'Loading...' })
      this.usuario.correo_electronico = this.usuario.persona.correo_electronico
      this.usuario.usuario = this.usuario.persona.correo_electronico
      try {
        if (await this.$refs.usuario.validate()) {
          const init = {
            url: `${process.env.BACKEND_URL}/public/registro`,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.STATIC_TOCKEN}`
            },
            data: this.usuario
          }
          const respuesta = await axios(init)
          this.step = 3
          this.$alert.success(`${respuesta.data ? respuesta.data.datos : 'Success.'}`)
        } else {
          throw new Error('EL Formulario no esta correctamente llenado.')
        }
      } catch (error) {
        this.$alert.error(error.response ? error.response.data.message : 'Error... try again.')
      } finally {
        this.$q.loading.hide()
      }
    }
  }
}
</script>
