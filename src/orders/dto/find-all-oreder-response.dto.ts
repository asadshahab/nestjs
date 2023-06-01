import { ResponsePayload } from 'src/dto/index.dto';
import { Order } from '../entities/order.entity';

export class FindAllOrderResponsePayload extends ResponsePayload {
  data: Order[];
}
