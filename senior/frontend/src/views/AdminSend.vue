<template>
  <div class="container">
    <table class="header" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 4px; width: 100%">
          <span class="title">Painel Admin - Enviar Notificação</span>
        </td>
        <td style="padding: 4px; white-space: nowrap">
          <span>Admin</span>
          <button @click="logout" style="margin-left: 10px">Sair</button>
        </td>
      </tr>
    </table>

    <div class="spacer"></div>

    <AdminMenu />

    <div class="admin-panel">
      <h2>Enviar Notificação</h2>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>

      <form @submit.prevent="handleSendNotification">
        <div class="form-row">
          <label>Mensagem:</label>
          <textarea v-model="message" rows="4" cols="50" required></textarea>
        </div>

        <div class="form-row">
          <label>Usuários:</label>
          <div>
            <div>
              <label>
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                />
                Selecionar todos
              </label>
            </div>
            <div v-for="user in users" :key="user.id" style="margin-top: 5px">
              <label>
                <input
                  type="checkbox"
                  :value="user.id"
                  v-model="selectedUsers"
                />
                {{ user.username }}
              </label>
            </div>
          </div>
        </div>

        <div class="form-row">
          <label></label>
          <button type="submit" :disabled="selectedUsers.length === 0">
            Enviar Notificação
          </button>
        </div>
      </form>

      <div class="spacer"></div>

      <h3>Usuários Cadastrados</h3>
      <table border="0" cellspacing="0" cellpadding="0">
        <tr style="background-color: #ff6600">
          <td style="padding: 4px"><strong>ID</strong></td>
          <td style="padding: 4px"><strong>Usuário</strong></td>
          <td style="padding: 4px"><strong>Cadastrado em</strong></td>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td style="padding: 4px">{{ user.id }}</td>
          <td style="padding: 4px">{{ user.username }}</td>
          <td style="padding: 4px">{{ formatDate(user.created_at) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { adminAPI } from "../services/api";
import AdminMenu from "../components/AdminMenu.vue";

const router = useRouter();
const users = ref<any[]>([]);
const selectedUsers = ref<number[]>([]);
const message = ref("");
const error = ref("");
const success = ref("");

const allSelected = computed(() => {
  return (
    users.value.length > 0 && selectedUsers.value.length === users.value.length
  );
});

const loadUsers = async () => {
  try {
    const response = await adminAPI.getUsers();
    users.value = response.data;
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedUsers.value = [];
  } else {
    selectedUsers.value = users.value.map((u) => u.id);
  }
};

const handleSendNotification = async () => {
  try {
    error.value = "";
    success.value = "";

    await adminAPI.sendNotification(message.value, selectedUsers.value);

    success.value = "Notificação enviada com sucesso!";
    message.value = "";
    selectedUsers.value = [];

    setTimeout(() => {
      success.value = "";
    }, 3000);
  } catch (err: any) {
    error.value = err.response?.data?.error || "Erro ao enviar notificação";
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("pt-BR");
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/admin/login");
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.admin-panel {
  background-color: #fff;
  padding: 20px;
  margin-top: 10px;
}

textarea {
  font-family: Verdana, Geneva, sans-serif;
  font-size: 10pt;
  padding: 4px;
  border: 1px solid #828282;
}

table {
  width: 100%;
  margin-top: 10px;
}

table td {
  border-bottom: 1px solid #e6e6df;
}
</style>
