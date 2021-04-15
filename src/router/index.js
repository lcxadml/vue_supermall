import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate  from '../components/goods/Cate.vue'
import Params  from '../components/goods/Params.vue'
import Add  from '../components/goods/Add.vue'
import List  from '../components/goods/List.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/repoter/Report.vue'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {path:'/',redirect:'login'},
   {path:'/login',component:Login},
   {path:'/home',component:Home,
   redirect:'/welcome',
   children:[
     {path:'/welcome',component:Welcome},
     {path:'/users',component:Users},
     {path:'/rights',component:Rights},
     {path:'/roles',component:Roles},
     {path:'/categories',component:Cate},
     {path:'/Params',component:Params},
     {path:'/goods',component:List},
     {path:'/add',component:Add},
     {path:'/orders',component:Order},
     {path:'/reports',component:Report},
   ]},
   
  ] 
})
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
// to代表将要访问的路径
//from代表从哪个路径跳转而来
// next是一个函数，表示放行
//  next() 放行  next('/login')强制跳转的路径
if(to.path=='/login')return next();
// 获取token
const tokenStr = window.sessionStorage.getItem("token")
if(!tokenStr) return next('/login')
next()
})
export default router