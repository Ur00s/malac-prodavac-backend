import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductReviewReplyDto } from '../dto';
import { Prisma, ReviewReply } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ProductReviewRepliesService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ReviewReplyInclude = {};

  create(
    productId: number,
    id: number,
    createProductReviewReplyDto: CreateProductReviewReplyDto,
  ) {
    return this.prisma.reviewReply.create({
      data: {
        ...createProductReviewReplyDto,
        review: { connect: { productId, id } },
      },
      include: ProductReviewRepliesService.include,
    });
  }

  findAll(
    productId: number,
    reviewId: number,
    findOptions: Prisma.ReviewReplyFindManyArgs,
  ) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<ReviewReply, Prisma.ReviewReplyFindManyArgs>(
      this.prisma.reviewReply,
      {
        ...findOptions,
        where: { ...findOptions.where, review: { id: reviewId, productId } },
        include: ProductReviewRepliesService.include,
      },
      { page },
    );
  }

  findOne(
    where: Prisma.ReviewReplyWhereUniqueInput,
    include?: Prisma.ReviewReplyInclude,
  ) {
    return this.prisma.reviewReply.findUniqueOrThrow({
      where,
      include: include ?? ProductReviewRepliesService.include,
    });
  }
}
