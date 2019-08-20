import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import ls from 'vue-ls'
import axios from 'axios'
import qrcode from 'vue-qrcode-reader'
import uuid from 'vue-uuid'
import moment from 'vue-moment'
import qrious from 'vue-qriously'


Vue.prototype.axios = axios;
Vue.use(qrious);
Vue.use(qrcode);
Vue.use(uuid);
Vue.use(moment);
Vue.use(ls,{
  namespace: 'asriSM_',
  name: 'session',
  storage: 'local'
});
Vue.use(vuetify,{
  theme: {
    primary: '#424242',
    secondary: '#979797',
    accent: '#ba2d65',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
});

// AXIOS CONFIG
const baseURL = 'http://10.10.0.28/WebServiceInventoryMAS/api/';
// const devURL = 'https://api.alam-sutera.com/InventoryMAS/api/';
const devURL = 'http://10.10.0.28/WebServiceInventoryMAS/api/';

axios.defaults.baseURL = (process.env.NODE_ENV == 'production') ? baseURL : devURL;
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.request.use((config) => {
  store.commit('loading',true);
  return config;
}, (error) => {
  store.commit('loading',false);
  return Promise.reject(error);
});
axios.interceptors.response.use((res) => {
  store.commit('loading',false);
  if(res.status == 200) {
    // console.log(res);
    return res;
  } else {
    let data = {
      alert: true,
      color: 'error',
      message: '('+res.status+') '+res.statusText
    }
    store.commit.alert(data);
  }
}, (error) => {
  store.commit('loading',false);
  return Promise.reject(error);
});

// VUE FILTER
var numeral = require("numeral");
Vue.filter("formatNumber", (value) => numeral(value).format("0,0"));
Vue.filter("formatDecimal", (value) => numeral(value).format("0,0.00"));
Vue.filter("formatPercentage", (value) => numeral(value).format("0,0.0000"));



// VUE START
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
