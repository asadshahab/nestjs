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
          const productData = await this.productService.getProductById(element.id);
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
   * @description Paginate all Orders
   * @param options
   * @returns all Orders
   * @returns pagination
   * @returns total Orders
   */

  async paginate(options: IPaginationOptions): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options);
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
      const orderData = await this.findById(id, user);
      if (!orderData) {
        throw new NotFoundException('Order not found');
      }
      await Promise.all(
        productList.map(async (product) => {
          const productId = product.product.id;
          const productData = await this.productService.getProductById(productId);
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
      const orderData = await this.findById(id, user);
      if (!orderData) {
        throw new NotFoundException('Order not found');
      }
      await this.orderRepository.delete(id);
      return orderData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
