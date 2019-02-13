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
// 图片预览
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
// 视频流直播

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
require('videojs-contrib-hls/dist/videojs-contrib-hls')
import VideoPlayer from 'vue-video-player'
// 视频直播 - 结束

Vue.use(VideoPlayer)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
// defalut install

Vue.use(Element, {
  size: 'mini', // set element-ui default size ----medium
  i18n: (key, value) => i18n.t(key, value)
})
import plugin from './components/plugins'
for (const i in plugin) {
  Vue.use(plugin[i].default)
}
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
const Foo = window.add
Vue.prototype.Foo = Foo
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
}) 
