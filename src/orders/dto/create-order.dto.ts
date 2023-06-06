import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Product } from 'src/products/product.entity';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  productList: { product: Product; quantity: number }[];
  user: User;

  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
