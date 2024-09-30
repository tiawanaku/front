
async function guardApp (to, from, next) {
  if (window.localStorage.getItem('app_token')) {
    next()
  } else {
    window.localStorage.clear()
    next('/')
  }
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/OutLoginLayout.vue'),
    beforeEnter: (to, from, next) => {
      const menu = window.localStorage.getItem('app_menu')
      if (window.localStorage.getItem('app_token') && menu && window.localStorage.getItem('app_usuario')) {
        if (from.path.includes('app/')) {
          next({ path: `${JSON.parse(menu)[0].ruta}`, replace: true })
        } else {
          next({ path: `app/${JSON.parse(menu)[0].ruta}`, replace: true })
        }
      } else {
        next()
      }
    },
    children: [
      {
        path: '/',
        component: () => import('pages/Login.vue')
      }
    ]
  },
  {
    path: '/app/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: guardApp,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'entidades',
        name: 'entidades',
        component: () => import('pages/Entidades.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('pages/Roles.vue')
      },
      {
        path: 'menus',
        name: 'menus',
        component: () => import('pages/Menus.vue')
      },
      {
        path: 'permisos',
        name: 'permisos',
        component: () => import('pages/Permisos.vue')
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('pages/Usuarios.vue')
      },
      {
        path: 'parametros',
        name: 'parametros',
        component: () => import('pages/Parametros.vue')
      },
      {
        path: 'perfil',
        name: 'perfil',
        component: () => import('pages/Profile.vue')
      },
      {
        path: 'procesos',
        name: 'procesos',
        component: () => import('pages/Procesos.vue')
      },
      {
        path: 'busqueda',
        name: 'busqueda',
        component: () => import('pages/Busqueda.vue')
      },
      {
        path: 'denuncias',
        name: 'denuncias',
        component: () => import('pages/Denuncias.vue')
      },
      {
        path: 'denuncia/:uuid',
        name: 'denuncia',
        component: () => import('pages/Denuncia.vue'),
        props: true
      },
      {
        path: 'busqueda-avanzada',
        name: 'busqueda-avanzada',
        component: () => import('pages/BusquedaAvanzada.vue')
      }
    ]
  },
  {
    path: '/editor-formulario/:id',
    component: () => import('layouts/EditorLayout.vue'),
    beforeEnter: guardApp,
    children: [
      {
        path: '',
        component: () => import('pages/Administrador/EditorFormulario'),
        name: 'editor-formulario'
      }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
