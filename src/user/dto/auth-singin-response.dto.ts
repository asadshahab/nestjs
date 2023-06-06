import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { User } from '../user.entity';

export class AuthSingInResponsePayload extends ResponsePayload {
  user: User;
  accessToken?: string;
}
