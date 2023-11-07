import { SubjectBeforeFilterHook } from 'nest-casl';
import { UserEntity } from '../entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class UsersHook
  implements SubjectBeforeFilterHook<UserEntity, AuthorizableRequest>
{
  constructor(readonly usersService: UsersService) {}

  async run({ params, user }: AuthorizableRequest) {
    return await this.usersService.findOne(
      { id: +params.id },
      {
        customer: {
          where: { orders: { some: { product: { shopId: user.shop?.id } } } },
        },
      },
    );
  }
}
