import { IsString, Length } from 'class-validator';

export class ChatDto {
  @IsString()
  @Length(5, 250)
  prompt: string;
}
