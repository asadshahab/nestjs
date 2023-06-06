import { User } from 'src/user/user.entity';
import { Product } from 'src/products/product.entity';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  //   create a relation with the product entity
  @ManyToMany((type) => Product, (product) => product.order, { cascade: true })
  product: Product[];

  @ManyToOne((type) => User, (user) => user.order)
  user: User;

  @Column()
  quantity: number;

  @Column()
  status: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: string;
}
