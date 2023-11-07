import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class ChatMessageDto {
  @IsString()
  text: string;
}

export class CreateChatMessageDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ChatMessageDto)
  message: ChatMessageDto;

  @IsInt()
  @IsPositive()
  toUserId: number;
}
