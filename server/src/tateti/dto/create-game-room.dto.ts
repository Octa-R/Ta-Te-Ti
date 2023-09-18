import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { isMark } from '../decorators/is-mark.decorator';
export class CreateGameRoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  name: string;

  // @isMark()
  @IsNotEmpty()
  mark: string;
}
