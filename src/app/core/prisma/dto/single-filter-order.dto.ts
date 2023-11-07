import { ISingleOrder, FilterOrder } from '@chax-at/prisma-filter';
import { IsIn, IsString } from 'class-validator';

export class SingleFilterOrder<T> implements ISingleOrder<T> {
  @IsString()
  field!: keyof T & string;

  @IsIn(['asc', 'desc'])
  dir!: FilterOrder;
}
