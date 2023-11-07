import { Shop } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';
import { ProductEntity } from '../../products/entities';

export class ShopEntity implements Shop {
  constructor(partial: Partial<ShopEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  businessName: string;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;

  @Type(() => ProductEntity)
  products?: ProductEntity[];
}
