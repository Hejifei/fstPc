// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App'
import router from './router'

import "./assets/css/fstpublic.less";
import "./assets/css/calendar.css";
// 公共方法引用
import fstjs from "./assets/js/fstPublic.js";


Vue.use(ElementUI);
Vue.use(fstjs);
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
