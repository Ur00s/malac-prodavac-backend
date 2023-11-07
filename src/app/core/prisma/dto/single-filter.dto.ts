import { ISingleFilter, FilterOperationType } from '@chax-at/prisma-filter';
import { IsString, IsEnum, IsDefined } from 'class-validator';

export class SingleFilter<T> implements ISingleFilter<T> {
  @IsString()
  field!: keyof T & string;

  @IsEnum(FilterOperationType)
  type!: FilterOperationType;

  @IsDefined()
  value: any;
}
