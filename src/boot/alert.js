import { Notify } from 'quasar'

export default async ({ app, Vue }) => {
  Vue.prototype.$alert = {
    success: (message) => {
      Notify.create({
        color: 'white',
        message,
        icon: 'done_all',
        position: 'top-right',
        classes: 'q-pa-md text-weight-bold positive_border',
        textColor: 'positive',
        actions: [
          {
            textColor: 'positive',
            icon: 'close'
          }
        ]
      })
    },
    error: (message) => {
      Notify.create({
        color: 'white',
        message,
        icon: 'error',
        position: 'top-right',
        classes: 'q-pa-md text-weight-bold negative_border',
        textColor: 'negative',
        actions: [
          {
            textColor: 'negative',
            icon: 'close'
          }
        ]
      })
    },
    warning: (message) => {
      Notify.create({
        color: 'white',
        message,
        icon: 'report_problem',
        position: 'top-right',
        classes: 'q-pa-md text-weight-bold warning_border',
        textColor: 'warning',
        actions: [
          {
            textColor: 'warning',
            icon: 'close'
          }
        ]
      })
    },
    info: (message) => {
      Notify.create({
        color: 'white',
        message,
        icon: 'report_problem',
        position: 'top-right',
        classes: 'q-pa-md text-weight-bold info_border',
        textColor: 'info',
        actions: [
          {
            textColor: 'info',
            icon: 'close'
          }
        ]
      })
    }
  }
}
