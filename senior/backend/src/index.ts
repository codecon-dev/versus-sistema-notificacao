import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { AppDataSource } from "./config/database";
import { rabbitMQ } from "./config/rabbitmq";
import { initializeWebSocket } from "./websocket/socket";
import { notificationConsumer } from "./consumers/NotificationConsumer";

import authRoutes from "./routes/auth.routes";
import notificationRoutes from "./routes/notification.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API de Notificações rodando!" });
});

// Inicializar servidor
async function bootstrap() {
  try {
    // Conectar banco de dados
    await AppDataSource.initialize();
    console.log("✅ Banco de dados conectado");

    // Conectar RabbitMQ
    await rabbitMQ.connect();

    // Inicializar WebSocket
    initializeWebSocket(server);
    console.log("✅ WebSocket inicializado");

    // Iniciar consumer do RabbitMQ
    await notificationConsumer.start();

    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 WebSocket disponível em ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar servidor:", error);
    process.exit(1);
  }
}

bootstrap();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await rabbitMQ.close();
  await AppDataSource.destroy();
  process.exit(0);
});
