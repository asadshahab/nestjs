import { Injectable, NotFoundException } from '@nestjs/common';

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

  // create a method that will be used to return the list of products
  async getAllProducts(filterProductDto: FilterProductDto): Promise<Product[]> {
    // do this with the query builder with dynamic queries
    const { name, status } = filterProductDto;
    const query = this.productRepository.createQueryBuilder('product');
    if (name) {
      console.log(name);
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
      // query.andWhere('product.name = :name', { name: name });
    }
    if (status) {
      query.andWhere('product.status = :status', { status: status });
    }
    const data = await query.getMany();
    if (data.length === 0) throw new NotFoundException('No product found');
    return data;
  }

  // create a method that will be used to return a single product
  async getProductById(id: number): Promise<Product> {
    const data = await this.productRepository.findOne({ where: { id: id } });
    if (!data) throw new NotFoundException(`Product with id ${id} not found`);
    return data;
  }

  // create a method that will be used to create a new product
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const data = await this.productRepository.save(createProductDto);
    if (!data) throw new NotFoundException(`Product not created`);
    return data;
  }

  // create a method that will be used to update a product
  async updateProductById(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);

    // Update the desired keys of the product object with the new values
    Object.assign(product, updateProductDto);

    // Save the updated product back to the database
    const updatedProduct = await this.productRepository.save(product);

    return updatedProduct;
  }

  // create a method that will be used to delete a product
  async deleteProductById(id: number): Promise<void> {
    const data = await this.getProductById(id);
    if (data) {
      const deletedData = await this.productRepository.delete(id);
      if (deletedData.affected == 0) {
        throw new NotFoundException(`Product with id ${id} not found`);
      } else {
        return;
      }
    }
  }
}
