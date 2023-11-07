import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './shops.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [ShopsService],
})
export class ShopsModule {}
