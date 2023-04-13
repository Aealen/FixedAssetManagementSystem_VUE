import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/regist',
    component: () => import('@/views/regist/index'),
    hidden: false
  },
  {
    path: '/resetpwd',
    component: () => import('@/views/resetPwd/index'),
    hidden: false
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',

      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  }

]

export const asyncRoutes = [

  {
    path: '/user',
    component: Layout,
    redirect: '/user/table',

    meta: { title: '用户管理', icon: 'el-icon-s-help', roles: ['1'] },
    children: [
      {
        path: 'list',

        component: () => import('@/views/UserManage/index'),
        meta: { title: '用户列表', icon: 'table', roles: ['1'] }
      }
    ]
  },
  {
    path: '/fa',
    component: Layout,
    redirect: '/fa/table',

    meta: { title: '资产管理', icon: 'el-icon-s-help', roles: ['1'] },
    children: [
      {
        path: 'list',

        component: () => import('@/views/FAManage/index'),
        meta: { title: '资产列表', icon: 'table', roles: ['1'] }
      },
      {
        path: 'add',

        component: () => import('@/views/FAManage/AddFa/index'),
        meta: { title: '新增资产', icon: 'table', roles: ['1'] }
      },
      {
        path: 'typelist',

        component: () => import('@/views/FAManage/TypeList/index'),
        meta: { title: '资产类别', icon: 'table', roles: ['1'] }
      },
      {
        path: 'deptlist',

        component: () => import('@/views/FAManage/DeptList/index'),
        meta: { title: '部门管理', icon: 'table', roles: ['1'] }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/table',

    meta: { title: '订单管理', icon: 'el-icon-s-help', roles: ['1', '2', '3', '4'] },
    children: [
      {
        path: 'list',

        component: () => import('@/views/OrderManage/index'),
        meta: { title: '订单列表', icon: 'table', roles: ['1', '4'] }
      },
      {
        path: 'addOrder',

        component: () => import('@/views/ReporterModule/AddOrder/index'),
        meta: { title: '新增订单', icon: 'table', roles: ['1', '2'] }
      },
      {
        path: 'reporterOrderList',
        component: () => import('@/views/ReporterModule/OrderList/index'),
        meta: { title: '我的订单', icon: 'table', roles: ['1', '2', '3'] }
      },
      {
        path: 'verifyOrder',

        component: () => import('@/views/CustodianModule/VerifyOrder/index'),
        meta: { title: '订单审核', icon: 'table', roles: ['1', '4'] }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/table',

    meta: { title: '系统日志', icon: 'el-icon-s-help', roles: ['1'] },
    children: [
      {
        path: 'list',

        component: () => import('@/views/SysLogModule/index'),
        meta: { title: '系统日志', icon: 'table', roles: ['1'] }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/Aealen/FixedAssetManagementSystem',
        meta: { title: '项目仓库', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
