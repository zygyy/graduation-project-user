// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'
// 导入ElementUI组件(页面设计)以及样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'
//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//进度条的包和样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.interceptors.request.use(config => {
  //再request拦截器中展示进度条NProgress.start()
  NProgress.start()
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})

//再response拦截器中隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config;
})
//挂载到Vue的原型对象上
Vue.prototype.$http=axios

Vue.use(ElementUI);
Vue.use(VueQuillEditor);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
