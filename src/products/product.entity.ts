import { BaseEntity, Column, Entity, In, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
});

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field((type) => Int)
  @Column()
  price: number;

  @Field()
  @Column()
  status: string;

  @Field(() => Order)
  @ManyToMany((type) => Order, (order) => order.product)
  @JoinTable({ name: 'orderProduct' })
  order: Order;
}
