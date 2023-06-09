import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User, UserRole } from '../user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class AuthSignupDto {
  @Field()
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsString()
  @Field()
  phoneNum?: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @Field()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}

@ObjectType()
export class accessTokenPayloadDTO {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
