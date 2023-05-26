import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import Schedule from "./ScheduleEntity";

// TODO: fix the spacing for tabs

@Entity("users")
class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default: "staff",
  })
  role: string;

  @Column({
    default: false,
  })
  deleted: boolean;

  @OneToMany((type) => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    update: false,
  })
  createdAt: Date;
  // TODO: create a updatedAt and test when update a register

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, process.env.PASSWORD_SALT);
  }
}
export default User;
