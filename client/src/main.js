import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);
Vue.config.productionTip = false;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  console.log(config)
  config.headers['token'] = 'token';
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
axios.defaults.baseURL = "http://127.0.0.1:3000/api/v1/"
axios.defaults.withCredentials = true;
Vue.prototype.$http = axios;
new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount("#app");
