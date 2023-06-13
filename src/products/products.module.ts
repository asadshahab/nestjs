import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { AuthModule } from '../user/user.module';
import { ProductsResolver } from './products.resolver';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, PaginationModule],

  controllers: [ProductsController],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService],
})
export class ProductsModule {}
