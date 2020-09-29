import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import permission from './directive/permission'

import Pagination from '@/components/Pagination'
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar'

// 全局配置
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import request from '@/utils/request'

import { getDicts } from '@/api/opeData'
import { getConfigKey } from '@/api/opeConfig'
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from '@/utils/userright'

// 第三方包
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(ElementUI, { locale })
Vue.prototype.$http = request
Vue.use(permission)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import '@/icons' // icon
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
