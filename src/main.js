// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import App from './App'
import router from './router'
import MyServerHttp from '@/plugins/http.js'
import moment from 'moment'
// import axios from 'axios'
// Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.use(MyServerHttp)
// Vue.use(axios)
// 全局过滤器
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
