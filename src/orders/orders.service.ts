import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/user.entity';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>, private productService: ProductsService) {}

  /**
   * @description create order
   * @param createOrderDto
   * @returns return the  created order
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { productList, status, user } = createOrderDto;

      const products: Product[] = productList.map((product) => product.product);
      await Promise.all(
        products.map(async (element) => {
          const productData = await this.productService.getProductByIdForOrder(element.id);
          if (!productData) {
            throw new NotFoundException('Product not found');
          }
        }),
      );

      const orderInstances = await this.orderRepository.create({
        status: status,
        product: products,
        user: user,
        quantity: 2,
      });
      return await orderInstances.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description get all orders
   * @param user
   * @returns return all orders
   */
  async findAll(user: User) {
    try {
      const data = await this.orderRepository.find({
        relations: ['user', 'product'],
        select: ['id', 'status', 'quantity'],
        where: { user: { id: user.id } },
      });

      // no data found exception

      if (data.length === 0) {
        throw new NotFoundException('No order found');
      }

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description Paginate all Orders
   * @param options
   * @returns all Orders
   * @returns pagination
   * @returns total Orders
   */

  async paginate(options: IPaginationOptions): Promise<Pagination<Order>> {
    const queryBuilder = await this.orderRepository.createQueryBuilder('orders');
    return paginate<Order>(queryBuilder, options);
  }

  /**
   * @description get one order
   * @param id
   * @param user
   * @returns return one order
   */
  async findById(id: number, user: User): Promise<Order> {
    try {
      const orderData = await this.orderRepository.findOne({
        relations: ['user', 'product'],
        where: { id, user: { id: user.id } },
      });

      // no data found exception
      if (!orderData) {
        throw new NotFoundException('Order not found');
      }

      return orderData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description update order
   * @param id
   * @param updateOrderDto
   * @param user
   * @returns return the updated order
   */
  async updateOrder(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    try {
      const { status, productList } = updateOrderDto;
      // check the order exists or not
      const orderData = await this.orderRepository.findOne({
        where: { id, user: { id: user.id } },
      });
      if (!orderData) {
        throw new NotFoundException('Order not found');
      }
      await Promise.all(
        productList.map(async (product) => {
          const productId = product.product.id;
          const productData = await this.productService.getProductByIdForOrder(productId);
          if (!productData) {
            throw new NotFoundException('Product not found');
          }
        }),
      );
      const updateData = await this.orderRepository.save({
        status: status,
        quantity: productList.length,
      });

      return updateData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description remove order
   * @param id
   * @param user
   * @returns return the deleted order
   */
  async deleteOrder(id: number, user: User) {
    try {
      // check the order exists or not
      const orderData = await this.orderRepository.findOne({
        where: { id, user: { id: user.id } },
      });
      if (!orderData) {
        throw new NotFoundException('Order not found');
      }
      await this.orderRepository.delete(id);
      // delete the order
      return orderData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
