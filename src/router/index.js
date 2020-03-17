import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Links from "../views/Links.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/links",
    name: "Links",
    component: Links
  }
];

const router = new VueRouter({
  routes
});

export default router;
