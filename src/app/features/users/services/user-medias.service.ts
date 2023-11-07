import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, UserMedia } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class UserMediasService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.UserMediaInclude = {};

  upsert(image: Express.Multer.File, id: number) {
    return this.prisma.userMedia.upsert({
      create: {
        key: image.filename,
        mimetype: image.mimetype,
        originalName: image.originalname,
        user: { connect: { id: id } },
      },
      update: {
        key: image.filename,
        mimetype: image.mimetype,
        originalName: image.originalname,
      },
      where: { userId: id },
    });
  }

  findAll(id: number, findOptions: Prisma.UserMediaFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<UserMedia, Prisma.UserMediaFindManyArgs>(
      this.prisma.userMedia,
      {
        ...findOptions,
        where: { ...findOptions.where, userId: id },
        include: UserMediasService.include,
      },
      { page },
    );
  }

  async findOne(
    where: Prisma.UserMediaWhereUniqueInput,
    include?: Prisma.UserMediaInclude,
  ) {
    return await this.prisma.userMedia.findUniqueOrThrow({
      where,
      include: include ?? UserMediasService.include,
    });
  }

  async findFirst(
    where: Prisma.UserMediaWhereInput,
    include?: Prisma.UserMediaInclude,
  ) {
    return await this.prisma.userMedia.findFirstOrThrow({
      where,
      include: include ?? UserMediasService.include,
    });
  }

  async remove(userId: number, id: number) {
    return this.prisma.userMedia.delete({ where: { userId, id } });
  }
}
