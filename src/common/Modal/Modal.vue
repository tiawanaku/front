<template>
  <q-dialog v-model="$store.state.global.globalModal" persistent>
    <q-card>
      <q-toolbar>
        <q-avatar color="primary">
          <img src="https://cdn.quasar-framework.org/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
       <slot name="contentModal"></slot>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
