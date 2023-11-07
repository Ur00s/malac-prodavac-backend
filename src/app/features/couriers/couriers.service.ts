import { Injectable } from '@nestjs/common';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { PrismaService } from 'nestjs-prisma';
import { Courier, Prisma, UserRole } from '@prisma/client';
import { hashPassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class CouriersService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.CourierInclude = { user: true };

  create(createCourierDto: CreateCourierDto) {
    return this.prisma.courier.create({
      data: {
        pricePerKilometer: createCourierDto.pricePerKilometer,
        user: {
          create: {
            ...createCourierDto.user,
            password: hashPassword(createCourierDto.user.password),
            roles: { set: [UserRole.Courier] },
          },
        },
      },
      include: CouriersService.include,
    });
  }

  async findAll(findOptions: Prisma.CourierFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Courier, Prisma.CourierFindManyArgs>(
      this.prisma.courier,
      {
        ...findOptions,
        include: CouriersService.include,
      },
      { page },
    );
  }

  findOne(
    where: Prisma.CourierWhereUniqueInput,
    include?: Prisma.CourierInclude,
  ) {
    return this.prisma.courier.findUniqueOrThrow({
      where,
      include: include ?? CouriersService.include,
    });
  }

  update(id: number, updateCourierDto: UpdateCourierDto) {
    return this.prisma.courier.update({
      where: { id },
      data: {
        user: {
          update: {
            ...updateCourierDto.user,
            password:
              updateCourierDto.user?.password &&
              hashPassword(updateCourierDto.user.password),
          },
        },
      },
      include: CouriersService.include,
    });
  }
}
