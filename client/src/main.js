import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);
Vue.config.productionTip = false;

// 请求拦截器
axios.interceptor.request.use(
  config => {
    console.log(__dirname, config)
  }
);
// 响应拦截器
axios.interceptor.response.use(
  res => {
    console.log(__dirname, config)
  }
)

Vue.use(axios)
new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount("#app");
