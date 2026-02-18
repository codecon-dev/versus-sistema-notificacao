import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:3000";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL);

    this.socket.on("connect", () => {
      console.log("✅ WebSocket conectado");
      this.socket?.emit("authenticate", token);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ WebSocket desconectado");
    });
  }

  onNotification(callback: (notification: any) => void) {
    this.socket?.on("new-notification", callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
