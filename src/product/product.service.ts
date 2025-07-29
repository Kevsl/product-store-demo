import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto';
import { QueryParamsDto, SearchQueryParamsDto } from 'src/utils/commonDtos';
import { UserFromJwt } from 'src/utils/types';
import { UserRoles } from 'src/utils/const';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}

  async create(dto: ProductDto, user: UserFromJwt) {
    const generatedDescription =
      await this.chatService.createProductDescription(dto.keywords);

    const createdProduct = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: generatedDescription,
        price: dto.price,
        isAvailable: dto.isAvailable,
        createdBy: user.id,
      },
    });

    for (const productCategory of dto.productCategories) {
      await this.prisma.productCategory.findUnique({
        where: {
          id: productCategory,
        },
      });

      if (!productCategory) {
        throw new NotFoundException(
          `Product Category with ID: ${productCategory} not found`,
        );
      }
      await this.prisma.productHasProductCategory.create({
        data: {
          productId: createdProduct.id,
          productCategoryId: productCategory,
        },
      });
    }
  }

  findAll(dto: QueryParamsDto) {
    return this.prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
      skip: dto.skip,
      take: dto.take,
    });
  }

  search(dto: SearchQueryParamsDto) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: dto.search,
          mode: 'insensitive',
        },
      },

      orderBy: {
        name: 'asc',
      },
      skip: dto.skip,
      take: dto.take,
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        productHasCategory: {
          include: {
            productCategory: true,
          },
        },
      },
    });
    if (!product || !product.id) {
      throw new NotFoundException(`Product with ID: ${id} not found`);
    }
    return product;
  }

  async update(id: string, dto: ProductDto, user: UserFromJwt) {
    const product = await this.findOne(id);

    if (product.createdBy !== user.id || user.role.name !== UserRoles.ADMIN) {
      throw new ForbiddenException(`you re not allowed to update this product`);
    }

    await this.prisma.productHasProductCategory.deleteMany({
      where: {
        productId: id,
      },
    });

    for (const productCategory of dto.productCategories) {
      await this.prisma.productCategory.findUnique({
        where: {
          id: productCategory,
        },
      });

      if (!productCategory) {
        throw new NotFoundException(
          `Product Category with ID: ${productCategory} not found`,
        );
      }

      await this.prisma.productHasProductCategory.create({
        data: {
          productId: id,
          productCategoryId: productCategory,
        },
      });
    }

    return this.prisma.product.update({
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
        productId: id,
      },
    });

    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
