import Vue from 'vue'
import App from './App'
import router from './router'

import {Message,Input,Form,FormItem,Button} from "element-ui"
import './assets/css/global.css'
import'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'
Vue.config.productionTip = false

/* eslint-disable no-new */
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios
 Vue.use(Form)
 Vue.use(FormItem)
 Vue.use(Input)
 Vue.use(Button)
 Vue.prototype.$message = Message
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
