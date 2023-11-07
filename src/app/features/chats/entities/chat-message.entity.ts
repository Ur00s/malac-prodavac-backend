import { ChatMessage } from '@prisma/client';

export class ChatMessageEntity implements ChatMessage {
  constructor(partial: Partial<ChatMessageEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  chatId: number;
  text: string;
  recipientUserId: number;
  opened: boolean;
  updatedAt: Date;
  createdAt: Date;
}
