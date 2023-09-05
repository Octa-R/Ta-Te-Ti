import { Options } from '@mikro-orm/core';
import * as path from 'path';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'game',
  type: 'postgresql',
  host: 'postgres', // Nombre del servicio de Docker
  port: 5432,
  user: 'oruarte',
  password: 'password',
  allowGlobalContext: true,
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  // migrations: {
  //   path: path.join(__dirname, './migrations'),
  //   glob: '!(*.d).{js,ts}',
  //   emit: 'js',
  // },
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
};

export default config;
