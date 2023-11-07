import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { AppConfig } from '../configuration/app/app-config.interface';

export const throttlerFactory = (
  configService: ConfigService,
): ThrottlerModuleOptions => {
  const config = configService.get<AppConfig>('app');
  const ttl = config.throttler.ttl;
  const limit = config.throttler.limit;

  return {
    throttlers: [
      { ttl, limit, ignoreUserAgents: [/googlebot/gi, /bingbot/gi] },
    ],
  };
};
