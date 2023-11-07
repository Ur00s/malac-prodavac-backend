import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsPositive()
  price: number;

  @IsInt()
  categoryId: number;

  @ApiProperty({ enum: $Enums.ProductMeasurementUnit })
  @IsEnum($Enums.ProductMeasurementUnit)
  unitOfMeasurement: $Enums.ProductMeasurementUnit;

  @IsOptional()
  @IsString()
  availableAt?: string;

  @IsOptional()
  @IsPositive()
  availableAtLatitude?: number;

  @IsOptional()
  @IsPositive()
  availableAtLongitude?: number;

  @IsOptional()
  @IsPositive()
  availableFromHours?: number;

  @IsOptional()
  @IsPositive()
  availableTillHours?: number;

  @IsOptional()
  @ApiProperty({ enum: $Enums.Currency })
  @IsEnum($Enums.Currency)
  currency?: $Enums.Currency;
}
