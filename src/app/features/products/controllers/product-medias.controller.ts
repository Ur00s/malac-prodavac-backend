import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
  Inject,
  UploadedFiles,
  Post,
  StreamableFile,
  Res,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ProductEntity, ProductMediaEntity } from '../entities';
import { serializePagination } from '../../../common/helpers';
import { ApiFiles } from '../../../common/decorators';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../../core/prisma/dto';
import { ProductsHook } from '../hooks/products.hook';
import { ConfigType } from '@nestjs/config';
import { appConfigFactory } from '../../../core/configuration/app';
import { ProductMediasService } from '../services';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { join } from 'path';

@UseGuards(AccessGuard)
@ApiTags('products')
@Controller('products/:id/medias')
export class ProductMediasController {
  constructor(
    private readonly productMediasService: ProductMediasService,
    @Inject(appConfigFactory.KEY)
    private config: ConfigType<typeof appConfigFactory>,
  ) {}

  @Post()
  @ApiFiles('images', true, 5)
  @UseAbility(Actions.update, ProductEntity, ProductsHook)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(^image)(\/)[a-zA-Z0-9_]*/gm,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        }),
    )
    images: Express.Multer.File[],
  ) {
    return this.productMediasService.create(id, images);
  }

  @Get()
  @UseAbility(Actions.read, ProductEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) id: number,
    @Query(new DirectFilterPipe<any, Prisma.ProductMediaWhereInput>([]))
    filterDto: FilterDto<Prisma.ProductMediaWhereInput>,
  ) {
    return serializePagination(
      ProductMediaEntity,
      this.productMediasService.findAll(id, filterDto.findOptions),
    );
  }

  @Get(':mediaId')
  @UseAbility(Actions.read, ProductEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) productId: number,
    @Param('mediaId', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const media = await this.productMediasService.findOne({
      id,
      productId,
    });

    const file = createReadStream(
      join(
        process.cwd(),
        `${this.config.multerDest}/${this.config.productMediaDest}/${media.key}`,
      ),
    );

    res.set({
      'Content-Type': media.mimetype,
      'Content-Disposition': 'inline',
    });

    return new StreamableFile(file);
  }

  @Delete(':mediaId')
  @UseAbility(Actions.update, ProductEntity, ProductsHook)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) productId: number,
    @Param('mediaId', ParseIntPipe) id: number,
  ) {
    return new ProductEntity(
      await this.productMediasService.remove(productId, id),
    );
  }
}
