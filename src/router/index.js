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
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/Home')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/personal',
        name: 'personal',
        component: () => import('@/views/personal/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/userList',
        name: 'userList',
        component: () => import('@/views/Authoraty/UserList'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/roleList',
        name: 'roleList',
        component: () => import('@/views/Authoraty/RoleList')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/menuList',
        name: 'menuList',
        component: () => import('@/views/Authoraty/MenuList')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/addMenu',
        name: 'addMenu',
        component: () => import('@/views/Authoraty/addMenu')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/resourceList',
        name: 'resourceList',
        component: () => import('@/views/Authoraty/ResourceList')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/allocResource',
        name: 'allocResource',
        component: () => import('@/views/Authoraty/allocResource'),
        meta: {
          keepAlive: false // 需要缓存的页面
        }
      },
      {
        path: '/resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/Authoraty/resourceCategory')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/opeDiary',
        name: 'opeDiary',
        component: () => import('@/views/System/Diary/OpeDiary')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/logDiary',
        name: 'logDiary',
        component: () => import('@/views/System/Diary/LogDiary')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/online',
        name: 'online',
        component: () => import('@/views/System/Online')
        ,meta: {
          keepAlive: true // 需要缓存的页面
        }
      }

    ]

  },
  {
    path: '/forgetPwd',
    name: 'forgetPwd',
    component: () => import('@/views/personal/forgetPwd')
    ,meta: {
      keepAlive: false // 需要缓存的页面
    }
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history', // 这一句删掉路由的#号
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
