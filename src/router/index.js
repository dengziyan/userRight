import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: () => import('@/views/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/Home')
      },
      {
        path: '/userList',
        name: 'userList',
        component: () => import('@/views/Authoraty/UserList')
      },
      {
        path: '/roleList',
        name: 'roleList',
        component: () => import('@/views/Authoraty/RoleList')
      },
      {
        path: '/menuList',
        name: 'menuList',
        component: () => import('@/views/Authoraty/MenuList')
      },
      {
        path: '/resourceList',
        name: 'resourceList',
        component: () => import('@/views/Authoraty/ResourceList')
      },
      {
        path: '/opeDiary',
        name: 'opeDiary',
        component: () => import('@/views/System/Diary/OpeDiary')
      },
      {
        path: '/logDiary',
        name: 'logDiary',
        component: () => import('@/views/System/Diary/LogDiary')
      },
      {
        path: '/online',
        name: 'online',
        component: () => import('@/views/System/Online')
      },
      {
        path: '/personal',
        name: 'personal',
        component: () => import('@/views/personal/index')
      }
    ]

  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
