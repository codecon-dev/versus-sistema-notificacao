<template>
  <div class="notification-bell" @click.stop="toggleList">
    🔔
    <span v-if="unreadCount > 0" class="notification-count">{{
      unreadCount
    }}</span>

    <div v-if="showList" class="notification-list">
      <div class="notification-header">
        <strong>Notificações</strong>
        <button v-if="unreadCount > 0" @click.stop="markAllAsRead">
          Marcar todas como lidas
        </button>
      </div>

      <div v-if="recentNotifications.length === 0" class="no-notifications">
        Nenhuma notificação
      </div>

      <div v-else>
        <div
          v-for="notif in recentNotifications"
          :key="notif.id"
          :class="['notification-item', { unread: !notif.readAt }]"
          @click.stop="markAsRead(notif.id)"
        >
          <div>{{ notif.message }}</div>
          <div class="notification-time">{{ formatTime(notif.createdAt) }}</div>
        </div>

        <div class="notification-footer">
          <router-link to="/notifications" @click.stop="showList = false">
            Ver todas as notificações
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { socketService } from "../services/socket";
import { useNotifications } from "../composables/useNotifications";

const showList = ref(false);
const audioInitialized = ref(false);

// Usar composable compartilhado
const {
  unreadCount,
  recentNotifications,
  loadNotifications,
  markAsRead,
  markAllAsRead,
  playNotificationSound,
  initAudio,
} = useNotifications();

const toggleList = () => {
  // Inicializar áudio na primeira interação
  if (!audioInitialized.value) {
    initAudio();
    audioInitialized.value = true;
  }
  showList.value = !showList.value;
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleString("pt-BR");
};

// Handler para fechar dropdown ao clicar fora
const handleClickOutside = () => {
  showList.value = false;
};

onMounted(() => {
  loadNotifications();

  // Conectar WebSocket
  const token = localStorage.getItem("token");
  if (token) {
    socketService.connect(token);

    socketService.onNotification((notification) => {
      console.log("Nova notificação recebida:", notification);
      playNotificationSound();
      loadNotifications();
    });
  }

  // Fechar lista ao clicar fora
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  socketService.disconnect();
  // Remover listener para evitar memory leak
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.notification-bell {
  display: inline-block;
  position: relative;
}

.notification-list {
  position: absolute;
  top: 30px;
  right: 0;
  width: 400px;
  max-height: 500px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #828282;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.notification-header {
  padding: 10px;
  border-bottom: 2px solid #ff6600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header button {
  font-size: 9pt;
  padding: 3px 6px;
}

.no-notifications {
  padding: 20px;
  text-align: center;
  color: #828282;
}

.notification-item {
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f0f0f0;
}

.notification-time {
  font-size: 8pt;
  color: #828282;
  margin-top: 4px;
}

.notification-footer {
  padding: 10px;
  border-top: 1px solid #e6e6df;
  text-align: center;
  background-color: #f6f6ef;
}

.notification-footer a {
  color: #000;
  text-decoration: none;
  font-size: 9pt;
}

.notification-footer a:hover {
  text-decoration: underline;
}
</style>
