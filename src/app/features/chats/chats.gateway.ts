import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { CreateChatMessageDto, OpenChatDto } from './dto';
import { Server } from 'socket.io';
import {
  prismaKnownClientExceptionMappings,
  validationPipeOptions,
} from '../../../util/definition';
import {
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { ChatEntity, ChatMessageEntity } from './entities';
import { ResponseSerializerInterceptor } from '../../common/interceptors';
import {
  AccessGuard,
  Actions,
  CaslUser,
  UseAbility,
  UserProxy,
} from 'nest-casl';
import { ChatMessagesService, ChatsService } from './services';
import { AuthorizableSocket } from '../../core/socket.io';
import { plainToInstance } from 'class-transformer';
import { SocketService } from '../socket/socket.service';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { UserRole } from '@prisma/client';

@UseFilters(new WsExceptionFilter(prismaKnownClientExceptionMappings))
@UseGuards(AccessGuard)
@UseInterceptors(ResponseSerializerInterceptor)
@UsePipes(new ValidationPipe(validationPipeOptions))
@WebSocketGateway({
  namespace: 'chats',
  transports: ['websocket', 'polling'],
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatMessagesService: ChatMessagesService,
    private chatService: ChatsService,
    private socketService: SocketService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: AuthorizableSocket) {
    this.socketService.handleConnection(client);
  }

  handleDisconnect(client: AuthorizableSocket) {
    this.socketService.handleDisconnection(client);
  }

  @SubscribeMessage('new-message')
  @UseAbility(Actions.create, ChatMessageEntity)
  async handleNewMessage(
    @ConnectedSocket()
    client: AuthorizableSocket,
    @MessageBody() createChatMessageDto: CreateChatMessageDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, message] = await this.chatMessagesService.create(
      createChatMessageDto,
      client.user,
    );

    client
      .to(this.socketService.findClient(message.recipientUserId.toString())?.id)
      ?.emit('new-message', plainToInstance(ChatMessageEntity, message));

    return new ChatMessageEntity(message);
  }

  @SubscribeMessage('open-chat')
  @UseAbility(Actions.read, ChatEntity)
  async handleOpenChat(
    @ConnectedSocket()
    client: AuthorizableSocket,
    @MessageBody() openChatDto: OpenChatDto,
    @CaslUser() userProxy: UserProxy<JWTPayloadUser>,
  ) {
    const user = await userProxy.get();
    const chat = await this.chatService.openChat(
      {
        id: openChatDto.chatId,
        customerId: user.customer?.id,
        shopId: user.shop?.id,
      },
      user.id,
    );

    client
      .to(
        this.socketService.findClient(
          user.roles.includes(UserRole.Customer)
            ? chat.shop.userId.toString()
            : chat.customer.userId.toString(),
        )?.id,
      )
      ?.emit('open-chat', plainToInstance(ChatEntity, chat));

    return new ChatEntity(chat);
  }
}
