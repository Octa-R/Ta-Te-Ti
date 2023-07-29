import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class JoinGameRoomDto {
  @MinLength(4)
  @MaxLength(15)
  @IsNotEmpty()
  @IsString()
  name: string;

  @MinLength(1)
  @MaxLength(4)
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
