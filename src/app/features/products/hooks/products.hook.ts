import { SubjectBeforeFilterHook } from 'nest-casl';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { ProductEntity } from '../entities';
import { ProductsService } from '../services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsHook
  implements SubjectBeforeFilterHook<ProductEntity, AuthorizableRequest>
{
  constructor(private productsService: ProductsService) {}

  run({ params, user }: AuthorizableRequest) {
    return this.productsService.findOne(
      { id: +params.id },
      {
        _count: {
          select: {
            productMedias: true,
            orders: { where: { customerId: user.customer?.id } },
          },
        },
      },
    );
  }
}
