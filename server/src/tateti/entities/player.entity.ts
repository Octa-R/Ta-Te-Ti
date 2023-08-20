import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity()
export class Player extends BaseEntity<Player, 'id'> {
  @PrimaryKey({ hidden: true })
  id: string;

  @Property()
  name: string;
  @Property()
  mark: MARK;
  @Property()
  score: number;
  @Property()
  isConnected: boolean;

  constructor(partial: Partial<Player>) {
    super();
    this.id = randomUUID();
    this.score = 0;
    this.isConnected = false;
    Object.assign(this, partial);
  }

  connect() {
    this.isConnected = true;
  }

  disconnect() {
    this.isConnected = false;
  }

  getId() {
    return this.id;
  }

  incrementScore() {
    this.score++;
  }
}
