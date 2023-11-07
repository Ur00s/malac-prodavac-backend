import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { ShopEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type ShopSubjects = InferSubjects<typeof ShopEntity>;

export const permissions: Permissions<
  UserRole,
  ShopSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can }) {
    can(Actions.read, ShopEntity);
  },
  Shop({ can, user }) {
    can(Actions.manage, ShopEntity, {
      id: user.shop?.id,
    });
  },
};
