import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Router from 'vue-router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/regist', '/resetpwd'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        // 权限判定正题 ↓
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        if (hasRoles) {
          next()
        } else {
          try {
            // get user info

            // if (!store.state.permission.isAddRoutes) {
            //   await store.dispatch('permission/generateRoutes')
            // }

            const { roleId } = await store.dispatch('user/getCurrUserViewByToken')
            // 通过权限获取路由
            console.log('roleId ' + roleId)
            // console.log(sessionStorage.getItem('rid'))
            const accessRoutes = await store.dispatch('permission/generateRoutes', roleId)


            // 更新路由
            router.routes = store.getters.permission_routes
            // router.matcher = new Router().matcher
            // 动态添加可访问路由

            router.addRoutes(accessRoutes)


            // console.log(store)
            console.log(to)
            // next({ ...to, replace: true })
            next({ ...to, replace: true })

            // next()
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error relate to Token')
            next(`/login?redirect=${to.path}`)
            // next(`${to.path}`)
            NProgress.done()
          }
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
