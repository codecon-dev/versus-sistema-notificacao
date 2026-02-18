<template>
  <div class="container">
    <table class="header" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 4px; width: 100%">
          <span class="title">Painel Admin - Dashboard</span>
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
      <div v-if="loading" class="loading">Carregando estatísticas...</div>

      <div v-else>
        <!-- Cards de Estatísticas -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">Usuários Cadastrados</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📧</div>
            <div class="stat-value">{{ stats.totalNotifications }}</div>
            <div class="stat-label">Notificações Enviadas</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value">{{ stats.readRate }}%</div>
            <div class="stat-label">Taxa de Leitura</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-value">{{ stats.todayNotifications }}</div>
            <div class="stat-label">Enviadas Hoje</div>
          </div>
        </div>

        <!-- Seção de Envios Recentes -->
        <div class="dashboard-section">
          <h3>📈 Últimos 7 Dias</h3>
          <div class="info-box">
            <p>
              <strong>Total de notificações enviadas:</strong>
              {{ stats.recentNotifications }}
            </p>
            <p>
              <strong>Total de destinatários:</strong>
              {{ stats.totalRecipients }}
            </p>
            <p>
              <strong>Lidas:</strong> {{ stats.readRecipients }} |
              <strong>Não lidas:</strong> {{ stats.unreadRecipients }}
            </p>
          </div>
        </div>

        <!-- Gráfico Simples de Notificações por Dia -->
        <div
          class="dashboard-section"
          v-if="stats.notificationsByDay?.length > 0"
        >
          <h3>📊 Notificações por Dia</h3>
          <div class="chart">
            <div
              v-for="day in stats.notificationsByDay"
              :key="day.date"
              class="chart-bar"
            >
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{ height: getBarHeight(day.count) + 'px' }"
                  :title="`${day.count} notificações`"
                ></div>
              </div>
              <div class="bar-label">{{ formatDate(day.date) }}</div>
              <div class="bar-value">{{ day.count }}</div>
            </div>
          </div>
        </div>

        <!-- Usuários Mais Ativos -->
        <div class="dashboard-section" v-if="stats.mostActiveUsers?.length > 0">
          <h3>🏆 Top 5 Usuários Mais Ativos</h3>
          <table border="0" cellspacing="0" cellpadding="0" class="stats-table">
            <tr style="background-color: #ff6600">
              <td style="padding: 4px"><strong>Posição</strong></td>
              <td style="padding: 4px"><strong>Usuário</strong></td>
              <td style="padding: 4px"><strong>Notificações Lidas</strong></td>
            </tr>
            <tr
              v-for="(user, index) in stats.mostActiveUsers"
              :key="user.username"
            >
              <td style="padding: 8px; text-align: center">
                <span class="rank">{{ index + 1 }}º</span>
              </td>
              <td style="padding: 8px">{{ user.username }}</td>
              <td style="padding: 8px; text-align: center">
                {{ user.readCount }}
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
const stats = ref<any>({
  totalUsers: 0,
  totalNotifications: 0,
  readRate: 0,
  todayNotifications: 0,
  recentNotifications: 0,
  totalRecipients: 0,
  readRecipients: 0,
  unreadRecipients: 0,
  mostActiveUsers: [],
  notificationsByDay: [],
});

const loadStats = async () => {
  try {
    loading.value = true;
    const response = await adminAPI.getDashboardStats();
    stats.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
  } finally {
    loading.value = false;
  }
};

const getBarHeight = (count: number) => {
  const maxCount = Math.max(
    ...stats.value.notificationsByDay.map((d: any) => d.count),
  );
  return (count / maxCount) * 150; // Altura máxima de 150px
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/admin/login");
};

onMounted(() => {
  loadStats();
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #f6f6ef;
  border: 1px solid #828282;
  padding: 20px;
  text-align: center;
}

.stat-icon {
  font-size: 32pt;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 24pt;
  font-weight: bold;
  color: #ff6600;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 9pt;
  color: #828282;
}

.dashboard-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ff6600;
}

.dashboard-section h3 {
  font-size: 11pt;
  margin-bottom: 15px;
}

.info-box {
  background-color: #ffffed;
  border: 1px solid #e6e6df;
  padding: 15px;
  margin-top: 10px;
}

.info-box p {
  margin: 5px 0;
}

.chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 20px;
  background-color: #f6f6ef;
  border: 1px solid #828282;
  margin-top: 10px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 80px;
}

.bar-container {
  height: 150px;
  display: flex;
  align-items: flex-end;
  width: 100%;
  justify-content: center;
}

.bar {
  width: 40px;
  background-color: #ff6600;
  border: 1px solid #828282;
  transition: opacity 0.2s;
}

.bar:hover {
  opacity: 0.8;
}

.bar-label {
  margin-top: 5px;
  font-size: 8pt;
  color: #828282;
}

.bar-value {
  margin-top: 2px;
  font-size: 9pt;
  font-weight: bold;
}

.stats-table {
  width: 100%;
  margin-top: 10px;
}

.stats-table td {
  border-bottom: 1px solid #e6e6df;
}

.rank {
  font-size: 11pt;
  font-weight: bold;
  color: #ff6600;
}
</style>
