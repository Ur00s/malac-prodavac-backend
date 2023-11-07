import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsDate, IsEnum, IsInt, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  productId: number;

  @ApiProperty({ enum: $Enums.DeliveryMethod })
  @IsEnum($Enums.DeliveryMethod)
  deliveryMethod: $Enums.DeliveryMethod;

  @IsPositive()
  quantity: number;

  @IsDate()
  timeOfSelfPickup: Date;
}
