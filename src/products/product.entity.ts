import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductStatus } from './product-status.enum';
import { Order } from 'src/orders/entities/order.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  price: number;
  @Column()
  status: ProductStatus;

  @ManyToMany((type) => Order, (order) => order.product)
  @JoinTable({ name: 'orderProduct' })
  // customized the join table  and add a new field called quantity
  order: Order[];
}
