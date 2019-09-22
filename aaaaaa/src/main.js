// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
// 主题文件
import ElementUI from 'element-ui'
import './components/theme/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'element-ui/lib/theme-chalk/base.css';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import hkLocale from 'element-ui/lib/locale/lang/zh-TW'
import ElementLocale from 'element-ui/lib/locale'
import en from './../static/i18n/en'
import cn from './../static/i18n/cn'
import hk from './../static/i18n/hk'
// 图标
import './components/fonts/iconfont.css'

// 富文本编辑器

import VueI18n from 'vue-i18n'
import axios from 'axios'
import store from './store'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'
import 'font-awesome/css/font-awesome.min.css'
import Meta from 'vue-meta'
// Vue.use(ckeditor)
Vue.use(Meta)
Vue.use(ElementUI)
var SocialSharing = require('vue-social-sharing')
Vue.use(SocialSharing)
Vue.component('vue-ctk-date-time-picker', VueCtkDateTimePicker)
//主题相关的配置
Vue.use(Vuetify, {
  theme: {
    primary: '#286667',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    iconfont: 'fa4',
  }
})

const messages = {
  EN: {
    ...enLocale,
    ...en
  },
  CN: {
    ...cn,
    ...zhLocale
  },
  HK: {
    ...hk,
    ...hkLocale
  }
}
//设置i18n，翻译相关
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'HK',
  messages
});
// Element 组件内文字翻译
ElementLocale.i18n((key, value) => i18n.t(key, value))

// 配置API接口地址 将API方法绑定到全局
// http request 拦截器
//axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
axios.interceptors.request.use(
  config => {
    //配置发送请求的信息
    if (localStorage.getItem('okta-token-storage')) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `${JSON.parse(
                localStorage.getItem('okta-token-storage')
            ).accessToken.tokenType} ${JSON.parse(
                localStorage.getItem('okta-token-storage')
            ).accessToken.accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error.response)
  }
)

// http response 攔截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '錯誤請求'
          break
        case 401:
          error.message = '未授權，請重新登錄'
          // 返回 401 清除token信息並跳轉到登錄頁面
          Vue.prototype.$auth.loginRedirect(localStorage.getItem('referrerPath'))
          sessionStorage.clear()
          localStorage.clear()
          break
        case 403:
          error.message = '拒絕訪問'
          break
        case 404:
          error.message = '請求錯誤,未找到該資源'
          break
        case 405:
          error.message = '請求方法未允許'
          break
        case 408:
          error.message = '請求超時'
          break
        case 500:
          error.message = '服務器端出錯'
          break
        case 501:
          error.message = '網絡未實現'
          break
        case 502:
          error.message = '網絡錯誤'
          break
        case 503:
          error.message = '服務不可用'
          break
        case 504:
          error.message = '網絡超時'
          break
        case 505:
          error.message = 'http版本不支持該請求'
          break
        default:
          error.message = '連接錯誤'
      }
    } else {
      error.message = '連接到服務器失敗'
    }
    // Message.error(error.message + error.response.status)
    return Promise.reject(error.response)
  }
)

// axios.defaults.baseURL = 'https://enterprise-api.yoov.com/api/v1/';
axios.defaults.baseURL = 'http://192.168.2.180:8080/api/v1/';

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$http = axios;
Vue.prototype.$fileUrl = 'https://192.168.2.180';
// Vue.prototype.$fileUrl = 'https://enterprise.yoov.com'


Vue.prototype.$serialize = function (object) {
  let params = new URLSearchParams();
  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'object') {
      if (object[key].length) {
        Object.keys(object[key]).forEach((v, i) => {
          Object.keys(object[key][i]).forEach(k => {
            if (k !== 'lastModifiedAt' && k !== 'createdAt') {
              params.append(`${key}[${i}].${k}`, object[key][i][k])
            }
          })
        })
      } else {
        Object.keys(object[key]).forEach(k => {
          params.append(`${key}.${k}`, object[key][k])
        })
      }
    } else {
      params.append(key, object[key])
    }
  })
  return params
}

// 判断该路由是否需要登录权限
router.beforeEach(async (to, from, next) => {
  if (
    to.matched.some(record => record.meta.requiresAuth) &&
    !await Vue.prototype.$auth.isAuthenticated()
  ) {
    Vue.prototype.$auth.loginRedirect('/implicit/callback')
  } else {
    next()
  }
})
router.afterEach(route => {})



Vue.filter('time', function (value) {
  //value为13位的时间戳
  function add0(m) {
    return m < 10 ? '0' + m : m
  }
  let time = new Date(value)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let s = time.getHours()
  let mi = time.getMinutes()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(s) + ':' + add0(mi)
})

Vue.filter('filterText', function (value) {
  //value是标签字符串
  let text = ''
  let div = document.createElement('div')
  div.innerHTML = value
  let elArr = div.children
  let arr = []
  arr.push.apply(arr, elArr)
  arr.forEach(item => {
    text += item.innerText
  })
  return text.replace(/\s+/g, '')
})
Vue.prototype.$moment = function (value) {
  //value为13位的时间戳
  function add0(m) {
    return m < 10 ? '0' + m : m
  }
  let time = new Date(value)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let s = time.getHours()
  let mi = time.getMinutes()
  let se = time.getSeconds()
  return `${y}-${add0(m)}-${add0(d)} ${add0(s)}:${add0(mi)}:${add0(se)}`
}

Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {
    App
  },
  template: '<App/>'
})
