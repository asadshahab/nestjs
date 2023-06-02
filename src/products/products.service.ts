import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product';
import { FilterProductDto } from './dto/filter.product.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * @description find one and create
   * @param createProductDto
   * @returns
   */
  async findOneAndCreate(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description find all products
   * @param filterProductDto
   * @returns The array of products that match the filter criteria
   */
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

  /**
   * @description Paginate all products
   * @param options
   * @returns return all products with pagination
   */

  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    const queryBuilder = this.productRepository.createQueryBuilder('orders');
    return paginate<Product>(queryBuilder, options);
  }

  /**
   * @description find product by id
   * @param id
   * @returns The product with the specified ID.
   */
  async getProductById(id: number): Promise<Product> {
    try {
      const data = await this.productRepository.findOne({ where: { id: id } });
      if (!data) throw new NotFoundException(`Product with id ${id} not found`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description find product by name
   * @param name
   * @returns The product with the specified name.
   */
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

  /**
   * @description add a product
   * @param createProductDto
   * @returns the product that was created
   */
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const data = await this.productRepository.save(createProductDto);
    if (!data) throw new BadRequestException(`Product not created`);
    return data;
  }

  /**
   * @description find product by id and update
   * @param id
   * @param updateProductDto
   * @returns The product with the specified ID.
   */
  async updateProductById(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.getProductById(id);
      Object.assign(product, updateProductDto);
      const updatedProduct = await this.productRepository.save(product);

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description find product by id and delete
   * @param id
   * @returns The product with the specified ID.
   */
  async deleteProductById(id: number): Promise<Product> {
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
