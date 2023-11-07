import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../configuration/app/app-config.interface';

export const jwtFactory = (config: ConfigService) => {
  const appConfig = config.get<AppConfig>('app');
  const secret = appConfig.security.secretKey;
  const expiresIn = appConfig.auth.expiresIn;

  return { secret, signOptions: { expiresIn } };
};
