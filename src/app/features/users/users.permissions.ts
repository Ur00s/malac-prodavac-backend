import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { UserEntity, UserMediaEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type UserSubjects = InferSubjects<
  typeof UserEntity | typeof UserMediaEntity
>;

export const permissions: Permissions<
  UserRole,
  UserSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can, user }) {
    can(Actions.manage, UserEntity, { id: user.id });
    can(Actions.manage, UserMediaEntity, { userId: user.id });
  },
  Customer({ can }) {
    can(Actions.read, UserEntity);
    can(Actions.read, UserMediaEntity);
  },
  Courier({ can }) {
    can(Actions.read, UserEntity);
    can(Actions.read, UserMediaEntity);
  },
  Shop({ can, cannot }) {
    can(Actions.read, UserEntity, {});
    cannot(Actions.read, UserEntity, {
      roles: { $in: [UserRole.Customer] },
      customer: { $eq: null },
    }).because("As a Shop owner you can't read all users");
    can(Actions.read, UserMediaEntity, {});
    cannot(Actions.read, UserMediaEntity, {
      'user.roles': { $in: [UserRole.Customer] },
      'user.customer': { $eq: null },
    }).because("As a Shop owner you can't read all users");
  },
};
