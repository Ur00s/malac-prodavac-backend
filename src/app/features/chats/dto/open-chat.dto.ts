import { IsInt, IsPositive } from 'class-validator';

export class OpenChatDto {
  @IsInt()
  @IsPositive()
  chatId: number;
}
