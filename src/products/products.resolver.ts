import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.product.dto';
import { Product } from './product.entity';
import { ProductResponsePayload } from './dto/product-response.dto';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { ProductConstant } from '../utils/constants/message-constants';
import { UpdateProductDto } from './dto/update.product';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../user/user.entity';
import { GqlAuthGuard } from '../user/auth/jwt-auth-guard';
import { RolesGuard } from '../user/auth/role.guard';
// import { PaginationResponse } from '../utils/common/dto/pagination-response';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  //   @Query(() => PaginationResponse)
  //   async products(@Args('page') page: number, @Args('limit') limit: number) {
  //     limit = limit > 100 ? 100 : limit;
  //     return 'hello';
  //   }

  @UseGuards(GqlAuthGuard)
  @Query(() => ProductResponsePayload)
  @SetMetadata('roles', [UserRole.VENDOR])
  async getProductById(@Args('id') id: number): Promise<ProductResponsePayload> {
    console.log('get product by id resolver');
    const product = await this.productsService.getProductById(id);
    return {
      response: {
        status: HttpStatus.OK,
        message: ProductConstant.productRetrieved,
      },
      product,
    };
  }

  @Mutation(() => ProductResponsePayload)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.SUPERADMIN])
  async addProduct(@Args('input') input: CreateProductDto): Promise<ProductResponsePayload> {
    const product = await this.productsService.createProduct(input);
    return { response: { status: HttpStatus.OK, message: ProductConstant.productCreated }, product };
  }

  @Mutation(() => ProductResponsePayload)
  async updateProduct(@Args('id') id: number, @Args('input') input: UpdateProductDto): Promise<ProductResponsePayload> {
    const product = await this.productsService.updateProductById(id, input);
    return {
      response: {
        status: HttpStatus.OK,
        message: ProductConstant.productUpdated,
      },
      product,
    };
  }

  @Mutation(() => ProductResponsePayload)
  @UseGuards(AuthGuard('jwt'))
  @SetMetadata('roles', [UserRole.VENDOR])
  async deleteProduct(@Args('id') id: number): Promise<ProductResponsePayload> {
    console.log('delete product resolver');
    const product = await this.productsService.deleteProductById(id);
    return {
      response: {
        status: HttpStatus.OK,
        message: ProductConstant.productDeleted,
      },
      product,
    };
  }
}
