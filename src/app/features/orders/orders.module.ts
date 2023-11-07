import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './orders.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
