import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../../../user/user.entity';
import { ResponsePayload } from 'src/utils/common/dto/index.dto';
import { Product } from 'src/products/product.entity';
import { Order } from 'src/orders/entities/order.entity';

export class PaginationResponse extends ResponsePayload {
  // pass optional type of data like order and user
  data: Pagination<any>;
}
