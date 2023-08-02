import { PlayerStateDto } from '../dto';
import { Exclude } from 'class-transformer';

export class Player {
  @Exclude()
  id: string;

  @Exclude()
  socketId: string;

  name: string;
  mark: MARK;
  score: number;
  isConnected: boolean;

  constructor(partial: Partial<Player>) {
    Object.assign(this, partial);
    this.score = 0;
    this.isConnected = true;
  }

  setSocketId(id: string) {
    this.socketId = id;
  }

  incrementScore() {
    this.score++;
  }
}
