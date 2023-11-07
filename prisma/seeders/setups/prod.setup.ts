import { PrismaClient } from '@prisma/client';
import { createSeedStateFactory } from '../../../src/util/factory';
import { devConfig } from '../configs';
import { categories } from '../data';

type SeedPrivileges = 'categories';

const state = createSeedStateFactory<SeedPrivileges>(devConfig);
const prisma = new PrismaClient();

export const prodSetup = async () => {
  console.log('Seeding:');

  if (state.categories.privileges.write) {
    console.log('Categories...');

    for (const { name, categories: subs } of categories) {
      const cat = await prisma.category.upsert({
        create: { name },
        update: {},
        where: { name },
      });

      if (subs)
        for (const { name } of subs) {
          await prisma.category.upsert({
            create: { name, parentCategoryId: cat.id },
            update: { parentCategoryId: cat.id },
            where: { name },
          });
        }
    }
  }
};
