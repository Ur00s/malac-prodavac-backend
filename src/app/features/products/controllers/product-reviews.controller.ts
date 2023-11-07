import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductReviewsService } from '../services';
import { CreateProductReviewDto, UpdateProductReviewDto } from '../dto';
import { ProductReviewEntity } from '../entities/product-review.entity';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { AuthUser } from '../../../common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../../core/prisma/dto';
import { serializePagination } from '../../../common/helpers';
import { AccessGuard, AccessService, Actions, UseAbility } from 'nest-casl';
import { ProductReviewsHook, ProductsHook } from '../hooks';
import { ProductEntity } from '../entities';

@UseGuards(AccessGuard)
@ApiTags('products')
@Controller('products/:id/reviews')
export class ProductReviewsController {
  constructor(
    private productReviewsService: ProductReviewsService,
    private accessService: AccessService,
  ) {}

  @Post()
  @UseAbility(Actions.aggregate, ProductEntity, ProductsHook)
  @UseAbility(Actions.create, ProductReviewEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() createProductReviewDto: CreateProductReviewDto,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new ProductReviewEntity(
      await this.productReviewsService.create(
        productId,
        createProductReviewDto,
        user,
      ),
    );
  }

  @Get()
  @UseAbility(Actions.read, ProductReviewEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) productId: number,
    @Query(new DirectFilterPipe<any, Prisma.ReviewWhereInput>([]))
    filterDto: FilterDto<Prisma.ReviewWhereInput>,
  ) {
    return serializePagination(
      ProductReviewEntity,
      this.productReviewsService.findAll(productId, filterDto.findOptions),
    );
  }

  @Get(':reviewId')
  @UseAbility(Actions.read, ProductReviewEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) id: number,
  ) {
    return new ProductReviewEntity(
      await this.productReviewsService.findOne({ productId, id }),
    );
  }

  @Patch(':reviewId')
  @UseAbility(Actions.create, ProductReviewEntity, ProductReviewsHook)
  @HttpCode(HttpStatus.OK)
  async updata(
    @Param('id', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) id: number,
    @Body() updateProductReviewDto: UpdateProductReviewDto,
  ) {
    return new ProductReviewEntity(
      await this.productReviewsService.update(
        productId,
        id,
        updateProductReviewDto,
      ),
    );
  }
}
