import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('products')
export class ProductsController {
  //@des
  // create a constructor with a private property
  // that will be used to inject the service
  constructor(private readonly productsService: ProductsService) {}

  //@des
  // create a method that will be used to handle
  // the GET request to the /products endpoint
  // and return the list of products
  @Get('/')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['admin'])
  getAllProducts(
    @Query(ValidationPipe) filterProductDto: FilterProductDto,
  ): Promise<Product[]> {
    return this.productsService.getAllProducts(filterProductDto);
  }

  //@des
  // create a method that will be used to handle
  // the GET request to the /products/:id endpoint
  // and return a single product
  @Get('/:id')
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getProductById(id);
  }
  //@des
  // create a method that will be used to handle
  // the POST request to the /products endpoint
  // and create a new product
  @Post('/')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['superAdmin'])
  @UsePipes(ValidationPipe)
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }
  // @des
  // create a method that will be used to handle
  // the patch request to the /products/:id endpoint
  // and update a single product
  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['superAdmin', 'admin'])
  updateProductById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ProductValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProductById(id, updateProductDto);
  }

  // @des
  // create a method that will be used to handle
  // the DELETE request to the /products/:id endpoint
  // and delete a single product
  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['superAdmin'])
  deleteProductById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.deleteProductById(id);
  }
}
