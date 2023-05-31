import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product';
import { FilterProductDto } from './dto/filter.product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * @param
   */
  async findOneAndCreate(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllProducts(filterProductDto: FilterProductDto): Promise<Product[]> {
    try {
      const { name, status } = filterProductDto;
      const query = this.productRepository.createQueryBuilder('product');
      if (name) {
        console.log(name);
        query.andWhere('product.name LIKE :name', { name: `%${name}%` });
      }
      if (status) {
        query.andWhere('product.status = :status', { status: status });
      }
      const data = await query.getMany();
      if (data.length === 0) throw new NotFoundException('No product found');
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // create a method that will be used to return a single product
  async getProductById(id: number): Promise<Product> {
    try {
      const data = await this.productRepository.findOne({ where: { id: id } });
      if (!data) throw new NotFoundException(`Product with id ${id} not found`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // get by id for order
  async getProductByIdForOrder(name: string): Promise<Product> {
    try {
      const data = await this.productRepository.findOne({
        where: { name: name },
      });
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // create a method that will be used to create a new product
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const data = await this.productRepository.save(createProductDto);
    if (!data) throw new BadRequestException(`Product not created`);
    return data;
  }

  // create a method that will be used to update a product
  async updateProductById(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.getProductById(id);
      Object.assign(product, updateProductDto);
      const updatedProduct = await this.productRepository.save(product);

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // create a method that will be used to delete a product
  async deleteProductById(id: number): Promise<void> {
    try {
      const data = await this.getProductById(id);
      if (data) {
        const deletedData = await this.productRepository.delete(id);
        if (deletedData.affected == 0) {
          throw new NotFoundException(`Product with id ${id} not found`);
        } else {
          return;
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
