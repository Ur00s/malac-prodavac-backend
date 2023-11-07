import { IsString } from 'class-validator';

export class CreateProductReviewReplyDto {
  @IsString()
  text: string;
}
