import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { FilterDto } from '../../core/prisma/dto';
import { Prisma } from '@prisma/client';
import { CategoryEntity } from './entities';
import { serializePagination } from '../../common/helpers';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new DirectFilterPipe<any, Prisma.CategoryWhereInput>([]))
    filterDto: FilterDto<Prisma.CategoryWhereInput>,
  ) {
    return serializePagination(
      CategoryEntity,
      this.categoriesService.findAll(filterDto.findOptions),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new CategoryEntity(
      await this.categoriesService.findOne({ id }, { subCategories: true }),
    );
  }
}
