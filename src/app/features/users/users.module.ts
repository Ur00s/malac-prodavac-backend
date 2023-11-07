import { Module } from '@nestjs/common';
import { UserMediasService, UsersService } from './services';
import { CaslModule } from 'nest-casl';
import { permissions } from './users.permissions';
import { UsersController } from './controllers';
import { UserMediasController } from './controllers';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { multerFactory } from '../../core/files';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) =>
        multerFactory(config, 'userMediaDest'),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService, UserMediasService],
  exports: [UsersService],
  controllers: [UsersController, UserMediasController],
})
export class UsersModule {}
