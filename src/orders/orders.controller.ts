import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/auth/auth.entity';
import { Product } from 'src/products/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/role.guard';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(ValidationPipe)
  create(@Body() createOrderDto: CreateOrderDto, @Req() reqUser) {
    console.log('user', reqUser.user);
    // get id from the user

    createOrderDto.user = reqUser.user;
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll(
    @Query('id') CreateOrderDto: CreateOrderDto,
    @Req() reqUser,
  ): Promise<Order[]> {
    return this.ordersService.findAll(reqUser.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findOne(@Param('id') id: number, @Req() reqUser): Promise<Order> {
    const user = reqUser.user;
    const data = this.ordersService.findOne(id, user);
    return data;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.ordersService.remove(+id);
  }
}
