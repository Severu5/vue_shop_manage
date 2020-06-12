import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('@/components/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import('@/components/user/Users.vue')
      },
      {
        path: '/rights',
        component: () => import('@/components/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('@/components/power/Roles.vue')
      },
      {
        path: '/categories',
        component: () => import('@/components/goods/Cate.vue')
      },
      {
        path: '/params',
        component: () => import('@/components/goods/Params.vue')
      },
      {
        path: '/goods',
        component: () => import('@/components/goods/List.vue')
      },
      {
        path: '/goods/add',
        component: () => import('@/components/goods/Add.vue')
      },
      {
        path: '/orders',
        component: () => import('@/components/order/Order.vue')
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // to 代表将要访问的路径
  // from 代表从哪个路径而来
  // next 为一个函数为接下来跳转
  if (to.path === '/login') return next();
  const token = window.sessionStorage.getItem('token');
  if (!token) return next('/login');
  next();
});

export default router;
