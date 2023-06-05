import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { AuthModule } from 'src/user/user.module';
// import { ProductRepository } from './product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule],

  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
