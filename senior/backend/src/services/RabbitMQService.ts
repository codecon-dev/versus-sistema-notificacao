import { rabbitMQ } from "../config/rabbitmq";

export class RabbitMQService {
  async publishNotification(data: any): Promise<void> {
    const channel = rabbitMQ.getChannel();

    if (!channel) {
      console.error("Canal RabbitMQ não disponível");
      return;
    }

    try {
      const message = JSON.stringify(data);
      channel.sendToQueue("notifications", Buffer.from(message), {
        persistent: true,
      });
      console.log("📤 Notificação publicada na fila:", data);
    } catch (error) {
      console.error("Erro ao publicar notificação:", error);
    }
  }
}

export const rabbitMQService = new RabbitMQService();
