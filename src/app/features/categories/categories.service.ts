import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.CategoryInclude = {};

  findAll(findOptions: Prisma.CategoryFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Category, Prisma.CategoryFindManyArgs>(
      this.prisma.category,
      { ...findOptions, include: CategoriesService.include },
      { page },
    );
  }

  findOne(
    where: Prisma.CategoryWhereUniqueInput,
    include?: Prisma.CategoryInclude,
  ) {
    return this.prisma.category.findFirstOrThrow({
      where,
      include: include ?? CategoriesService.include,
    });
  }
}
