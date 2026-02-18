<template>
  <div class="container">
    <table class="header" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 4px; width: 100%">
          <span class="title">Sistema de Notificações</span>
        </td>
        <td style="padding: 4px; white-space: nowrap">
          <span>{{ user?.username }}</span>
          <NotificationBell />
          <button @click="logout" style="margin-left: 10px">Sair</button>
        </td>
      </tr>
    </table>

    <div class="spacer"></div>

    <div class="login-form">
      <h2>Bem-vindo!</h2>
      <p>Você está logado no sistema de notificações.</p>
      <p>Aguarde por notificações dos administradores.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NotificationBell from "../components/NotificationBell.vue";

const router = useRouter();
const user = ref<any>(null);

onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
  }
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>
