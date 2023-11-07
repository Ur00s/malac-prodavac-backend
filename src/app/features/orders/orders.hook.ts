import { SubjectBeforeFilterHook } from 'nest-casl';
import { OrderEntity } from './entities';
import { AuthorizableRequest } from '../../core/authentication/jwt';
import { OrdersService } from './orders.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersHook
  implements SubjectBeforeFilterHook<OrderEntity, AuthorizableRequest>
{
  constructor(private ordersService: OrdersService) {}

  run({ params }: AuthorizableRequest) {
    return this.ordersService.findOne(
      {
        id: +params.id,
      },
      { product: true },
    );
  }
}
