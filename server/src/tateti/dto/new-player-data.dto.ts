import { IsBoolean, IsString, IsUUID } from 'class-validator';
import { isMark } from '../decorators/is-mark.decorator';

export class NewPlayerDataDto {
  @IsString()
  @IsUUID()
  roomId: string;

  @IsString()
  name: string;

  // @isMark()
  mark: MARK;

  @IsBoolean()
  isHost: boolean;

  @IsString()
  message: string;

  @IsBoolean()
  ok: boolean;

  @IsString()
  @IsUUID()
  playerId: string;
}
