// DTO for creating a product

import { IsNotEmpty } from 'class-validator';
import { ProductStatus } from '../product-status.enum';

// Path: src/products/dto/create.product.dto.ts
export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  description: string;
  price: number;
  status: ProductStatus;
}
