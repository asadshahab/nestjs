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
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/auth/role.guard';
import { OrderResponsePayload } from './dto/oreder-response.dto';
import { OrderConstant } from '../utils/constants/message-constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import PaginationPayloadInterface from '../pagination/dto/pagination-payload-interface.dto';
import { Order } from './entities/order.entity';

@Controller('order')
@ApiTags('Order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   *
   * @Body createOrderDto
   * @returns the order created
   */
  @Post('/create')
  @ApiSecurity('JWT-auth')
  @UsePipes(ValidationPipe)
  async orderCreate(@Body() createOrderDto: CreateOrderDto, @Req() reqUser): Promise<OrderResponsePayload> {
    createOrderDto.user = reqUser.user;
    const order = await this.ordersService.createOrder(createOrderDto);
    return { response: { status: HttpStatus.CREATED, message: OrderConstant.orderCreated }, order }}

  /**
   *@description get all orders
   * @param Page, limit
   * @returns User orders with pagination
    */
  @Get('/view')
  async getProducts(@Query('page') page: number, @Query('limit') limit: number): Promise<PaginationPayloadInterface<Order>> {
    return this.ordersService.paginateOrder(page, limit);
  }

  /**
   * @description get one order
   * @param id
   * @Auth bearer token
   * @returns return the order
   */

  @Get('/view/:id')
  @ApiSecurity('JWT-auth')
  async findById(@Param('id') id: number, @Req() reqUser): Promise<OrderResponsePayload> {
    const user = reqUser.user;
    const order = await this.ordersService.findById(id, user);
    return { response: { status: HttpStatus.OK, message: OrderConstant.orderRetrieved }, order };
  }

  /**
   * @description update one order
   * @param id
   * @body updateOrderDto
   * @Auth bearer token
   * @returns return the order
   */
  @Put('/edit/:id')
  @ApiSecurity('JWT-auth')
  async orderUpdate(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto, @Req() reqUser) {
    const { user } = reqUser;
    const order = await this.ordersService.updateOrder(id, updateOrderDto, user);
    return { response: { status: HttpStatus.OK, message: OrderConstant.orderUpdated }, order };
  }

  /**
   * @description delete one order
   * @param id
   * @Auth bearer token
   * @returns return the order
   */
  @Delete('/delete/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async orderDelete(@Param('id') id: number, @Req() reqUser): Promise<OrderResponsePayload> {
    const { user } = reqUser;
    const order = await this.ordersService.deleteOrder(id, user);
    return { response: { status: HttpStatus.OK, message: OrderConstant.orderDeleted }, order };
  }
}
