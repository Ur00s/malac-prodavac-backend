import { UserEntity } from '../../../features/users/entities';
import { Request } from 'express';

export type JWTPayloadUser = Omit<UserEntity, 'password'>;
export type JwtPayload = { user: JWTPayloadUser };

export interface AuthorizableRequest extends Request {
  user: JWTPayloadUser;
}
