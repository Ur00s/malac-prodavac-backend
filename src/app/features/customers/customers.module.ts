import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './customers.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
