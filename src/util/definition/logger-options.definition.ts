import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import { Environment } from '../enum';

export const loggerOptions: WinstonModuleOptions = {
  level:
    process.env.NODE_ENV === undefined ||
    process.env.NODE_ENV === Environment.Development
      ? 'debug'
      : 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.ms(),
        utilities.format.nestLike('MP', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
};
