import Vue from 'vue';
import App from './App.vue';
import router from './router';
// 导入全局样式表
import '@/assets/css/global.css';
import '@/plugins/element.js';
import '@/assets/fonts/iconfont.css';

import { API } from '@/request/index.js';

Vue.prototype.$http = API;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
