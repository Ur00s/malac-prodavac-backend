import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

export function ApiFiles(fieldName: string, required = true, maxCount = 10) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'array',
            items: { type: 'file', format: 'binary' },
          },
        },
      },
    }),
  );
}
