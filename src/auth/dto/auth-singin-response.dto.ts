import { ResponsePayload } from 'src/dto/index.dto';
import { User } from '../auth.entity';

export class AuthSingInResponsePayload extends ResponsePayload {
  data: User;
  accessToken?: string;
}
