import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { QueryParamsDto } from 'src/utils/commonDtos';
import { ProductCategoryDto } from './dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @ApiOkResponse({ type: ProductCategoryDto, isArray: false })
  @Post()
  create(@Body() dto: ProductCategoryDto) {
    return this.productCategoryService.create(dto);
  }

  @ApiOkResponse({ type: ProductCategoryDto, isArray: true })
  @Get()
  findAll(@Query() dto: QueryParamsDto) {
    return this.productCategoryService.findAll(dto);
  }

  @ApiOkResponse({ type: ProductCategoryDto, isArray: false })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(id);
  }

  @ApiOkResponse({ type: ProductCategoryDto, isArray: false })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: ProductCategoryDto) {
    return this.productCategoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(id);
  }
}
