import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ApiTags } from '@nestjs/swagger';
import { ShopEntity } from './entities';
import { CreateShopDto, UpdateShopDto } from './dto';
import { Public } from '../../common/decorators';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import { serializePagination } from '../../common/helpers';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../core/prisma/dto';
import { ShopsHook } from './shops.hook';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createShopDto: CreateShopDto) {
    return new ShopEntity(await this.shopsService.create(createShopDto));
  }

  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, ShopEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new DirectFilterPipe<any, Prisma.ShopWhereInput>([]))
    filterDto: FilterDto<Prisma.ShopWhereInput>,
  ) {
    return serializePagination(
      ShopEntity,
      this.shopsService.findAll(filterDto.findOptions),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, ShopEntity)
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new ShopEntity(await this.shopsService.findOne({ id }));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, ShopEntity, ShopsHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return new ShopEntity(await this.shopsService.update(id, updateShopDto));
  }
}
