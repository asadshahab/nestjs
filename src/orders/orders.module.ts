import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { AuthModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { OrdersResolver } from './orders.resolver';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), AuthModule, ProductsModule, PaginationModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
