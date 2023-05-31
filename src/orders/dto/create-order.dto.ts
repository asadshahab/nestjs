import { IsNotEmpty } from 'class-validator';
import { User } from 'src/auth/auth.entity';
import { Product } from 'src/products/product.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  productList: { product: Product; quantity: number }[];
  user: User;
  status?: string;
}
