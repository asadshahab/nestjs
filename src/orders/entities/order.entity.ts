import { User } from '../../user/user.entity';
import { Product } from '../../products/product.entity';
import { BaseEntity, Column, Entity, In, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Product])
  @ManyToMany((type) => Product, (product) => product.order, { cascade: true, onDelete: 'CASCADE' })
  product: Product[];

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.order)
  user: User;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field()
  @Column()
  status: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: string;
}
