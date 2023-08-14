'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20230814181401 extends Migration {

  async up() {
    this.addSql('create table "player" ("id" varchar(255) not null, "name" varchar(255) not null, "mark" varchar(255) not null, "score" int not null default 0, "is_connected" boolean not null default true, constraint "player_pkey" primary key ("id"));');

    this.addSql('create table "game" ("id" uuid not null, "turn_count" int not null default 0, "player1wants_to_play_again" boolean not null default false, "player2wants_to_play_again" boolean not null default false, "player1_id" varchar(255) not null, "player2_id" varchar(255) null, "status" varchar(255) not null default \'WAITING_OPPONENT\', "turn" varchar(255) not null default \'X\', "board" jsonb not null, "match_result" varchar(255) not null default \'NOT_OVER\', constraint "game_pkey" primary key ("id"));');
    this.addSql('alter table "game" add constraint "game_player1_id_unique" unique ("player1_id");');
    this.addSql('alter table "game" add constraint "game_player2_id_unique" unique ("player2_id");');

    this.addSql('alter table "game" add constraint "game_player1_id_foreign" foreign key ("player1_id") references "player" ("id") on update cascade;');
    this.addSql('alter table "game" add constraint "game_player2_id_foreign" foreign key ("player2_id") references "player" ("id") on update cascade on delete set null;');
  }

  async down() {
    this.addSql('alter table "game" drop constraint "game_player1_id_foreign";');

    this.addSql('alter table "game" drop constraint "game_player2_id_foreign";');

    this.addSql('drop table if exists "player" cascade;');

    this.addSql('drop table if exists "game" cascade;');
  }

}
exports.Migration20230814181401 = Migration20230814181401;
