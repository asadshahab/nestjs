import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthSignupDto } from './auth-singup.dto';
export class AuthSignInDto extends PickType(AuthSignupDto, [
  'email',
  'password',
  'username',
]) {}
