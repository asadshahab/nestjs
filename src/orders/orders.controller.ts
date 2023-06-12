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
import { OrderConstant } from '../utils/constants/message-constants';
// import { PaginationResponse } from '../utils/common/dto/pagination-response';
import { Order } from './entities/order.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   *
   * @Body createOrderDto
   * @Auth bearer token
   * @returns the order created
   */
  @Post('/create')
  @ApiSecurity('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(ValidationPipe)
  async orderCreate(@Body() createOrderDto: CreateOrderDto, @Req() reqUser): Promise<OrderResponsePayload> {
    createOrderDto.user = reqUser.user;
    const order = await this.ordersService.createOrder(createOrderDto);
    return {
      response: { status: HttpStatus.CREATED, message: OrderConstant.orderCreated },
      order,
    };
  }

  /**
   *@description get all orders
   * @param CreateOrderDto
   * @Auth bearer token
   * @returns
  //  */
  // @Get('/view')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // async findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number): Promise<PaginationResponse<Order>> {
  //   const orderData = await this.ordersService.paginate({
  //     page,
  //     limit,
  //   });
  //   return {
  //     response: { status: HttpStatus.OK, message: MessageConstant.orderRetrieved },
  //     data: orderData,
  //   };
  // }

  /**
   * @description get one order
   * @param id
   * @Auth bearer token
   * @returns return the order
   */

  @Get('/view/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
