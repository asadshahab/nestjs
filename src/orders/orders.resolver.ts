import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponsePayload } from './dto/oreder-response.dto';
import { OrderConstant } from '../utils/constants/message-constants';
import { GqlAuthGuard } from '../user/auth/jwt-auth-guard';
import { RolesGuard } from '../user/auth/role.guard';
import { User, UserRole } from '../user/user.entity';
import { CurrentUser } from '../utils/common/decorator/current-user-decorator';

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  @Query(() => Order)
  async orderById(@Args('id') id: number, @CurrentUser() user: User): Promise<OrderResponsePayload> {
    const order = await this.ordersService.findById(id, user);
    return { response: {status: HttpStatus.OK, message: OrderConstant.orderRetrieved,  }, order };
  }

  @Mutation(() => OrderResponsePayload)
  async createOrder(@Args('createOrderInput') createOrderInput: CreateOrderDto): Promise<OrderResponsePayload> {
    console.log('createOrderInput', createOrderInput);
    const order = await this.ordersService.createOrder(createOrderInput);
    return { response: {status: HttpStatus.OK, message: OrderConstant.orderCreated,  }, order };
  }

  @Mutation(() => OrderResponsePayload)
  async updateOrder(@Args('id') id: number, @Args('updateOrderInput') updateOrderInput: CreateOrderDto, @CurrentUser() user:User): Promise<OrderResponsePayload> {
    const order = await this.ordersService.updateOrder(id, updateOrderInput, user);
    return { response: {status: HttpStatus.OK, message: OrderConstant.orderUpdated,  }, order };
  }

  @Mutation(() => OrderResponsePayload)
  async deleteOrder(@Args('id') id: number, @CurrentUser() user:User): Promise<OrderResponsePayload> {
    const order = await this.ordersService.deleteOrder(id, user);
    return { response: {status: HttpStatus.OK, message: OrderConstant.orderDeleted,  }, order };
  }
}
