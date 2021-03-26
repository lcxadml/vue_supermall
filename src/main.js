import Vue from 'vue'
import App from './App'
import router from './router'

import {Message,Input,Form,FormItem,Button,Header,Main,Aside,Container,
  Menu,Submenu,MenuItem,MenuItemGroup} from "element-ui"
import './assets/css/global.css'
import'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'
Vue.config.productionTip = false

/* eslint-disable no-new */
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  console.log(config);
  // 最后必须return config
  console.log(sessionStorage.getItem('token'));
  config.headers.Authorization = sessionStorage.getItem('token');
  return config
})
Vue.prototype.$http = axios
 Vue.use(Form)
 Vue.use(FormItem)
 Vue.use(Input)
 Vue.use(Button)
 Vue.use(Header)
 Vue.use(Main)
 Vue.use(Aside)
 Vue.use(Container)
 Vue.use(Menu)
 Vue.use(Submenu)
 Vue.use(MenuItem)
 Vue.use(MenuItemGroup)

 Vue.prototype.$message = Message
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
