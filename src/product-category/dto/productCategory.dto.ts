import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ProductCategoryDto {
  @ApiProperty({
    example: 'Product Category 1',
    description: 'Product Category name',
  })
  @IsString()
  @Length(1, 60)
  name: string;
}
