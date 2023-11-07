import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { CaslModule } from 'nest-casl';
import { permissions } from './chats.permissions';
import { ChatMessagesService, ChatsService } from './services';
import { ChatMessagesController, ChatsController } from './controllers';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  providers: [ChatsGateway, ChatsService, ChatMessagesService],
  controllers: [ChatsController, ChatMessagesController],
})
export class ChatsModule {}
