import { registerAs } from '@nestjs/config';
import { AppConfigDto } from './app-config.dto';
import { AppConfig } from './app-config.interface';
import { configFactory } from '../../../../util/factory';

export const appConfigFactory = registerAs('app', (): AppConfig => {
  const configDto = configFactory<AppConfigDto>(AppConfigDto);

  return {
    nodeEnv: configDto.NODE_ENV,
    protocol: configDto.PROTOCOL,
    baseDomain: configDto.BASE_DOMAIN,
    apiPort: configDto.API_PORT,
    maxFileSizeB: configDto.MAX_FILESIZE_B,
    multerDest: configDto.MULTER_DEST,
    userMediaDest: configDto.USER_MEDIA_DEST,
    productMediaDest: configDto.PRODUCT_MEDIA_DEST,

    security: {
      secretKey: configDto.SECRET_KEY,
      passwordSaltRounds: configDto.SALT_ROUNDS,
    },

    auth: {
      cookieName: configDto.COOKIE_NAME,
      expiresIn: configDto.EXPIRES_IN,
    },

    throttler: {
      ttl: configDto.THROTTLER_TTL,
      limit: configDto.THROTTLER_LIMIT,
    },
  };
});
