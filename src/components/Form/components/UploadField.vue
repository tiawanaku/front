<template>
  <div
    class="form-group"
    :class="element?.designColumn || ''"
    role="group">
    <q-uploader
      :id="element.name"
      :url="element.url"
      :label="element.label"
      :field-name="element.name"
      :multiple="element.multiple"
      :accept="element?.typeInput ? '.jpg, image/*' : ''"
      :max-files="element.max ? element.max : 10"
      :max-file-size="element.maxlength ? element.maxlength * 1024 * 1024 : 100 * 1024 * 1024"
      @rejected="onRejected"
      :ref="name">
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
            <q-tooltip>Clear All</q-tooltip>
          </q-btn>
          <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat >
            <q-tooltip>Remove Uploaded Files</q-tooltip>
          </q-btn>
          <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
          <div class="col">
            <div class="q-uploader__title">{{ element.label }}</div>
            <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
          </div>
          <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" round dense flat>
            <q-uploader-add-trigger />
            <q-tooltip>Pick Files</q-tooltip>
          </q-btn>
          <q-btn v-if="scope.canUpload" :id=" `btn-upload-${element.name}`" icon="cloud_upload" @click="scope.upload" round dense flat >
            <q-tooltip>Upload Files</q-tooltip>
          </q-btn>

          <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
            <q-tooltip>Abort Upload</q-tooltip>
          </q-btn>
        </div>
      </template>
    </q-uploader>
  </div>
</template>

<script>
import { toRef, ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  props: {
    element: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    const name = toRef(props.element, 'name')
    const value = ref('')
    const $q = useQuasar()

    console.log('upload', props.element)

    function onRejected (rejectedEntries) {
      console.log('error upload', rejectedEntries)
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} el/los archivo(s) no pasaron las restricciones de validación`
      })
    }

    return {
      name,
      value,
      onRejected
    }
  }
}
</script>

<style lang="scss">
.form-group {
  .q-uploader {
    width: 100%;
  }
}
</style>
