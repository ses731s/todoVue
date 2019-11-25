import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
// import Auth from "../auth/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login
    // beforeEnter: (to, from, next) => {
    //   if(localStorage.getItem("user-token")!=null || localStorage.getItem("user-token")!='' || localStorage.getItem("user-token")!= undefined ){
    //     next('/todo');
    //   }else{
    //     next('/');
    //   }
    // }
  },
  {
    path: "/guest",
    name: "guest",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Guest.vue")
  },
  {
    path: "/todo",
    name: "Todo",
    component: () => import(/* webpackChunkName: "about" */ "../views/Todo.vue")
  },
  {
    path: "/signup",
    name: "signup",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/SignUp.vue")
  },
  {
    path: "/test",
    name: "test",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/test.vue")
  },
  {
    path: "*",
    name: "PageNotFound",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Page404.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
