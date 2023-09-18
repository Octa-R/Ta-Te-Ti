import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { isMark } from '../decorators/is-mark.decorator';

export class MoveToGameDto {
  @IsNumber()
  @IsNotEmpty()
  @Max(2)
  @Min(0)
  row: number;

  @IsNumber()
  @IsNotEmpty()
  @Max(2)
  @Min(0)
  col: number;

  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  playerId: string;

  // @isMark()
  @IsNotEmpty()
  @IsString()
  mark: string;
}
