import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
  HttpStatus,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/auth/role.guard';
import { OrderResponsePayload } from './dto/oreder-response.dto';
import { MessageConstant } from '../utils/constants/order-message-constants';
import { PaginationResponse } from '../utils/common/dto/pagination-response';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   *
   * @Body createOrderDto
   * @Auth bearer token
   * @returns the order created
   */
  @Post('/create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(ValidationPipe)
  async orderCreate(@Body() createOrderDto: CreateOrderDto, @Req() reqUser): Promise<OrderResponsePayload> {
    createOrderDto.user = reqUser.user;
    const orderData = await this.ordersService.createOrder(createOrderDto);
    return {
      response: { status: HttpStatus.CREATED, message: MessageConstant.orderCreated },
      data: orderData,
    };
  }

  /**
   *@description get all orders
   * @param CreateOrderDto
   * @Auth bearer token
   * @returns
   */
  @Get('/view')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number): Promise<PaginationResponse<Order>> {
    const orderData = await this.ordersService.paginate({
      page,
      limit,
    });
    return {
      response: { status: HttpStatus.OK, message: MessageConstant.orderRetrieved },
      data: orderData,
    };
  }

  /**
   * @description get one order
   * @param id
   * @Auth bearer token
   * @returns return the order
   */

  @Get('/view/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findById(@Param('id') id: number, @Req() reqUser): Promise<OrderResponsePayload> {
    const user = reqUser.user;
    const data = await this.ordersService.findById(id, user);
    return { response: { status: HttpStatus.OK, message: MessageConstant.orderRetrieved }, data: data };
  }

  /**
   * @description update one order
   * @param id
   * @body updateOrderDto
   * @Auth bearer token
   * @returns return the order
   */
  @Put('/edit/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async orderUpdate(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto, @Req() reqUser) {
    const { user } = reqUser;
    const orderData = await this.ordersService.updateOrder(id, updateOrderDto, user);
    return { response: { status: HttpStatus.OK, message: MessageConstant.orderUpdated }, data: orderData };
  }

  /**
   * @description delete one order
   * @param id
   * @Auth bearer token
   * @returns return the order
   */
  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async orderDelete(@Param('id') id: number, @Req() reqUser): Promise<OrderResponsePayload> {
    const { user } = reqUser;

    const orderData = await this.ordersService.deleteOrder(id, user);
    return { response: { status: HttpStatus.OK, message: MessageConstant.orderDeleted }, data: orderData };
  }
}
