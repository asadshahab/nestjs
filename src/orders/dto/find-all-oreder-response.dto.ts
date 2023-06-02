import { ResponsePayload } from 'src/common/dto/index.dto';
import { Order } from '../entities/order.entity';

export class FindAllOrderResponsePayload extends ResponsePayload {
  data: Order[];
}
