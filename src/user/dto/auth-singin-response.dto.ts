import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class AuthSingInResponsePayload extends ResponsePayload {
  @ApiProperty({ type: User })
  @Field(() => User)
  user: User;

  @ApiProperty({ type: String })
  @Field()
  accessToken?: string;
}
