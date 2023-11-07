import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const categoryGenerator = (qty: number) => {
  const categories: Prisma.CategoryCreateInput[] = [];

  for (let i = 0; i < qty; ++i) {
    const name = faker.commerce.productAdjective();

    categories.push({
      name,
    });
  }

  return categories;
};
