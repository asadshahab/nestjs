import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayload } from '../../utils/common/dto/index.dto';
import PaginationPayloadInterface from '../../pagination/dto/pagination-payload-interface.dto';
import { Product } from '../product.entity';

@ObjectType()
export class AuthPaginationResponse extends PaginationPayloadInterface<Product> {
    @Field(() => [Product])
    product: Product[];
}
