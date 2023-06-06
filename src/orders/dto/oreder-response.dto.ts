import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { Order } from '../entities/order.entity';

export class OrderResponsePayload extends ResponsePayload {
  data: Order;
}
