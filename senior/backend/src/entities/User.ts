import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { NotificationRecipient } from "./NotificationRecipient";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password_hash!: string;

  @Column({ default: false })
  is_admin!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => NotificationRecipient, (recipient) => recipient.user)
  notifications!: NotificationRecipient[];
}
