import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
/* import componentsRouter  from './modules/components'
import chartsRouter   from './modules/charts'
import tableRouter   from './modules/table'
import nestedRouter from './modules/nested' */

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/

// constantRouterMap: 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。
// asyncRouterMap： 代表那些需求动态判断权限并通过 addRouters 动态添加的页面。
// 不需要动态判断权限的路由
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: '首页', icon: 'home', noCache: false }
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/resource',
    name: 'river',
    meta: { title: '资源管理', icon: 'kaohe' },
    alwaysShow: true,
    children: [
      
      // {
      //   path: 'river2',
      //   name: 'river2',
      //   component: () => import('@/views/res/river'),
      //   meta: { title: '河流管理', noCache: true }
      // }, {
      //   path: 'drainage',
      //   name: 'drainage',
      //   component: () => import('@/views/res/drainage'),
      //   meta: { title: '水系管理', noCache: true }
      // } ,
      {
        path: 'lakeb',
        name: 'lakeb',
        component: () => import('@/views/res/lakebase'),
        meta: { title: '湖泊区域', noCache: true }
      },
      // {
      //   path: 'duty',
      //   name: 'duty',
      //   component: () => import('@/views/res/dutyPart'),
      //   meta: { title: '责任段', noCache: true }
      // }
    ]
  },
  {
    path: '/work',
    component: Layout,
    redirect: '/work/work',
    name: 'work',
    meta: { title: '工单管理', icon: 'complaint' },
    children: [    
      {
        path: 'complaint',
        name: 'complaint',
        component: () => import('@/views/work/complaint'),
        meta: { title: '投诉管理' }
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/views/work/report'),
        meta: { title: '巡河上报' }
      },
      {
        path: 'proTask',
        name: 'proTask',
        component: () => import('@/views/work/proTask'),
        meta: { title: '任务工单' }
      }
    ]
  },
  {
    path: '/regula',
    component: Layout,
    redirect: '/regula/regula',
    name: 'regula',
    meta: { title: '巡河一张图', icon: 'kaohe' },
    children: [ 
      {
        path: 'rivergula',
        name: 'rivergula',
        component: () => import('@/views/regula/rivergula'),
        meta: { title: '河流监管' , noCache: true }
      },
      {
        path: 'rivermap',
        name: 'rivermap',
        component: () => import('@/views/regula/riverresmap'),
        meta: { title: '河流管理', noCache: true }
      },
      {
        path: 'restabmap',
        name: 'restabmap',
        component: () => import('@/views/regula/restabMap'),
        meta: { title: '资源管理', noCache: true }
      },
      {
        path: 'usermanger',
        name: 'usermanger',
        component: () => import('@/views/regula/usermanger'),
        meta: { title: '专员管理', noCache: true }
      },
      
    ]
  },
  {
    path: '/statisticalAnalysis',
    alwaysShow: true,
    component: Layout,
    redirect: '/statisticalAnalysis/statisticalAnalysis',
    name: 'statisticalAnalysis',
    meta: { title: '统计分析', icon: 'fenxi' },
    children: [
      {
        path: 'assessmentStatistics',
        name: 'assessmentStatistics',
        component: () => import('@/views/statisticalAnalysis/assessmentStatistics'),
        meta: { title: '考核统计', noCache: false }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/setting',
    name: 'setting',
    meta: { title: '系统设置', icon: 'setting' },
    children: [
      {
        path: 'areaManagement',
        name: 'areaManagement',
        component: () => import('@/views/setting/areaManagement'),
        meta: { title: '区域管理', noCache: false }
      }, {
        path: 'logManagement',
        name: 'logManagement',
        component: () => import('@/views/setting/logManagement'),
        meta: { title: '日志管理' }
      },
      {
        path: 'userManagement',
        name: 'userManagement',
        component: () => import('@/views/setting/userManagement'),
        meta: { title: '用户管理', noCache: false }
      }, {
        path: 'addressBook',
        name: 'addressBook',
        component: () => import('@/views/setting/addressBook'),
        meta: { title: '通 讯 录' }
      }, {
        path: 'msg',
        name: 'msg',
        component: () => import('@/views/setting/msg'),
        meta: { title: '通知公告' }
      },
      {
        path: 'unitRole',
        name: 'unitRole',
        component: () => import('@/views/setting/unitRole'),
        meta: { title: '单位角色', noCache: false }
      },
      // {
      //   path: 'basketball',
      //   name: 'basketball',
      //   component: () => import('@/views/demos/basketball'),
      //   meta: { title: 'NBA' }
      // }
    ]
  },

  {
    path: '/guide',
    component: Layout,
    hidden: true,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  }
]

// 需求动态判断权限并通过 addRouters 动态添加的页面
export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    hidden: true,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },

  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  {
    path: '/example',
    component: Layout,
    hidden: true,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    meta: { title: 'tab', icon: 'tab' },
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab1',
        meta: { title: 'tab1', icon: 'tab' }
      },
      {
        path: 'index2',
        component: () => import('@/views/tab/index2'),
        name: 'Tab2',
        meta: { title: 'tab2', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'log',
        component: () => import('@/views/errorLog/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    hidden: true,
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/exportExcel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/selectExcel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/uploadExcel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    hidden: true,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },

  {
    path: '/theme',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/i18n',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    hidden: false,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },

  {
    path: '/form',
    name: 'Form1',
    component: Layout,
    hidden: false,
    meta: {
      title: 'Form',
      icon: 'toushu',
      roles: ['admin']
    },
    children: [
      {
        path: 'map',
        name: 'testMap',
        component: () => import('@/views/test/map'),
        meta: { title: '地图' }
      },
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form' }
      },
      {
        path: 'demo',
        name: '示例',
        component: () => import('@/views/form/demo'),
        meta: { title: '表单示例' }
      },
      {
        path: 'gencode2',
        name: '代码自动生成',
        component: () => import('@/views/test/list'),
        meta: { title: '代码自动生成示例2' }
      },
      {
        path: 'layer',
        name: 'dialog',
        component: () => import('@/views/form/layer'),
        meta: { title: 'dialog' }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    hidden: false,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'documentation', icon: 'documentation', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
  base: 'hzmis'
})
