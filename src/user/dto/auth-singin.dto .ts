import { PickType } from '@nestjs/mapped-types';
import { AuthSignupDto } from './auth-singup.dto';
export class AuthSignInDto extends PickType(AuthSignupDto, ['email', 'password', 'username']) {}
