import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/auth/auth.entity';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/product.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>, private productService: ProductsService) {}

  /**
   *
   * @param status
   * @param products
   * @param user
   * @returns return the  created order
   */
  async createOrder(status: string, products: Product[], user: User): Promise<Order> {
    try {
      const orderInstance = this.orderRepository.create({
        status: status,
        product: products,
        user: user,
        quantity: 2,
      });
      return await this.orderRepository.save(orderInstance);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description create order
   * @param createOrderDto
   * @returns return the  created order
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { productList, status, user } = createOrderDto;

      const products: Product[] = [];
      for (const product of productList) {
        products.push(product.product);
      }

      for (const element of products) {
        const productData = await this.productService.getProductByIdForOrder(element.name);
        if (!productData) {
          throw new NotFoundException('Product not found');
        }
      }

      const orderInstances = await this.createOrder(status, products, user);
      return orderInstances;
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
   * @description get one order
   * @param id
   * @param user
   * @returns return one order
   */
  async findOne(id: number, user: User): Promise<Order> {
    try {
      const orderData = await this.orderRepository.findOne({
        relations: ['user', 'product'],
        where: { id: id, user: { id: user.id } },
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
  async update(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    try {
      // order exists or not
      this.findOne(id, user);

      // destructuring the updateOrderDto
      const { status, productList } = updateOrderDto;

      // Product exists or not
      for (const product of productList) {
        const productData = this.productService.getProductByIdForOrder(product.product.name);
        if (!productData) {
          throw new NotFoundException('Product not found');
        }
      }

      // update the order quantity and status
      const updateData = await this.orderRepository.update(id, {
        status: status,
        quantity: productList.length,
      });

      // update the order
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
  async remove(id: number, user: User) {
    // order exists or not
    this.findOne(id, user);

    // delete the order
    return await this.orderRepository.delete(id);
  }
}
