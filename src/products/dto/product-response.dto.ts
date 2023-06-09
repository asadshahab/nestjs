import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { Product } from '../product.entity';

@ObjectType()
export class ProductResponsePayload extends ResponsePayload {
  @Field(() => Product, { nullable: true })
  product: Product;
}
