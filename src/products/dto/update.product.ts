import { ProductStatus } from '../product-status.enum';

export class UpdateProductDto {
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
}
