<template>
  <div
    class="col-xs-12"
    style="margin-bottom:-130px;"
  >
    <div class="">
      <!-- <div class="text-secondary"> -->
      <q-toolbar
        class="q-gutter-md q-pl-lg"
        :style="titulo==''?'height: 150px;':'height: 210px;'"
      >
        <q-toolbar-title style="margin-top:-100px;">
          <p class="text-h6">
            <q-icon
              :name="icono"
              size="md"
              style="margin-top:-5px;"
            />
            {{ titulo }}
          </p>
        </q-toolbar-title>
      </q-toolbar>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    titulo: {
      type: String,
      default: () => ''
    },
    icono: {
      type: String,
      default: () => ''
    }
  }
}
</script>
