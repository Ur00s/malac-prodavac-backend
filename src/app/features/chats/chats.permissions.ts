import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { ChatEntity, ChatMessageEntity } from './entities';
import { UserRole } from '@prisma/client';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { ShopEntity } from '../shops/entities';
import { CustomerEntity } from '../customers/entities';

export type ChatSubjects = InferSubjects<
  | typeof ChatEntity
  | typeof ChatMessageEntity
  | typeof ShopEntity
  | typeof CustomerEntity
>;

export const permissions: Permissions<
  UserRole,
  ChatSubjects,
  Actions,
  JWTPayloadUser
> = {
  Customer({ can, user }) {
    can(Actions.read, ChatEntity, {
      customerId: { $eq: user.customer?.id },
    });
    can(Actions.create, ChatMessageEntity);
    can(Actions.read, ChatMessageEntity, {
      'chat.customerId': { $eq: user.customer?.id },
    });
  },
  Shop({ can, user }) {
    can(Actions.read, ChatEntity, {
      shopId: { $eq: user.shop?.id },
    });
    can(Actions.create, ChatMessageEntity);
    can(Actions.read, ChatMessageEntity, {
      'chat.shopId': { $eq: user.shop?.id },
    });
  },
};
