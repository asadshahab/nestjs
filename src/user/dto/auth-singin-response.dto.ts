import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { User } from '../user.entity';

@ObjectType()
export class AuthSingInResponsePayload extends ResponsePayload {
  @Field(() => User)
  user: User;

  @Field()
  accessToken?: string;
}
