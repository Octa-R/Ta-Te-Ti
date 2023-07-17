import { GameStateDto } from '../dto';
import { CurrentGameState } from '../interfaces';
import { Player } from './player.model';
import { Exclude } from 'class-transformer';

export class Game {
  @Exclude()
  id: string;

  roomId: string;
  player1: Player;
  player2: Player;

  constructor(partial: Partial<Game>) {
    Object.assign(this, partial);
  }
  getRoomId() {
    return this.roomId;
  }
  setPlayer1(player: Player) {}
  setPlayer2(player: Player) {}
}
