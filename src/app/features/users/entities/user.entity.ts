import { $Enums } from '.prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Type } from 'class-transformer';
import { CustomerEntity } from '../../customers/entities';
import { CourierEntity } from '../../couriers/entities';
import { ShopEntity } from '../../shops/entities';
import { DecimalToNumber } from '../../../common/decorators';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  firstName: string;
  lastName: string;
  email: string;
  @ApiHideProperty()
  @Exclude()
  password: string;
  address: string;
  @DecimalToNumber()
  addressLatitude: Decimal;
  @DecimalToNumber()
  addressLongitude: Decimal;
  phoneNumber: string;
  @ApiProperty({ enum: $Enums.UserRole })
  roles: Array<$Enums.UserRole>;
  @ApiProperty({ enum: $Enums.PaymentMethod })
  paymentMethod: $Enums.PaymentMethod;
  @ApiProperty({ enum: $Enums.Currency })
  currency: $Enums.Currency;
  updatedAt: Date;
  createdAt: Date;

  @ApiProperty({ nullable: true })
  @Type(() => CustomerEntity)
  customer?: CustomerEntity;

  @ApiProperty({ nullable: true })
  @Type(() => CourierEntity)
  courier?: CourierEntity;

  @ApiProperty({ nullable: true })
  @Type(() => ShopEntity)
  shop?: ShopEntity;
}
