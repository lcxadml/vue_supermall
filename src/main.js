import Vue from 'vue'
import App from './App'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import {Message,Input,Form,FormItem,Button,Header,Main,Aside,Container,
  Menu,Submenu,MenuItem,MenuItemGroup,Breadcrumb,BreadcrumbItem,Card,
  Option,Select,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Cascader,Alert,TabPane,Tabs,Steps,Step,Checkbox,CheckboxGroup,Upload
} from "element-ui"
import './assets/css/global.css'
import'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{

  // 最后必须return config
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
 Vue.use(Breadcrumb)
 Vue.use(MenuItemGroup)
 Vue.use(BreadcrumbItem)
 Vue.use(Option)
 Vue.use(Select)
 Vue.use(Row)
 Vue.use(Col)
 Vue.use(Card)
 Vue.use(Table)
 Vue.use(TableColumn)
 Vue.use(Switch)
 Vue.use(Tooltip)
 Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
// 将富文本编辑器注册为全局可以用的组件
Vue.use(VueQuillEditor)
 Vue.prototype.$message = Message
 Vue.prototype.$confirm = MessageBox.confirm
 Vue.component('tree-table',TreeTable)
 Vue.filter('dateFormat',function(originVal){
      const dt = new Date(originVal);
     const y = dt.getFullYear();
     const m = (dt.getMonth()+1+'').padStart(2,'0');
     const d = (dt.getDate()+'').padStart(2,'0');
     const hh = (dt.getHours()+'').padStart(2,'0');
     const mm = (dt.getMinutes()+'').padStart(2,'0');
     const ss = (dt.getSeconds()+'').padStart(2,'0'); 
     return `${y}-${m}-${d}${hh}:${mm}:${ss}`
 })
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
