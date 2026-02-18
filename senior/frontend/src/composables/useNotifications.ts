import { ref, computed } from "vue";
import { notificationAPI } from "../services/api";

const notifications = ref<any[]>([]);
const isLoading = ref(false);

// Pré-carregar o áudio
let notificationAudio: HTMLAudioElement | null = null;
try {
  notificationAudio = new Audio("/notification.mp3");
  notificationAudio.volume = 1.0; // Volume a 100%
  notificationAudio.load();
  console.log("✅ Áudio de notificação carregado");
} catch (error) {
  console.error("❌ Erro ao carregar áudio:", error);
}

// Função para tocar som de notificação
const playNotificationSound = async () => {
  console.log("🔔 Tentando tocar som de notificação...");
  try {
    if (!notificationAudio) {
      notificationAudio = new Audio("/notification.mp3");
      notificationAudio.volume = 1.0;
    }

    // Reset para tocar desde o início
    notificationAudio.currentTime = 0;

    await notificationAudio.play();
    console.log("✅ Som tocado com sucesso!");
  } catch (error: any) {
    console.error("❌ Erro ao tocar som:", error);
    console.error("Tipo de erro:", error.name, "- Mensagem:", error.message);

    // Se falhou por política de autoplay, avisar usuário
    if (error.name === "NotAllowedError") {
      console.warn(
        "⚠️  Navegador bloqueou autoplay. Usuário precisa interagir com a página primeiro.",
      );
    }
  }
};

export function useNotifications() {
  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.readAt).length;
  });

  const recentNotifications = computed(() => {
    return notifications.value.slice(0, 10);
  });

  const loadNotifications = async () => {
    try {
      isLoading.value = true;
      const response = await notificationAPI.getMyNotifications();
      notifications.value = response.data;
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const markAsRead = async (id: number) => {
    try {
      // Atualizar localmente primeiro para resposta imediata
      const notification = notifications.value.find((n) => n.id === id);
      if (notification && !notification.readAt) {
        notification.readAt = new Date().toISOString();
      }

      // Enviar para o backend
      await notificationAPI.markAsRead(id);

      // Recarregar para garantir sincronização
      await loadNotifications();
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      // Recarregar em caso de erro
      await loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      // Atualizar localmente primeiro
      const now = new Date().toISOString();
      notifications.value.forEach((n) => {
        if (!n.readAt) {
          n.readAt = now;
        }
      });

      // Enviar para o backend
      await notificationAPI.markAllAsRead();

      // Recarregar para garantir sincronização
      await loadNotifications();
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      // Recarregar em caso de erro
      await loadNotifications();
    }
  };

  // Função para inicializar áudio (chamar após primeira interação do usuário)
  const initAudio = () => {
    if (!notificationAudio) {
      try {
        notificationAudio = new Audio("/notification.mp3");
        notificationAudio.volume = 1.0;
        notificationAudio.load();
        console.log("✅ Áudio inicializado após interação do usuário");
      } catch (error) {
        console.error("❌ Erro ao inicializar áudio:", error);
      }
    }
  };

  return {
    notifications,
    unreadCount,
    recentNotifications,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    playNotificationSound,
    initAudio,
  };
}
