import { Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { CourierEntity } from './entities';
import { CouriersService } from './couriers.service';
import { AuthorizableRequest } from '../../core/authentication/jwt';

@Injectable()
export class CouriersHook
  implements SubjectBeforeFilterHook<CourierEntity, AuthorizableRequest>
{
  constructor(readonly couriersService: CouriersService) {}

  run({ params }: AuthorizableRequest) {
    return this.couriersService.findOne({ id: +params.id });
  }
}
