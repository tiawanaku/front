<template>
  <section>
    <q-banner class="bg-info text-white">
      <div class="row">
        <div class="col-xs-8">
          <p class="text-bold">Habilite/deshabilite los permisos del módulo para cada rol, donde:</p>
        </div>
        <div class="col-xs-4">
          <q-toggle v-model="toogleTrue" checked-icon="check" color="secondary" size="lg" disable label="Con permiso"
            unchecked-icon="clear" />
          <q-toggle v-model="toogleFalse" color="secondary" size="lg" disable label="Sin permiso" checked-icon="check"
            unchecked-icon="clear" />
        </div>
      </div>
    </q-banner>
    <q-markup-table flat>
      <thead>
        <tr>
          <th class="text-center" style="min-width:150px !important;"><span
              class="text-bold text-subtitle1">Roles</span></th>
          <th class="text-center"><span class="text-bold text-subtitle1">Acceso</span></th>
          <th class="text-center"><span class="text-bold text-subtitle1">Crear</span></th>
          <th class="text-center"><span class="text-bold text-subtitle1">Leer</span></th>
          <th class="text-center"><span class="text-bold text-subtitle1">Actualizar</span></th>
          <th class="text-center"><span class="text-bold text-subtitle1">Eliminar</span></th>
          <th class="text-center"><span class="text-bold text-subtitle1">CSV</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(permiso, index) of permisos" :key="index">
          <td style="min-width:150px !important;">
            <p class="text-bold">
              {{ permiso.nombre }}
            </p>
            <p style="font-size:10px;" class="text-grey">{{ permiso.descripcion }}</p>
          </td>
          <td class="text-center">
            <q-toggle color="secondary" size="lg" checked-icon="check" unchecked-icon="clear"
              v-model="permiso.permisos.access" @input="cambiarPermiso(permiso.permisos, permiso.id)"/>
          </td>
          <td class="text-center">
            <q-toggle color="secondary" size="lg" checked-icon="check" unchecked-icon="clear"
              v-model="permiso.permisos.create" @input="cambiarPermiso(permiso.permisos, permiso.id)"/>
          </td>
          <td class="text-center">
            <q-toggle color="secondary" size="lg" checked-icon="check" unchecked-icon="clear"
              v-model="permiso.permisos.read" @input="cambiarPermiso(permiso.permisos, permiso.id)"/>
          </td>
          <td class="text-center">
            <q-toggle color="secondary" size="lg" checked-icon="check" unchecked-icon="clear"
              v-model="permiso.permisos.update" @input="cambiarPermiso(permiso.permisos, permiso.id)"/>
          </td>
          <td class="text-center">
            <q-toggle color="secondary" size="lg" checked-icon="check" unchecked-icon="clear"
              v-model="permiso.permisos.delete" @input="cambiarPermiso(permiso.permisos, permiso.id)"/>
          </td>
          <td class="text-center">
            <q-toggle color="secondary" size="lg" checked-icon="check" unchecked-icon="clear"
              v-model="permiso.permisos.csv" @input="cambiarPermiso(permiso.permisos, permiso.id)"/>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </section>
</template>

<script>

export default {
  props: {
    modulo: {
      type: Object,
      default: () => {}
    },
    permisos: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      toogleTrue: true,
      toogleFalse: false
    }
  },
  methods: {
    async cambiarPermiso (permiso, idRol) {
      permiso.idRol = idRol
      let respuesta = {}
      if (permiso.id) {
        respuesta = await this.$axios.put('permiso', permiso)
      } else {
        respuesta = await this.$axios.post('permiso', permiso)
      }
      permiso.id = respuesta.id
    }
  }
}

</script>
