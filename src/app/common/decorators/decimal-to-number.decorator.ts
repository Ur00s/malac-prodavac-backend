import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export const DecimalToNumber = (options?: ApiPropertyOptions) => {
  return applyDecorators(
    Type(() => Number),
    ApiProperty({ type: Number, ...options }),
  );
};
