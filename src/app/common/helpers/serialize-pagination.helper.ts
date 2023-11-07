import { ClassConstructor, plainToInstance } from 'class-transformer';
import { PaginatedResult } from 'prisma-pagination';

export const serializePagination = async <T>(
  cls: ClassConstructor<T>,
  paginationResult: Promise<PaginatedResult<T>>,
) => {
  const result = await paginationResult;
  result.data = plainToInstance(cls, result.data);
  return result;
};
