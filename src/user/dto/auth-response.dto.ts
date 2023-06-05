import { ResponsePayload } from 'src/utils/common/dto/index.dto';
import { User } from '../user.entity';

export class AuthResponsePayload extends ResponsePayload {
  data: User[];
  accessToken?: string;
}
