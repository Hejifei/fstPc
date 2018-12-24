// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'lib-flexible/flexible'
import Vue from 'vue'
import FastClick from 'fastclick'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css';

import VueRouter from 'vue-router'

import App from './App'
import router from './router'
// 公共样式引用
import "./assets/css/fstwechat.css";
import 'vux/src/styles/reset.less';
// 公共方法引用
import fstjs from "./assets/js/fstPublic.js";

Vue.use(fstjs);
Vue.use(Vant);

// FastClick.attach(document.body)

Vue.config.productionTip = false
// 修改title
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
/* eslint-disable no-new */


new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
