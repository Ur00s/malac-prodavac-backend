import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateChatMessageDto } from '../dto';
import { ChatMessage, Prisma, UserRole } from '@prisma/client';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ChatMessagesService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ChatMessageInclude = { chat: true };

  async create(
    createChatMessageDto: CreateChatMessageDto,
    user: JWTPayloadUser,
  ) {
    if (user.roles.includes(UserRole.Customer))
      this.prisma.order.findFirstOrThrow({
        where: { customerId: user.customer?.id },
      });

    if (user.roles.includes(UserRole.Shop))
      this.prisma.chat.findFirstOrThrow({
        where: {
          shopId: user.shop?.id,
          customer: { userId: createChatMessageDto.toUserId },
        },
      });

    const toUser = this.prisma.user.findUniqueOrThrow({
      where: { id: createChatMessageDto.toUserId },
      include: { customer: true, shop: true },
    });

    const message = this.prisma.chatMessage.create({
      data: {
        text: createChatMessageDto.message.text,
        recipientUserId: createChatMessageDto.toUserId,
        chat: {
          connectOrCreate: {
            create: {
              customerId: user.customer?.id ?? (await toUser).customer?.id,
              shopId: user.shop?.id ?? (await toUser).shop?.id,
            },
            where: {
              customerId_shopId: {
                customerId: user.customer?.id ?? (await toUser).customer?.id,
                shopId: user.shop?.id ?? (await toUser).shop?.id,
              },
            },
          },
        },
      },
      include: ChatMessagesService.include,
    });

    return this.prisma.$transaction([toUser, message]);
  }

  findAll(chatId: number, findOptions: Prisma.ChatMessageFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<ChatMessage, Prisma.ChatMessageFindManyArgs>(
      this.prisma.chatMessage,
      {
        ...findOptions,
        where: { ...findOptions.where, chatId },
        orderBy: { createdAt: 'desc' },
      },
      { page },
    );
  }

  findOne(
    where: Prisma.ChatMessageWhereUniqueInput,
    include?: Prisma.ChatMessageInclude,
  ) {
    return this.prisma.chatMessage.findUniqueOrThrow({
      where,
      include: include ?? ChatMessagesService.include,
    });
  }
}
