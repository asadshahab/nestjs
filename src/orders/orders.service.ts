import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/auth/auth.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,

    // use the product service to get the product details
    private productService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const { productList, status, user } = createOrderDto;

      const products = [];
      for (const product of productList) {
        products.push(product.product);
      }

      for (const element of products) {
        const productData = await this.productService.getProductByIdForOrder(
          element.name,
        );
        if (!productData) {
          throw new NotFoundException('Product not found');
        }
      }

      const orderInstance = this.orderRepository.create({
        status: status,
        product: products,
        user: user,
        quantity: 2,
      });
      return await this.orderRepository.save(orderInstance);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll(user: User) {
    // find all orders with userId and also send the product details

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
  }

  async findOne(id: number, user: User): Promise<Order> {
    // find one order with userId and also send the product details
    const orderData = await this.orderRepository.findOne({
      relations: ['user', 'product'],
      where: { id: id, user: { id: user.id } },
    });

    // no data found exception
    if (!orderData) {
      throw new NotFoundException('Order not found');
    }

    return orderData;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // order exists or not
    const orderData = this.orderRepository.findOne({ where: { id: id } });

    if (!orderData) {
      throw new NotFoundException('Order not found');
    }

    console.log('order', updateOrderDto);

    // destructuring the updateOrderDto
    const { status, productList } = updateOrderDto;

    // Product exists or not
    for (const product of productList) {
      const productData = this.productService.getProductByIdForOrder(
        product.product.name,
      );
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
  }

  remove(id: number, user: User) {
    // order exists or not
    //  this.findOne(id, user);

    return `This action removes a #${id} order`;
  }
}
