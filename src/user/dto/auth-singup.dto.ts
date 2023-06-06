import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User, UserRole } from '../user.entity';

export class AuthSignupDto {
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  phoneNum?: string;

  //   only allow ENUM values
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class accessTokenPayloadDTO {
  accessToken: string;
  user: User;
}
