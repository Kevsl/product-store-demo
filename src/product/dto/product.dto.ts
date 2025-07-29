import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: 'Product 1',
    description: 'Product name',
  })
  @Length(3, 60)
  @IsString()
  name: string;

  @ApiProperty({
    example: 22.34,
    description: 'Product price',
  })
  @IsDecimal()
  price: number;

  @ApiProperty({
    example: true,
    description: 'Product is available?',
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    example: ['122121K-3232323-3232'],
    description: 'Product categories UUID',
  })
  @IsArray()
  @IsUUID(4, { each: true })
  productCategories: string[];

  @IsString()
  @Length(5, 250)
  keywords: string;
}
