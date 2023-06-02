// DTO for creating a product

import { IsNotEmpty } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  description?: string;

  price?: number;

  status?: ProductStatus;
}
