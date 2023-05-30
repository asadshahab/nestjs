import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../user-role.enum';
import { Exclude } from 'class-transformer';
import { User } from '../auth.entity';

export class AuthSignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

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
