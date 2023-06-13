import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { User } from '../user.entity';
import PaginationPayloadInterface from '../../pagination/dto/pagination-payload-interface.dto';

@ObjectType()
export class AuthPaginationResponse extends PaginationPayloadInterface<User> {
    @Field(() => [User])
    data: User[];
}
