// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store";
import ElementUI from 'element-ui';
// import echarts from 'echarts'
import * as echarts from 'echarts';
import 'element-ui/lib/theme-chalk/index.css';
import '@/utils/global'//全局
// 控制路由表的js文件
import '@/permission.js'
import Print from '@/utils/print'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Print);

Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
