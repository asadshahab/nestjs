import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';

export enum ProductStatus {
  // define the values of the enum
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

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
