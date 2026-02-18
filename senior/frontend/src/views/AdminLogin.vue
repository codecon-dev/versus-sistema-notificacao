<template>
  <div class="container">
    <table class="header" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 4px">
          <span class="title">Admin - Sistema de Notificações</span>
        </td>
      </tr>
    </table>

    <div class="spacer"></div>

    <div class="login-form">
      <h2>Login Admin</h2>

      <div v-if="error" class="error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-row">
          <label>Usuário:</label>
          <input v-model="username" type="text" required placeholder="admin" />
        </div>

        <div class="form-row">
          <label>Senha:</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="admin"
          />
        </div>

        <div class="form-row">
          <label></label>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authAPI } from "../services/api";

const router = useRouter();
const username = ref("admin");
const password = ref("admin");
const error = ref("");

const handleLogin = async () => {
  try {
    error.value = "";
    const response = await authAPI.login(username.value, password.value);

    if (!response.data.user.isAdmin) {
      error.value = "Acesso negado. Apenas administradores.";
      return;
    }

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    router.push("/admin/dashboard");
  } catch (err: any) {
    error.value = err.response?.data?.error || "Erro ao fazer login";
  }
};
</script>
