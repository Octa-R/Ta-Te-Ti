import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { isMark } from '../decorators/is-mark.decorator';
export class CreateGameRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @isMark()
  @IsNotEmpty()
  @IsString()
  mark: MARK;
}
