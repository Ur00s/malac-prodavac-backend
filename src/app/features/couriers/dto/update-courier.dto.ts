import { Type } from 'class-transformer';
import {
  IsOptional,
  ValidateNested,
  IsPositive,
  IsObject,
  IsString,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { UpdateUserDto } from '../../users/dto';

export class UpdateCourierDto {
  @IsOptional()
  @IsPositive()
  pricePerKilometer?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(90)
  currentLocationLatitude?: number;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(90)
  currentLocationLongitude?: number;
}
