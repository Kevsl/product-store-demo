import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamsDto } from 'src/utils/commonDtos';
import { ProductCategoryDto } from './dto';

@Injectable()
export class ProductCategoryService {
  constructor(private prisma: PrismaService) {}

  create(dto: ProductCategoryDto) {
    return this.prisma.productCategory.create({
      data: {
        ...dto,
      },
    });
  }

  findAll(dto: QueryParamsDto) {
    return this.prisma.productCategory.findMany({
      orderBy: {
        name: 'asc',
      },
      skip: dto.skip,
      take: dto.take,
    });
  }

  async findOne(id: string) {
    const productCategory = await this.prisma.productCategory.findUnique({
      where: {
        id,
      },
    });

    if (!productCategory || !productCategory.id) {
      throw new NotFoundException(`Product Category with ID: ${id} not found`);
    }

    return productCategory;
  }

  async update(id: string, dto: ProductCategoryDto) {
    await this.findOne(id);

    return this.prisma.productCategory.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.productHasProductCategory.deleteMany({
      where: {
        productCategoryId: id,
      },
    });

    return this.prisma.productCategory.delete({
      where: {
        id,
      },
    });
  }
}
