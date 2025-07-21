import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class QueryParamsDto {
  @Type(() => Number)
  @IsInt()
  skip: number;

  @Type(() => Number)
  @IsInt()
  take: number;
}
