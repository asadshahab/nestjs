// DTO for creating a product

import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  description?: string;
  price?: number;

  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
