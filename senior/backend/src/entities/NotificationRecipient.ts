import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Notification } from "./Notification";
import { User } from "./User";

@Entity("notification_recipients")
export class NotificationRecipient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  notification_id!: number;

  @Column()
  user_id!: number;

  @Column({ type: "timestamp", nullable: true })
  read_at!: Date | null;

  @CreateDateColumn()
  received_at!: Date;

  @ManyToOne(() => Notification, (notification) => notification.recipients)
  @JoinColumn({ name: "notification_id" })
  notification!: Notification;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
