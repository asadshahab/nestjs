import { AuthSignupDto } from './auth-singup.dto';
import {  InputType , PickType} from '@nestjs/graphql';

@InputType()
export class AuthSignInDto extends PickType(AuthSignupDto, ['email', 'password', ] as const) {
}
