import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../configuration/app';
import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerFactory = (
  configService: ConfigService,
  forFeature: 'userMediaDest' | 'productMediaDest',
): MulterModuleOptions => {
  const config = configService.get<AppConfig>('app');

  return {
    dest: `${config.multerDest}/${config[forFeature]}`,
    limits: { fileSize: config.maxFileSizeB },
  };
};
