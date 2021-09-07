import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login page',
      component: () => import('@/views/login/index'),
      meta: {
        showFooter: false
      }
    },
    {
      path: '/main',
      name: 'main page',
      component: () => import('@/views/main/index'),
      meta: {
        showFooter: true
      }
    },
    {
      path: '/user',
      name: 'user page',
      component: () => import('@/views/user/index'),
      meta: {
        showFooter: true
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
