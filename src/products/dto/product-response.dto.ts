import { ResponsePayload } from '../../utils/common/dto/index.dto';
import { Product } from '../product.entity';

export class ProductResponsePayload extends ResponsePayload {
  product: Product;
}
