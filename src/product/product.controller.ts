import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto';
import { QueryParamsDto, SearchQueryParamsDto } from 'src/utils/commonDtos';
import { AdminGuard, JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';
import { UserFromJwt } from 'src/utils/types';
import { ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({ type: ProductDto, isArray: false })
  @Post()
  create(@Body() dto: ProductDto, @GetUser() user: UserFromJwt) {
    return this.productService.create(dto, user);
  }

  @ApiCookieAuth('jwt')
  @ApiOkResponse({ type: ProductDto, isArray: true })
  @UseGuards(JwtGuard, AdminGuard)
  @Get('all')
  findAll(@Query() dto: QueryParamsDto) {
    return this.productService.findAll(dto);
  }

  @ApiOkResponse({ type: ProductDto, isArray: true })
  @Get('search')
  search(@Query() dto: SearchQueryParamsDto) {
    return this.productService.search(dto);
  }

  @ApiOkResponse({ type: ProductDto, isArray: false })
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
  @ApiOkResponse({ type: ProductDto, isArray: false })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: ProductDto,
    @GetUser() user: UserFromJwt,
  ) {
    return this.productService.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
