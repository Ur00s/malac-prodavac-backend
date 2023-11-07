import { Category } from '@prisma/client';

export class CategoryEntity implements Category {
  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  name: string;
  parentCategoryId: number;
  updatedAt: Date;
  createdAt: Date;
}
