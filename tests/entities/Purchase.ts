import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Purchase {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", nullable: false, precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => User, user => user.purchases, {
    nullable: false
  })
  user: User;
}
