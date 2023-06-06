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
import { Product } from './product.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/auth/role.guard';
import { ProductResponsePayload } from './dto/product-response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MessageConstant } from './message-constants';
import { User, UserRole } from 'src/user/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   *
   * @param filterProductDto
   * @returns return a list of products
   */
  @Get('/getAll')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  getAllProducts(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number): Promise<Pagination<Product>> {
    return this.productsService.paginate({ page, limit });
  }

  /**
   *
   * @param id
   * @returns return a single product
   */
  @Get('/getById/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponsePayload> {
    const product = await this.productsService.getProductById(id);
    return {
      response: {
        status: HttpStatus.OK,
        message: MessageConstant.productRetrieved,
      },
      data: product,
    };
  }

  /**
   *
   * @param createProductDto
   * @returns
   */
  @Post('/addProduct')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  @UsePipes(ValidationPipe)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductResponsePayload> {
    const product = await this.productsService.createProduct(createProductDto);
    return {
      response: {
        status: HttpStatus.CREATED,
        message: MessageConstant.productCreated,
      },
      data: product,
    };
  }

  /**
   *
   * @param id
   * @Body updateProductDto
   * @returns
   */
  @Put('/update/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  async updateProductById(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponsePayload> {
    const updatedProduct = await this.productsService.updateProductById(id, updateProductDto);
    return {
      response: {
        status: HttpStatus.OK,
        message: MessageConstant.productUpdated,
      },
      data: updatedProduct,
    };
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  async deleteProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponsePayload> {
    const deletedProduct = await this.productsService.deleteProductById(id);
    return {
      response: {
        status: HttpStatus.OK,
        message: MessageConstant.productDeleted,
      },
      data: deletedProduct,
    };
  }
}
