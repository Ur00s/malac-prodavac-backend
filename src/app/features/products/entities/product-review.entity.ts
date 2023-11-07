import { Review } from '@prisma/client';
import { ProductReviewReplyEntity } from './product-review-reply.entity';
import { Type } from 'class-transformer';

export class ProductReviewEntity implements Review {
  constructor(partial: Partial<ProductReviewEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  customerId: number;
  productId: number;
  text: string;
  rating: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => ProductReviewReplyEntity)
  reviewReplies?: ProductReviewReplyEntity[];
}
