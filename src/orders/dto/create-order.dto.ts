import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from '../../user/user.entity';
import { Product } from '../../products/product.entity';
import { OrderStatus } from '../entities/order.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { AuthSignupDto } from '../../user/dto/auth-singup.dto';
import { CreateProductDto } from '../../products/dto/create.product.dto';

@InputType()
export class ProductList {
  @Field(() => CreateProductDto)
  product: Product;
  @Field(() => Int)
  quantity: number;
}
@InputType()
export class CreateOrderDto {
  @Field(() => [ProductList])
  @IsNotEmpty()
  productList: ProductList[];

  @Field((type) => AuthSignupDto)
  user: AuthSignupDto;

  @Field((type) => OrderStatus, { defaultValue: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
