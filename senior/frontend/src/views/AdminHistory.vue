<template>
  <div class="container">
    <table class="header" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 4px; width: 100%">
          <span class="title">Painel Admin - Histórico de Notificações</span>
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
      <h2>Histórico de Notificações Enviadas</h2>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else-if="notifications.length === 0" class="no-notifications">
        Nenhuma notificação enviada ainda.
      </div>

      <table
        v-else
        border="0"
        cellspacing="0"
        cellpadding="0"
        class="history-table"
      >
        <tr style="background-color: #ff6600">
          <td style="padding: 4px; width: 40%"><strong>Mensagem</strong></td>
          <td style="padding: 4px; width: 15%"><strong>Enviado por</strong></td>
          <td style="padding: 4px; width: 15%"><strong>Data</strong></td>
          <td style="padding: 4px; width: 10%">
            <strong>Destinatários</strong>
          </td>
          <td style="padding: 4px; width: 10%">
            <strong>Taxa Leitura</strong>
          </td>
          <td style="padding: 4px; width: 10%"><strong>Ações</strong></td>
        </tr>
        <tr v-for="notif in notifications" :key="notif.id">
          <td style="padding: 8px">{{ notif.message }}</td>
          <td style="padding: 8px">{{ notif.createdBy }}</td>
          <td style="padding: 8px">{{ formatDate(notif.createdAt) }}</td>
          <td style="padding: 8px; text-align: center">
            {{ notif.totalRecipients }}
          </td>
          <td style="padding: 8px; text-align: center">
            <span class="rate-badge" :class="getRateClass(notif.readRate)">
              {{ notif.readRate }}%
            </span>
            <div class="rate-details">
              Lidas: {{ notif.readCount }} | Não lidas: {{ notif.unreadCount }}
            </div>
          </td>
          <td style="padding: 8px; text-align: center">
            <button @click="viewDetails(notif.id)" class="action-btn">
              Ver Detalhes
            </button>
          </td>
        </tr>
      </table>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalhes da Notificação</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>

        <div v-if="loadingDetails" class="loading">Carregando detalhes...</div>

        <div v-else-if="selectedNotification">
          <div class="detail-section">
            <p><strong>Mensagem:</strong> {{ selectedNotification.message }}</p>
            <p>
              <strong>Enviado por:</strong> {{ selectedNotification.createdBy }}
            </p>
            <p>
              <strong>Data:</strong>
              {{ formatDate(selectedNotification.createdAt) }}
            </p>
          </div>

          <h4>Destinatários ({{ selectedNotification.recipients.length }})</h4>
          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="recipients-table"
          >
            <tr style="background-color: #ff6600">
              <td style="padding: 4px"><strong>Usuário</strong></td>
              <td style="padding: 4px"><strong>Status</strong></td>
              <td style="padding: 4px"><strong>Recebida em</strong></td>
              <td style="padding: 4px"><strong>Lida em</strong></td>
            </tr>
            <tr
              v-for="recipient in selectedNotification.recipients"
              :key="recipient.id"
              :class="{ 'unread-row': recipient.status === 'Não lida' }"
            >
              <td style="padding: 8px">{{ recipient.username }}</td>
              <td style="padding: 8px; text-align: center">
                <span
                  class="status-badge"
                  :class="recipient.status === 'Lida' ? 'read' : 'unread'"
                >
                  {{ recipient.status }}
                </span>
              </td>
              <td style="padding: 8px">
                {{ formatDate(recipient.receivedAt) }}
              </td>
              <td style="padding: 8px">
                {{ recipient.readAt ? formatDate(recipient.readAt) : "-" }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { adminAPI } from "../services/api";
import AdminMenu from "../components/AdminMenu.vue";

const router = useRouter();
const loading = ref(true);
const loadingDetails = ref(false);
const notifications = ref<any[]>([]);
const showModal = ref(false);
const selectedNotification = ref<any>(null);

const loadNotifications = async () => {
  try {
    loading.value = true;
    const response = await adminAPI.getSentNotifications();
    notifications.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar notificações:", error);
  } finally {
    loading.value = false;
  }
};

const viewDetails = async (id: number) => {
  try {
    loadingDetails.value = true;
    showModal.value = true;
    const response = await adminAPI.getNotificationDetails(id);
    selectedNotification.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar detalhes:", error);
  } finally {
    loadingDetails.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedNotification.value = null;
};

const getRateClass = (rate: string) => {
  const rateNum = parseFloat(rate);
  if (rateNum >= 75) return "high";
  if (rateNum >= 50) return "medium";
  return "low";
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
  loadNotifications();
});
</script>

<style scoped>
.admin-panel {
  background-color: #fff;
  padding: 20px;
  margin-top: 10px;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #828282;
}

.no-notifications {
  padding: 40px;
  text-align: center;
  color: #828282;
}

.history-table {
  width: 100%;
  margin-top: 10px;
}

.history-table td {
  border-bottom: 1px solid #e6e6df;
  vertical-align: top;
}

.rate-badge {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 9pt;
  font-weight: bold;
}

.rate-badge.high {
  background-color: #4caf50;
  color: #fff;
}

.rate-badge.medium {
  background-color: #ff9800;
  color: #fff;
}

.rate-badge.low {
  background-color: #f44336;
  color: #fff;
}

.rate-details {
  font-size: 8pt;
  color: #828282;
  margin-top: 4px;
}

.action-btn {
  font-size: 9pt;
  padding: 3px 6px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 2px solid #828282;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff6600;
}

.modal-header h3 {
  margin: 0;
  font-size: 12pt;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20pt;
  cursor: pointer;
  color: #828282;
  padding: 0;
  width: 30px;
  height: 30px;
}

.close-btn:hover {
  color: #000;
}

.detail-section {
  background-color: #f6f6ef;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #e6e6df;
}

.detail-section p {
  margin: 5px 0;
}

.recipients-table {
  width: 100%;
  margin-top: 10px;
}

.recipients-table td {
  border-bottom: 1px solid #e6e6df;
}

.unread-row {
  background-color: #ffffed;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 8pt;
  font-weight: bold;
}

.status-badge.read {
  background-color: #e6e6df;
  color: #828282;
}

.status-badge.unread {
  background-color: #ff6600;
  color: #fff;
}

h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 11pt;
}
</style>
