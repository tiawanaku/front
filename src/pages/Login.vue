<template>
  <div class="app-login">
    <div class="app-login__background"></div>
    <div class="app-login__background_2"></div>
    <q-page
      class="column justify-center"
      style="z-index:100;"
    >
      <div class="row justify-center q-pa-md">
        <div class="col-xs-12 col-sm-10 col-md-8">
          <auth :metodo="'login'"></auth>
        </div>
      </div>
    </q-page>
  </div>
</template>
<script>
import Auth from '@components/Auth/Auth'
export default {
  components: {
    Auth
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
.app-login {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .app-login__background {
    width: 100%;
    background: #eceff1 url("../assets/background.jpg") no-repeat;
    filter: blur(1px);
    position: fixed;
    background-size: cover;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .app-login__background_2 {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    background-size: cover;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
}
</style>
