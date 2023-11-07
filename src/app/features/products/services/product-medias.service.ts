import { Injectable } from '@nestjs/common';
import { Prisma, ProductMedia } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ProductMediasService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ProductMediaInclude = {};

  create(id: number, images: Express.Multer.File[]) {
    return this.prisma.productMedia.createMany({
      data: images.map((image) => ({
        productId: id,
        key: image.filename,
        originalName: image.originalname,
        mimetype: image.mimetype,
      })),
      skipDuplicates: true,
    });
  }

  findAll(productId: number, findOptions: Prisma.ProductMediaFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<ProductMedia, Prisma.ProductMediaFindManyArgs>(
      this.prisma.productMedia,
      {
        ...findOptions,
        where: { ...findOptions.where, productId },
        include: ProductMediasService.include,
      },
      { page },
    );
  }

  findOne(
    where: Prisma.ProductMediaWhereUniqueInput,
    include?: Prisma.ProductMediaInclude,
  ) {
    return this.prisma.productMedia.findUniqueOrThrow({
      where,
      include: include ?? ProductMediasService.include,
    });
  }

  remove(productId: number, id: number) {
    return this.prisma.productMedia.delete({ where: { productId, id } });
  }
}
