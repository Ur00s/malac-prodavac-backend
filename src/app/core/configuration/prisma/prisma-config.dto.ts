import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export type PrismaLogs = 'log' | 'debug' | 'warn' | 'error';

const PrismaLogs: PrismaLogs[] = ['debug', 'error', 'log', 'warn'];

export class PrismaConfigDto {
  @IsEnum(PrismaLogs)
  PRISMA_LOGS: PrismaLogs;

  @IsString()
  @IsNotEmpty()
  POSTGRES_DATABASE_URL: string;

  @IsBoolean()
  PRISMA_EXPLICIT_CONN: boolean;
}
