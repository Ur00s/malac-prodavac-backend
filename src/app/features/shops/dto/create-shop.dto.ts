import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from '../../users/dto';
import { Type } from 'class-transformer';

export class CreateShopDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsOptional()
  @IsString()
  businessName?: string;
}
