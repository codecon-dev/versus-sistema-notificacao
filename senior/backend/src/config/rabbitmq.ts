import amqp, { Connection, Channel } from "amqplib";

export class RabbitMQConfig {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private url: string;

  constructor() {
    this.url = process.env.RABBITMQ_URL || "amqp://localhost:5672";
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue("notifications", { durable: true });
      console.log("✅ RabbitMQ conectado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao conectar no RabbitMQ:", error);
      // Tentar reconectar após 5 segundos
      setTimeout(() => this.connect(), 5000);
    }
  }

  getChannel(): Channel | null {
    return this.channel;
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}

export const rabbitMQ = new RabbitMQConfig();
