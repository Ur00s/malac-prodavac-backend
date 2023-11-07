import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const ApiFile = (fieldName: string, required = true) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: { [fieldName]: { type: 'file' } },
      },
    }),
    UseInterceptors(FileInterceptor(fieldName)),
  );
