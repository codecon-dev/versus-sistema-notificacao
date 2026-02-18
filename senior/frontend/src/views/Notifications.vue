<template>
  <div class="container">
    <table class="header" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 4px; width: 100%">
          <span class="title">Minhas Notificações</span>
        </td>
        <td style="padding: 4px; white-space: nowrap">
          <span>{{ user?.username }}</span>
          <NotificationBell />
          <button @click="goBack" style="margin-left: 10px">Voltar</button>
          <button @click="logout" style="margin-left: 5px">Sair</button>
        </td>
      </tr>
    </table>

    <div class="spacer"></div>

    <div class="notifications-page">
      <div class="actions-bar">
        <h2>Todas as Notificações ({{ notifications.length }})</h2>
        <button v-if="unreadCount > 0" @click="markAllAsRead">
          Marcar todas como lidas ({{ unreadCount }})
        </button>
      </div>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else-if="notifications.length === 0" class="no-notifications">
        Você não tem notificações ainda.
      </div>

      <table
        v-else
        border="0"
        cellspacing="0"
        cellpadding="0"
        class="notifications-table"
      >
        <tr style="background-color: #ff6600">
          <td style="padding: 4px; width: 50px"><strong>Status</strong></td>
          <td style="padding: 4px"><strong>Mensagem</strong></td>
          <td style="padding: 4px; width: 150px">
            <strong>Recebida em</strong>
          </td>
          <td style="padding: 4px; width: 100px"><strong>Ações</strong></td>
        </tr>
        <tr
          v-for="notif in notifications"
          :key="notif.id"
          :class="{ 'unread-row': !notif.readAt }"
        >
          <td style="padding: 8px; text-align: center">
            <span v-if="!notif.readAt" class="status-badge unread">Nova</span>
            <span v-else class="status-badge read">Lida</span>
          </td>
          <td style="padding: 8px">
            <div :class="{ 'bold-text': !notif.readAt }">
              {{ notif.message }}
            </div>
            <div class="notification-meta">
              Criada em: {{ formatTime(notif.createdAt) }}
            </div>
          </td>
          <td style="padding: 8px">{{ formatTime(notif.receivedAt) }}</td>
          <td style="padding: 8px; text-align: center">
            <button
              v-if="!notif.readAt"
              @click="markAsRead(notif.id)"
              class="action-btn"
            >
              Marcar como lida
            </button>
            <span v-else class="read-time">
              Lida em {{ formatTime(notif.readAt) }}
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { socketService } from "../services/socket";
import { useNotifications } from "../composables/useNotifications";
import NotificationBell from "../components/NotificationBell.vue";

const router = useRouter();
const user = ref<any>(null);

// Usar composable compartilhado
const {
  notifications,
  unreadCount,
  isLoading: loading,
  loadNotifications,
  markAsRead,
  markAllAsRead,
  playNotificationSound,
  initAudio,
} = useNotifications();

const formatTime = (date: string) => {
  return new Date(date).toLocaleString("pt-BR");
};

const goBack = () => {
  router.push("/home");
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};

onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
  }

  // Inicializar áudio
  initAudio();

  loadNotifications();

  // Conectar WebSocket para receber notificações em tempo real
  const token = localStorage.getItem("token");
  if (token) {
    socketService.connect(token);

    socketService.onNotification((notification) => {
      console.log("Nova notificação recebida:", notification);
      playNotificationSound();
      loadNotifications();
    });
  }
});
</script>

<style scoped>
.notifications-page {
  background-color: #fff;
  padding: 20px;
  margin-top: 10px;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff6600;
}

.actions-bar h2 {
  margin: 0;
  font-size: 12pt;
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

.notifications-table {
  width: 100%;
  margin-top: 10px;
}

.notifications-table td {
  border-bottom: 1px solid #e6e6df;
  vertical-align: top;
}

.unread-row {
  background-color: #ffffed;
}

.bold-text {
  font-weight: bold;
}

.notification-meta {
  font-size: 8pt;
  color: #828282;
  margin-top: 4px;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 8pt;
  font-weight: bold;
}

.status-badge.unread {
  background-color: #ff6600;
  color: #fff;
}

.status-badge.read {
  background-color: #e6e6df;
  color: #828282;
}

.action-btn {
  font-size: 9pt;
  padding: 3px 6px;
}

.read-time {
  font-size: 8pt;
  color: #828282;
}
</style>
