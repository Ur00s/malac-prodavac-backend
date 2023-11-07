import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User, UserRole } from '@prisma/client';
import { comparePassword } from '../../../../util/helper';
import { createPaginator } from 'prisma-pagination';
import { AuthService } from '../../auth/auth.service';
import { Response } from 'express';
import { JWTPayloadUser } from '../../../core/authentication/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  static readonly include: Prisma.UserInclude = {
    customer: true,
    courier: true,
    shop: true,
    profilePicture: true,
  };

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        email,
      },
      include: UsersService.include,
    });

    if (!comparePassword(password, user.password))
      throw new UnauthorizedException();

    return user;
  }

  findAll(findOptions: Prisma.UserFindManyArgs, user: JWTPayloadUser) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<User, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        ...findOptions,
        where: {
          ...findOptions.where,
          OR: [
            {
              roles: { hasSome: [UserRole.Customer] },
              customer: user.roles.includes(UserRole.Shop)
                ? {
                    orders: { some: { product: { shopId: user.shop?.id } } },
                  }
                : undefined,
            },
            { roles: { hasSome: [UserRole.Courier, UserRole.Shop] } },
          ],
        },
        include: UsersService.include,
      },
      { page },
    );
  }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude,
  ) {
    return await this.prisma.user.findUniqueOrThrow({
      where,
      include: include ?? UsersService.include,
    });
  }

  async findFirst(where: Prisma.UserWhereInput, include?: Prisma.UserInclude) {
    return await this.prisma.user.findFirstOrThrow({
      where,
      include: include ?? UsersService.include,
    });
  }

  async remove(id: number, res: Response) {
    const user = await this.prisma.user.delete({
      where: { id },
      include: UsersService.include,
    });

    this.authService.logout(res);

    return user;
  }
}
