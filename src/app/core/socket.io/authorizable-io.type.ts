import { Socket } from 'socket.io';
import { JWTPayloadUser } from '../authentication/jwt';

export interface AuthorizableSocket extends Socket {
  user: JWTPayloadUser;
}
