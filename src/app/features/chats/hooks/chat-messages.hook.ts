import { SubjectBeforeFilterHook } from 'nest-casl';
import { ChatMessageEntity } from '../entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { ChatMessagesService } from '../services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMessagesHook
  implements SubjectBeforeFilterHook<ChatMessageEntity, AuthorizableRequest>
{
  constructor(private chatMessagesService: ChatMessagesService) {}

  run({ params }: AuthorizableRequest) {
    return this.chatMessagesService.findOne({
      id: +params.id,
    });
  }
}
