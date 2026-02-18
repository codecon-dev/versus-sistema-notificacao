import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import AdminLogin from "../views/AdminLogin.vue";
import Home from "../views/Home.vue";
import Notifications from "../views/Notifications.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import AdminSend from "../views/AdminSend.vue";
import AdminHistory from "../views/AdminHistory.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    redirect: "/admin/dashboard",
  },
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/send",
    name: "AdminSend",
    component: AdminSend,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/history",
    name: "AdminHistory",
    component: AdminHistory,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.requiresAdmin && user) {
    const userData = JSON.parse(user);
    if (!userData.isAdmin) {
      next("/home");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
