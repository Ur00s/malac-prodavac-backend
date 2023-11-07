import { IsInt, IsPositive, IsString, Max, ValidateIf } from 'class-validator';

export class CreateProductReviewDto {
  @ValidateIf((o) => o.text || !o.rating)
  @IsString()
  text?: string;

  @ValidateIf((o) => !o.text || o.rating !== undefined)
  @IsInt()
  @IsPositive()
  @Max(5)
  rating?: number;
}
