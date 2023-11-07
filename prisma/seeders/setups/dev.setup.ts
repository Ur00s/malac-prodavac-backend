import { PrismaClient, UserRole } from '@prisma/client';
import { createSeedStateFactory } from '../../../src/util/factory';
import { devConfig } from '../configs';
import { hashPassword } from '../../../src/util/helper';
import { productGenerator } from '../generators/product';
import { categories } from '../data';

type SeedPrivileges =
  | 'categories'
  | 'users'
  | 'customers'
  | 'couriers'
  | 'shops'
  | 'products'
  | 'orders';

const state = createSeedStateFactory<SeedPrivileges>(devConfig);
const prisma = new PrismaClient();

export const devSetup = async () => {
  console.log('Deleting data', '...');

  if (state.categories.privileges.delete) {
    await prisma.category.deleteMany();
    await prisma.$executeRaw`ALTER SEQUENCE categories_id_seq RESTART WITH 1`;
  }
  if (state.users.privileges.delete)
    if (state.customers.privileges.delete) {
      await prisma.user.deleteMany();
      await prisma.$executeRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
    }
  if (state.customers.privileges.delete) {
    await prisma.customer.deleteMany();
    await prisma.$executeRaw`ALTER SEQUENCE customers_id_seq RESTART WITH 1`;
  }
  if (state.couriers.privileges.delete) {
    await prisma.customer.deleteMany();
    await prisma.$executeRaw`ALTER SEQUENCE couriers_id_seq RESTART WITH 1`;
  }
  if (state.shops.privileges.delete) {
    await prisma.customer.deleteMany();
    await prisma.$executeRaw`ALTER SEQUENCE shops_id_seq RESTART WITH 1`;
  }
  if (state.products.privileges.delete) {
    await prisma.customer.deleteMany();
    await prisma.$executeRaw`ALTER SEQUENCE products_id_seq RESTART WITH 1`;
  }

  console.log('Seeding:');

  if (state.categories.privileges.write) {
    console.log('Categories...');

    for (const { name, categories: subs } of categories) {
      await prisma.category.create({
        data: {
          name,
          subCategories: {
            createMany: {
              data: subs ? subs.map((sub) => ({ name: sub.name })) : [],
              skipDuplicates: true,
            },
          },
        },
      });
    }

    state.categories.set(await prisma.category.findMany());
  }
  if (state.customers.privileges.write) {
    console.log('Customers...');

    state.customers.add(
      await prisma.customer.create({
        data: {
          user: {
            create: {
              email: 'customer@malac.com',
              password: hashPassword('Password123.'),
              firstName: 'Kupac',
              lastName: 'Kupčević',
              address: 'Topolska 18',
              phoneNumber: '+38162000000',
              roles: { set: [UserRole.Customer] },
            },
          },
        },
      }),
    );
  }

  if (state.couriers.privileges.write) {
    console.log('Couriers...');

    state.couriers.add(
      await prisma.courier.create({
        data: {
          user: {
            create: {
              email: 'courier@malac.com',
              password: hashPassword('Password123.'),
              firstName: 'Dostavljač',
              lastName: 'Dostavljačević',
              address: 'Topolska 18',
              phoneNumber: '+38162000000',
              roles: { set: [UserRole.Courier] },
            },
          },
          pricePerKilometer: 30,
        },
      }),
    );
  }

  if (state.couriers.privileges.write) {
    console.log('Shops...');

    state.shops.add(
      await prisma.shop.create({
        data: {
          user: {
            create: {
              email: 'shop@malac.com',
              password: hashPassword('Password123.'),
              firstName: 'Prodavac',
              lastName: 'Prodavčević',
              address: 'Topolska 18',
              phoneNumber: '+38162000000',
              roles: { set: [UserRole.Shop] },
            },
          },
          businessName: 'Trnavčevići u divljini',
        },
      }),
    );
  }

  if (state.products.privileges.write) {
    console.log('Products...');

    for (const product of productGenerator(30, state)) {
      state.products.add(await prisma.product.create({ data: product }));
    }
  }
};
