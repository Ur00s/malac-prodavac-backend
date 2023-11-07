import { Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { ShopEntity } from './entities';
import { ShopsService } from './shops.service';
import { AuthorizableRequest } from '../../core/authentication/jwt';

@Injectable()
export class ShopsHook
  implements SubjectBeforeFilterHook<ShopEntity, AuthorizableRequest>
{
  constructor(readonly shopsService: ShopsService) {}

  run({ params }: AuthorizableRequest) {
    return this.shopsService.findOne({ id: +params.id });
  }
}
