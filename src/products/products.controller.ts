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
import { ProductConstant } from '../utils/constants/message-constants';
import {  UserRole } from '../user/user.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import PaginationPayloadInterface from '../pagination/dto/pagination-payload-interface.dto';

@Controller('product')
@ApiTags('Product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   *
   * @param page
   * @param limit 
   * @returns return a list of products with pagination
   */
  @Get('/view')
  async getProducts( @Query('page') page: number, @Query('limit') limit: number): Promise<PaginationPayloadInterface<Product>> {
    return this.productsService.paginateProduct(page, limit);
  }

  /**
   *
   * @param id
   * @returns return a single product
   */
  @Get('/view/:id')
  @ApiSecurity('JWT-auth')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponsePayload> {
    const product = await this.productsService.getProductById(id);
    return {response: {status: HttpStatus.OK, message: ProductConstant.productRetrieved}, product}; }

  /**
   *
   * @param createProductDto
   * @returns
   */
  @Post('/create')
  @UsePipes(ValidationPipe)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductResponsePayload> {
    const product = await this.productsService.createProduct(createProductDto);
    return {response: { status: HttpStatus.CREATED,message: ProductConstant?.productCreated }, product};
  }

  /**
   *
   * @param id
   * @Body updateProductDto
   * @returns
   */
  @Put('/edit/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  async updateProductById(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponsePayload> {
    const product = await this.productsService.updateProductById(id, updateProductDto);
    return {response: { status: HttpStatus.OK, message: ProductConstant.productUpdated }, product};
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete('/delete/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN, UserRole.ADMIN])
  async deleteProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponsePayload> {
    const product = await this.productsService.deleteProductById(id);
    return {response: {status: HttpStatus.OK, message: ProductConstant.productDeleted}, product}; 
  }
}
