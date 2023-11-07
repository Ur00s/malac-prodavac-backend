import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Product } from '@prisma/client';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ProductInclude = {
    category: true,
    discounts: true,
    shop: true,
    reviews: true,
  };

  create(createProductDto: CreateProductDto, user: JWTPayloadUser) {
    return this.prisma.product.create({
      data: { ...createProductDto, shopId: user.shop?.id },
      include: ProductsService.include,
    });
  }

  findAll(findOptions: Prisma.ProductFindManyArgs) {
    const paginator = createPaginator({ page: 1, perPage: 20 });
    return paginator<Product, Prisma.ProductFindManyArgs>(
      this.prisma.product,
      {
        ...findOptions,
        include: ProductsService.include,
      },
      { page: findOptions.skip },
    );
  }

  findOne(
    where: Prisma.ProductWhereUniqueInput,
    include?: Prisma.ProductInclude,
  ) {
    return this.prisma.product.findUniqueOrThrow({
      where,
      include: include ?? ProductsService.include,
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: { ...updateProductDto },
      include: ProductsService.include,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
      include: ProductsService.include,
    });
  }
}
