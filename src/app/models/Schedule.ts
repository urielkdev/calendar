import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User";

@Entity("schedules")
class Schedule {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  date: Date;

  @Column()
  shiftHours: number;

  @ManyToOne((type) => User, (user) => user.schedules)
  user: User;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    update: false,
  })
  createdAt: Date;
}
export default Schedule;
