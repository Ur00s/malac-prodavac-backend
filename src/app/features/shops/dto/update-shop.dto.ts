import { UpdateUserDto } from '../../users/dto';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateShopDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;

  @IsOptional()
  @IsString()
  businessName?: string;
}
