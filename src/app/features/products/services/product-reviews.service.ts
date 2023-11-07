import { Prisma, Review } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductReviewDto, UpdateProductReviewDto } from '../dto';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { Injectable } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ProductReviewsService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ReviewInclude = { reviewReplies: true };

  async create(
    productId: number,
    createProductReviewDto: CreateProductReviewDto,
    user: JWTPayloadUser,
  ) {
    const review = this.prisma.review.create({
      data: {
        ...createProductReviewDto,
        productId,
        customerId: user.customer?.id,
      },
    });

    const product = this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
    });

    const updateProduct = this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: (await product).rating
          .times((await product).ratingsCount)
          .add(createProductReviewDto.rating)
          .div((await product).ratingsCount + 1),
        ratingsCount: { increment: 1 },
      },
    });

    const [res] = await this.prisma.$transaction([
      review,
      product,
      updateProduct,
    ]);
    return res;
  }

  findAll(productId: number, findOptions: Prisma.ReviewFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Review, Prisma.ReviewFindManyArgs>(
      this.prisma.review,
      {
        ...findOptions,
        where: { ...findOptions.where, productId },
        include: ProductReviewsService.include,
      },
      { page },
    );
  }

  findOne(
    where: Prisma.ReviewWhereUniqueInput,
    include?: Prisma.ReviewInclude,
  ) {
    return this.prisma.review.findUniqueOrThrow({
      where,
      include: include ?? ProductReviewsService.include,
    });
  }

  async update(
    productId: number,
    id: number,
    updateProductReviewDto: UpdateProductReviewDto,
  ) {
    const oldReview = this.prisma.review.findUniqueOrThrow({
      where: { productId, id },
    });

    const review = this.prisma.review.update({
      where: { productId, id },
      data: { ...updateProductReviewDto },
      include: ProductReviewsService.include,
    });

    const product = this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
    });

    const updateProduct = this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: (await product).rating
          .times((await product).ratingsCount)
          .add(updateProductReviewDto.rating - (await oldReview).rating)
          .div((await product).ratingsCount),
      },
    });

    const [res] = await this.prisma.$transaction([
      oldReview,
      review,
      product,
      updateProduct,
    ]);

    return res;
  }
}
