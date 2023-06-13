import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product';
import { FilterProductDto } from './dto/filter.product.dto';
import { ProductConstant } from '../utils/constants/message-constants';
import PaginationPayloadInterface from '../pagination/dto/pagination-payload-interface.dto';
import { PaginationService } from '../pagination/pagination.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>, private readonly paginationService: PaginationService
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
        throw new NotFoundException(ProductConstant.productNotFound);
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

  async paginateProduct(page:number, limit:number): Promise<PaginationPayloadInterface<Product>> {
    return this.paginationService.paginate<Product>(this.productRepository, page, limit);
  }

  /**
   * @description find product by id
   * @param id
   * @returns The product with the specified ID.
   */
  async getProductById(id: number): Promise<Product> {
    try {
      const data = await this.productRepository.findOne({ where: { id } });
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
      throw new BadRequestException(ProductConstant?.productExist);
    }
    const productData = this.productRepository.create(createProductDto);
    return await productData?.save();;
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
      if (!product) {
        throw new NotFoundException(ProductConstant?.productNotFound);
      }
      return await this.productRepository.save({ ...product, ...updateProductDto });
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
      if (!data) {
        throw new NotFoundException(ProductConstant?.productNotFound);
      }
      const deletedData = await this.productRepository.delete(id);
      if (deletedData.affected == 0) {
        throw new NotFoundException(ProductConstant?.productNotDeleted);
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
