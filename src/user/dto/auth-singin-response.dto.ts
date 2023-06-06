import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { User } from '../user.entity';

export class AuthSingInResponsePayload extends ResponsePayload {
  data: User;
  accessToken?: string;
}
