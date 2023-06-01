import { ResponsePayload } from 'src/dto/index.dto';
import { User } from '../auth.entity';

export class AuthResponsePayload extends ResponsePayload {
  data: User[];
  accessToken?: string;
}
