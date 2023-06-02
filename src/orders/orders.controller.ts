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
  HttpCode,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/auth/auth.entity';
import { Product } from 'src/products/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/role.guard';
import { Order } from './entities/order.entity';
import { OrderResponsePayload } from './dto/oreder-response.dto';
import { FindAllOrderResponsePayload } from './dto/find-all-oreder-response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   *
   * @Body createOrderDto
   * @Auth bearer token
   * @returns the order created
   */
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() createOrderDto: CreateOrderDto, @Req() reqUser): Promise<OrderResponsePayload> {
    createOrderDto.user = reqUser.user;
    const orderData = await this.ordersService.create(createOrderDto);
    return {
      response: { status: HttpStatus.CREATED, message: 'Order created successfully' },
      data: orderData,
    };
  }

  /**
   *@description get all orders
   * @param CreateOrderDto
   * @Auth bearer token
   * @returns
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findAll(
    @Query('id') CreateOrderDto: CreateOrderDto,
    @Req() reqUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    return this.ordersService.paginate({
      page,
      limit,
    });
  }

  /**
   * @description get one order
   * @param id
   * @Auth bearer token
   * @returns return the order
   */

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: number, @Req() reqUser): Promise<OrderResponsePayload> {
    const user = reqUser.user;
    const data = await this.ordersService.findOne(id, user);
    return { response: { status: HttpStatus.OK, message: 'Order retrieved successfully' }, data: data };
  }

  /**
   * @description update one order
   * @param id
   * @body updateOrderDto
   * @Auth bearer token
   * @returns return the order
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto, @Req() reqUser) {
    const { user } = reqUser;
    const orderData = await this.ordersService.findOne(id, user);
    return { response: { status: HttpStatus.OK, message: 'Order updated successfully' }, data: orderData };
  }

  /**
   * @description delete one order
   * @param id
   * @Auth bearer token
   * @returns return the order
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async remove(@Param('id') id: number, @Req() reqUser): Promise<OrderResponsePayload> {
    const { user } = reqUser;

    const orderData = await this.ordersService.findOne(id, user);
    return { response: { status: HttpStatus.OK, message: 'Order deleted successfully' }, data: orderData };
  }
}
