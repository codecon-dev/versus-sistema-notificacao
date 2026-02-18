import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Notification } from "../entities/Notification";
import { NotificationRecipient } from "../entities/NotificationRecipient";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "notifications",
  synchronize: true, // Em produção, usar migrations
  logging: false,
  entities: [User, Notification, NotificationRecipient],
  subscribers: [],
  migrations: [],
});
