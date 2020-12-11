// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Antd from 'ant-design-vue';

// 导入css
import 'ant-design-vue/dist/antd.css'
import XData from './components/XData.vue'

Vue.use(Antd)
Vue.component('myData',XData)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
