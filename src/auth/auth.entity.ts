import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Order } from 'src/orders/entities/order.entity';

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
  role: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany((type) => Order, (order) => order.user)
  order: Order;
}
