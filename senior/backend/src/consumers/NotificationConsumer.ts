import { rabbitMQ } from "../config/rabbitmq";
import { getWebSocketServer } from "../websocket/socket";

export class NotificationConsumer {
  async start() {
    const channel = rabbitMQ.getChannel();

    if (!channel) {
      console.error("❌ Canal RabbitMQ não disponível para consumer");
      setTimeout(() => this.start(), 5000);
      return;
    }

    console.log('👂 Consumer aguardando mensagens na fila "notifications"');

    channel.consume("notifications", (msg) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log("📥 Mensagem recebida da fila:", data);

          // Enviar via WebSocket para os usuários
          const wsServer = getWebSocketServer();
          if (wsServer) {
            wsServer.sendNotificationToUsers(data.userIds, {
              id: data.notificationId,
              message: data.message,
              createdAt: data.createdAt,
            });
          }

          channel.ack(msg);
        } catch (error) {
          console.error("❌ Erro ao processar mensagem:", error);
          channel.nack(msg, false, false);
        }
      }
    });
  }
}

export const notificationConsumer = new NotificationConsumer();
