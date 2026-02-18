<template>
  <div class="admin-menu">
    <router-link
      to="/admin/dashboard"
      class="menu-item"
      :class="{ active: isActive('/admin/dashboard') }"
    >
      📊 Dashboard
    </router-link>
    <router-link
      to="/admin/send"
      class="menu-item"
      :class="{ active: isActive('/admin/send') }"
    >
      📤 Enviar Notificação
    </router-link>
    <router-link
      to="/admin/history"
      class="menu-item"
      :class="{ active: isActive('/admin/history') }"
    >
      📋 Histórico
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const isActive = (path: string) => {
  return (
    route.path === path ||
    (path === "/admin/dashboard" && route.path === "/admin")
  );
};
</script>

<style scoped>
.admin-menu {
  background-color: #f6f6ef;
  border: 1px solid #828282;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.menu-item {
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid #828282;
  color: #000;
  text-decoration: none;
  font-size: 10pt;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #e6e6df;
}

.menu-item.active {
  background-color: #ff6600;
  color: #fff;
  font-weight: bold;
  border-color: #ff6600;
}
</style>
