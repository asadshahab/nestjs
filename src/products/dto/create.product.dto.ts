// DTO for creating a product

import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductStatus } from '../product.entity';
import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  description?: string;

  @Field((type) => Float)
  price?: number;

  @Field((type) => ProductStatus, { defaultValue: ProductStatus.ACTIVE })
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
