import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email?: string;

  @Column()
  phoneNum: string;

  @Column()
  role: UserRole;

  @Column()
  password: string;
}
