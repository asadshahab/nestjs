import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { Order } from '../entities/order.entity';

@ObjectType()
export class OrderResponsePayload extends ResponsePayload {
  @Field(() => Order)
  order: Order;
}
