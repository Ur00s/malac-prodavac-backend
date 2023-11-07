import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export const ApiPropertyType = (options: ApiPropertyOptions) => {
  return applyDecorators(
    ApiProperty(options),
    Type(() => options.type as Function),
  );
};
