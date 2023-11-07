import { PrismaConfigDto } from './prisma-config.dto';
import { registerAs } from '@nestjs/config';
import { PrismaConfig } from './prisma-config.interface';
import { configFactory } from '../../../../util/factory';

export const prismaConfigFactory = registerAs('prisma', (): PrismaConfig => {
  const configDto = configFactory<PrismaConfigDto>(PrismaConfigDto);

  return {
    databaseUrl: configDto.POSTGRES_DATABASE_URL,
    explicitConnect: configDto.PRISMA_EXPLICIT_CONN,
    logs: configDto.PRISMA_LOGS,
  };
});
