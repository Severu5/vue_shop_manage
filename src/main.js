import Vue from 'vue';
import App from './App.vue';
import router from './router';
// 导入全局样式表
import '@/assets/css/global.css';
import '@/plugins/element.js';
import '@/assets/fonts/iconfont.css';

import { API } from '@/request/index.js';
import TreeTable from 'vue-table-with-tree-grid';
import VueQuillEditor from 'vue-quill-editor';
// 导入富文本编辑器组件以及样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.prototype.$http = API;

Vue.config.productionTip = false;

Vue.component('tree-table', TreeTable);
Vue.use(VueQuillEditor);

// 注册一个全局的过滤器
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
