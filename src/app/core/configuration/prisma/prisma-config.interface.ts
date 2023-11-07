import { PrismaLogs } from './prisma-config.dto';

export interface PrismaConfig {
  logs: PrismaLogs;
  databaseUrl: string;
  explicitConnect: boolean;
}
