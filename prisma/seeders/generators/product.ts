import { $Enums, Category, Prisma, Shop } from '@prisma/client';
import { TCreateSeedStateOption } from '../../../src/util/factory';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
export const productGenerator = (
  qty: number,
  state: {
    categories: TCreateSeedStateOption;
    shops: TCreateSeedStateOption;
  },
) => {
  const products: Prisma.ProductCreateInput[] = [];

  for (let i = 0; i < qty; ++i) {
    const title = faker.commerce.product();
    const desc = faker.commerce.productDescription();

    products.push({
      title,
      desc,
      category: {
        connect: { id: (state.categories.getRandom() as Category).id },
      },
      shop: { connect: { id: (state.shops.getRandom() as Shop).id } },
      price: Number(faker.commerce.price()),
      unitOfMeasurement: sample($Enums.ProductMeasurementUnit),
    });
  }

  return products;
};
