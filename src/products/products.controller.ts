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
import { RolesGuard } from '../user/auth/role.guard';
import { ProductResponsePayload } from './dto/product-response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MessageConstant } from '../utils/constants/product-message-constants';
import { User, UserRole } from '../user/user.entity';
import { PaginationResponse } from 'src/utils/common/dto/pagination-response';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   *
   * @param filterProductDto
   * @returns return a list of products
   */
  @Get('/view')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  async getAllProducts(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number): Promise<PaginationResponse<Product>> {
    const data = await this.productsService.paginate({
      page,
      limit,
    });
    return {
      response: { status: HttpStatus.OK, message: MessageConstant.productRetrieved },
      data,
    };
  }

  /**
   *
   * @param id
   * @returns return a single product
   */
  @Get('/view/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponsePayload> {
    const product = await this.productsService.getProductById(id);
    return {
      response: {
        status: HttpStatus.OK,
        message: MessageConstant.productRetrieved,
      },
      product,
    };
  }

  /**
   *
   * @param createProductDto
   * @returns
   */
  @Post('/create')
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
      product,
    };
  }

  /**
   *
   * @param id
   * @Body updateProductDto
   * @returns
   */
  @Put('/edit/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  async updateProductById(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponsePayload> {
    const product = await this.productsService.updateProductById(id, updateProductDto);
    return {
      response: {
        status: HttpStatus.OK,
        message: MessageConstant.productUpdated,
      },
      product,
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
    const product = await this.productsService.deleteProductById(id);
    return {
      response: {
        status: HttpStatus.OK,
        message: MessageConstant.productDeleted,
      },
      product,
    };
  }
}
