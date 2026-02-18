import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

export class WebSocketServer {
  private io: SocketServer;
  private userSockets: Map<number, string[]> = new Map();

  constructor(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      console.log("🔌 Cliente conectado:", socket.id);

      socket.on("authenticate", (token: string) => {
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-secret-key",
          ) as any;

          if (decoded.id) {
            // Armazenar o socket do usuário
            const userSocketList = this.userSockets.get(decoded.id) || [];
            userSocketList.push(socket.id);
            this.userSockets.set(decoded.id, userSocketList);

            socket.data.userId = decoded.id;
            console.log(
              `✅ Usuário ${decoded.username} (ID: ${decoded.id}) autenticado no WebSocket`,
            );
          }
        } catch (error) {
          console.error("❌ Erro na autenticação do WebSocket:", error);
          socket.disconnect();
        }
      });

      socket.on("disconnect", () => {
        const userId = socket.data.userId;
        if (userId) {
          const userSocketList = this.userSockets.get(userId) || [];
          const updatedList = userSocketList.filter((id) => id !== socket.id);

          if (updatedList.length === 0) {
            this.userSockets.delete(userId);
          } else {
            this.userSockets.set(userId, updatedList);
          }
        }
        console.log("🔌 Cliente desconectado:", socket.id);
      });
    });
  }

  sendNotificationToUsers(userIds: number[], notification: any) {
    userIds.forEach((userId) => {
      const socketIds = this.userSockets.get(userId);
      if (socketIds) {
        socketIds.forEach((socketId) => {
          this.io.to(socketId).emit("new-notification", notification);
          console.log(
            `📨 Notificação enviada para usuário ${userId} via socket ${socketId}`,
          );
        });
      }
    });
  }

  getIO() {
    return this.io;
  }
}

let webSocketServer: WebSocketServer;

export const initializeWebSocket = (server: HttpServer) => {
  webSocketServer = new WebSocketServer(server);
  return webSocketServer;
};

export const getWebSocketServer = () => webSocketServer;
