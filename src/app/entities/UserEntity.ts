import bcrypt from "bcryptjs";
import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Schedule from "./ScheduleEntity";

// TODO: fix the spacing for tabs

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
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

  @OneToMany((type) => Schedule, (schedule) => schedule.user, {
    cascade: true,
  })
  schedules: Schedule[];

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    update: false,
  })
  createdAt: Date;
  // TODO: create a updatedAt and test when update a register

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(
      this.password,
      parseInt(process.env.PASSWORD_SALT || "10")
    );
  }
}
export default User;
