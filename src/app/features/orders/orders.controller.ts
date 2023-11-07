import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import {
  AccessGuard,
  AccessService,
  Actions,
  CaslSubject,
  SubjectProxy,
  UseAbility,
} from 'nest-casl';
import { OrderEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { AuthUser } from '../../common/decorators';
import { serializePagination } from '../../common/helpers';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { FilterDto } from '../../core/prisma/dto';
import { Prisma } from '@prisma/client';
import { OrdersHook } from './orders.hook';

@UseGuards(AccessGuard)
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private accessService: AccessService,
  ) {}

  @Post()
  @UseAbility(Actions.create, OrderEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new OrderEntity(
      await this.ordersService.create(createOrderDto, user),
    );
  }

  @Get()
  @UseAbility(Actions.read, OrderEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new DirectFilterPipe<any, Prisma.OrderWhereInput>([]))
    filterDto: FilterDto<Prisma.OrderWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      OrderEntity,
      this.ordersService.findAll(filterDto.findOptions, user),
    );
  }

  @Get(':id')
  @UseAbility(Actions.read, OrderEntity, OrdersHook)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new OrderEntity(await this.ordersService.findOne({ id }));
  }

  @Patch(':id')
  @UseAbility(Actions.update, OrderEntity, OrdersHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @AuthUser() user: JWTPayloadUser,
    @CaslSubject() subjectProxy: SubjectProxy<OrderEntity>,
  ) {
    const subject = await subjectProxy.get();
    Array.from(Object.keys(updateOrderDto)).forEach((field) =>
      this.accessService.assertAbility(user, Actions.update, subject, field),
    );

    return new OrderEntity(
      await this.ordersService.update(id, updateOrderDto, user),
    );
  }

  @Delete(':id')
  @UseAbility(Actions.delete, OrderEntity, OrdersHook)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new OrderEntity(await this.ordersService.remove(id));
  }
}
