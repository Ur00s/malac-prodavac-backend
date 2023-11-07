import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'nestjs-prisma';
import { Customer, Prisma, UserRole } from '@prisma/client';
import { hashPassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';
import { JWTPayloadUser } from '../../core/authentication/jwt';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.CustomerInclude = {
    user: true,
  };

  create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        user: {
          create: {
            ...createCustomerDto.user,
            password: hashPassword(createCustomerDto.user.password),
            roles: { set: [UserRole.Customer] },
          },
        },
      },
      include: CustomersService.include,
    });
  }

  async findAll(
    findOptions: Prisma.CustomerFindManyArgs,
    user: JWTPayloadUser,
  ) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Customer, Prisma.CustomerFindManyArgs>(
      this.prisma.customer,
      {
        ...findOptions,
        where: {
          ...findOptions.where,
          OR: [
            {
              user: { roles: { hasSome: [UserRole.Customer] } },
              orders: user.roles.includes(UserRole.Shop)
                ? {
                    some: { product: { shopId: user.shop?.id } },
                  }
                : undefined,
            },
            { user: { roles: { hasSome: [UserRole.Courier, UserRole.Shop] } } },
          ],
        },
        include: CustomersService.include,
      },
      { page },
    );
  }

  findOne(
    where: Prisma.CustomerWhereUniqueInput,
    include?: Prisma.CustomerInclude,
  ) {
    return this.prisma.customer.findUniqueOrThrow({
      where,
      include: include ?? CustomersService.include,
    });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        user: {
          update: {
            ...updateCustomerDto.user,
            password:
              updateCustomerDto.user?.password &&
              hashPassword(updateCustomerDto.user.password),
          },
        },
      },
      include: CustomersService.include,
    });
  }
}
