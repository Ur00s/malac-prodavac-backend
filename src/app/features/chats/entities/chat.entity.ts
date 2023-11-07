import { Chat } from '@prisma/client';

export class ChatEntity implements Chat {
  constructor(partial: Partial<ChatEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  customerId: number;
  shopId: number;
  visibilityCustomer: boolean;
  visibilityShop: boolean;
  updatedAt: Date;
  createdAt: Date;
}
