import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product';
import { FilterProductDto } from './dto/filter.product.dto';
import { ProductValidationPipe } from './pipes/product.validation.pipe';
import { Product } from './product.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/role.guard';
import { ProductResponsePayload } from './dto/product-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   *
   * @param filterProductDto
   * @returns
   */
  @Get('/')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['admin', 'superAdmin'])
  getAllProducts(@Query(ValidationPipe) filterProductDto: FilterProductDto): Promise<Product[]> {
    return this.productsService.getAllProducts(filterProductDto);
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get('/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponsePayload> {
    const product = await this.productsService.getProductById(id);
    const response = {
      status: HttpStatus.OK,
      message: 'Product retrieved successfully',
    };
    return { response, data: product };
  }

  /**
   *
   * @param createProductDto
   * @returns
   */
  @Post('/')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['superAdmin'])
  @UsePipes(ValidationPipe)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductResponsePayload> {
    const product = await this.productsService.createProduct(createProductDto);
    const response = {
      status: HttpStatus.CREATED,
      message: 'Product created successfully',
    };
    return { response, data: product };
  }

  /**
   *
   * @param id
   * @Body updateProductDto
   * @returns
   */
  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['superAdmin', 'admin'])
  async updateProductById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ProductValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<ProductResponsePayload> {
    const updatedProduct = await this.productsService.updateProductById(id, updateProductDto);
    const response = {
      status: HttpStatus.OK,
      message: 'Product updated successfully',
    };
    return { response, data: updatedProduct };
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['superAdmin'])
  async deleteProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponsePayload> {
    const deletedProduct = await this.productsService.deleteProductById(id);
    const response = {
      status: HttpStatus.OK,
      message: 'Product deleted successfully',
    };
    return { response, data: deletedProduct };
  }
}
