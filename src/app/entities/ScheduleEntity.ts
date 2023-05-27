import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import User from "./UserEntity";
/**
 * @openapi
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         shiftHours:
 *           type: number
 *           format: float
 *         createdAt:
 *           type: string
 *           format: date-time
 */
@Entity("schedules")
class Schedule {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  date: Date;

  @Column({ type: "float" })
  shiftHours: number;

  @ManyToOne((type) => User, (user) => user.schedules)
  @Index()
  user: User;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    update: false,
  })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
export default Schedule;
