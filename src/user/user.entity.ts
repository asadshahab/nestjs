import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from '../orders/entities/order.entity';

export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superAdmin',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
}
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: false })
  email?: string;

  @Column()
  phoneNum: string;

  @Column()
  role: UserRole;

  @Column()
  @Exclude()
  password: string;

  @OneToMany((type) => Order, (order) => order.user)
  order: Order;
}
