import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateProductDto } from './create.product.dto';

export class FilterProductDto extends PickType(CreateProductDto, ['description', 'price', 'status']) {
  name?: string;
}
