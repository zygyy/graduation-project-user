import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome'
import Information from '@/components/Information/information'
import Others from '@/components/Others/others'
import Kongjian from '@/components/Kongjian/kongjian'


Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home,
      redirect:"/welcome",
      children:[
        {
          path:'/welcome',
          component:Welcome,
        },
        {
          path:'/information',
          component:Information,
        },
        {
          path:'/others',
          component:Others,
        },
        {
          path:'/kongjian',
          component:Kongjian,
        }
      ]
    }
   
    
  ]
})

export default router