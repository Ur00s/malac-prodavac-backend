import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Order } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { DecimalToNumber } from '../../../common/decorators';
import { ProductEntity } from '../../products/entities';
import { CustomerEntity } from '../../customers/entities';
import { CourierEntity } from '../../couriers/entities';
import { Type } from 'class-transformer';

export class OrderEntity implements Order {
  constructor(partial: Partial<OrderEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  productId: number;
  customerId: number;
  courierId: number;
  @DecimalToNumber()
  quantity: Decimal;
  accepted: boolean;
  @ApiProperty({ enum: $Enums.OrderStatus })
  orderStatus: $Enums.OrderStatus;
  @ApiProperty({ enum: $Enums.DeliveryMethod })
  deliveryMethod: $Enums.DeliveryMethod;
  timeOfSelfPickup: Date;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => ProductEntity)
  product?: ProductEntity;
  @Type(() => CustomerEntity)
  customer?: CustomerEntity;
  @Type(() => CourierEntity)
  courier?: CourierEntity;
}
