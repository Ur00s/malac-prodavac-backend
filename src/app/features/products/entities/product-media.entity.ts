import { ProductMedia } from '@prisma/client';

export class ProductMediaEntity implements ProductMedia {
  constructor(partial: Partial<ProductMediaEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  mimetype: string;
  key: string;
  productId: number;
  originalName: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}
