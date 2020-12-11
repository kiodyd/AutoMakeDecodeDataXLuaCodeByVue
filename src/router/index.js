import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import DecodeDataX from '../views/DecodeDataX'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'DecodeDataX',
      component: DecodeDataX
    }
  ]
})
