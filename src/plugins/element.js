import Vue from 'vue';
import {
  Button,
  Form,
  FormItem,
  Input,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui';

const cmp = [
  Button,
  Form,
  FormItem,
  Input
];
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
cmp.forEach(c => {
  Vue.use(c);
});
// Vue.use(Button)
