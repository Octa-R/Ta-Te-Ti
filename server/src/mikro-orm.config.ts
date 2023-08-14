import { Options } from '@mikro-orm/core';
import * as path from 'path';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'game',
  type: 'postgresql',
  user: 'oruarte',
  password: 'password',
  port: 5432,
  allowGlobalContext: true,
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  migrations: {
    path: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}',
    emit: 'js',
  },
};

export default config;
