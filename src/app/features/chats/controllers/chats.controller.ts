import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatsService } from '../services/chats.service';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { FilterDto } from '../../../core/prisma/dto';
import { Prisma } from '@prisma/client';
import { serializePagination } from '../../../common/helpers';
import { ChatEntity } from '../entities';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { AuthUser } from '../../../common/decorators';
import { ChatsHook } from '../hooks/chats.hook';

@UseGuards(AccessGuard)
@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get()
  @UseAbility(Actions.read, ChatEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new DirectFilterPipe<any, Prisma.ChatWhereInput>([]))
    filterDto: FilterDto<Prisma.ChatWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      ChatEntity,
      this.chatsService.findAll(filterDto.findOptions, user),
    );
  }

  @Get(':id')
  @UseAbility(Actions.read, ChatEntity, ChatsHook)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new ChatEntity(
      await this.chatsService.findOne(
        { id },
        {
          ...ChatsService.include,
          _count: {
            select: {
              chatMessages: {
                where: { recipientUserId: user.id, opened: false },
              },
            },
          },
        },
      ),
    );
  }
}
