import {
  GeneratedFindOptions,
  IFilter,
  IGeneratedFilter,
} from '@chax-at/prisma-filter';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { SingleFilterOrder } from './single-filter-order.dto';
import { SingleFilter } from './single-filter.dto';

export class Filter<T = any> implements IFilter<T> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilter)
  @IsOptional()
  filter?: Array<SingleFilter<T>>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilterOrder)
  @IsOptional()
  order?: Array<SingleFilterOrder<T>>;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}

export class FilterDto<TWhereInput>
  extends Filter
  implements IGeneratedFilter<TWhereInput>
{
  // This will be set by filter pipe
  findOptions!: GeneratedFindOptions<TWhereInput>;
}
