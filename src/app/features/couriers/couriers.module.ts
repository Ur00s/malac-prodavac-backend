import { Module } from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { CouriersController } from './couriers.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './couriers.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [CouriersController],
  providers: [CouriersService],
})
export class CouriersModule {}
