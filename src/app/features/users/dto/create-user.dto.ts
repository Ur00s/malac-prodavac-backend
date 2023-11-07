import {
  IsString,
  IsOptional,
  IsEmail,
  Max,
  Min,
  IsNumber,
  Matches,
  IsEnum,
} from 'class-validator';
import {
  nameRegex,
  passwordRegex,
  phoneRegex,
} from '../../../common/constants';
import { $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @Matches(nameRegex)
  firstName: string;

  @Matches(nameRegex)
  lastName: string;

  @IsEmail()
  email: string;

  @Matches(passwordRegex)
  password: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  addressLatitude?: number;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  addressLongitude?: number;

  @IsOptional()
  @IsEnum($Enums.Currency)
  @ApiProperty({ enum: $Enums.Currency })
  currency?: $Enums.Currency;

  @IsOptional()
  @ApiProperty({ enum: $Enums.PaymentMethod })
  @IsEnum($Enums.PaymentMethod)
  paymentMethod?: $Enums.PaymentMethod;

  @IsOptional()
  @Matches(phoneRegex)
  phoneNumber?: string;
}
