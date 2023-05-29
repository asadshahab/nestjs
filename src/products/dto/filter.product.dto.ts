import { IsOptional } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  price: number;

  @IsOptional()
  status: string;
}
