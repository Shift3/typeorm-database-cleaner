import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Purchase } from './Purchase';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToMany(() => Purchase, purchase => purchase.user)
    purchases: Purchase[];
}
