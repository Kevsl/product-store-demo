import { Type } from 'class-transformer';
import { IsInt, IsString, Length } from 'class-validator';

export class SearchQueryParamsDto {
  @Type(() => Number)
  @IsInt()
  skip: number;

  @Type(() => Number)
  @IsInt()
  take: number;

  @IsString()
  @Length(1, 50)
  search: string;
}
