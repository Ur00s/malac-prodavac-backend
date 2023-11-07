import { IsObject, ValidateNested } from 'class-validator';
import { CreateUserDto } from '../../users/dto';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
