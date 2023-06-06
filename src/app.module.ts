import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import configServices from './config/configServices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configServices] }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductsModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
