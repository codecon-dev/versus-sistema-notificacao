<template>
  <div class="container">
    <table class="header" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 4px">
          <span class="title">Sistema de Notificações</span>
        </td>
      </tr>
    </table>

    <div class="spacer"></div>

    <div class="login-form">
      <h2>Login</h2>

      <div v-if="error" class="error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-row">
          <label>Usuário:</label>
          <input v-model="username" type="text" required />
        </div>

        <div class="form-row">
          <label>Senha:</label>
          <input v-model="password" type="password" required />
        </div>

        <div class="form-row">
          <label></label>
          <button type="submit">Entrar</button>
        </div>
      </form>

      <div style="margin-top: 20px">
        <p>
          Não tem conta?
          <a href="#" @click.prevent="showRegister = !showRegister"
            >Criar conta</a
          >
        </p>
      </div>

      <div
        v-if="showRegister"
        style="
          margin-top: 20px;
          border-top: 1px solid #828282;
          padding-top: 20px;
        "
      >
        <h3>Criar Conta</h3>

        <div v-if="registerSuccess" class="success">{{ registerSuccess }}</div>

        <form @submit.prevent="handleRegister">
          <div class="form-row">
            <label>Usuário:</label>
            <input v-model="newUsername" type="text" required />
          </div>

          <div class="form-row">
            <label>Senha:</label>
            <input v-model="newPassword" type="password" required />
          </div>

          <div class="form-row">
            <label></label>
            <button type="submit">Criar Conta</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authAPI } from "../services/api";

const router = useRouter();
const username = ref("");
const password = ref("");
const error = ref("");
const showRegister = ref(false);
const newUsername = ref("");
const newPassword = ref("");
const registerSuccess = ref("");

const handleLogin = async () => {
  try {
    error.value = "";
    const response = await authAPI.login(username.value, password.value);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    router.push("/home");
  } catch (err: any) {
    error.value = err.response?.data?.error || "Erro ao fazer login";
  }
};

const handleRegister = async () => {
  try {
    error.value = "";
    registerSuccess.value = "";
    await authAPI.register(newUsername.value, newPassword.value);

    registerSuccess.value = "Conta criada com sucesso! Faça login.";
    newUsername.value = "";
    newPassword.value = "";
  } catch (err: any) {
    error.value = err.response?.data?.error || "Erro ao criar conta";
  }
};
</script>
