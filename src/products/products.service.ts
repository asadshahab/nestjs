import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product';
import { FilterProductDto } from './dto/filter.product.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { MessageConstant } from '../utils/constants/product-message-constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

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
        query.andWhere('product.name LIKE :name', { name: `${name}%` });
      }
      if (status) {
        query.andWhere('product.status = :status', { status });
      }
      const data = await query.getMany();
      if (data.length === 0) {
        throw new NotFoundException(MessageConstant.productNotFound);
      }
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
      const data = await this.productRepository.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException(MessageConstant.productNotFound);
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description find product by name
   * @param id
   * @returns The product with the specified name.
   */
  async getProductByIdForOrder(id: number): Promise<Product> {
    try {
      const data = await this.productRepository.findOne({
        where: { id },
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
    const { name } = createProductDto;
    const product = await this.productRepository.findOne({ where: { name } });
    if (product) {
      throw new BadRequestException(MessageConstant.productExist);
    }
    const data = await this.productRepository.save(createProductDto);
    if (!data) {
      throw new BadRequestException(MessageConstant.productNotCreated);
    }
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
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(MessageConstant.productNotFound);
      }

      // update the changes fileds only
      const updatedProduct =
        updateProductDto.name && updateProductDto.status
          ? await this.productRepository.save({ ...product, ...updateProductDto })
          : await this.productRepository.save({ ...product, ...updateProductDto });

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
      const data = await this.productRepository.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException(MessageConstant.productNotFound);
      }

      const deletedData = await this.productRepository.delete(id);
      if (deletedData.affected == 0) {
        throw new NotFoundException(MessageConstant.productNotDeleted);
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
