import { ResponsePayload } from 'src/dto/index.dto';
import { Product } from '../product.entity';

export class ProductResponsePayload extends ResponsePayload {
  data: Product;
}
