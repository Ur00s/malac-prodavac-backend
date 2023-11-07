import { SubjectBeforeFilterHook } from 'nest-casl';
import { ChatEntity } from '../entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { ChatsService } from '../services/chats.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatsHook
  implements SubjectBeforeFilterHook<ChatEntity, AuthorizableRequest>
{
  constructor(private chatsService: ChatsService) {}

  run({ params }: AuthorizableRequest) {
    return this.chatsService.findOne({
      id: +params.id,
    });
  }
}
