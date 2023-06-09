import { PickType } from '@nestjs/mapped-types';
import { AuthSignupDto } from './auth-singup.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class AuthSignInDto extends PickType(AuthSignupDto, ['email', 'password', 'username']) {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  password: string;
}
