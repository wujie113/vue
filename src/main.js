import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters
import 'element-ui/lib/theme-chalk/display.css'
import './icons/iconfont.css' //使用第三方图标
import 'babel-polyfill'
// import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)
// defalut install
// import vuePicturePreview from 'rm-img-pre-lxk'
// Vue.use(vuePicturePreview)
// import preview from 'vue-photo-preview'
// import 'vue-photo-preview/dist/skin.css'
// Vue.use(preview)
import ImageViewer from '@/components/ImageViewer'
Vue.use(ImageViewer)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
import plugin from './components/plugins'
for(let i in plugin){ 
  Vue.use(plugin[i].default);
}
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
}) 
