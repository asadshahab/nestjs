import { PickType } from '@nestjs/graphql';
import { CreateProductDto } from './create.product.dto';

export class FilterProductDto extends PickType(CreateProductDto, ['description', 'price', 'status']) {
  name?: string;
}
