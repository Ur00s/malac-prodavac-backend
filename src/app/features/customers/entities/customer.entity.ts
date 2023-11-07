import { Customer } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';

export class CustomerEntity implements Customer {
  constructor(partial: Partial<CustomerEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  updatedAt: Date;
  createdAt: Date;
  favoriteShops: number[];
  favoriteProducts: number[];

  @Type(() => UserEntity)
  user?: UserEntity;
}
