import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { Exclude, Expose } from 'class-transformer';

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
}
