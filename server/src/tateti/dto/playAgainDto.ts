import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class PlayAgainDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  playerId: string;
}
