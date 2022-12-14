import { getRouterNameList, getToken, getRouterList } from '@/utils/auth'
import { userStore } from '@/store'
import { addRouteList } from '@/router'
import nProgress from 'nprogress'
// 进度条
nProgress.configure({ showSpinner: false })
// 加载动画
let loading
/**
 * 路由前置拦截
 */
export function beforeEach(router) {
  router.beforeEach((to, from, next) => {
    nProgress.start()
    loading = ElLoading.service({
      text: '拼命加载中...',
    })
    const token = getToken()
    if (token) {
      if (to.path === '/login') {
        ElNotification({
          title: '已经登录',
          message: '请先退出再登录！',
          type: 'error'
        })
        return next(from.path)
      }
      // 判断路由是否存在  不存在则进入
      if (!router.hasRoute(to.name)) {
        // 判断本地是否有路由，如果有路由则是因为刷新导致路由丢失，重新渲染
        let localRouter = getRouterNameList()
        if (getRouterList() && localRouter.includes(to.path)) {
          userStore.getRouterList().then(res => {
            return next({ path: to.fullPath, replace: true, query: to.query })
          })
        } else {
          ElNotification({
            title: '路由不存在',
            message: '别瞎点了！',
            type: 'error'
          })
          return next(from.path)
        }
      } else {
        return next()
      }
    } else {
      // 判断路由是否存在
      if (!router.hasRoute(to.name)) {
        ElNotification({
          title: '路由不存在',
          message: '别瞎点了，老实登录去吧！',
          type: 'error'
        })
        return next('login')
      }
      //如果当前路由需要不登录
      if (to.meta.needLogin === false) {
        return next()
      } else {
        ElNotification({
          title: 'token过期',
          message: '请重新登录',
          type: 'error'
        })
        return next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    }
  })
}

/**
 * 路由后置拦截
 */
export function afterEach(router) {
  router.afterEach((to, from) => {
    nProgress.done()
    loading.close()
  })
}
export function guard(router) {
  beforeEach(router)
  afterEach(router)
}
