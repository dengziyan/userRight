import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

//全局配置
import 'normalize.css/normalize.css'
import '@/styles/index.scss' 
import 'element-ui/lib/theme-chalk/index.css'
import request from '@/utils/request'
// import './mock'
//第三方包
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en' 


Vue.use(ElementUI, { locale })
Vue.prototype.$http = request;

import '@/permission' 


if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}





Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
