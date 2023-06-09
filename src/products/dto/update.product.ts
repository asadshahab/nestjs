import { PartialType } from '@nestjs/graphql';
import { CreateProductDto } from './create.product.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType()
export class UpdateProductDto extends PartialType(CreateProductDto){}

