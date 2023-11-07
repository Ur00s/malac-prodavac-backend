import { Injectable, Logger } from '@nestjs/common';
import { AuthorizableSocket } from '../../core/socket.io';

@Injectable()
export class SocketService {
  private logger = new Logger(SocketService.name);

  private readonly connectedClients: Map<string, AuthorizableSocket> =
    new Map();

  handleConnection(client: AuthorizableSocket): void {
    const { id } = client.user;
    this.connectedClients.set(id.toString(), client);
    this.logger.log(`New socket connected! User ID: ${id}`);
  }

  handleDisconnection(client: AuthorizableSocket): void {
    const { id } = client.user;
    this.connectedClients.delete(id.toString());
    this.logger.log(`A socket disconnected! User ID: ${id}`);
  }

  findClient(id: string): AuthorizableSocket | undefined {
    return this.connectedClients.get(id);
  }
}
