import {
  IsEnum,
  IsHexadecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Environment } from '../../../../util/enum';
import { fileSizeBytes } from '../../../common/constants';

export class AppConfigDto {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  PROTOCOL: string;

  @IsString()
  @IsNotEmpty()
  BASE_DOMAIN: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  API_PORT: number;

  @IsNumber()
  @Min(1)
  @Max(fileSizeBytes.MB * 10)
  MAX_FILESIZE_B: number;

  @IsString()
  MULTER_DEST: string;

  @IsString()
  USER_MEDIA_DEST: string;

  @IsString()
  PRODUCT_MEDIA_DEST: string;

  @IsHexadecimal()
  @MinLength(32)
  SECRET_KEY: string;

  @IsNumber()
  @Min(10)
  @IsOptional()
  SALT_ROUNDS?: number;

  @IsString()
  @IsNotEmpty()
  COOKIE_NAME: string;

  @IsString()
  @IsNotEmpty()
  EXPIRES_IN: string;

  @IsNumber()
  @Min(1)
  THROTTLER_TTL: number;

  @IsNumber()
  @Min(0)
  THROTTLER_LIMIT: number;
}
