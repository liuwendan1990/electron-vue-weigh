import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  } else {
    return originalPush.call(this, location).catch(err => err)
  }
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  } else {
    return originalReplace.call(this, location).catch(err => err)
  }
}

export default new VueRouter({
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
