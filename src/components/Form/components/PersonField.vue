<template>
  <div
    v-show="element?.visible"
    class="form-group form-person-container"
    :class="element?.designColumn || ''"
    role="group">
    <!-- <pre>{{ element }}</pre> -->
    <q-form @submit="verificar">
      <div class="person-header">
        <SelectField :element="element.options[0]" />
        <TextField :element="element.options[1]" :class="{ 'person-tipo-empty' : !element.options[0].visible}"/>
        <div
          :class="{ [element.options[2].designColumn]: element.options[2].designColumn }"
          class="form-group person-date">
          <label class="label-group">{{ element.options[2].label }}</label>
          <div class="form-group-advanced">
            <TextField :element="element.options[2].items[0]" />
            <SelectField :element="element.options[2].items[1]" />
            <TextField :element="element.options[2].items[2]" />
          </div>
        </div>
      </div>
      <div class="person-btns">
        <q-btn
          icon="task_alt"
          label="Validar en SEGIP"
          color="primary"
          no-caps
          padding="3px 15px"
          type="submit" />
      </div>
      <TextField v-if="render" :value="nombres" :element="element.options[3]" />
      <TextField v-if="render" :value="primerApellido" :element="element.options[4]" />
      <TextField v-if="render" :value="segundoApellido" :element="element.options[5]" />
      <div
        :class="{ [element.options[6].designColumn]: element.options[6].designColumn }"
        class="form-group">
        <div class="form-group-advanced">
          <SelectField v-if="render" :value="nacionalidad" :element="element.options[6].items[0]" />
        </div>
      </div>
      <TextField v-if="render" :value="ocupacion" :element="element.options[7]" />
      <TextField v-if="render" :value="direccion" :element="element.options[8]" />
      <TextField v-if="render" :value="telefono" :element="element.options[9]" />
      <div
        :class="{ [element.options[10].designColumn]: element.options[10].designColumn }"
        class="form-group">
        <div class="form-group-advanced">
          <SelectField v-if="render" :value="estadoCivil" :element="element.options[10].items[0]" />
        </div>
      </div>
      <RadioField v-if="render" :value="genero" :element="element.options[11]" />
    </q-form>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import TextField from './TextField'
import SelectField from './SelectField'
import RadioField from './RadioField'

const urlBase = process.env.BACKEND

const components = {
  text: 'TextField',
  select: 'SelectField',
  radio: 'RadioField'
}

export default {
  components: {
    TextField,
    SelectField,
    RadioField
  },
  props: {
    element: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    const $q = useQuasar()
    const render = ref(true)
    const nombres = ref()
    const primerApellido = ref()
    const segundoApellido = ref()
    const nacionalidad = ref()
    const ocupacion = ref()
    const direccion = ref()
    const telefono = ref()
    const estadoCivil = ref()
    const genero = ref()

    return {
      components,
      nombres,
      primerApellido,
      segundoApellido,
      nacionalidad,
      ocupacion,
      direccion,
      telefono,
      estadoCivil,
      genero,
      render,
      verificar (e) {
        const formData = new FormData(e.target)
        const data = {}

        for (const [name, value] of formData.entries()) {
          data[name] = value
        }
        const datos = {
          tipo: props.element.typeInput,
          numero_documento: data.nro_documento.split('-')[0],
          complemento: data.nro_documento.split('-')[1],
          tipo_documento: data.tipo_documento || 'CI',
          nombres: data.nombres,
          primer_apellido: data.primer_apellido,
          segundo_apellido: data.segundo_apellido,
          fecha_nacimiento: [data.anio, data.mes, data.dia].join('-'),
          lugar_nacimiento_pais: data.nacionalidad || 'BOLIVIANA'
        }
        axios.post(`${urlBase}public/persona-segip`, datos)
          .then(response => {
            if (response.data.observacion) {
              return $q.notify({
                type: 'negative',
                message: response.data.observacion
              })
            }
            if (response.data.datos?.persona) {
              const persona = response.data.datos.persona
              $q.notify({
                type: 'positive',
                message: persona.mensaje_estado
              })
              render.value = false
              nextTick(() => {
                nombres.value = persona.nombres
                primerApellido.value = persona.primer_apellido
                segundoApellido.value = persona.segundo_apellido
                nacionalidad.value = persona.nacionalidad
                genero.value = persona.genero
                render.value = true
              })
            }
          })
      }
    }
  }
}
</script>

<style lang="scss">
.person-btns {
  padding: 0px 8px 20px 10px;
  text-align: right;
  margin: -5px 0 0 0;
}
.person-header {
  & > .form-group {
    &:first-child {
      width: 25%;

      & + .form-group {
        width: 30%;
      }
    }
    &:last-child {
      width: 45%;
    }

    &.person-tipo-empty {
      width: 55% !important;
    }
  }
}
.person-date {
  .form-group {
    &:first-child {
      width: 30%;

      & + .form-group {
        width: 40%;
      }
    }
    &:last-child {
      width: 30%;
    }
  }
}
</style>
