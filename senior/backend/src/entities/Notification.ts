import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { NotificationRecipient } from "./NotificationRecipient";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  message!: string;

  @Column()
  created_by!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => NotificationRecipient, (recipient) => recipient.notification)
  recipients!: NotificationRecipient[];
}
