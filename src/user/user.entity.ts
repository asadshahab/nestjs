import { BaseEntity, Column, Entity, In, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from '../orders/entities/order.entity';
import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superAdmin',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
}
registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  username: string;

  @Field()
  @Column({ nullable: false })
  email?: string;

  @Field()
  @Column()
  phoneNum: string;

  @Field((type) => UserRole)
  @Column()
  role: UserRole;

  @Field()
  @Column()
  @Exclude()
  password: string;

  @Field(() => Order, { nullable: true })
  @OneToMany((type) => Order, (order) => order.user)
  order: Order;
}
